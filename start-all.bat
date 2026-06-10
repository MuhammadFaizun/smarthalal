@echo off
echo ===================================================
echo Menjalankan Smart-Halal Backend dan Frontend...
echo ===================================================

:: Jalankan Backend di jendela cmd baru
echo Memulai Backend (Port 3000)...
start "Smart-Halal Backend" cmd /k "cd /d %~dp0smart-halal-backend && npm run dev"

:: Jalankan Frontend di jendela cmd baru
echo Memulai Frontend (Port 3001)...
start "Smart-Halal Frontend" cmd /k "cd /d %~dp0smart-halal-frontend && npm run dev"

echo.
echo ===================================================
echo Backend sedang berjalan di: http://localhost:3000
echo Frontend sedang berjalan di: http://localhost:3001
echo.
echo Silakan buka http://localhost:3001 di browser Anda!
echo ===================================================
echo.
pause
