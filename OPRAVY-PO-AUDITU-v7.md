# Opravy po hloubkovém auditu DOMUS Studio v7

Provedeno 21. 7. 2026.

## Implementováno

- doplněn CSS token `--surface-2`;
- odstraněna nefunkční deklarace písma Inter, použit kvalitní systémový font stack;
- responzivní režim rozšířen do šířky 1180 px;
- odstraněno deset přepisovaných základních funkcí (mrtvý kód „premium override“);
- vyhledávání překresluje aplikaci až po 160 ms nečinnosti a respektuje IME kompozici;
- historie půdorysu se ukládá až při skutečném posunu prvku;
- motiv se nastavuje před načtením CSS přes samostatný CSP-kompatibilní skript;
- doplněny `aria-label` u ikonových ovládacích prvků;
- import zachová dokument s poznámkou i bez vloženého souboru;
- uživatelsky rozšiřitelné barvy se před inline stylem validují;
- normalizační funkce přejmenována na `ensureProjectV7` a legacy aliasy se definují jen jednou;
- Three.js při ukončení navíc explicitně uvolní WebGL kontext;
- opraven offline fallback service workeru a zvýšena revize cache;
- přidány regresní statické kontroly pro klíčové body auditu.

## Záměrně neimplementováno

- přechod na esbuild/Rollup: vhodný jako samostatná architektonická etapa, nikoli jako rychlá oprava;
- přibalení fontu Inter: kvůli licenci, velikosti a distribuci byl zvolen stabilní systémový font stack;
- úplný přechod na delegaci událostí a cílené DOM aktualizace: nynější debounce odstraňuje akutní problém, větší refaktor vyžaduje samostatné testování.

## Závěrečné ověření

- `npm run build`: OK
- `npm run check:generated`: OK
- unit testy: OK
- statické kontroly: OK
- PowerShell statické testy: OK
- browser testy: OK
- test responzivity: 1024 px bez vodorovného posuvu; 390 px bez vodorovného posuvu

Poznámka: dva doplňkové browser smoke testy byly v izolovaném testovacím prostředí přeskočeny, protože zde Chromium blokuje loopback/IndexedDB pro vložený dokument. Hlavní browser sada prošla a stejné testy zůstávají připravené pro běžný GitHub CI runner.
