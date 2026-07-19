@echo off
cd /d "%~dp0"
start "DOMUS Studio local server" /min powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-domus.ps1"
