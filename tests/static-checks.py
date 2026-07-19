from pathlib import Path
import re, subprocess, sys
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
errors=[]
for name in ['app.js','db.js','domus-core.js','domus-audit.js','domus-backup.js','domus-premium.js','domus-performance.js','domus-diagnostics.js','service-worker.js']:
    result=subprocess.run(['node','--check',str(ROOT/name)],capture_output=True,text=True)
    if result.returncode: errors.append(f'{name}: {result.stderr.strip()}')

html=(ROOT/'index.html').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
ids=[tag.get('id') for tag in soup.find_all(attrs={'id':True})]
dup=sorted({value for value in ids if ids.count(value)>1})
if dup: errors.append('Duplicitní HTML ID: '+', '.join(dup))

all_text='\n'.join((ROOT/name).read_text(encoding='utf-8',errors='ignore') for name in ['index.html','app.js','domus-diagnostics.js'])
actions=set(re.findall(r'data-action=["\']([^"\']+)',all_text))
handled=set(re.findall(r"action\s*===\s*['\"]([^'\"]+)", (ROOT/'app.js').read_text(encoding='utf-8')))
missing=sorted(actions-handled)
if missing: errors.append('Akce bez handleru: '+', '.join(missing))

app=(ROOT/'app.js').read_text(encoding='utf-8')
if re.search(r'(?<!InstallPrompt\.)\bprompt\s*\(',app): errors.append('Nalezen systémový prompt()')
if 'domusSyncCode' in app or '?code=' in app: errors.append('Nalezen starý párovací kód v klientovi/URL')
if "'inward'" in app: errors.append('Nalezen neplatný směr dveří inward')

server=(ROOT/'start-domus.ps1').read_text(encoding='utf-8')
for forbidden in ["'.json'", "'.ps1'", "'.dat'"]:
    static_block=server[server.find('$allowedStatic'):server.find('$mimeTypes')]
    if forbidden in static_block: errors.append(f'Citlivá přípona ve whitelistu serveru: {forbidden}')
if '$env:LOCALAPPDATA' not in server: errors.append('Server neukládá data do LocalAppData')
if 'Require-SyncToken' not in server: errors.append('Chybí autorizace synchronizace')
if 'Get-ChildItem $root -Recurse' in server: errors.append('Server používá příliš široký rekurzivní whitelist')
for runtime_name in ['index.html','app.js','db.js','domus-core.js','domus-audit.js','domus-backup.js','domus-premium.js','domus-performance.js','domus-diagnostics.js','service-worker.js','manifest.webmanifest','vendor/three.module.min.js','workers/project-metrics-worker.js']:
    if f"'{runtime_name}'" not in server: errors.append(f'Runtime soubor není v explicitním whitelistu: {runtime_name}')

manifest=(ROOT/'manifest.webmanifest').read_text(encoding='utf-8')
for icon in ['icon-192.png','icon-512.png','icon-maskable-512.png']:
    if icon not in manifest or not (ROOT/icon).exists(): errors.append(f'Chybí PWA ikona {icon}')


# GitHub-ready modular source and Test Lab.
required_repo = [
    'package.json', '.github/workflows/ci.yml', 'scripts/build.mjs', 'scripts/check-generated.mjs',
    'src/core/domus-core.js', 'src/core/db.js', 'src/core/domus-audit.js', 'src/core/domus-backup.js', 'src/core/domus-diagnostics.js', 'src/core/domus-premium.js', 'src/core/domus-performance.js',
]
for name in required_repo:
    if not (ROOT/name).exists(): errors.append(f'Chybí GitHub/modulární soubor {name}')
fragments=sorted((ROOT/'src/app').glob('*.js'))
if len(fragments) < 20: errors.append(f'Aplikace není dostatečně rozdělena: {len(fragments)} fragmentů')
if 'domus-diagnostics.js' not in html: errors.append('Test Lab není načten v index.html')
for element_id in ['diagnosticsBtn','diagnosticsDialog','diagnosticsContent','runDiagnosticsBtn','exportDiagnosticsBtn']:
    if element_id not in ids: errors.append(f'Chybí prvek Test Labu {element_id}')
if "DomusDiagnostics.mount" not in app: errors.append('Test Lab není připojen k aplikačnímu kontextu')
if "diagnosticRoundTrip" not in (ROOT/'db.js').read_text(encoding='utf-8'): errors.append('Chybí izolovaný IndexedDB diagnostický test')

for required in ['vendor/three.module.min.js','vendor/OrbitControls.js','vendor/GLTFExporter.js','src-tauri/tauri.conf.json','src-tauri/icons/icon.ico','src-tauri/icons/icon.icns','dist/index.html']:
    if not (ROOT/required).exists(): errors.append(f'Chybí premium/distribuční soubor {required}')


tauri_config=(ROOT/'src-tauri/tauri.conf.json').read_text(encoding='utf-8')
if 'DOMUS_UPDATER_PUBLIC_KEY_REPLACE' in tauri_config: errors.append('Tauri konfigurace obsahuje neplatný updater placeholder')
release_workflow=(ROOT/'.github/workflows/release.yml').read_text(encoding='utf-8')
for secret in ['TAURI_UPDATER_PUBLIC_KEY','TAURI_SIGNING_PRIVATE_KEY']:
    if secret not in release_workflow: errors.append(f'Release workflow nevyžaduje {secret}')

if errors:
    print('\n'.join('FAIL: '+e for e in errors)); sys.exit(1)
print(f'static-checks: OK ({len(actions)} akcí, {len(ids)} HTML ID)')
