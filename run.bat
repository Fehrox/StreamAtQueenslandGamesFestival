@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run this project.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm is required to run this project.
  echo Install Node.js with npm, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency install failed.
    pause
    exit /b 1
  )
)

set ASTRO_TELEMETRY_DISABLED=1

echo Starting Queensland Games Festival invite site...
echo Open http://127.0.0.1:4321/
call npm.cmd run dev -- --host 127.0.0.1 --port 4321

endlocal
