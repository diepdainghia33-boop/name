# pyrefly: ignore [missing-import]
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)

# Mocking the database to avoid connection issues during tests
@pytest.fixture(autouse=True)
def mock_db():
    with patch("main.get_db") as mock:
        mock.return_value = None
        yield mock

def test_get_stats():
    """Kiểm tra endpoint lấy thông số hệ thống."""
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "cpu_speed" in data
    assert "status" in data
    assert data["status"] == "Stable"

def test_get_analytics():
    """Kiểm tra endpoint lấy dữ liệu phân tích."""
    response = client.get("/api/analytics?days=7")
    assert response.status_code == 200
    data = response.json()
    assert "days" in data
    assert "data" in data
    assert "intents" in data

@patch("main.get_groq_client")
def test_chat_endpoint(mock_groq):
    """Kiểm tra endpoint Chat với Mock Groq Client."""
    # Giả lập phản hồi từ Groq
    mock_completion = MagicMock()
    mock_completion.choices[0].message.content = "Xin chào, tôi là Architect AI."
    mock_completion.usage.total_tokens = 20
    mock_groq.return_value.chat.completions.create.return_value = mock_completion

    payload = {
        "history": [{"role": "user", "content": "Hello"}],
        "system_prompt": "You are a helpful assistant"
    }
    response = client.post("/api/chat", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Xin chào, tôi là Architect AI."
    assert data["tokens"] == 20
    assert data["model"] == "llama-3.3-70b-versatile"

def test_invoice_ocr_invalid_payload():
    """Kiểm tra lỗi khi gửi payload không hợp lệ lên endpoint OCR."""
    response = client.post("/api/invoices/ocr", json={})
    assert response.status_code == 422  # Validation Error
