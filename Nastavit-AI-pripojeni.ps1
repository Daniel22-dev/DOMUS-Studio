$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataRoot = Join-Path $env:LOCALAPPDATA 'DOMUS Studio'
$configDir = Join-Path $dataRoot 'config'
if (-not (Test-Path $configDir)) { New-Item -ItemType Directory -Path $configDir -Force | Out-Null }
Write-Host ''
Write-Host 'DOMUS Studio v7.3 - nastaveni AI analyzy, vizualizatoru a asistenta' -ForegroundColor Cyan
Write-Host 'Klic bude zasifrovan pomoci Windows DPAPI a pujde precist pouze pod vasim uzivatelskym uctem.' -ForegroundColor DarkGray
Write-Host 'Klic se nepridava do projektu ani do exportovane zalohy.' -ForegroundColor DarkGray
Write-Host ''
$key = Read-Host 'Vlozte OpenAI API klic' -AsSecureString
if ($key.Length -eq 0) { throw 'Nebyl zadan API klic.' }
$key | ConvertFrom-SecureString | Set-Content (Join-Path $configDir 'ai-key.dat') -Encoding UTF8
$model = Read-Host 'Textovy model pro analyzu a asistenta [gpt-5-mini]'
if ([string]::IsNullOrWhiteSpace($model)) { $model = 'gpt-5-mini' }
$imageModel = Read-Host 'Obrazovy model pro fotorealisticke vizualizace [gpt-image-2]'
if ([string]::IsNullOrWhiteSpace($imageModel)) { $imageModel = 'gpt-image-2' }
@{ model = $model.Trim(); imageModel = $imageModel.Trim() } | ConvertTo-Json | Set-Content (Join-Path $configDir 'ai-settings.json') -Encoding UTF8
Write-Host ''
Write-Host 'AI pripojeni bylo nastaveno. Zavrete a znovu spustte DOMUS Studio.' -ForegroundColor Green
Write-Host 'Spotreba API se uctuje podle vaseho OpenAI API uctu.' -ForegroundColor Yellow
Read-Host 'Stisknete Enter pro zavreni'
