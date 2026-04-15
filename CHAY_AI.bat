@echo off
echo ==========================================
echo    KHOI CHAY HE THONG AI - PORT 5000
echo ==========================================
cd ai_service
..\.venv\Scripts\python.exe -m uvicorn main:app --reload --host [IP_ADDRESS] --port 5000
pause
