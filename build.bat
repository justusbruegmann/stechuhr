
@echo off
REM build.bat - baut Backend (TypeScript) und Frontend nacheinander.
REM Bricht ab, sobald ein Schritt fehlschlaegt.

REM In das Verzeichnis wechseln, in dem diese Datei liegt (= Projekt-Root).
REM AI GERNERATED
cd /d "%~dp0"

echo ==^> Backend: TypeScript kompilieren
cd backend
call npm install
call npx tsc
if errorlevel 1 goto :error
cd ..

echo ==^> Frontend: Build
cd frontend
call npm install
call npm run build
if errorlevel 1 goto :error
cd ..

echo ==^> Fertig
exit /b 0

:error
echo.
echo !!! Build fehlgeschlagen (Exit-Code %errorlevel%^).
cd /d "%~dp0"
exit /b 1