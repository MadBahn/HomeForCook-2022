@ECHO OFF
start cmd /c npm start
timeout /t 5 /nobreak
start /b cmd /c cook-server-dashboard.exe