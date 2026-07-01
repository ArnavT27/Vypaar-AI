@echo off
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║   🚀 Retail Store Management System - Backend Setup      ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo ✅ npm found
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

REM Ask if user wants to seed database
set /p seed="Would you like to seed the database with demo data? (y/n): "

if /i "%seed%"=="y" (
    echo 🌱 Seeding database...
    call npm run seed
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Database seeded successfully!
        echo.
        echo 📝 Demo Credentials:
        echo    Email: demo@store.com
        echo    Password: demo123
    ) else (
        echo ❌ Failed to seed database
        echo You can try again later with: npm run seed
    )
)

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║   🎉 Installation Complete!                              ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 🚀 To start the server, run:
echo    npm run dev     (Development mode with auto-restart)
echo    npm start       (Production mode)
echo.
echo 📚 Documentation:
echo    server/README.md              - Complete API documentation
echo    server/QUICK_START.md         - Quick start guide
echo    BACKEND_SETUP.md              - Detailed setup instructions
echo.
echo 🔗 After starting:
echo    API: http://localhost:5000/api
echo    Health Check: http://localhost:5000/api/health
echo.
echo Happy Coding! 🎊
echo.
pause
