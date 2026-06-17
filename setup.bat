@echo off
REM Smart Waste Management System - Quick Setup Script (Windows)
REM This script sets up the entire project

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Smart Waste Management System - Setup Script             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo Setting up Backend...
cd backend

REM Install backend dependencies
echo Installing backend dependencies...
call npm install

REM Copy environment file
if not exist .env (
    echo ✓ Creating .env file
    copy .env.example .env
    echo ⚠ Please update .env with your database credentials
)

cd ..
echo ✓ Backend setup complete

echo.
echo Setting up Frontend...
cd frontend

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install

REM Create .env if it doesn't exist
if not exist .env (
    echo ✓ Creating .env file
    echo REACT_APP_API_URL=http://localhost:5000/api/v1 > .env
)

cd ..
echo ✓ Frontend setup complete

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Setup Complete!                                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo 1. Update backend\.env with your MySQL credentials
echo 2. Create MySQL database: mysql -u root -p ^< database_schema.sql
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. In another terminal, start frontend: cd frontend ^&^& npm start
echo.
pause
