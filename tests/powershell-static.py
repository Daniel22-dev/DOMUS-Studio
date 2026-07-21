from pathlib import Path
import re

ROOT=Path(__file__).resolve().parent.parent

def balanced(path: Path):
    text=path.read_text(encoding='utf-8-sig')
    stack=[]; pairs={')':'(',']':'[','}':'{'}; opens=set(pairs.values())
    i=0; line=1; quote=None; here=None
    while i<len(text):
        c=text[i]
        if c=='\n': line+=1
        if here:
            marker='"@' if here=='double' else "'@"
            if text.startswith(marker,i) and (i==0 or text[i-1]=='\n'):
                here=None; i+=2; continue
            i+=1; continue
        if quote:
            if c=='`': i+=2; continue
            if c==quote:
                if quote=="'" and i+1<len(text) and text[i+1]=="'": i+=2; continue
                quote=None
            i+=1; continue
        if c=='#':
            j=text.find('\n',i); i=len(text) if j<0 else j; continue
        if text.startswith('@"',i): here='double'; i+=2; continue
        if text.startswith("@'",i): here='single'; i+=2; continue
        if c in "'\"": quote=c; i+=1; continue
        if c in opens: stack.append((c,line))
        elif c in pairs:
            assert stack and stack[-1][0]==pairs[c], f'{path.name}: nevyvážený znak {c} na řádku {line}'
            stack.pop()
        i+=1
    assert not quote and not here and not stack, f'{path.name}: neukončená struktura {stack[-5:]}'

for path in ROOT.glob('*.ps1'):
    balanced(path)

server=(ROOT/'start-domus.ps1').read_text(encoding='utf-8-sig')
required=[
    "Join-Path $env:LOCALAPPDATA 'DOMUS Studio'",
    'AllowAutoRedirect = $false',
    'function Require-LocalApi',
    'function Require-SyncToken',
    "if ($path -eq '/api/product'",
    "if ($path -eq '/api/ai'",
    "if ($path -eq '/api/image'",
    "function Invoke-DomusImageEdit",
    "gpt-image-2",
    "if ($path -eq '/api/sync/pair'",
    "if ($path -eq '/api/sync/push'",
    "if ($path -eq '/api/sync/list'",
    "if ($path -eq '/api/sync/pull'",
    'Get-Sha256 $token',
    'AddMinutes(10)',
    'AddDays(180)',
    "Content-Security-Policy",
    '$allowedStatic',
    "$relative.Contains('..')",
    'Read-JsonBody',
    'Test-RateLimit',
]
for item in required:
    assert item in server, f'chybí serverová ochrana: {item}'

assert re.search(r"/api/product'.{0,180}Require-LocalApi", server, re.S), 'produktové API není lokální'
assert re.search(r"/api/ai'.{0,180}Require-LocalApi", server, re.S), 'AI API není lokální'
assert re.search(r"/api/image'.{0,180}Require-LocalApi", server, re.S), 'obrazové API není lokální'
for endpoint in ('push','list','pull'):
    assert re.search(rf"/api/sync/{endpoint}'.{{0,180}}Require-SyncToken", server, re.S), f'sync {endpoint} není autorizován'

static_block=re.search(r"\$mime\s*=\s*@\{(.*?)\}\s*\n\$allowedStatic",server,re.S)
assert static_block, 'nenalezen MIME whitelist'
for forbidden in ("'.json'", "'.ps1'", "'.bat'", "'.dat'", "'.md'"):
    assert forbidden not in static_block.group(1), f'citlivá přípona v MIME whitelistu: {forbidden}'
assert '?code=' not in server and 'pairingCode=' not in server, 'párovací kód se nesmí předávat v URL'

allow=(ROOT/'Povolit-mobilni-pristup.ps1').read_text(encoding='utf-8-sig')
deny=(ROOT/'Zakazat-mobilni-pristup.ps1').read_text(encoding='utf-8-sig')
assert "New-NetFirewallRule -DisplayName 'DOMUS Studio v6 mobile'" in allow
assert "Remove-NetFirewallRule -DisplayName 'DOMUS Studio v6 mobile'" in deny
assert "-Profile Private" in allow

print('powershell-static: OK')
