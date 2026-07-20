# Oprava Test Lab / browser CI

## Příčina

Test Lab po spuštění aplikace automaticky zahajuje tichý diagnostický běh. Pokud v jeho průběhu CI otevřelo projekt a vyžádalo nový report, původní implementace `runAll()` vrátila poslední uložený report z dashboardu místo toho, aby počkala na aktivní běh a vytvořila nový report pro právě otevřený projekt.

Výsledkem byl falešný neúspěch `project-smoke`: projekt byl ve skutečnosti otevřen, ale CI vyhodnocovalo starý dashboardový report se stavem `SKIP`.

## Provedená oprava

- Test Lab nyní serializuje souběžné diagnostické běhy pomocí `activeRun`.
- Explicitní diagnostika počká na případný tichý běh a poté vytvoří nový report nad aktuálním stavem aplikace.
- Tichý background test může bezpečně sdílet již probíhající běh.
- HTTP smoke test čeká na skutečné vykreslení pracovního prostoru.
- Chybová hláška nyní vypisuje konkrétní výsledek `project-smoke` a stav pracovního prostoru.
- Izolovaný browser test nově ověřuje, že Test Lab po otevření projektu vrátí `project-smoke: PASS`.

## Ověření

- `npm test`: PASS
- `npm run check:generated`: PASS
- izolovaný Chromium browser test: PASS
- 16 pracovních částí aplikace: PASS
- mobilní viewport 390 px: PASS
- Three.js vendor moduly: PASS

Plný HTTP/IndexedDB scénář se v tomto pracovním prostředí kvůli jeho loopback politice označuje jako SKIP; stejný scénář běží na GitHub Actions runneru.
