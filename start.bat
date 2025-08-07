@echo off
echo Starting VPN Application...

echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd ..\backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo Starting backend server...
start "VPN Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo Starting frontend...
cd ..\frontend
start "VPN Frontend" cmd /k "npm run dev"

echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
pause