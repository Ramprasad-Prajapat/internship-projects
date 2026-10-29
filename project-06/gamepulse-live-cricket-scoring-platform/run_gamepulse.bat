@echo off
title GamePulse Live - Full Stack Launcher
color 0A
cls

echo ========================================================================
echo                  GAMEPULSE LIVE - CRICKET PLATFORM                      
echo ========================================================================
echo.
echo Starting full-stack application...
echo.

set "ROOT_DIR=%~dp0"
set "MAVEN_BIN=%ROOT_DIR%apache-maven-3.9.12\bin\mvn.cmd"

if not exist "%MAVEN_BIN%" (
    set "MAVEN_BIN=mvn"
)

echo [1/3] Launching Spring Boot Backend Engine (Port 8080)...
start "GamePulse Backend Server" cmd /k "cd /d "%ROOT_DIR%backend" && "%MAVEN_BIN%" spring-boot:run"

echo [2/3] Waiting for Backend initialization...
timeout /t 5 /nobreak > nul

echo [3/3] Launching React Vite Frontend...
start "GamePulse Frontend Server" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"

echo.
echo ========================================================================
echo                        STARTUP COMPLETE                                 
echo ========================================================================
echo.
echo  - Frontend Web UI:  http://localhost:3000 (or http://localhost:3001)
echo  - Backend REST API: http://localhost:8080/api
echo  - Health Check:     http://localhost:8080/api/health
echo.
echo  ⚡ DEMO CREDENTIALS:
echo    👑 Admin:   admin@gamepulse.com  / admin123
echo    🏏 Scorer:  scorer@gamepulse.com / scorer123
echo    👤 Viewer:  user@gamepulse.com  / user123
echo.
echo ========================================================================
echo Opening GamePulse Live in your default browser...
timeout /t 3 /nobreak > nul
start http://localhost:3000

echo Press any key to close this launcher window (Servers will keep running)...
pause > nul
