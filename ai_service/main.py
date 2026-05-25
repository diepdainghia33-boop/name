import traceback
from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import redis, os, mysql.connector, json, io, re, subprocess, base64
from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel
from PIL import Image as PILImage, ImageOps, ImageFilter, ImageEnhance
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


@app.get("/")
def root():
    return {
        "service": "chatid-ai",
        "status": "ok",
        "health": "/health",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "chatid-ai"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    host = os.getenv("DB_HOST")
    if not host:
        return None
    try:
        config = {
            "host": host,
            "port": int(os.getenv("DB_PORT", "3306")),
            "user": os.getenv("DB_USERNAME", "root"),
            "password": os.getenv("DB_PASSWORD", ""),
            "database": os.getenv("DB_DATABASE", "test"),
            "connect_timeout": 5,
        }
        ssl_ca = os.getenv("MYSQL_ATTR_SSL_CA")
        if ssl_ca:
            config["ssl_ca"] = ssl_ca
        return mysql.connector.connect(**config)
    except Exception:
        return None


def get_redis_client():
    redis_url = os.getenv("REDIS_URL")
    if redis_url:
        return redis.from_url(redis_url, socket_connect_timeout=2)
    host = os.getenv("REDIS_HOST", "127.0.0.1")
    port = int(os.getenv("REDIS_PORT", "6379"))
    password = os.getenv("REDIS_PASSWORD") or None
    return redis.Redis(host=host, port=port, password=password, socket_connect_timeout=2)

def get_system_setting(key, default=None):
    db = get_db()
    if not db:
        return default
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT value FROM settings WHERE `key` = %s LIMIT 1", (key,))
        row = cursor.fetchone()
        db.close()
        return row['value'] if row and row['value'] else default
    except:
        if db: db.close()
        return default

def get_groq_client():
    key = get_system_setting("GROQ_API_KEY") or os.getenv("GROQ_API_KEY")
    if not key:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY is not configured.")
    return Groq(api_key=key)

def get_anthropic_client():
    key = get_system_setting("ANTHROPIC_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
    if not key:
        return None
    return Anthropic(api_key=key)

# We'll initialize them in the request handlers instead of globally


SYSTEM_PROMPT = """Bạn là **Architect AI Premium** — một chuyên gia tư vấn kiến trúc phần mềm và hệ thống cấp cao. Bạn không chỉ trả lời câu hỏi, mà còn là một người đồng hành (partner) giúp người dùng giải quyết vấn đề một cách triệt để.

**Phong cách tương tác:**
1. **Chuyên nghiệp nhưng Gần gũi:** Hãy xưng hô là "Tôi" và gọi người dùng là "bạn" (hoặc tên của họ nếu biết). Hãy tỏ ra thân thiện và đầy nhiệt huyết.
2. **Chủ động (Proactive):** Nếu câu hỏi của người dùng còn mơ hồ, hãy đưa ra các giả định hợp lý hoặc hỏi thêm các thông tin cần thiết thay vì trả lời hời hợt.
3. **Tư duy Kiến trúc:** Luôn phân tích các khía cạnh về hiệu năng (Performance), khả năng mở rộng (Scalability) và bảo mật (Security) trong mọi giải pháp kỹ thuật.
4. **Trực quan:** Sử dụng bảng biểu, danh sách và định dạng markdown rõ ràng để thông tin dễ nắm bắt nhất.

**Quy tắc trả lời:**
- Luôn sử dụng tiếng Việt tự nhiên, tránh dùng từ Hán Việt quá nặng nề trừ khi là thuật ngữ chuyên môn.
- Khi phân tích hóa đơn (OCR), hãy tóm tắt các con số quan trọng trước, sau đó mới đi vào chi tiết.
- Nếu có code, hãy giải thích ngắn gọn logic đằng sau đoạn code đó.
- Luôn kết thúc bằng một câu hỏi gợi mở hoặc một lời đề nghị hỗ trợ bước tiếp theo.

**Khả năng đặc biệt:**
1. **Tạo Hình Ảnh:** Bạn có khả năng tạo hình ảnh nghệ thuật, sơ đồ kiến trúc hoặc minh họa kỹ thuật. Để tạo hình ảnh, hãy sử dụng cú pháp Markdown sau: `![Description](https://pollinations.ai/p/PROMPT?width=1024&height=1024&nologo=true)`. 
   - Thay `PROMPT` bằng mô tả chi tiết bằng tiếng Anh để có kết quả tốt nhất. 
   - Ví dụ: `![Sơ đồ Microservices](https://pollinations.ai/p/professional_microservices_architecture_diagram_sleek_modern_dark_mode?width=1024&height=1024&nologo=true)`.
2. **Viết Code:** Luôn cung cấp code sạch, có comment và giải thích rõ ràng.

**Định dạng:**
- Sử dụng **bold** cho các từ khóa quan trọng.
- Sử dụng `code` cho các biến hoặc lệnh ngắn.
- Sử dụng khối code ``` cho các đoạn mã dài.
- Sử dụng > cho các lưu ý quan trọng hoặc trích dẫn.
- Khi tạo ảnh, hãy đặt nó trong một đoạn riêng biệt để hiển thị đẹp nhất. """

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


OCR_CONFIG = "--oem 3 --psm 6 -c preserve_interword_spaces=1"


class InvoiceOcrRequest(BaseModel):
    image_base64: str
    image_type: Optional[str] = None
    filename: Optional[str] = None


def _decode_base64_image(image_base64: str) -> bytes:
    payload = image_base64.split(",", 1)[1] if image_base64.startswith("data:") else image_base64
    return base64.b64decode(payload)


def _clean_ocr_text(text: str) -> str:
    lines = []
    for raw_line in (text or "").replace("\r", "").split("\n"):
        line = re.sub(r"\s+", " ", raw_line).strip()
        if line:
            lines.append(line)
    return "\n".join(lines)


def _build_invoice_variants(image: PILImage.Image):
    if image.mode != "RGB":
        image = image.convert("RGB")

    if image.width < 1600:
        scale = 1600 / max(image.width, 1)
        image = image.resize((1600, max(1, int(image.height * scale))), PILImage.LANCZOS)

    gray = image.convert("L")
    base = ImageOps.autocontrast(gray)

    variants = [
        base,
        ImageEnhance.Contrast(base).enhance(1.7),
        base.filter(ImageFilter.SHARPEN),
        base.filter(ImageFilter.MedianFilter(size=3)),
        ImageEnhance.Sharpness(base).enhance(2.0),
    ]

    threshold = ImageEnhance.Contrast(base).enhance(2.2).point(lambda p: 255 if p > 170 else 0)
    variants.append(threshold)

    return variants


def _ocr_confidence(image: PILImage.Image) -> float:
    try:
        data = pytesseract.image_to_data(
            image,
            lang="vie+eng",
            config=OCR_CONFIG,
            output_type=pytesseract.Output.DICT,
        )
        values = []
        for conf in data.get("conf", []):
            try:
                score = float(conf)
                if score >= 0:
                    values.append(score)
            except Exception:
                continue
        if not values:
            return 0.0
        return round(sum(values) / len(values), 2)
    except Exception:
        return 0.0


def _score_ocr_text(text: str, confidence: float) -> float:
    digits = sum(1 for ch in text if ch.isdigit())
    letters = sum(1 for ch in text if ch.isalpha())
    lines = len([line for line in text.splitlines() if line.strip()])
    return len(text) + (digits * 3) + (letters * 0.2) + (lines * 12) + confidence


def _parse_amount(value):
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return round(float(value), 2)

    text = str(value).strip()
    if not text:
        return None

    cleaned = re.sub(r"[^\d,.\-]", "", text)
    if not cleaned:
        return None

    if "," in cleaned and "." in cleaned:
        if cleaned.rfind(",") > cleaned.rfind("."):
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    elif "," in cleaned:
        parts = cleaned.split(",")
        if len(parts[-1]) in (1, 2):
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    elif cleaned.count(".") > 1:
        cleaned = cleaned.replace(".", "")

    try:
        return round(float(cleaned), 2)
    except Exception:
        return None


def _parse_date(value):
    if not value:
        return None

    text = str(value).strip()
    if not text:
        return None

    patterns = [
        (r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})", ["%d/%m/%Y", "%d-%m-%Y", "%d/%m/%y", "%d-%m-%y"]),
        (r"(\d{4}[/-]\d{1,2}[/-]\d{1,2})", ["%Y/%m/%d", "%Y-%m-%d"]),
        (r"(\d{1,2}\.\d{1,2}\.\d{2,4})", ["%d.%m.%Y", "%d.%m.%y"]),
    ]

    for pattern, formats in patterns:
        match = re.search(pattern, text)
        if not match:
            continue
        candidate = match.group(1).replace(".", "/")
        for fmt in formats:
            try:
                return datetime.strptime(candidate, fmt).strftime("%Y-%m-%d")
            except Exception:
                continue
    return None


def _extract_invoice_number(text: str):
    if not text:
        return None

    patterns = [
        r"(?:mã hóa đơn|ma hoa don|số hóa đơn|so hoa don|invoice(?:\s*(?:no\.?|number))?|bill(?:\s*(?:no\.?|number))?|receipt(?:\s*(?:no\.?|number))?)\s*[:#\-]?\s*([A-Za-z0-9\-\/\.]+)",
        r"(?:hđ|hd|inv)\s*[:#\-]?\s*([A-Za-z0-9\-\/\.]+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None


def _extract_currency(text: str):
    lower = (text or "").lower()
    if any(token in lower for token in ["usd", "$", "us$"]):
        return "USD"
    if any(token in lower for token in ["eur", "€"]):
        return "EUR"
    if any(token in lower for token in ["vnd", "vnđ", "vnd.", "đ", "dong"]):
        return "VND"
    return None


def _extract_store_name(lines):
    ignore_words = [
        "hóa đơn",
        "hoa don",
        "invoice",
        "receipt",
        "bill",
        "tax",
        "mst",
        "mã số",
        "tong cong",
        "tổng cộng",
        "subtotal",
        "total",
        "thanh tien",
        "thành tiền",
    ]

    for line in lines[:8]:
        candidate = line.strip()
        lower = candidate.lower()
        if len(candidate) < 3:
            continue
        if any(word in lower for word in ignore_words):
            continue
        if re.search(r"\d{5,}", candidate):
            continue
        return candidate[:120]

    return None


def _extract_invoice_regex(text: str):
    lines = [line.strip() for line in (text or "").splitlines() if line.strip()]
    store_name = _extract_store_name(lines)

    total_amount = None
    total_patterns = [
        r"(?:tổng cộng|tong cong|thành tiền|thanh tien|total(?:\s*amount)?|amount due|grand total|payment total)\s*[:\-]?\s*([0-9][0-9\.,]*)",
        r"(?:total(?:\s*amount)?|grand total|amount due)\s*[^\d]{0,20}([0-9][0-9\.,]*)",
        r"([0-9][0-9\.,]*)\s*(?:vnd|vnđ|usd|eur|\$|€)",
    ]

    for pattern in total_patterns:
        match = re.search(pattern, text or "", flags=re.IGNORECASE)
        if match:
            total_amount = _parse_amount(match.group(1))
            if total_amount is not None:
                break

    purchase_date = _parse_date(text)
    invoice_number = _extract_invoice_number(text)
    currency = _extract_currency(text)

    items = []

    return {
        "store_name": store_name,
        "invoice_number": invoice_number,
        "purchase_date": purchase_date,
        "total_amount": total_amount,
        "currency": currency,
        "items": items,
        "confidence": 0,
    }


def _extract_json_object(text: str):
    if not text:
        return None

    cleaned = text.strip().replace("```json", "").replace("```", "")
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    try:
        return json.loads(cleaned[start : end + 1])
    except Exception:
        return None


INVOICE_EXTRACTION_PROMPT = """You are an invoice OCR extraction engine.
Return only valid JSON, no markdown, no commentary.
Use only the OCR text below. Do not invent missing values.

Schema:
{{
  "store_name": null,
  "invoice_number": null,
  "purchase_date": null,
  "total_amount": null,
  "currency": null,
  "confidence": 0.0,
  "items": [
    {{
      "name": null,
      "quantity": null,
      "price": null,
      "total": null
    }}
  ]
}}

Rules:
- purchase_date should be YYYY-MM-DD when possible.
- total_amount must be a number, not formatted text.
- currency should be VND, USD, EUR, JPY, GBP, or null.
- confidence should be a number from 0 to 1.
- items should include only what is clearly visible.

OCR text:
<<<
{ocr_text}
>>>"""


def _extract_invoice_with_claude(ocr_text: str):
    """Try Claude first, fall back to Groq if no Anthropic key."""
    if not ocr_text.strip():
        return None

    prompt = INVOICE_EXTRACTION_PROMPT.format(ocr_text=ocr_text)

    # --- Try Claude (Anthropic) ---
    anthropic_key = get_system_setting("ANTHROPIC_API_KEY", os.getenv("ANTHROPIC_API_KEY"))
    if anthropic_key:
        try:
            response = get_anthropic_client().messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=900,
                temperature=0,
                messages=[{"role": "user", "content": prompt}],
            )
            content = ""
            for block in response.content:
                if hasattr(block, "text"):
                    content += block.text
            result = _extract_json_object(content)
            if result:
                return result
        except Exception as exc:
            print(f"Claude extraction failed, falling back to Groq: {exc}")

    # --- Fallback: Groq (llama-3.3-70b) ---
    try:
        groq_client = get_groq_client()
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an invoice data extraction engine. Return only valid JSON matching the requested schema exactly. No markdown, no commentary."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=900,
            temperature=0,
        )
        content = completion.choices[0].message.content or ""
        return _extract_json_object(content)
    except Exception as exc:
        print(f"Groq invoice extraction failed: {exc}")
        return None


def _merge_invoice_data(base: dict, override: dict):
    merged = dict(base or {})
    override = override or {}

    for key in ["store_name", "invoice_number", "purchase_date", "total_amount", "currency", "confidence"]:
        value = override.get(key)
        if value not in [None, "", []]:
            merged[key] = value

    items = override.get("items")
    if isinstance(items, list) and items:
        merged["items"] = items

    return merged


def analyze_invoice_image(image_bytes: bytes, filename: Optional[str] = None, image_type: Optional[str] = None):
    """
    Analyze an invoice image using Groq Vision (no Tesseract required).
    Falls back to Tesseract if Groq Vision fails.
    """

    # --- Determine image media type ---
    ext = (image_type or "jpg").lower().lstrip(".")
    media_type_map = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "gif": "image/gif", "webp": "image/webp"}
    media_type = media_type_map.get(ext, "image/jpeg")

    # --- Encode image as base64 ---
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    # --- Try Groq Vision first (no Tesseract needed) ---
    groq_vision_prompt = """You are an invoice/receipt OCR and data extraction engine.
Carefully read all text visible in this invoice/receipt image.
Return ONLY a valid JSON object (no markdown, no explanation) with this exact schema:
{
  "raw_text": "<all visible text from the invoice, newline separated>",
  "store_name": "<shop/restaurant/store name or null>",
  "invoice_number": "<invoice/receipt number or null>",
  "purchase_date": "<date in YYYY-MM-DD format or null>",
  "total_amount": <number or null>,
  "currency": "<VND, USD, EUR, etc. or null>",
  "confidence": <number 0.0 to 1.0>,
  "items": [
    {"name": "<item name>", "quantity": <number or null>, "price": <number or null>, "total": <number or null>}
  ]
}
Rules:
- total_amount must be a plain number (no commas, no currency symbols).
- Extract ALL line items visible.
- If a field is not visible, use null.
- confidence: 0.9 if you can read the image clearly, lower if blurry."""

    try:
        groq_client = get_groq_client()
        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{media_type};base64,{image_b64}"},
                        },
                        {"type": "text", "text": groq_vision_prompt},
                    ],
                }
            ],
            max_tokens=1200,
            temperature=0,
        )
        content = response.choices[0].message.content or ""
        vision_data = _extract_json_object(content)

        if vision_data:
            raw_text = vision_data.pop("raw_text", "") or ""
            # Normalise & parse numeric fields
            vision_data["total_amount"] = _parse_amount(vision_data.get("total_amount"))
            vision_data["purchase_date"] = _parse_date(vision_data.get("purchase_date"))
            vision_data["currency"] = vision_data.get("currency") or _extract_currency(raw_text) or "VND"
            claude_confidence = float(vision_data.get("confidence") or 0)
            if claude_confidence <= 1:
                claude_confidence *= 100
            vision_data["confidence"] = round(claude_confidence, 2)
            if not isinstance(vision_data.get("items"), list):
                vision_data["items"] = []

            return {
                "raw_text": raw_text,
                "confidence": vision_data["confidence"],
                "extracted": vision_data,
                "bill": {
                    "store_name": vision_data.get("store_name"),
                    "invoice_number": vision_data.get("invoice_number"),
                    "purchase_date": vision_data.get("purchase_date"),
                    "total_amount": vision_data.get("total_amount"),
                    "currency": vision_data.get("currency"),
                    "confidence_score": vision_data.get("confidence"),
                    "items": vision_data.get("items", []),
                },
                "source": {"filename": filename, "image_type": image_type},
            }
    except Exception as exc:
        print(f"Groq Vision OCR failed, falling back to Tesseract: {exc}")

    # --- Fallback: Tesseract (if installed) ---
    try:
        image = PILImage.open(io.BytesIO(image_bytes))
        variants = _build_invoice_variants(image)
        best_text = ""
        best_confidence = 0.0
        best_score = -1

        for variant in variants:
            try:
                ocr_text = pytesseract.image_to_string(variant, lang="vie+eng", config=OCR_CONFIG)
                cleaned_text = _clean_ocr_text(ocr_text)
                confidence = _ocr_confidence(variant)
                score = _score_ocr_text(cleaned_text, confidence)
                if score > best_score:
                    best_text = cleaned_text
                    best_confidence = confidence
                    best_score = score
            except Exception as exc2:
                print(f"OCR variant failed: {exc2}")

        base_data = _extract_invoice_regex(best_text)
        structured = base_data

        try:
            claude_data = _extract_invoice_with_claude(best_text)
            if claude_data:
                structured = _merge_invoice_data(base_data, claude_data)
        except Exception as exc3:
            print(f"LLM invoice extraction failed: {exc3}")

        structured["store_name"] = structured.get("store_name") or base_data.get("store_name")
        structured["invoice_number"] = structured.get("invoice_number") or base_data.get("invoice_number")
        structured["purchase_date"] = _parse_date(structured.get("purchase_date")) or base_data.get("purchase_date")
        structured["total_amount"] = _parse_amount(structured.get("total_amount")) or base_data.get("total_amount")
        structured["currency"] = structured.get("currency") or base_data.get("currency") or "VND"
        claude_confidence = float(structured.get("confidence") or 0)
        if claude_confidence <= 1:
            claude_confidence *= 100
        structured["confidence"] = round(max(best_confidence, claude_confidence), 2)
        structured["items"] = structured.get("items") if isinstance(structured.get("items"), list) else []

        return {
            "raw_text": best_text,
            "confidence": structured["confidence"],
            "extracted": structured,
            "bill": {
                "store_name": structured.get("store_name"),
                "invoice_number": structured.get("invoice_number"),
                "purchase_date": structured.get("purchase_date"),
                "total_amount": structured.get("total_amount"),
                "currency": structured.get("currency"),
                "confidence_score": structured.get("confidence"),
                "items": structured.get("items", []),
            },
            "source": {"filename": filename, "image_type": image_type},
        }
    except Exception as exc4:
        print(f"Tesseract OCR also failed: {exc4}")
        # Return empty result rather than crashing
        return {
            "raw_text": "",
            "confidence": 0,
            "extracted": {},
            "bill": {
                "store_name": None, "invoice_number": None, "purchase_date": None,
                "total_amount": None, "currency": "VND", "confidence_score": 0, "items": [],
            },
            "source": {"filename": filename, "image_type": image_type},
        }


@app.post("/api/invoices/ocr")
async def invoice_ocr(req: InvoiceOcrRequest):
    """
    OCR + invoice extraction endpoint for uploaded bill images.
    Returns raw OCR text plus structured invoice data.
    """
    try:
        image_bytes = _decode_base64_image(req.image_base64)
        return analyze_invoice_image(image_bytes, filename=req.filename, image_type=req.image_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class BatchOcrItem(BaseModel):
    image_base64: str
    image_type: Optional[str] = None
    filename: Optional[str] = None

class BatchOcrRequest(BaseModel):
    images: List[BatchOcrItem]

@app.post("/api/invoices/ocr/batch")
async def invoice_ocr_batch(req: BatchOcrRequest):
    """
    Batch OCR: accepts multiple invoice images, extracts each one,
    and returns per-invoice results + an aggregated summary.
    """
    import concurrent.futures

    def _process_one(item: BatchOcrItem):
        try:
            img_bytes = _decode_base64_image(item.image_base64)
            return analyze_invoice_image(img_bytes, filename=item.filename, image_type=item.image_type)
        except Exception as exc:
            print(f"Batch OCR item failed ({item.filename}): {exc}")
            return {
                "raw_text": "", "confidence": 0, "extracted": {},
                "bill": {"store_name": None, "invoice_number": None, "purchase_date": None,
                         "total_amount": None, "currency": "VND", "confidence_score": 0, "items": []},
                "source": {"filename": item.filename, "image_type": item.image_type},
            }

    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(req.images), 5)) as pool:
            results = list(pool.map(_process_one, req.images))

        # ── Build aggregated summary ──────────────────────────────────────────
        currency_totals: dict = {}
        total_items = 0
        successful = 0

        for r in results:
            bill = r.get("bill", {})
            amount = bill.get("total_amount")
            currency = bill.get("currency") or "VND"
            items = bill.get("items") or []

            if amount is not None:
                currency_totals[currency] = round(currency_totals.get(currency, 0) + float(amount), 2)
                successful += 1
            total_items += len(items)

        summary_lines = [f"**Tổng hợp {len(results)} hóa đơn:**"]
        for cur, total in currency_totals.items():
            summary_lines.append(f"- **{cur}**: {total:,.0f}")
        summary_lines.append(f"- Số mặt hàng: **{total_items}**")
        summary_lines.append(f"- Trích xuất thành công: **{successful}/{len(results)}**")

        return {
            "invoices": results,
            "summary": {
                "count": len(results),
                "successful": successful,
                "currency_totals": currency_totals,
                "total_items": total_items,
                "summary_text": "\n".join(summary_lines),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
        r = get_redis_client()
        if r.ping():
            health_score += 25
    except Exception:
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
    model: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
@app.post("/api/chat")
async def chat(req: ChatRequest):
    """
    Called by Laravel ChatController to get a real AI response.
    Accepts conversation history and returns the AI reply + token count.
    Roles 'bot' are automatically mapped to 'assistant' for Groq compatibility.
    """
    try:
        # KIỂM TRA LỖI 1: Xác thực API Key trước khi gọi client
        if not os.environ.get("GROQ_API_KEY"):
            print("==> ERROR: GROQ_API_KEY is missing in Render Environment!")
            raise HTTPException(status_code=500, detail="Groq API Key is not configured on Render.")

        system = req.system_prompt or SYSTEM_PROMPT
        groq_messages = [{"role": "system", "content": system}]

        # Kiểm tra dữ liệu history truyền vào để tránh lỗi NoneType
        if req.history:
            for msg in req.history:
                # Fix critical bug: Groq requires 'assistant', not 'bot'
                role = "assistant" if msg.role in ("bot", "assistant") else "user"
                if msg.content and msg.content.strip():
                    groq_messages.append({"role": role, "content": msg.content})

        # KIỂM TRA LỖI 2: Thay thế model versatile đã bị hoen rỉ bằng model mới chạy siêu nhanh
        # Thay vì llama-3.3-70b-versatile, ta dùng bản ổn định hiện tại: llama-3.3-70b-specdec hoặc llama3-70b-8192
        current_default_model = "llama3-70b-8192" 
        model = req.model if (req.model and "versatile" not in req.model) else current_default_model
        
        # Ép hạ max_tokens xuống nếu bạn đang bị dính lỗi timeout 5s từ Laravel gửi sang
        max_tokens = req.max_tokens or 1024  # Thử hạ từ 2048 xuống 1024 để AI phản hồi nhanh hơn

        # Gọi API của Groq
        completion = get_groq_client().chat.completions.create(
            model=model,
            messages=groq_messages,
            max_tokens=max_tokens,
            temperature=req.temperature if req.temperature is not None else 0.7,
        )

        ai_text = completion.choices[0].message.content
        tokens_used = completion.usage.total_tokens

        return {
            "content": ai_text,
            "tokens": tokens_used,
            "model": model
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # In toàn bộ vết lỗi ra màn hình Render Logs để bạn "bắt mạch"
        print("================= CRITICAL EXCEPTION IN AI SERVICE =================")
        traceback.print_exc()
        print("====================================================================")
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")

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
        anthropic = get_anthropic_client()
        if not anthropic:
            raise RuntimeError("ANTHROPIC_API_KEY not configured — using Groq fallback")

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

            completion = get_groq_client().chat.completions.create(
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
                invoice_result = analyze_invoice_image(img_bytes, filename=image.filename, image_type=image.content_type)
                ocr_text = invoice_result.get("raw_text", "")
            except Exception:
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

        completion = get_groq_client().chat.completions.create(
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

