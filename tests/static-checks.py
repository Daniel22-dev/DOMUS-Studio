from pathlib import Path
import re, subprocess, sys
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
errors=[]
for name in ['theme-init.js','app.js','db.js','domus-core.js','domus-audit.js','domus-backup.js','domus-premium.js','domus-performance.js','domus-diagnostics.js','service-worker.js']:
    result=subprocess.run(['node','--check',str(ROOT/name)],capture_output=True,text=True)
    if result.returncode: errors.append(f'{name}: {result.stderr.strip()}')

html=(ROOT/'index.html').read_text(encoding='utf-8')
soup=BeautifulSoup(html,'html.parser')
ids=[tag.get('id') for tag in soup.find_all(attrs={'id':True})]
dup=sorted({value for value in ids if ids.count(value)>1})
if dup: errors.append('Duplicitní HTML ID: '+', '.join(dup))
meta_csp=soup.find('meta', attrs={'http-equiv': re.compile(r'^Content-Security-Policy$', re.I)})
if meta_csp and 'frame-ancestors' in (meta_csp.get('content') or ''):
    errors.append('Direktiva frame-ancestors nesmí být v meta CSP; musí být pouze v HTTP hlavičce')

all_text='\n'.join((ROOT/name).read_text(encoding='utf-8',errors='ignore') for name in ['index.html','app.js','domus-diagnostics.js'])
actions=set(re.findall(r'data-action=["\']([^"\']+)',all_text))
handled=set(re.findall(r"action\s*===\s*['\"]([^'\"]+)", (ROOT/'app.js').read_text(encoding='utf-8')))
missing=sorted(actions-handled)
if missing: errors.append('Akce bez handleru: '+', '.join(missing))

app=(ROOT/'app.js').read_text(encoding='utf-8')
if re.search(r'(?<!InstallPrompt\.)\bprompt\s*\(',app): errors.append('Nalezen systémový prompt()')
if re.search(r'(?<![\w$])confirm\s*\(', app): errors.append('Nalezen systémový confirm() místo dialogu DOMUS')
if 'domusSyncCode' in app or '?code=' in app: errors.append('Nalezen starý párovací kód v klientovi/URL')
if "'inward'" in app: errors.append('Nalezen neplatný směr dveří inward')


styles=(ROOT/'styles.css').read_text(encoding='utf-8')
if '--surface-2:' not in styles: errors.append('Chybí CSS token --surface-2')
if re.search(r'font-family:\s*Inter', styles): errors.append('Inter je deklarován bez lokálního fontu')
if '@media (max-width: 1180px)' not in styles: errors.append('Není opraven responzivní breakpoint 1180 px')
if 'theme-init.js' not in html or html.find('theme-init.js') > html.find('styles.css'): errors.append('Motiv se neinicializuje před načtením stylů')
if 'ensureProjectV6' in app: errors.append('Zůstalo zastaralé pojmenování ensureProjectV6')
for function_name in ['renderPlanTab','renderModelTab','renderPdfTab','setupPlanCanvas','setupModelCanvas','pushPlanHistory','undoPlanChange','selectedElementDefinition','importProjectsFromSync','pullCurrentProjectFromSync']:
    count=len(re.findall(rf'function\s+{function_name}\s*\(', app))
    if count != 1: errors.append(f'Funkce {function_name} má {count} deklarací místo jedné')

server=(ROOT/'start-domus.ps1').read_text(encoding='utf-8')
for forbidden in ["'.json'", "'.ps1'", "'.dat'"]:
    static_block=server[server.find('$allowedStatic'):server.find('$mimeTypes')]
    if forbidden in static_block: errors.append(f'Citlivá přípona ve whitelistu serveru: {forbidden}')
if '$env:LOCALAPPDATA' not in server: errors.append('Server neukládá data do LocalAppData')
if 'Require-SyncToken' not in server: errors.append('Chybí autorizace synchronizace')
if "frame-ancestors 'none'" not in server: errors.append('Serverová CSP hlavička neobsahuje frame-ancestors none')
if 'Get-ChildItem $root -Recurse' in server: errors.append('Server používá příliš široký rekurzivní whitelist')
for runtime_name in ['index.html','theme-init.js','styles.css','styles.css.map','app.js','app.js.map','service-worker.js','manifest.webmanifest','vendor/three.core.min.js','vendor/three.module.min.js','workers/project-metrics-worker.js']:
    if f"'{runtime_name}'" not in server: errors.append(f'Runtime soubor není v explicitním whitelistu: {runtime_name}')

manifest=(ROOT/'manifest.webmanifest').read_text(encoding='utf-8')
for icon in ['icon-192.png','icon-512.png','icon-maskable-512.png']:
    if icon not in manifest or not (ROOT/icon).exists(): errors.append(f'Chybí PWA ikona {icon}')


# GitHub-ready modular source and Test Lab.
required_repo = [
    'package.json', '.github/workflows/ci.yml', 'scripts/build.mjs', 'scripts/check-generated.mjs', 'scripts/architecture-audit.mjs', 'src/styles/main.css',
    'src/core/domus-core.js', 'src/core/db.js', 'src/core/domus-audit.js', 'src/core/domus-backup.js', 'src/core/domus-diagnostics.js', 'src/core/domus-premium.js', 'src/core/domus-performance.js',
]
for name in required_repo:
    if not (ROOT/name).exists(): errors.append(f'Chybí GitHub/modulární soubor {name}')
fragments=sorted((ROOT/'src/app').glob('*.js'))
if len(fragments) < 20: errors.append(f'Aplikace není dostatečně rozdělena: {len(fragments)} fragmentů')
if 'DomusDiagnostics' not in app: errors.append('Test Lab není součástí runtime bundlu')
for element_id in ['confirmDialog','confirmDialogTitle','confirmDialogMessage','confirmCancelBtn','confirmAcceptBtn','mobileMenuBtn','mobileActions','mobileNewProjectBtn']:
    if element_id not in ids: errors.append(f'Chybí profesionální UI prvek {element_id}')
if 'aria-label="Hledat projekty"' not in (ROOT/'src/app/30-render-shell.js').read_text(encoding='utf-8'): errors.append('Vyhledávání projektů nemá přístupný název')
app_fragments_text='\n'.join(item.read_text(encoding='utf-8') for item in fragments)
if 'DOMUS AI Studio' not in app_fragments_text: errors.append('Chybí nové DOMUS AI Studio')
if 'generateAiVisualizations' not in app_fragments_text: errors.append('Chybí AI vizualizátor')
if 'validateAiAssistantResponse' not in (ROOT/'src/core/domus-core.js').read_text(encoding='utf-8'): errors.append('Chybí validátor projektového asistenta')
if not (ROOT/'MANUAL-DOMUS-STUDIO-v7.3.html').exists(): errors.append('Chybí samostatný HTML manuál')
if 'aria-current="page"' not in (ROOT/'src/app/30-render-shell.js').read_text(encoding='utf-8'): errors.append('Aktivní záložka nemá aria-current=page')

for element_id in ['diagnosticsBtn','diagnosticsDialog','diagnosticsContent','runDiagnosticsBtn','exportDiagnosticsBtn']:
    if element_id not in ids: errors.append(f'Chybí prvek Test Labu {element_id}')
if "DomusDiagnostics.mount" not in app: errors.append('Test Lab není připojen k aplikačnímu kontextu')
if "diagnosticRoundTrip" not in (ROOT/'db.js').read_text(encoding='utf-8'): errors.append('Chybí izolovaný IndexedDB diagnostický test')

for required in ['vendor/three.core.min.js','vendor/three.module.min.js','vendor/OrbitControls.js','vendor/GLTFExporter.js','src-tauri/tauri.conf.json','src-tauri/icons/icon.ico','src-tauri/icons/icon.icns','dist/index.html']:
    if not (ROOT/required).exists(): errors.append(f'Chybí premium/distribuční soubor {required}')



# Every relative ES-module dependency in vendor/ must exist. This catches split packages
# such as Three.js where three.module.min.js imports three.core.min.js.
module_pattern = re.compile(r"(?:import|export)\s*(?:[^'\";]*?\sfrom\s*)?['\"]([^'\"]+)['\"]|import\s*\(\s*['\"]([^'\"]+)['\"]\s*\)")
for js_file in sorted((ROOT/'vendor').rglob('*.js')):
    source = js_file.read_text(encoding='utf-8', errors='ignore')
    for match in module_pattern.finditer(source):
        specifier = match.group(1) or match.group(2)
        if not specifier or not specifier.startswith('.'):
            continue
        target = (js_file.parent/specifier).resolve()
        candidates = [target]
        if target.suffix == '':
            candidates += [target.with_suffix('.js'), target/'index.js']
        if not any(candidate.is_file() for candidate in candidates):
            errors.append(f'Chybí relativní modul {specifier} importovaný z {js_file.relative_to(ROOT)}')


script_sources=[tag.get('src') for tag in soup.find_all('script', src=True)]
if script_sources != ['theme-init.js','app.js']: errors.append('Index musí načítat theme-init.js a jediný runtime bundle app.js')
for generated in ['app.js.map','styles.css.map','dist/app.js.map','dist/styles.css.map']:
    if not (ROOT/generated).exists(): errors.append(f'Chybí source map {generated}')
event_source='\n'.join(item.read_text(encoding='utf-8') for item in (ROOT/'src/app').glob('7[0-4]-*.js'))
if "app.addEventListener('click', handleDelegatedAppClick)" not in event_source: errors.append('Chybí delegace dynamických akcí')
if "app.querySelectorAll('[data-action]')" in event_source: errors.append('Dynamické akce stále vážou jednotlivé listenery')
for region in ['projectGrid','materialsResults','budgetResults','auditResults','diaryResults','libraryResults','manualResults']:
    if f'id="{region}"' not in app_fragments_text: errors.append(f'Chybí region pro cílený render: {region}')

tauri_config=(ROOT/'src-tauri/tauri.conf.json').read_text(encoding='utf-8')
if 'DOMUS_UPDATER_PUBLIC_KEY_REPLACE' in tauri_config: errors.append('Tauri konfigurace obsahuje neplatný updater placeholder')
release_workflow=(ROOT/'.github/workflows/release.yml').read_text(encoding='utf-8')
for secret in ['TAURI_UPDATER_PUBLIC_KEY','TAURI_SIGNING_PRIVATE_KEY']:
    if secret not in release_workflow: errors.append(f'Release workflow nevyžaduje {secret}')

if errors:
    print('\n'.join('FAIL: '+e for e in errors)); sys.exit(1)
print(f'static-checks: OK ({len(actions)} akcí, {len(ids)} HTML ID)')
