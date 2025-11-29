@echo off
echo Starting TruliCare servers...

echo.
echo Starting Flask Backend...
start "Flask Backend" cmd /k "cd /d E:\trulicare\backend && python app.py"

timeout /t 3

echo.
echo Starting React Frontend...
start "React Frontend" cmd /k "cd /d E:\trulicare\frontend && npm run dev"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause