@echo off
REM SynapseGrid Windows Build Script

setlocal enabledelayedexpansion

echo.
echo ============================================
echo    SynapseGrid v1.0.0 - Build Script
echo ============================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo    Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo ✅ npm found: 
npm --version

echo.
echo Step 1: Installing dependencies...
echo.
call npm ci
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building backend...
echo.
call npm run build -w @synapse/backend
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to build backend
    pause
    exit /b 1
)

echo.
echo Step 3: Building frontend...
echo.
call npm run build -w @synapse/frontend
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)

echo.
echo Step 4: Creating Windows executable...
echo.
call npm run dist
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create Windows executable
    pause
    exit /b 1
)

echo.
echo ============================================
echo    ✅ Build completed successfully!
echo ============================================
echo.
echo 📦 Output files located in: dist\
echo.
dir dist\*.exe
echo.
echo Ready to deploy! You can now:
echo  1. Upload files to GitHub Releases
echo  2. Distribute SynapseGrid-*.exe to users
echo  3. Run the .msi installer or portable version
echo.
pause
