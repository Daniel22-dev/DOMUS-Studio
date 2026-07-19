@echo off
set "DOMUS_CONFIG=%LOCALAPPDATA%\DOMUS Studio\config"
if exist "%DOMUS_CONFIG%\ai-key.dat" del /q "%DOMUS_CONFIG%\ai-key.dat"
if exist "%DOMUS_CONFIG%\ai-settings.json" del /q "%DOMUS_CONFIG%\ai-settings.json"
if exist "%~dp0ai-key.dat" del /q "%~dp0ai-key.dat"
if exist "%~dp0ai-settings.json" del /q "%~dp0ai-settings.json"
echo AI klic a nastaveni byly odstraneny z bezpecneho uzivatelskeho uloziste.
pause
