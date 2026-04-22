from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import redis, os, mysql.connector, json, io, re, subprocess, base64
from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel
from PIL import Image as PILImage
import pytesseract
try:
    from .ota_analyzer import ota_engine
except ImportError:
    from ota_analyzer import ota_engine
from groq import Groq
from anthropic import Anthropic
from dotenv import load_dotenv

# Load .env file
load_dotenv()

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

# Claude client - for multi-modal (PDF/Excel) and web search
anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

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

def get_cpu_load():
    try:
        cmd = "wmic cpu get loadpercentage /value"
        output = subprocess.check_output(cmd, shell=True).decode(errors="ignore")
        values = re.findall(r"LoadPercentage=(\d+)", output)
        if values:
            loads = [int(v) for v in values]
            return round(sum(loads) / len(loads), 1)
    except:
        pass

    try:
        cmd = "wmic cpu get loadpercentage"
        output = subprocess.check_output(cmd, shell=True).decode(errors="ignore")
        values = [int(v) for v in re.findall(r"\b\d+\b", output)]
        if values:
            return round(sum(values) / len(values), 1)
    except:
        pass

    return None

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
        "cpu_load": get_cpu_load(),
        "status": "Stable",
        "total_messages": total_msgs,
        "total_tokens": total_tokens,
        "health": health_score
    }

@app.get("/api/analytics")
def get_analytics(request: Request):
    data = []
    days = []
    intents = [
        {"name": "Invoice Analysis", "value": 0, "color": "#60a5fa"},
        {"name": "Architectural Consulting", "value": 0, "color": "#f472b6"},
        {"name": "General Chat", "value": 100, "color": "#9ca3af"}
    ]

    # Get days parameter from query (default 7)
    try:
        days_param = int(request.query_params.get("days", "7"))
    except:
        days_param = 7

    # Limit valid range
    if days_param not in [1, 7, 30]:
        days_param = 7

    try:
        db = get_db()
        if db:
            cursor = db.cursor(dictionary=True)

            # Query based on time range
            if days_param == 1:
                # 24 hours: group by hour
                cursor.execute(
                    "SELECT HOUR(created_at) as hour, COUNT(*) as count FROM messages "
                    "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) "
                    "GROUP BY HOUR(created_at) ORDER BY hour ASC"
                )
                rows = cursor.fetchall()
                # Create 24-hour array with zeros
                hour_data = [0] * 24
                hour_dict = {row['hour']: row['count'] for row in rows}
                for h in range(24):
                    hour_data[h] = hour_dict.get(h, 0)
                data = hour_data
                days = [f"{h}:00" for h in range(24)]

            elif days_param == 7:
                # 7 days: group by date
                cursor.execute(
                    "SELECT DATE(created_at) as day, COUNT(*) as count FROM messages "
                    "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) "
                    "GROUP BY DATE(created_at) ORDER BY day ASC"
                )
                rows = cursor.fetchall()
                # Build list of last 7 days including today
                from datetime import timedelta
                date_counts = {}
                for row in rows:
                    date_counts[row['day']] = row['count']
                today = datetime.now().date()
                for i in range(6, -1, -1):
                    d = today - timedelta(days=i)
                    days.append(d.strftime("%a"))
                    data.append(date_counts.get(d, 0))

            elif days_param == 30:
                # 30 days: group by date
                cursor.execute(
                    "SELECT DATE(created_at) as day, COUNT(*) as count FROM messages "
                    "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) "
                    "GROUP BY DATE(created_at) ORDER BY day ASC"
                )
                rows = cursor.fetchall()
                # Build list of last 30 days
                from datetime import timedelta
                date_counts = {}
                for row in rows:
                    date_counts[row['day']] = row['count']
                today = datetime.now().date()
                for i in range(29, -1, -1):
                    d = today - timedelta(days=i)
                    days.append(d.strftime("%d/%m"))
                    data.append(date_counts.get(d, 0))

            elif days_param == 30:
                # 30 days: group by date
                cursor.execute(
                    "SELECT DATE(created_at) as day, COUNT(*) as count FROM messages "
                    "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) "
                    "GROUP BY DATE(created_at) ORDER BY day ASC"
                )
                rows = cursor.fetchall()
                for row in rows:
                    days.append(row['day'].strftime("%d/%m"))
                    data.append(row['count'])

            # Intent analysis (same for all ranges)
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
    except Exception as e:
        print(f"Analytics error: {e}")
        pass

    # Fallback data if empty
    # Fallback data if empty
    if not data or len(data) == 0:
        if days_param == 1:
            days = [f"{h}:00" for h in range(24)]
            data = [0] * 24
        elif days_param == 7:
            days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            data = [0, 0, 0, 0, 0, 0, 0]
        else:  # 30
            today = datetime.now().date()
            days = []
            for i in range(29, -1, -1):
                d = today - timedelta(days=i)
                days.append(d.strftime("%d/%m"))
            data = [0] * 30
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


# ─── Claude-powered /api/chat/v2 endpoint (multi-modal + web search) ───────────────────

class ChatRequestV2(BaseModel):
    history: List[ChatMessage] = []
    system_prompt: Optional[str] = None
    files: Optional[List[dict]] = []  # [{"type": "pdf", "data": "base64..."}]
    search_enabled: bool = False

@app.post("/api/chat/v2")
async def chat_v2(req: ChatRequestV2):
    """
    Claude-powered endpoint supporting:
    - PDF/Excel file analysis via document tool
    - Web search via browser tool
    """
    try:
        system = req.system_prompt or SYSTEM_PROMPT

        # Build messages for Claude
        messages = [{"role": "user", "content": system}]

        # Build user message content (can include text + documents)
        user_content = []

        # Add text from history
        for msg in req.history:
            if msg.content and msg.content.strip():
                role = "assistant" if msg.role in ("bot", "assistant") else "user"
                messages.append({"role": role, "content": msg.content})

        # Add current message with file attachments if present
        current_text = req.history[-1].content if req.history else ""

        if req.files:
            # Files are base64 encoded
            for file in req.files:
                file_data = file.get("data", "")
                file_type = file.get("type", "").lower()

                if file_type == "pdf":
                    user_content.append({
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": file_data
                        }
                    })
                elif file_type in ("xlsx", "xls", "csv"):
                    # Excel files
                    media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    if file_type == "csv":
                        media_type = "text/csv"
                    user_content.append({
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": file_data
                        }
                    })
                elif file_type in ("png", "jpg", "jpeg", "gif"):
                    # Images
                    media_type = f"image/{file_type}"
                    user_content.append({
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": file_data
                        }
                    })

            # Add text content with files
            if current_text:
                user_content.insert(0, {"type": "text", "text": current_text})

            messages.append({"role": "user", "content": user_content})
        else:
            # Text-only message
            if current_text:
                messages.append({"role": "user", "content": current_text})

        # Define tools for Claude
        tools = []
        if req.search_enabled:
            tools.append({
                "name": "browser",
                "description": "Search the web for current information",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "The search query"}
                    },
                    "required": ["query"]
                }
            })

        # Call Claude
        extra_kwargs = {}
        if tools:
            extra_kwargs["tools"] = tools

        response = anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            messages=messages,
            **extra_kwargs
        )

        # Handle response
        if hasattr(response, 'content') and len(response.content) > 0:
            # Check if Claude used a tool (for web search)
            result_content = ""
            for block in response.content:
                if hasattr(block, 'text'):
                    result_content += block.text
        else:
            result_content = str(response)

        tokens_used = response.usage.input_tokens + response.usage.output_tokens if hasattr(response, 'usage') else 0

        return {
            "content": result_content,
            "tokens": tokens_used,
            "model": "claude-3-5-sonnet-20241022"
        }

    except Exception as e:
        # Fallback to Groq if Claude fails
        try:
            system = req.system_prompt or SYSTEM_PROMPT
            groq_messages = [{"role": "system", "content": system}]

            for msg in req.history:
                role = "assistant" if msg.role in ("bot", "assistant") else "user"
                if msg.content and msg.content.strip():
                    groq_messages.append({"role": role, "content": msg.content})

            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=groq_messages,
                max_tokens=2048,
                temperature=0.7,
            )

            return {
                "content": completion.choices[0].message.content,
                "tokens": completion.usage.total_tokens,
                "model": "llama-3.3-70b-versatile (fallback)"
            }
        except Exception as fallback_error:
            raise HTTPException(status_code=500, detail=f"Claude error: {str(e)}, Fallback error: {str(fallback_error)}")


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

@app.get("/analytics/chatbot")
async def get_chatbot_analytics():
    """Get chatbot analytics data for the dashboard"""
    try:
        # Sample data - in production, this would query actual metrics from database
        hours = ["00", "04", "08", "12", "16", "20", "24"]
        messages = [12, 8, 15, 22, 18, 25, 30]
        responses = [10, 6, 12, 20, 16, 22, 28]

        return {
            "hours": hours,
            "user_messages": messages,
            "ai_responses": responses,
            "stats": {
                "total_sessions": 247,
                "active_users": 89,
                "avg_response_time": 1.2,
                "success_rate": 98.5,
                "tokens_used": 1200000
            },
            "intents": [
                {"name": "Architecture", "value": 35, "color": "#60a5fa"},
                {"name": "Code Review", "value": 25, "color": "#f472b6"},
                {"name": "Invoice Analysis", "value": 20, "color": "#9ca3af"},
                {"name": "General Chat", "value": 20, "color": "#34d399"}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
