from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import redis, os, mysql.connector, json, io, re, subprocess
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from PIL import Image as PILImage
import pytesseract
from ota_analyzer import ota_engine
from groq import Groq

app = FastAPI(title="Architect AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """Bạn là Architect AI - trợ lý thông minh chuyên sâu về kiến trúc phần mềm, tư vấn kỹ thuật, và phân tích hóa đơn.

Khả năng của bạn:
- Thiết kế và tư vấn kiến trúc hệ thống (microservices, monolith, serverless, v.v.)
- Phân tích hóa đơn, chi phí dự án xây dựng
- Tư vấn về công nghệ frontend/backend (React, Laravel, FastAPI, v.v.)
- Hỗ trợ viết code, debugging, code review
- Trả lời mọi câu hỏi kỹ thuật và tổng quát

Quy tắc trả lời:
- Luôn trả lời bằng tiếng Việt trừ khi người dùng yêu cầu ngôn ngữ khác
- Sử dụng markdown để format câu trả lời (headers, code blocks, lists, bold/italic)
- Phân tích kỹ lưỡng trước khi trả lời
- Trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin
- Khi có code, luôn dùng code block với ngôn ngữ cụ thể"""

def get_db():
    try:
        return mysql.connector.connect(
            host="127.0.0.1", user="root", password="",
            database="laravel", connect_timeout=2
        )
    except:
        return None

_CPU_SPEED_CACHE = None

def get_cpu_speed():
    global _CPU_SPEED_CACHE
    if _CPU_SPEED_CACHE:
        return _CPU_SPEED_CACHE
    try:
        cmd = "wmic cpu get currentclockspeed"
        output = subprocess.check_output(cmd, shell=True).decode()
        _CPU_SPEED_CACHE = f"{float(output.split(chr(10))[1].strip())/1000:.2f} GHz"
        return _CPU_SPEED_CACHE
    except:
        return "2.40 GHz"

@app.get("/api/stats")
def get_stats():
    total_msgs = 0
    total_tokens = 0
    health_score = 50
    db = get_db()
    if db:
        health_score += 25
        try:
            cursor = db.cursor()
            cursor.execute("SELECT COUNT(*) FROM messages")
            total_msgs = cursor.fetchone()[0]
            cursor.execute("SELECT COALESCE(SUM(tokens), 0) FROM messages")
            total_tokens = cursor.fetchone()[0] or 0
            db.close()
        except:
            pass
    try:
        r = redis.Redis(host="localhost", port=6379, socket_connect_timeout=1)
        if r.ping():
            health_score += 25
    except:
        pass
    return {
        "cpu_speed": get_cpu_speed(),
        "status": "Stable",
        "total_messages": total_msgs,
        "total_tokens": total_tokens,
        "health": health_score
    }

@app.get("/api/analytics")
def get_analytics():
    data = []
    days = []
    intents = [
        {"name": "Invoice Analysis", "value": 0, "color": "#60a5fa"},
        {"name": "Architectural Consulting", "value": 0, "color": "#f472b6"},
        {"name": "General Chat", "value": 100, "color": "#9ca3af"}
    ]
    try:
        db = get_db()
        if db:
            cursor = db.cursor(dictionary=True)
            cursor.execute(
                "SELECT DATE(created_at) as day, COUNT(*) as count FROM messages "
                "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) "
                "GROUP BY DATE(created_at) ORDER BY day ASC"
            )
            rows = cursor.fetchall()
            for row in rows:
                days.append(row['day'].strftime("%a"))
                data.append(row['count'])

            cursor.execute("SELECT content FROM messages WHERE role='user' LIMIT 100")
            user_msgs = cursor.fetchall()
            invoice_count = sum(
                1 for m in user_msgs
                if m['content'] and ("hóa đơn" in m['content'].lower() or "invoice" in m['content'].lower())
            )
            architect_count = sum(
                1 for m in user_msgs
                if m['content'] and ("kiến trúc" in m['content'].lower() or "thiết kế" in m['content'].lower())
            )
            total = len(user_msgs) or 1
            inv_p = int((invoice_count / total) * 100)
            arc_p = int((architect_count / total) * 100)
            gen_p = max(0, 100 - inv_p - arc_p)
            intents = [
                {"name": "Invoice Analysis", "value": inv_p, "color": "#60a5fa"},
                {"name": "Architectural Consulting", "value": arc_p, "color": "#f472b6"},
                {"name": "General Chat", "value": gen_p, "color": "#9ca3af"}
            ]
            db.close()
    except:
        pass

    if not data:
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        data = [0, 0, 0, 0, 0, 0, 0]

    return {"days": days, "data": data, "intents": intents}


# ─── Clean /api/chat endpoint (called internally by Laravel) ───────────────────

class ChatMessage(BaseModel):
    role: str   # "user" | "assistant" | "bot"
    content: str

class ChatRequest(BaseModel):
    history: List[ChatMessage] = []
    system_prompt: Optional[str] = None

@app.post("/api/chat")
async def chat(req: ChatRequest):
    """
    Called by Laravel ChatController to get a real AI response.
    Accepts conversation history and returns the AI reply + token count.
    Roles 'bot' are automatically mapped to 'assistant' for Groq compatibility.
    """
    try:
        system = req.system_prompt or SYSTEM_PROMPT
        groq_messages = [{"role": "system", "content": system}]

        for msg in req.history:
            # Fix critical bug: Groq requires 'assistant', not 'bot'
            role = "assistant" if msg.role in ("bot", "assistant") else "user"
            if msg.content and msg.content.strip():
                groq_messages.append({"role": role, "content": msg.content})

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=groq_messages,
            max_tokens=2048,
            temperature=0.7,
        )

        ai_text = completion.choices[0].message.content
        tokens_used = completion.usage.total_tokens

        return {
            "content": ai_text,
            "tokens": tokens_used,
            "model": "llama-3.3-70b-versatile"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Legacy endpoint kept for backwards compatibility ───────────────────────────

@app.post("/api/messages/send")
async def send_message(
    content: Optional[str] = Form(None),
    conversation_id: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Legacy endpoint. Frontend should now send messages via Laravel /api/messages/send
    which calls /api/chat internally. Kept here for direct testing.
    """
    try:
        ocr_text = ""
        if image:
            try:
                img_bytes = await image.read()
                img = PILImage.open(io.BytesIO(img_bytes)).convert('L')
                ocr_text = pytesseract.image_to_string(img, lang='vie+eng')
            except:
                ocr_text = "[OCR Failed]"

        user_text = content or ocr_text or ""
        ota_result = ota_engine.analyze(user_text)

        # Build minimal history for this legacy call
        history_msgs = []
        db = get_db()
        if db and conversation_id:
            try:
                cursor = db.cursor(dictionary=True)
                cursor.execute(
                    "SELECT role, content FROM messages "
                    "WHERE conversation_id = %s ORDER BY id DESC LIMIT 10",
                    (conversation_id,)
                )
                rows = cursor.fetchall()
                for row in reversed(rows):
                    history_msgs.append(ChatMessage(role=row['role'], content=row['content'] or ""))
                db.close()
            except:
                pass

        # Add current message to history
        history_msgs.append(ChatMessage(role="user", content=user_text))

        # Call the clean chat endpoint logic
        groq_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in history_msgs:
            role = "assistant" if msg.role in ("bot", "assistant") else "user"
            if msg.content.strip():
                groq_messages.append({"role": role, "content": msg.content})

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=groq_messages,
            max_tokens=2048,
            temperature=0.7,
        )
        ai_response = completion.choices[0].message.content
        tokens_used = completion.usage.total_tokens

        return {
            "conversation_id": conversation_id or 0,
            "user_message": {
                "id": 0,
                "content": user_text,
                "role": "user",
                "sentiment": ota_result
            },
            "bot_message": {
                "id": datetime.now().timestamp(),
                "content": ai_response,
                "role": "bot",
                "created_at": datetime.now().isoformat(),
                "sentiment": ota_result,
                "tokens": tokens_used
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
