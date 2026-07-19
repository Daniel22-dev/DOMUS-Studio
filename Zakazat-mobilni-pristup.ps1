$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 49183
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process powershell.exe -Verb RunAs -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',"`"$PSCommandPath`"")
    exit
}
& netsh http delete urlacl url="http://+:$port/" | Out-Null
Remove-NetFirewallRule -DisplayName 'DOMUS Studio v4 mobile' -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName 'DOMUS Studio v5 mobile' -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName 'DOMUS Studio v6 mobile' -ErrorAction SilentlyContinue
Remove-Item (Join-Path $root 'lan-enabled.flag') -Force -ErrorAction SilentlyContinue
Write-Host 'Mobilni pristup byl zakazan. Po restartu bude DOMUS dostupny jen na notebooku.' -ForegroundColor Green
Read-Host 'Stisknete Enter pro zavreni'
