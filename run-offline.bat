@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  start "Japan Offline Server" /min cmd /c "py -m http.server 8765"
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "Japan Offline Server" /min cmd /c "python -m http.server 8765"
  ) else (
    echo Python is not installed.
    echo Install Python from https://www.python.org/downloads/ and try again.
    pause
    exit /b 1
  )
)

timeout /t 1 /nobreak >nul
start "" "http://localhost:8765/index.html"
echo Japan offline server is running at http://localhost:8765/
echo Close the small server window when you are finished.
endlocal
