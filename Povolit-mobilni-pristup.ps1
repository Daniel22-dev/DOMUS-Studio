$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 49183
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process powershell.exe -Verb RunAs -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',"`"$PSCommandPath`"")
    exit
}
$user = "$env:USERDOMAIN\$env:USERNAME"
& netsh http delete urlacl url="http://+:$port/" 2>$null | Out-Null
& netsh http add urlacl url="http://+:$port/" user="$user" | Out-Null
try { Remove-NetFirewallRule -DisplayName 'DOMUS Studio v4 mobile' -ErrorAction SilentlyContinue } catch { }
try { Remove-NetFirewallRule -DisplayName 'DOMUS Studio v5 mobile' -ErrorAction SilentlyContinue } catch { }
try { Remove-NetFirewallRule -DisplayName 'DOMUS Studio v6 mobile' -ErrorAction SilentlyContinue } catch { }
New-NetFirewallRule -DisplayName 'DOMUS Studio v6 mobile' -Direction Inbound -Action Allow -Protocol TCP -LocalPort $port -Profile Private | Out-Null
Set-Content (Join-Path $root 'lan-enabled.flag') -Value 'enabled' -Encoding ASCII
Write-Host ''
Write-Host 'Mobilni pristup DOMUS Studio byl povolen pro soukrome site.' -ForegroundColor Green
Write-Host 'Zavrete bezici okno DOMUS Studio a aplikaci znovu spustte.' -ForegroundColor Yellow
Write-Host 'Používejte pouze na duveryhodne domaci Wi-Fi.' -ForegroundColor DarkGray
Read-Host 'Stisknete Enter pro zavreni'
