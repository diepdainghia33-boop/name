@echo off
setlocal
set "ROOT=%~dp0"

:: Set path to root venv
if exist "%ROOT%.venv\Scripts\python.exe" (
    set "PYTHON_EXE=%ROOT%.venv\Scripts\python.exe"
) else (
    echo [WARNING] Virtual environment (.venv) not found.
    echo Please run SETUP_PROJECT.bat first or install dependencies manually.
    set "PYTHON_EXE=python"
)

echo ==========================================
echo    KHOI CHAY HE THONG AI - PORT 8001
echo ==========================================

:: Check if uvicorn is available
"%PYTHON_EXE%" -m uvicorn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] uvicorn is not installed in the current environment.
    echo Attempting to install missing dependencies...
    "%PYTHON_EXE%" -m pip install fastapi uvicorn[standard] redis python-multipart pydantic mysql-connector-python sqlalchemy pymysql pytesseract Pillow transformers torch scipy groq anthropic python-dotenv
)

pushd "%ROOT%ai_service"
"%PYTHON_EXE%" -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start AI Service.
    echo Please check if port 8001 is already in use.
)
popd
pause
