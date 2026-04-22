@echo off
setlocal
set "ROOT=%~dp0"
if exist "%ROOT%.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%ROOT%.venv\Scripts\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo ==========================================
echo    KHOI CHAY HE THONG AI - PORT 8001
echo ==========================================
pushd "%ROOT%ai_service"
"%PYTHON_EXE%" -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
popd
pause
