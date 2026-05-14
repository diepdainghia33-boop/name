@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo    ChatID Project Setup
echo ==========================================

:: 1. AI Service Setup
echo.
echo [1/3] Setting up AI Service...
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)
echo Installing AI dependencies...
.venv\Scripts\python.exe -m pip install -r ai_service\requirements.txt

:: 2. Backend Setup
echo.
echo [2/3] Setting up Backend...
pushd BackEnd
if not exist ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
)

:: Check for PHP
where php >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\xampp\php\php.exe" (
        set "PHP_EXE=C:\xampp\php\php.exe"
    ) else (
        echo [WARNING] PHP not found in PATH or C:\xampp\php. Please install PHP or XAMPP.
    )
) else (
    set "PHP_EXE=php"
)

if defined PHP_EXE (
    :: Check for Composer
    where composer >nul 2>nul
    if %errorlevel% neq 0 (
        if exist "composer.phar" (
            set "COMPOSER_CMD=!PHP_EXE! composer.phar"
        ) else (
            echo Composer not found. Attempting to download composer.phar...
            "!PHP_EXE!" -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
            "!PHP_EXE!" composer-setup.php
            "!PHP_EXE!" -r "unlink('composer-setup.php');"
            set "COMPOSER_CMD=!PHP_EXE! composer.phar"
        )
    ) else (
        set "COMPOSER_CMD=composer"
    )

    echo Running composer install...
    !COMPOSER_CMD! install
    
    echo Generating APP_KEY...
    "!PHP_EXE!" artisan key:generate

    echo Running database migrations...
    "!PHP_EXE!" artisan migrate --force
)
popd

:: 3. Frontend Setup
echo.
echo [3/3] Setting up Frontend...
pushd frontend
echo Running npm install...
call npm.cmd install
popd

echo.
echo ==========================================
echo    Setup Complete!
echo    Run start-all.bat to start the project.
echo ==========================================
pause
