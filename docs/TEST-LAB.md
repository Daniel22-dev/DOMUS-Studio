# DOMUS Test Lab v7

Test Lab je vestavěná administrátorská diagnostika. Otevře se tlačítkem **Test Lab** v horní liště nebo mobilním menu.

## Stavy

- `PASS` – kontrola prošla,
- `WARN` – funkce je omezená prostředím,
- `FAIL` – byla zjištěna chyba,
- `SKIP` – kontrola nebyla v daném kontextu použitelná.

## Kontrolované oblasti

- release metadata a schéma 7,
- sedm povinných runtime modulů,
- dialogy, HTML a action router,
- SecretScanner a export guard,
- migrace a invarianty projektů,
- DOMUS Verify,
- DXF export,
- položkové slučování synchronizace,
- výkonnostní profil projektu,
- WebGL schopnosti,
- ZIP backup round-trip,
- izolovaný IndexedDB round-trip,
- PWA, manifest a ikony,
- právě otevřený projekt,
- volitelně lokální AI a synchronizační API.

## Bezpečnost

Databázový test používá dočasný projekt a po dokončení jej odstraní. Testy nepřepisují běžné uživatelské projekty. Síťové služby se pouze dotazují na stav.

## Protokol

Stažený TXT protokol obsahuje verzi, schéma, prostředí, dobu testu a detail každé kontroly. Je určen jako příloha k GitHub issue nebo k servisní diagnostice.

## Očekávaná varování

Ve `file://` režimu mohou být očekávaná varování u service workeru, manifestu a action routeru. Na GitHub Pages jsou očekávaně nedostupné lokální AI a LAN API. Za poruchu se považuje především `FAIL`.
