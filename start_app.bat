@echo off

:: 1. Start the Bun Image Server in its own Git Bash window
start "" "C:\Users\ElvinBeshirli\AppData\Local\Programs\Git\usr\bin\bash.exe" --login -c "bunx serve 'D:/DataServer/Idari Ishler/Vusal Abdullayev/backup/KART/Images' -p 3000"

:: 2. Start the Next.js production server in its own Git Bash window
start "" "C:\Users\ElvinBeshirli\AppData\Local\Programs\Git\usr\bin\bash.exe" --login -c "cd 'C:/Users/ElvinBeshirli/time-record' && touch Elvin"