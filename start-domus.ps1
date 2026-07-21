$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
try { Add-Type -AssemblyName System.Net.Http -ErrorAction Stop } catch { }

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 49183
$localPrefix = "http://localhost:$port/"
$lanFlag = Join-Path $root 'lan-enabled.flag'
$lanEnabled = Test-Path $lanFlag
$prefix = $(if ($lanEnabled) { "http://+:$port/" } else { $localPrefix })
$dataRoot = Join-Path $env:LOCALAPPDATA 'DOMUS Studio'
$syncDir = Join-Path $dataRoot 'sync-store'
$configDir = Join-Path $dataRoot 'config'
@($dataRoot, $syncDir, $configDir) | ForEach-Object { if (-not (Test-Path $_)) { New-Item -ItemType Directory -Path $_ -Force | Out-Null } }

# Jednorázová migrace citlivých dat z původní webové složky.
@('ai-key.dat','ai-settings.json') | ForEach-Object {
    $old = Join-Path $root $_
    $new = Join-Path $configDir $_
    if ((Test-Path $old) -and -not (Test-Path $new)) { Move-Item $old $new -Force }
}
$oldSync = Join-Path $root 'sync-store'
if (Test-Path $oldSync) {
    Get-ChildItem $oldSync -Filter '*.json' -File -ErrorAction SilentlyContinue | ForEach-Object { Move-Item $_.FullName (Join-Path $syncDir $_.Name) -Force }
    Remove-Item $oldSync -Recurse -Force -ErrorAction SilentlyContinue
}
Remove-Item (Join-Path $root '.domus-sync.json') -Force -ErrorAction SilentlyContinue

$maxBodyBytes = @{
    '/api/product' = 32768
    '/api/ai' = 33554432
    '/api/image' = 50331648
    '/api/sync/pair' = 8192
    '/api/sync/push' = 209715200
    '/api/sync/pull' = 32768
    '/api/sync/list' = 8192
}
$rateState = @{}
$pairingCode = ''
$pairingExpiresAt = [DateTime]::MinValue

function Get-LocalIPv4 {
    try {
        $address = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' -and $_.PrefixOrigin -ne 'WellKnown' } | Sort-Object InterfaceMetric | Select-Object -First 1 -ExpandProperty IPAddress
        if ($address) { return [string]$address }
    } catch { }
    try {
        $address = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) | Where-Object { $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and $_.IPAddressToString -notlike '127.*' } | Select-Object -First 1
        if ($address) { return $address.IPAddressToString }
    } catch { }
    return '127.0.0.1'
}

function Test-IsLocalClient {
    param($Request)
    try {
        $address = $Request.RemoteEndPoint.Address
        return $address.Equals([System.Net.IPAddress]::Loopback) -or $address.Equals([System.Net.IPAddress]::IPv6Loopback) -or $address.IsIPv4MappedToIPv6 -and $address.MapToIPv4().Equals([System.Net.IPAddress]::Loopback)
    } catch { return $false }
}

function New-SecureToken {
    param([int]$Bytes = 32)
    $buffer = New-Object byte[] $Bytes
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($buffer) } finally { $rng.Dispose() }
    return [Convert]::ToBase64String($buffer).TrimEnd('=').Replace('+','-').Replace('/','_')
}

function Get-Sha256 {
    param([string]$Value)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($Value))).Replace('-','').ToLowerInvariant()) } finally { $sha.Dispose() }
}

function Get-DeviceConfiguration {
    $path = Join-Path $configDir 'device.json'
    $config = $null
    if (Test-Path $path) { try { $config = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json } catch { } }
    if (-not $config) {
        $config = [pscustomobject]@{ deviceName = $env:COMPUTERNAME; createdAt = (Get-Date).ToString('o') }
        $config | ConvertTo-Json | Set-Content $path -Encoding UTF8
    }
    return $config
}

function New-PairingCode {
    $script:pairingCode = [string](Get-Random -Minimum 100000 -Maximum 999999)
    $script:pairingExpiresAt = (Get-Date).AddMinutes(10)
}

function Get-PairedDevices {
    $path = Join-Path $configDir 'paired-devices.json'
    if (-not (Test-Path $path)) { return @() }
    try {
        $items = Get-Content $path -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($items -is [System.Array]) { return @($items) }
        if ($items) { return @($items) }
    } catch { }
    return @()
}

function Save-PairedDevices {
    param($Devices)
    @($Devices) | ConvertTo-Json -Depth 8 | Set-Content (Join-Path $configDir 'paired-devices.json') -Encoding UTF8
}

function Test-BearerToken {
    param($Request)
    if (-not $lanEnabled) { return $false }
    $header = [string]$Request.Headers['Authorization']
    if ($header -notmatch '^Bearer\s+(.+)$') { return $false }
    $hash = Get-Sha256 $Matches[1]
    $devices = @(Get-PairedDevices)
    $match = $devices | Where-Object { $_.tokenHash -eq $hash -and ([DateTime]$_.expiresAt) -gt (Get-Date) } | Select-Object -First 1
    if (-not $match) { return $false }
    $match.lastSeenAt = (Get-Date).ToString('o')
    Save-PairedDevices $devices
    return $true
}

function Test-PortOpen {
    param([int]$Port)
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $client.Connect('127.0.0.1', $Port)
        $client.Close()
        return $true
    } catch { return $false }
}

function Add-SecurityHeaders {
    param($Response)
    $Response.Headers['X-Content-Type-Options'] = 'nosniff'
    $Response.Headers['Referrer-Policy'] = 'no-referrer'
    $Response.Headers['Permissions-Policy'] = 'camera=(self), geolocation=(self), microphone=(), payment=(), usb=()'
    $Response.Headers['Cross-Origin-Resource-Policy'] = 'same-origin'
    $Response.Headers['Cache-Control'] = 'no-store'
    $Response.Headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' data:; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
}

function Write-JsonResponse {
    param($Context, $Data, [int]$StatusCode = 200)
    $json = $Data | ConvertTo-Json -Depth 30 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $Context.Response.StatusCode = $StatusCode
    $Context.Response.ContentType = 'application/json; charset=utf-8'
    Add-SecurityHeaders $Context.Response
    $Context.Response.ContentLength64 = $bytes.Length
    $Context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $Context.Response.OutputStream.Close()
}

function Read-JsonBody {
    param($Request, [int64]$Limit = 1048576)
    if ($Request.ContentLength64 -gt $Limit) { throw 'Požadavek překračuje povolenou velikost.' }
    $stream = $Request.InputStream
    $memory = New-Object System.IO.MemoryStream
    $buffer = New-Object byte[] 8192
    $total = 0L
    try {
        while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
            $total += $read
            if ($total -gt $Limit) { throw 'Požadavek překračuje povolenou velikost.' }
            $memory.Write($buffer, 0, $read)
        }
        if ($total -eq 0) { return @{} }
        $body = $Request.ContentEncoding.GetString($memory.ToArray())
        return $body | ConvertFrom-Json
    } finally { $memory.Dispose() }
}

function Test-RateLimit {
    param($Request, [string]$Bucket, [int]$Limit, [int]$Minutes)
    $key = "$($Request.RemoteEndPoint.Address)|$Bucket"
    $now = Get-Date
    if (-not $rateState.ContainsKey($key) -or $rateState[$key].ResetAt -le $now) { $rateState[$key] = [pscustomobject]@{ Count = 0; ResetAt = $now.AddMinutes($Minutes) } }
    $rateState[$key].Count++
    return $rateState[$key].Count -le $Limit
}

function Require-LocalApi {
    param($Context)
    if (-not (Test-IsLocalClient $Context.Request)) { Write-JsonResponse -Context $Context -Data @{ ok = $false; error = 'Tato funkce je dostupná pouze přímo na notebooku.' } -StatusCode 403; return $false }
    return $true
}

function Require-SyncToken {
    param($Context)
    if (Test-IsLocalClient $Context.Request) { return $true }
    if (-not (Test-RateLimit -Request $Context.Request -Bucket 'sync' -Limit 240 -Minutes 60)) { Write-JsonResponse -Context $Context -Data @{ ok = $false; error = 'Příliš mnoho požadavků. Zkuste to později.' } -StatusCode 429; return $false }
    if (-not (Test-BearerToken $Context.Request)) { Write-JsonResponse -Context $Context -Data @{ ok = $false; error = 'Zařízení není spárováno nebo jeho přístup vypršel.' } -StatusCode 401; return $false }
    return $true
}

function Get-AIConfiguration {
    $keyPath = Join-Path $configDir 'ai-key.dat'
    $settingsPath = Join-Path $configDir 'ai-settings.json'
    $model = 'gpt-5-mini'
    $imageModel = 'gpt-image-2'
    if (Test-Path $settingsPath) {
        try {
            $settings = Get-Content $settingsPath -Raw -Encoding UTF8 | ConvertFrom-Json
            if (-not [string]::IsNullOrWhiteSpace($settings.model)) { $model = [string]$settings.model }
            if (-not [string]::IsNullOrWhiteSpace($settings.imageModel)) { $imageModel = [string]$settings.imageModel }
        } catch { }
    }
    $apiKey = ''
    if (Test-Path $keyPath) {
        try { $secure = Get-Content $keyPath -Raw | ConvertTo-SecureString; $credential = New-Object System.Management.Automation.PSCredential('domus', $secure); $apiKey = $credential.GetNetworkCredential().Password } catch { $apiKey = '' }
    }
    return @{ configured = -not [string]::IsNullOrWhiteSpace($apiKey); apiKey = $apiKey; model = $model; imageModel = $imageModel }
}

function Test-BlockedHost {
    param([string]$HostName)
    $name = $HostName.ToLowerInvariant()
    if ($name -eq 'localhost' -or $name.EndsWith('.local') -or $name.EndsWith('.internal')) { return $true }
    try {
        $addresses = [System.Net.Dns]::GetHostAddresses($name)
        foreach ($address in $addresses) {
            $bytes = $address.GetAddressBytes()
            if ($address.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork) {
                if ($bytes[0] -eq 0 -or $bytes[0] -eq 10 -or $bytes[0] -eq 127) { return $true }
                if ($bytes[0] -eq 192 -and $bytes[1] -eq 168) { return $true }
                if ($bytes[0] -eq 172 -and $bytes[1] -ge 16 -and $bytes[1] -le 31) { return $true }
                if ($bytes[0] -eq 169 -and $bytes[1] -eq 254) { return $true }
                if ($bytes[0] -ge 224) { return $true }
            }
            if ($address.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetworkV6 -and ($address.IsIPv6LinkLocal -or $address.IsIPv6SiteLocal -or $address.Equals([System.Net.IPAddress]::IPv6Loopback))) { return $true }
        }
    } catch { return $true }
    return $false
}

function Invoke-SafeWebFetch {
    param([string]$Url)
    $handler = New-Object System.Net.Http.HttpClientHandler
    $handler.AllowAutoRedirect = $false
    $handler.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
    $client = New-Object System.Net.Http.HttpClient($handler)
    $client.Timeout = [TimeSpan]::FromSeconds(35)
    $client.DefaultRequestHeaders.UserAgent.ParseAdd('Mozilla/5.0 (Windows NT 10.0; Win64; x64) DOMUS-Studio/6.0')
    $client.DefaultRequestHeaders.AcceptLanguage.ParseAdd('cs-CZ,cs;q=0.9,en;q=0.7')
    try {
        $current = New-Object System.Uri($Url)
        for ($redirect = 0; $redirect -le 5; $redirect++) {
            if (($current.Scheme -ne 'http' -and $current.Scheme -ne 'https') -or (Test-BlockedHost -HostName $current.Host)) { throw 'Tuto adresu nelze z bezpečnostních důvodů načíst.' }
            $response = $client.GetAsync($current, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).GetAwaiter().GetResult()
            try {
                $status = [int]$response.StatusCode
                if ($status -ge 300 -and $status -lt 400) {
                    $location = $response.Headers.Location
                    if (-not $location) { throw 'Server vrátil neplatné přesměrování.' }
                    $current = $(if ($location.IsAbsoluteUri) { $location } else { New-Object System.Uri($current, $location) })
                    continue
                }
                if (-not $response.IsSuccessStatusCode) { throw "Web vrátil chybu HTTP $status." }
                $stream = $response.Content.ReadAsStreamAsync().GetAwaiter().GetResult()
                $memory = New-Object System.IO.MemoryStream
                $buffer = New-Object byte[] 8192
                $total = 0
                try {
                    while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                        $total += $read
                        if ($total -gt 1800000) { break }
                        $memory.Write($buffer, 0, $read)
                    }
                    $charset = $response.Content.Headers.ContentType.CharSet
                    $encoding = [Text.Encoding]::UTF8
                    if ($charset) { try { $encoding = [Text.Encoding]::GetEncoding($charset.Trim('"')) } catch { } }
                    return @{ Url = $current.AbsoluteUri; Html = $encoding.GetString($memory.ToArray()) }
                } finally { $memory.Dispose(); $stream.Dispose() }
            } finally { $response.Dispose() }
        }
        throw 'Adresa obsahuje příliš mnoho přesměrování.'
    } finally { $client.Dispose(); $handler.Dispose() }
}

function Get-OutputText {
    param($Response)
    $parts = New-Object System.Collections.Generic.List[string]
    if ($Response.output) { foreach ($item in $Response.output) { if ($item.content) { foreach ($content in $item.content) { if ($content.type -eq 'output_text' -and $content.text) { [void]$parts.Add([string]$content.text) } } } } }
    if ($parts.Count -eq 0 -and $Response.output_text) { [void]$parts.Add([string]$Response.output_text) }
    return ($parts -join "`n")
}

function Invoke-DomusAI {
    param($Payload, $Configuration)
    $task = [string]$Payload.task
    if ($task -eq 'assistant') {
        $prompt = @"
Jsi DOMUS Project Assistant, opatrný český asistent pro plánování stavebních, interiérových a zahradních projektů. Pracuješ pouze s dodanou strukturou aktivní varianty. Nejsi statik, projektant ani revizní technik. Nikdy netvrď, že byla změna provedena. Pokud uživatel žádá změnu, připrav návrh akcí k výslovnému potvrzení. Pokud chybí přesná poloha, rozměr nebo identifikátor prvku, polož doplňující otázku a vrať proposal null. Vrať pouze platný JSON bez markdownu:
{"reply":"stručná, ale užitečná odpověď v češtině","proposal":null}
nebo
{"reply":"vysvětlení návrhu","proposal":{"title":"...","summary":"...","risk":"low|medium|high","assumptions":["co musí uživatel ověřit"],"actions":[{"type":"add_object|move_object|resize_object|remove_object|add_material|add_cost|set_contingency|append_notes|set_wall_height|set_surface_material|create_variant","label":"srozumitelný popis","params":{}}]}}
Povolené parametry:
add_object: libraryKey,type,layer,xMm,yMm,widthMm,depthMm,heightCm,rotation,note.
move_object: objectId,xMm,yMm. resize_object: objectId,widthMm,depthMm,heightCm. remove_object: objectId.
add_material: name,category,manufacturer,sku,widthMm,depthMm,heightMm,unit,quantity,unitPrice,wastePercent,color,swatch,note.
add_cost: name,category,quantity,unit,unitPrice,note. set_contingency: percent. append_notes: text. set_wall_height: heightM.
set_surface_material: surface wall|floor|ceiling, materialId. create_variant: name,notes.
Pravidla: nejvýše 12 akcí; používej pouze existující objectId/materialId a libraryKey z kontextu; nevymýšlej cenu jako jistou skutečnost; odstranění nebo zásah do rozvodů označ high; přesné rozměry bez podkladu nenavrhuj.
Kontext aktivní varianty:
$($Payload.project | ConvertTo-Json -Depth 16 -Compress)
Poslední zprávy:
$($Payload.messages | ConvertTo-Json -Depth 8 -Compress)
"@
    } elseif ($task -eq 'variants') {
        $prompt = @"
Jsi stavební a interiérový návrhový asistent v osobní aplikaci DOMUS Studio. Připrav přesně 3 realistické návrhové směry pro zadaný projekt: účelný/úsporný, vyvážený a prémiový. Neuváděj konkrétní stavební tvrzení, která nelze doložit. Vrať pouze platný JSON bez markdownu ve tvaru:
{"variants":[{"name":"...","style":"...","description":"...","budgetFactor":0.85,"contingencyPercent":12,"changes":["...","...","...","..."]}]}
Každá varianta musí mít 4 až 6 konkrétních změn a budgetFactor v rozsahu 0.7 až 1.6. Kontext projektu:
$($Payload.project | ConvertTo-Json -Depth 8 -Compress)
Aktuální stav:
$($Payload.current | ConvertTo-Json -Depth 8 -Compress)
"@
    } else {
        $prompt = @"
Jsi opatrný obrazový asistent pro plánování rekonstrukcí v aplikaci DOMUS Studio. Analyzuješ fotografii skutečného stavu, nikoli autorizovanou projektovou dokumentaci. Jasně odděluj viditelné skutečnosti od odhadů. Nikdy nevymýšlej přesný rozměr, pokud není doložen. Vrať pouze platný JSON bez markdownu v tomto tvaru:
{"summary":"...","confidence":0.0,"roomType":"...","proposedPlan":{"shape":"rectangle","widthMm":null,"depthMm":null,"wallHeightM":null,"reasoning":"..."},"elements":[{"name":"...","typeKey":"door|window|column|cabinet|shower-tray|sink|water-pipe|valve|drain|floor-drain|manhole|socket|light|switchboard|radiator|floor-heating|ac|recuperation|sprinkler|irrigation-pipe|valve-box","layer":"architecture|water|sewer|electricity|heating|ventilation|garden","confidence":0.0,"notes":"..."}],"utilities":["..."],"risks":["..."],"measurementsToVerify":["..."]}
Pokyny: confidence je 0 až 1; rozměry nech null, pokud je nelze bezpečně převzít; popiš nejvýše 8 opravdu viditelných prvků; uveď nejistoty a praktická měření k ověření.
Kontext projektu:
$($Payload.project | ConvertTo-Json -Depth 8 -Compress)
Dosavadní údaje:
$($Payload.current | ConvertTo-Json -Depth 8 -Compress)
Popisy dalších pohledů:
$($Payload.photoViews | ConvertTo-Json -Depth 8 -Compress)
"@
    }
    $content = New-Object System.Collections.ArrayList
    [void]$content.Add(@{ type = 'input_text'; text = $prompt })
    $imageUrls = New-Object System.Collections.ArrayList
    if ($Payload.imageDataUrls) { foreach ($imageUrl in $Payload.imageDataUrls) { if ([string]$imageUrl -match '^data:image/(jpeg|png|webp);base64,' -and $imageUrls.Count -lt 4) { [void]$imageUrls.Add([string]$imageUrl) } } }
    if ($imageUrls.Count -eq 0 -and [string]$Payload.imageDataUrl -match '^data:image/(jpeg|png|webp);base64,') { [void]$imageUrls.Add([string]$Payload.imageDataUrl) }
    foreach ($imageUrl in $imageUrls) { [void]$content.Add(@{ type = 'input_image'; image_url = $imageUrl; detail = 'high' }) }
    $body = @{ model = $Configuration.model; input = @(@{ role = 'user'; content = $content }); max_output_tokens = 3000 }
    $headers = @{ Authorization = "Bearer $($Configuration.apiKey)"; 'Content-Type' = 'application/json' }
    $response = Invoke-RestMethod -Uri 'https://api.openai.com/v1/responses' -Method Post -Headers $headers -Body ($body | ConvertTo-Json -Depth 20 -Compress) -TimeoutSec 120
    $text = Get-OutputText -Response $response
    if ([string]::IsNullOrWhiteSpace($text)) { throw 'AI služba nevrátila textový výstup.' }
    return @{ text = $text; id = [string]$response.id }
}

function Invoke-DomusImageEdit {
    param($Payload, $Configuration)
    $prompt = [string]$Payload.prompt
    if ([string]::IsNullOrWhiteSpace($prompt) -or $prompt.Length -lt 10 -or $prompt.Length -gt 12000) { throw 'Zadání vizualizace nemá platnou délku.' }
    $imageDataUrl = [string]$Payload.imageDataUrl
    if ($imageDataUrl -notmatch '^data:image/(jpeg|png|webp);base64,') { throw 'Zdrojová fotografie nemá podporovaný formát.' }
    $quality = [string]$Payload.quality
    if (@('medium','high') -notcontains $quality) { $quality = 'medium' }
    $size = [string]$Payload.size
    if (@('auto','1024x1024','1536x1024','1024x1536') -notcontains $size) { $size = 'auto' }
    $count = 1
    try { $count = [Math]::Max(1, [Math]::Min(3, [int]$Payload.count)) } catch { $count = 1 }
    $body = @{
        model = $Configuration.imageModel
        images = @(@{ image_url = $imageDataUrl })
        prompt = $prompt
        input_fidelity = 'high'
        quality = $quality
        size = $size
        n = $count
        output_format = 'webp'
        output_compression = 88
        moderation = 'auto'
    }
    $headers = @{ Authorization = "Bearer $($Configuration.apiKey)"; 'Content-Type' = 'application/json' }
    $response = Invoke-RestMethod -Uri 'https://api.openai.com/v1/images/edits' -Method Post -Headers $headers -Body ($body | ConvertTo-Json -Depth 12 -Compress) -TimeoutSec 300
    $dataUrls = New-Object System.Collections.ArrayList
    foreach ($item in @($response.data)) {
        if (-not [string]::IsNullOrWhiteSpace([string]$item.b64_json)) { [void]$dataUrls.Add("data:image/webp;base64,$([string]$item.b64_json)") }
    }
    if ($dataUrls.Count -eq 0) { throw 'Obrazová AI nevrátila žádný obrázek.' }
    return @{ dataUrls = @($dataUrls); model = $Configuration.imageModel }
}

function Test-ProjectPayload {
    param($Project)
    if (-not $Project -or [string]::IsNullOrWhiteSpace([string]$Project.id)) { throw 'Projekt nemá platnou strukturu.' }
    $projectId = [string]$Project.id
    if ($projectId -notmatch '^[a-zA-Z0-9._:-]{3,120}$') { throw 'Projekt nemá platný identifikátor.' }
    $json = $Project | ConvertTo-Json -Depth 100 -Compress
    if ([Text.Encoding]::UTF8.GetByteCount($json) -gt 190000000) { throw 'Projekt překračuje povolenou velikost.' }
    if ($json -match '(?i)data:image/svg\+xml|javascript:|<script|onerror\s*=|onload\s*=') { throw 'Projekt obsahuje nepovolený aktivní obsah.' }
    return @{ Id = $projectId; Json = $json }
}

if (Test-PortOpen -Port $port) { Start-Process "$localPrefix`index.html"; exit }

$localIp = Get-LocalIPv4
$deviceConfig = Get-DeviceConfiguration
$mobileUrl = "http://$localIp`:$port/"
New-PairingCode

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try {
    $listener.Start()
} catch {
    if ($lanEnabled) {
        Write-Host 'Mobilni pristup nelze spustit. Znovu spustte Povolit-mobilni-pristup.bat jako spravce.' -ForegroundColor Yellow
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add($localPrefix)
        $listener.Start()
        $lanEnabled = $false
    } else { throw }
}
Start-Process "$localPrefix`index.html"
if ($lanEnabled) {
    Write-Host "DOMUS Studio v7.3 Premium bezi na notebooku: $localPrefix" -ForegroundColor Green
    Write-Host "Adresa pro telefon: $mobileUrl" -ForegroundColor Cyan
    Write-Host "Jednorazovy parovaci kod (10 minut): $pairingCode" -ForegroundColor Cyan
    Write-Host 'Telefon i notebook musi byt ve stejne duveryhodne siti Wi-Fi.' -ForegroundColor DarkGray
}

$mime = @{
    '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'application/javascript; charset=utf-8';
    '.webmanifest' = 'application/manifest+json; charset=utf-8'; '.map' = 'application/json; charset=utf-8'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
}
$allowedStatic = @{}
$staticFiles = @(
    'index.html', 'theme-init.js', 'styles.css', 'styles.css.map', 'app.js', 'app.js.map', 'service-worker.js', 'manifest.webmanifest',
    'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'MANUAL-DOMUS-STUDIO-v7.3.html',
    'workers/project-metrics-worker.js', 'vendor/three.core.min.js', 'vendor/three.module.min.js', 'vendor/OrbitControls.js', 'vendor/GLTFExporter.js',
    'vendor/tauri-core.js', 'vendor/tauri-updater.js', 'vendor/tauri-process.js', 'vendor/external/tslib/tslib.es6.js'
)
foreach ($relative in $staticFiles) {
    $candidate = Join-Path $root $relative
    if (Test-Path -LiteralPath $candidate -PathType Leaf) {
        $allowedStatic[$relative.ToLowerInvariant()] = $candidate
    }
}

$lastRequest = Get-Date
try {
    while ($listener.IsListening) {
        $async = $listener.BeginGetContext($null, $null)
        if (-not $async.AsyncWaitHandle.WaitOne(60000)) { if (((Get-Date) - $lastRequest).TotalHours -ge 2) { break }; continue }
        $context = $listener.EndGetContext($async)
        $lastRequest = Get-Date
        try {
            $path = $context.Request.Url.AbsolutePath
            if ($path -eq '/api/status') {
                if (-not (Require-LocalApi $context)) { continue }
                $config = Get-AIConfiguration
                Write-JsonResponse -Context $context -Data @{ configured = $config.configured; model = $config.model; imageModel = $config.imageModel; message = $(if ($config.configured) { 'Zašifrovaný API klíč je uložen mimo webovou složku a dostupný pouze aktuálnímu uživateli Windows.' } else { 'Spusťte Nastavit-AI-pripojeni.bat.' }) }
                continue
            }
            if ($path -eq '/api/product' -and $context.Request.HttpMethod -eq 'POST') {
                if (-not (Require-LocalApi $context)) { continue }
                if (-not (Test-RateLimit -Request $context.Request -Bucket 'product' -Limit 30 -Minutes 60)) { Write-JsonResponse -Context $context -Data @{ ok=$false; error='Příliš mnoho načtení odkazů.' } -StatusCode 429; continue }
                $payload = Read-JsonBody -Request $context.Request -Limit $maxBodyBytes[$path]
                try { $result = Invoke-SafeWebFetch -Url ([string]$payload.url); Write-JsonResponse -Context $context -Data @{ ok = $true; url = $result.Url; html = $result.Html } }
                catch { Write-JsonResponse -Context $context -Data @{ ok = $false; error = $_.Exception.Message } -StatusCode 400 }
                continue
            }
            if ($path -eq '/api/ai' -and $context.Request.HttpMethod -eq 'POST') {
                if (-not (Require-LocalApi $context)) { continue }
                if (-not (Test-RateLimit -Request $context.Request -Bucket 'ai' -Limit 20 -Minutes 60)) { Write-JsonResponse -Context $context -Data @{ ok=$false; error='Byl dosažen hodinový bezpečnostní limit AI požadavků.' } -StatusCode 429; continue }
                $payload = Read-JsonBody -Request $context.Request -Limit $maxBodyBytes[$path]
                $config = Get-AIConfiguration
                if (-not $config.configured) { Write-JsonResponse -Context $context -Data @{ ok = $false; error = 'AI připojení není nastaveno.' } -StatusCode 503; continue }
                try { $result = Invoke-DomusAI -Payload $payload -Configuration $config; Write-JsonResponse -Context $context -Data @{ ok = $true; text = $result.text; model = $config.model; requestId = $result.id } }
                catch { Write-JsonResponse -Context $context -Data @{ ok = $false; error = $_.Exception.Message } -StatusCode 502 }
                continue
            }
            if ($path -eq '/api/image' -and $context.Request.HttpMethod -eq 'POST') {
                if (-not (Require-LocalApi $context)) { continue }
                if (-not (Test-RateLimit -Request $context.Request -Bucket 'image' -Limit 12 -Minutes 60)) { Write-JsonResponse -Context $context -Data @{ ok=$false; error='Byl dosažen hodinový bezpečnostní limit obrazových požadavků.' } -StatusCode 429; continue }
                $payload = Read-JsonBody -Request $context.Request -Limit $maxBodyBytes[$path]
                $config = Get-AIConfiguration
                if (-not $config.configured) { Write-JsonResponse -Context $context -Data @{ ok = $false; error = 'AI připojení není nastaveno.' } -StatusCode 503; continue }
                try { $result = Invoke-DomusImageEdit -Payload $payload -Configuration $config; Write-JsonResponse -Context $context -Data @{ ok = $true; dataUrls = $result.dataUrls; model = $result.model } }
                catch { Write-JsonResponse -Context $context -Data @{ ok = $false; error = $_.Exception.Message } -StatusCode 502 }
                continue
            }
            if ($path -eq '/api/sync/status') {
                $isLocalClient = Test-IsLocalClient $context.Request
                if ($isLocalClient -and (Get-Date) -ge $pairingExpiresAt) { New-PairingCode }
                Write-JsonResponse -Context $context -Data @{ enabled = $lanEnabled; localClient = $isLocalClient; pairingCode = $(if ($lanEnabled -and $isLocalClient) { $pairingCode } else { '' }); pairingExpiresAt = $(if ($lanEnabled -and $isLocalClient) { $pairingExpiresAt.ToString('o') } else { '' }); serverUrl = $(if ($lanEnabled) { $mobileUrl } else { '' }); deviceName = [string]$deviceConfig.deviceName; paired = $(if ($isLocalClient) { $true } else { Test-BearerToken $context.Request }); message = $(if ($lanEnabled) { $(if ($isLocalClient) { 'Notebook je dostupný v místní síti. Kód platí deset minut a po spárování se používá dlouhý přístupový token.' } else { 'Mobilní přístup je aktivní. Spárujte zařízení jednorázovým kódem z notebooku.' }) } else { 'Spusťte Povolit-mobilni-pristup.bat jako správce a restartujte DOMUS Studio.' }) }
                continue
            }
            if ($path -eq '/api/sync/pair' -and $context.Request.HttpMethod -eq 'POST') {
                if (-not $lanEnabled) { Write-JsonResponse -Context $context -Data @{ ok=$false; error='Mobilní přístup není aktivní.' } -StatusCode 403; continue }
                if (-not (Test-RateLimit -Request $context.Request -Bucket 'pair' -Limit 5 -Minutes 15)) { Write-JsonResponse -Context $context -Data @{ ok=$false; error='Příliš mnoho neúspěšných pokusů. Počkejte 15 minut.' } -StatusCode 429; continue }
                $payload = Read-JsonBody -Request $context.Request -Limit $maxBodyBytes[$path]
                if ((Get-Date) -ge $pairingExpiresAt -or [string]$payload.code -ne $pairingCode) { Write-JsonResponse -Context $context -Data @{ ok=$false; error='Párovací kód je neplatný nebo vypršel.' } -StatusCode 403; continue }
                $token = New-SecureToken 32
                $devices = @(Get-PairedDevices | Where-Object { ([DateTime]$_.expiresAt) -gt (Get-Date) })
                $requestedName = [string]$payload.deviceName
                if ([string]::IsNullOrWhiteSpace($requestedName)) { $requestedName = 'Mobilni zarizeni' }
                $devices += [pscustomobject]@{ id = New-SecureToken 12; name = $requestedName.Substring(0, [Math]::Min(80, $requestedName.Length)); tokenHash = Get-Sha256 $token; createdAt = (Get-Date).ToString('o'); lastSeenAt = (Get-Date).ToString('o'); expiresAt = (Get-Date).AddDays(180).ToString('o') }
                Save-PairedDevices $devices
                New-PairingCode
                Write-JsonResponse -Context $context -Data @{ ok=$true; token=$token; expiresAt=(Get-Date).AddDays(180).ToString('o'); deviceName=[string]$deviceConfig.deviceName }
                continue
            }
            if ($path -eq '/api/sync/devices' -and $context.Request.HttpMethod -eq 'GET') {
                if (-not (Require-LocalApi $context)) { continue }
                $devices = @(Get-PairedDevices | ForEach-Object { @{ id=$_.id; name=$_.name; createdAt=$_.createdAt; lastSeenAt=$_.lastSeenAt; expiresAt=$_.expiresAt } })
                Write-JsonResponse -Context $context -Data @{ ok=$true; devices=$devices }
                continue
            }
            if ($path -eq '/api/sync/revoke' -and $context.Request.HttpMethod -eq 'POST') {
                if (-not (Require-LocalApi $context)) { continue }
                $payload = Read-JsonBody -Request $context.Request -Limit 8192
                $devices = @(Get-PairedDevices | Where-Object { $_.id -ne [string]$payload.id })
                Save-PairedDevices $devices
                Write-JsonResponse -Context $context -Data @{ ok=$true }
                continue
            }
            if ($path -eq '/api/sync/push' -and $context.Request.HttpMethod -eq 'POST') {
                if (-not (Require-SyncToken $context)) { continue }
                $payload = Read-JsonBody -Request $context.Request -Limit $maxBodyBytes[$path]
                try {
                    $validated = Test-ProjectPayload $payload.project
                    $target = Join-Path $syncDir "$($validated.Id).json"
                    [System.IO.File]::WriteAllText($target, $validated.Json, (New-Object System.Text.UTF8Encoding($false)))
                    Write-JsonResponse -Context $context -Data @{ ok = $true; projectId = $validated.Id; storedAt = (Get-Date).ToString('o') }
                } catch { Write-JsonResponse -Context $context -Data @{ ok = $false; error = $_.Exception.Message } -StatusCode 400 }
                continue
            }
            if ($path -eq '/api/sync/list' -and $context.Request.HttpMethod -eq 'GET') {
                if (-not (Require-SyncToken $context)) { continue }
                $items = New-Object System.Collections.ArrayList
                Get-ChildItem $syncDir -Filter '*.json' -File -ErrorAction SilentlyContinue | ForEach-Object { try { $project = Get-Content $_.FullName -Raw -Encoding UTF8 | ConvertFrom-Json; [void]$items.Add(@{ id = [string]$project.id; name = [string]$project.name; category = [string]$project.category; updatedAt = [string]$project.updatedAt; size = $_.Length }) } catch { } }
                Write-JsonResponse -Context $context -Data @{ ok = $true; projects = @($items | Sort-Object updatedAt -Descending) }
                continue
            }
            if ($path -eq '/api/sync/pull' -and $context.Request.HttpMethod -eq 'POST') {
                if (-not (Require-SyncToken $context)) { continue }
                $payload = Read-JsonBody -Request $context.Request -Limit $maxBodyBytes[$path]
                $projectId = [string]$payload.projectId
                if ($projectId -notmatch '^[a-zA-Z0-9._:-]{3,120}$') { Write-JsonResponse -Context $context -Data @{ ok = $false; error = 'Neplatný identifikátor projektu.' } -StatusCode 400; continue }
                $source = Join-Path $syncDir "$projectId.json"
                if (-not (Test-Path $source -PathType Leaf)) { Write-JsonResponse -Context $context -Data @{ ok = $false; error = 'Projekt zatím nebyl odeslán do synchronizace.' } -StatusCode 404; continue }
                try { $project = Get-Content $source -Raw -Encoding UTF8 | ConvertFrom-Json; Write-JsonResponse -Context $context -Data @{ ok = $true; project = $project } }
                catch { Write-JsonResponse -Context $context -Data @{ ok = $false; error = $_.Exception.Message } -StatusCode 500 }
                continue
            }

            if ($context.Request.HttpMethod -ne 'GET' -and $context.Request.HttpMethod -ne 'HEAD') { $context.Response.StatusCode = 405; Add-SecurityHeaders $context.Response; $context.Response.Close(); continue }
            $relative = [System.Uri]::UnescapeDataString($path.TrimStart('/')).Replace('\','/').ToLowerInvariant()
            if ([string]::IsNullOrWhiteSpace($relative)) { $relative = 'index.html' }
            if ($relative.Contains('..') -or -not $allowedStatic.ContainsKey($relative)) { $context.Response.StatusCode = 404; Add-SecurityHeaders $context.Response; $context.Response.Close(); continue }
            $candidate = $allowedStatic[$relative]
            $bytes = [System.IO.File]::ReadAllBytes($candidate)
            $extension = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
            $context.Response.ContentType = $(if ($mime.ContainsKey($extension)) { $mime[$extension] } else { 'application/octet-stream' })
            Add-SecurityHeaders $context.Response
            if ($context.Request.HttpMethod -eq 'HEAD') { $context.Response.ContentLength64 = $bytes.Length; $context.Response.Close(); continue }
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.OutputStream.Close()
        } catch {
            try { Write-JsonResponse -Context $context -Data @{ ok = $false; error = $_.Exception.Message } -StatusCode 500 } catch { try { $context.Response.Close() } catch { } }
        }
    }
} finally { $listener.Stop(); $listener.Close() }
