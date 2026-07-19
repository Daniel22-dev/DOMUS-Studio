# DOMUS Studio Premium v7.0.0

DOMUS Studio je local-first projektové centrum pro stavební, technické, interiérové a zahradní projekty. Verze 7.0 završuje prémiové etapy A–C: profesionální produktový základ, přesný 2D návrh, skutečný WebGL 3D model, Report Studio, pokročilou synchronizaci, výkonnostní vrstvu a desktopovou distribuci přes Tauri.

## Co přináší verze 7

### Etapa A – prémiový základ

- onboarding s projektovými šablonami,
- jednotný designový systém, světlý/tmavý režim a kompaktní zobrazení,
- vlastní značka, logo a údaje pro výstupy,
- DOMUS Report Studio s revizemi a volbou kapitol,
- Test Lab přímo v aplikaci,
- GitHub CI pro Windows i Linux,
- zdroj desktopové aplikace Tauri,
- automatizovaný GitHub Release a aktualizační kanál.

### Etapa B – DOMUS Precision 2D

- magnetická mřížka, koncové body a pravé úhly,
- přesné vrstvy, jejich viditelnost a uzamykání,
- vícenásobný výběr,
- duplikování, zrcadlení a zarovnávání,
- kompletní Undo/Redo editoru,
- parametrická a uživatelská knihovna,
- automatické kóty,
- export DXF.

### Etapa C – DOMUS RealSpace 3D

- skutečná Three.js WebGL scéna,
- perspektivní a ortografická kamera,
- stíny, strop, řezy a popisky,
- PBR vlastnosti materiálů podle jejich typu,
- režim celé obrazovky,
- export PNG a GLB,
- položkové slučování změn při synchronizaci,
- výkonnostní profil projektu a Web Worker,
- automatické aktualizace desktopové verze.

## Test Lab přímo v aplikaci

Test Lab je dostupný v horní liště a na mobilu v nabídce se třemi tečkami. Po startu proběhne bezpečný tichý self-test. Kontroluje mimo jiné:

- release metadata a povinné moduly,
- úplnost action routeru a dialogů,
- bezpečnost importu a exportu,
- migrace a invarianty dat,
- DOMUS Verify,
- ZIP zálohu a IndexedDB,
- DXF export a položkové slučování,
- výkonnostní profil,
- WebGL,
- PWA, manifest a ikony,
- volitelně AI a LAN synchronizaci.

Výsledek používá stavy `PASS`, `WARN`, `FAIL` a `SKIP`. Protokol lze stáhnout jako TXT.

## Architektura pro GitHub

Vývojové zdroje jsou v `src/`:

- `src/app/` – 21 aplikačních modulů,
- `src/core/` – 7 samostatných jader,
- `workers/` – výpočty mimo hlavní UI,
- `src-tauri/` – desktopová aplikace,
- `tests/` – unit, static, PowerShell a browser testy.

Kořenové runtime soubory a složka `dist/` jsou generované příkazem:

```bash
npm run build
```

Po úpravě zdrojů spusťte:

```bash
npm test
npm run test:browser
npm run check:generated
```

GitHub Actions ověřují webovou i desktopovou část. Podrobnosti jsou v `docs/ARCHITEKTURA-v7.md`, `docs/TEST-LAB.md` a `docs/DESKTOP-RELEASE.md`.

## Běžné spuštění ve Windows

1. Rozbalte ZIP do nové složky.
2. Spusťte `Spustit-DOMUS-Studio.bat`.
3. Aplikace se otevře na lokální adrese.
4. Při prvním použití otevřete **Úložiště a obnova** a vytvořte DOMUS ZIP zálohu.

Nouzový soubor `Otevrit-bez-serveru.bat` spustí omezený režim bez lokálního serveru. V něm nejsou dostupné serverové funkce, LAN synchronizace ani plná PWA diagnostika.

## Přechod ze starší verze

1. Ve starší verzi vytvořte zálohu.
2. Verzi 7 rozbalte do nové složky; původní instalaci nemažte.
3. Spusťte verzi 7 a zvolte **Import zálohy**.
4. Import data ověří, vytvoří bod obnovy a teprve potom je uloží.
5. Po kontrole vytvořte novou `.domus.zip` zálohu.

Podporován je import starších projektů. Aktuální datový formát je `schemaVersion 7`.

## Desktopová distribuce

Tauri projekt je připraven pro Windows, Linux a macOS. GitHub Release workflow:

- sestaví instalační balíčky,
- vytvoří updater artefakty,
- podepíše aktualizace klíčem z GitHub Secrets,
- volitelně podepíše Windows instalátor certifikátem,
- vytvoří draft GitHub Release.

Pro aktivaci vydávání je nutné nastavit tajné údaje popsané v `docs/DESKTOP-RELEASE.md`.

## Bezpečnost a data

- Projekty, přílohy, snapshoty a koš jsou oddělené v IndexedDB.
- Import používá validaci, velikostní limity a ochranu proti aktivnímu obsahu.
- Záloha obsahuje manifest, samostatné přílohy a kontrolní otisky.
- Mobilní párování používá jednorázový kód a následný token.
- Server poskytuje pouze povolené runtime soubory.
- AI klíče a synchronizační data nejsou součástí webového adresáře.
- Desktopová konfigurace používá restriktivní Content Security Policy.

Záloha může obsahovat citlivé informace o objektu. Uchovávejte ji jako důvěrný soubor.

## Hlavní příkazy

```bash
npm run build           # sestavení runtime a dist
npm test                # unit + static + PowerShell testy
npm run test:browser    # 16 částí aplikace, mobilní režim a HTTP/DB scénáře
npm run test:all        # všechny dostupné testy
npm run check:generated # kontrola aktuálnosti generovaných souborů
npm run desktop:dev     # Tauri vývojový režim
npm run desktop:build   # Tauri instalační balíčky
```

## Důležité dokumenty

- `NOVINKY-VERZE-7.html` – přehled etap A–C,
- `docs/ETAPY-A-C-PREMIUM.md` – rozsah implementace,
- `docs/ARCHITEKTURA-v7.md` – technická architektura,
- `docs/TEST-LAB.md` – vestavěné testy,
- `docs/DESKTOP-RELEASE.md` – instalátory, aktualizace a podpis,
- `FINALNI-OVERENI-v7.txt` – výsledky závěrečné kontroly,
- `CONTRIBUTING.md` – pravidla vývoje.
