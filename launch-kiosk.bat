@echo off
:: ============================================================
:: SP Motor Kiosk Launcher
::
:: Usage:
::   launch-kiosk.bat                        — normal window, localhost
::   launch-kiosk.bat --kiosk                — fullscreen kiosk, localhost
::   launch-kiosk.bat --url https://example.com          — custom URL
::   launch-kiosk.bat --kiosk --url https://example.com  — both
:: ============================================================

cd /d "%~dp0"

:: --- Parse arguments ---
set KIOSK_FLAG=
set LAUNCH_URL=http://localhost:8080

:parse_args
if "%~1"=="" goto args_done
if /i "%~1"=="--kiosk" (
    set KIOSK_FLAG=--kiosk
    shift & goto parse_args
)
if /i "%~1"=="--url" (
    set LAUNCH_URL=%~2
    shift & shift & goto parse_args
)
shift & goto parse_args
:args_done

:: Kill any existing instance on port 8080
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080"') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Start the local Node server in background
start "" /B node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{let f=path.join('./public',decodeURIComponent(req.url==='/'?'/index.html':req.url));fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end('Not found');}else{const m={'html':'text/html','js':'application/javascript','css':'text/css','png':'image/png','jpg':'image/jpeg','svg':'image/svg+xml','ico':'image/x-icon'};const ext=path.extname(f).slice(1);res.writeHead(200,{'Content-Type':m[ext]||'text/plain'});res.end(d);}});}).listen(8080,()=>console.log('Server ready on http://localhost:8080'));"

:: Wait for server to be ready
timeout /t 2 /nobreak >nul

:: Profile and extension dirs — both inside project folder (no spaces in path)
set PROFILE=%~dp0chrome-profile
set EXTDIR=%~dp0kiosk-extension

:: Only seed Preferences on very first run (do NOT wipe — extensions persist in the profile)
if not exist "%PROFILE%\Default" mkdir "%PROFILE%\Default"
if not exist "%PROFILE%\Default\Preferences" (
    echo {"extensions":{"ui":{"developer_mode":true}}} > "%PROFILE%\Default\Preferences"
)

:: Browser paths
set CHROME64="C:\Program Files\Google\Chrome\Application\chrome.exe"
set CHROME86="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
set EDGE64="C:\Program Files\Microsoft\Edge\Application\msedge.exe"
set EDGE86="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

if exist %CHROME64% (
    echo Launching Chrome...
    start "" %CHROME64% --user-data-dir=%PROFILE% --load-extension=%EXTDIR% %KIOSK_FLAG% --no-first-run --disable-infobars --disable-translate --autoplay-policy=no-user-gesture-required %LAUNCH_URL%
) else if exist %CHROME86% (
    echo Launching Chrome x86...
    start "" %CHROME86% --user-data-dir=%PROFILE% --load-extension=%EXTDIR% %KIOSK_FLAG% --no-first-run --disable-infobars --disable-translate --autoplay-policy=no-user-gesture-required %LAUNCH_URL%
) else if exist %EDGE64% (
    echo Launching Edge...
    start "" %EDGE64% --user-data-dir=%PROFILE% --load-extension=%EXTDIR% %KIOSK_FLAG% --no-first-run --disable-infobars --disable-translate --autoplay-policy=no-user-gesture-required %LAUNCH_URL%
) else if exist %EDGE86% (
    echo Launching Edge x86...
    start "" %EDGE86% --user-data-dir=%PROFILE% --load-extension=%EXTDIR% %KIOSK_FLAG% --no-first-run --disable-infobars --disable-translate --autoplay-policy=no-user-gesture-required %LAUNCH_URL%
) else (
    echo ERROR: Could not find Chrome or Edge.
    echo Please install Google Chrome and try again.
    pause
)
