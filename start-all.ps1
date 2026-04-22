param()

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root "BackEnd"
$frontendDir = Join-Path $root "frontend"
$aiDir = Join-Path $root "ai_service"

function Quote-PSLiteral {
    param([string]$Value)

    if ($null -eq $Value) {
        return "''"
    }

    return "'" + $Value.Replace("'", "''") + "'"
}

function Resolve-Executable {
    param([string[]]$Candidates)

    foreach ($candidate in $Candidates) {
        if ([string]::IsNullOrWhiteSpace($candidate)) {
            continue
        }

        if (Test-Path $candidate) {
            return (Resolve-Path $candidate).Path
        }

        $command = Get-Command $candidate -ErrorAction SilentlyContinue
        if ($command) {
            return $command.Source
        }
    }

    return $null
}

function Start-ServiceWindow {
    param(
        [string]$Title,
        [string]$WorkingDirectory,
        [string]$Executable,
        [string[]]$Arguments = @(),
        [hashtable]$Environment = @{}
    )

    if (-not (Test-Path $WorkingDirectory)) {
        throw "Missing directory: $WorkingDirectory"
    }

    $commands = @()
    $commands += '$host.UI.RawUI.WindowTitle = ' + (Quote-PSLiteral $Title)
    $commands += 'Set-Location -LiteralPath ' + (Quote-PSLiteral $WorkingDirectory)

    foreach ($pair in $Environment.GetEnumerator()) {
        $commands += '$env:' + $pair.Key + ' = ' + (Quote-PSLiteral ([string]$pair.Value))
    }

    $argumentLine = ""
    if ($Arguments -and $Arguments.Count -gt 0) {
        $argumentLine = " " + ($Arguments -join " ")
    }

    $commands += '& ' + (Quote-PSLiteral $Executable) + $argumentLine

    $command = $commands -join "; "
    Start-Process -FilePath "powershell.exe" -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        $command
    ) | Out-Null
}

$phpExe = Resolve-Executable @(
    "C:\xampp\php\php.exe",
    "php"
)

if (-not $phpExe) {
    throw "PHP was not found. Install PHP or make sure it is on PATH."
}

$npmExe = Resolve-Executable @(
    "npm.cmd",
    "npm"
)

if (-not $npmExe) {
    throw "npm was not found. Install Node.js or make sure npm is on PATH."
}

$pythonExe = Resolve-Executable @(
    (Join-Path $root ".venv\Scripts\python.exe"),
    "python"
)

if (-not $pythonExe) {
    throw "Python was not found. Activate .venv or install Python."
}

if (-not (Test-Path (Join-Path $backendDir "vendor"))) {
    Write-Host "Warning: BackEnd/vendor is missing. Run composer install first." -ForegroundColor Yellow
}

if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "Warning: frontend/node_modules is missing. Run npm install first." -ForegroundColor Yellow
}

if (-not (Test-Path (Join-Path $aiDir ".venv"))) {
    Write-Host "Warning: ai_service/.venv is missing. The script will use system python if available." -ForegroundColor Yellow
}

Write-Host "Starting ChatID services..." -ForegroundColor Cyan

Start-ServiceWindow `
    -Title "ChatID Backend" `
    -WorkingDirectory $backendDir `
    -Executable $phpExe `
    -Arguments @("artisan", "serve", "--host=127.0.0.1", "--port=8000") `
    -Environment @{
        AI_SERVICE_URL = "http://127.0.0.1:8001"
    }

Start-ServiceWindow `
    -Title "ChatID Frontend" `
    -WorkingDirectory $frontendDir `
    -Executable $npmExe `
    -Arguments @("start") `
    -Environment @{
        REACT_APP_API_URL = "http://127.0.0.1:8000/api"
        REACT_APP_AI_SERVICE_URL = "http://127.0.0.1:8001"
    }

Start-ServiceWindow `
    -Title "ChatID AI Service" `
    -WorkingDirectory $aiDir `
    -Executable $pythonExe `
    -Arguments @("-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8001", "--reload")

Write-Host "Launched:" -ForegroundColor Green
Write-Host "  Backend:  http://127.0.0.1:8000"
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  AI:       http://127.0.0.1:8001"
Write-Host "Close the opened windows to stop the services."
