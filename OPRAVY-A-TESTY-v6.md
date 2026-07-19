# DOMUS Studio v6.0.0 – provedené opravy a ověření

Datum sestavení: 19. července 2026

## Etapa 1 – bezpečnost

- odstraněna možnost spustit aktivní obsah z importovaného projektu,
- zaveden validátor datového schématu, typů, délek, hloubky a velikostí,
- povoleny pouze bezpečné datové obrázky JPEG, PNG a WebP,
- server používá whitelist statických souborů,
- konfigurace, API klíč, synchronizační tokeny a projekty přesunuty do `%LOCALAPPDATA%\DOMUS Studio`,
- AI a produktové API omezeny na lokální klient notebooku,
- synchronizace vyžaduje Bearer token,
- jednorázový párovací kód platí deset minut; token 180 dní a lze jej odvolat,
- doplněny limity požadavků, velikosti a bezpečnostní HTTP hlavičky,
- URL výrobků jsou kontrolovány při každém přesměrování,
- CSV export chráněn proti formula injection.

## Etapa 2 – data, zálohy a obnova

- nová databáze IndexedDB s oddělenými úložišti projektů, příloh, snapshotů, koše a metadat,
- automatická migrace starší databáze,
- fotografie a dokumenty ukládány jako Blob mimo hlavní projektový objekt,
- koš a obnova projektu,
- denní body obnovy a snapshot před importem,
- atomické nahrazení sady projektů,
- kontrola kvóty a žádost o trvalé úložiště,
- `.domus.zip` záloha s manifestem a SHA-256 otisky,
- kompatibilní import starších JSON záloh,
- řešení konfliktů ID bez tichého přepsání.

## Etapa 3 – přesnost funkcí

- skutečný polygon místnosti,
- vzdálenosti hran a liniových geometrií,
- kontrola liniových rozvodů,
- kompatibilní překryvy,
- směr otevírání dveří,
- navázání měření na konkrétní prvek,
- technické skóre oddělené od přijatých rizik,
- povinné zdůvodnění rozhodnutí,
- invalidace starého rozhodnutí po změně geometrie,
- sjednocené souřadnice objektů,
- RoomPlan import se společným měřítkem os,
- tolerance uzavření půdorysu v reálných jednotkách,
- validace strukturovaných AI výstupů,
- lokální detekce hran již nevytváří falešné stavební objekty.

## Etapa 4 – technická architektura

Rizikové subsystémy byly odděleny z hlavního UI orchestrátoru:

- `domus-core.js` – validace, sanitizace, geometrické a bezpečnostní utility,
- `domus-audit.js` – deterministická kontrola projektu,
- `domus-backup.js` – ZIP zálohy, CRC32 a kontrolní otisky,
- `db.js` – databáze, přílohy, koš, snapshoty a migrace,
- `app.js` – uživatelské rozhraní a koordinace modulů.

Přidány jsou opakovatelné testy v adresáři `tests`.

## Etapa 5 – použitelnost

- stav ukládání a čas posledního úspěšného uložení,
- Undo u hlavních destruktivních operací,
- koš a obnova,
- průvodce projektem,
- seskupená hlavní navigace,
- vyhledávání a filtry v materiálech, rozpočtu, Verify a BuildLog,
- mobilní import, export a správa úložiště,
- vlastní validované dialogy místo systémového `prompt()`,
- revize poptávkových exportů,
- editovatelný pasport a záruky,
- historie změn deníku,
- řízená aktualizace PWA,
- PNG a maskable ikony,
- lepší focus, minimální velikosti textu a textový seznam půdorysných prvků.

## Automatické testy

### `tests/core-tests.mjs`

Ověřuje mimo jiné:

- odmítnutí SVG datového obrázku a `javascript:` URL,
- sanitizaci škodlivého projektu,
- neutralizaci nebezpečných CSV hodnot,
- správnou interpretaci boolean hodnot,
- polygon místnosti,
- povolený překryv sprchové vaničky a vpusti,
- nalezení malé vzdálenosti liniového rozvodu,
- nezměněné technické skóre po přijetí rizika,
- limity AI výstupu,
- vytvoření ZIP archivu.

### `tests/static-checks.py`

Ověřuje:

- syntaxi JavaScriptu,
- duplicitní HTML ID,
- obsluhu všech deklarovaných akcí,
- nepřítomnost systémového `prompt()`,
- nepřítomnost starého párování kódem v URL,
- whitelist statických souborů,
- LocalAppData a autorizaci synchronizace,
- přítomnost PWA ikon.

### `tests/browser-smoke.mjs`

V headless Chromiu ověřuje:

- načtení dashboardu,
- vykreslení všech 15 hlavních modulů,
- vyhledávání a filtry,
- skutečné vrácení vymazaného půdorysu,
- mobilní šířku 390 px bez horizontálního přetékání,
- dostupnost mobilního exportu,
- odmítnutí nebezpečného SVG importu.

### `tests/db-browser.mjs`

Test je připraven pro praktické ověření IndexedDB, oddělených příloh, koše a snapshotů v běžném prohlížeči. Bezpečnostní režim testovacího Chromia v tomto sestavovacím prostředí však blokoval IndexedDB u vloženého testovacího dokumentu, takže byl test korektně označen jako přeskočený. Databázový modul prošel syntaktickou a statickou kontrolou; jeho skutečný zápis a migrace musí být ještě potvrzeny při závěrečném Windows smoke testu na normální adrese aplikace.

## Omezení ověření

V sestavovacím prostředí nebyl dostupný Windows PowerShell ani reálné Windows Firewall/DPAPI prostředí. PowerShell skripty proto prošly statickou kontrolou struktury, povolených cest, endpointů, autorizace a bezpečnostních pravidel, ale konečný test serveru, URL ACL, firewallu, DPAPI a párování musí proběhnout na cílovém počítači s Windows.

Stejně tak nebyly fyzicky ověřeny LiDAR, RoomPlan a WebXR na konkrétním podporovaném zařízení.
