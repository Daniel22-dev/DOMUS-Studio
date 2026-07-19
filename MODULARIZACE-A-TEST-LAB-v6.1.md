# DOMUS Studio v6.1.0 – modularizace a Test Lab

## Co bylo změněno

- hlavní zdroj rozdělen do 13 doménových fragmentů,
- vytvořena složka `src/core` pro pět samostatných runtime modulů,
- přidán reprodukovatelný build,
- přidána kontrola zastaralých generovaných souborů,
- přidán vestavěný Test Lab,
- přidán izolovaný IndexedDB diagnostický round-trip,
- přidány testy Test Labu v prohlížeči,
- přidán skutečný HTTP smoke test pro CI,
- přidán GitHub Actions workflow,
- přidána dokumentace architektury a pravidla přispívání.

## Test Lab

Test Lab je dostupný přímo v horní liště aplikace a na mobilu v rozbalovací nabídce. Automatická kontrola se spouští na pozadí po startu. Plná kontrola se spustí po otevření dialogu.

Testy jsou rozděleny na Release, Runtime, UI, Bezpečnost, Data, Doménu, PWA a Služby. Výsledek lze stáhnout jako textový protokol.

## GitHub CI

Workflow `.github/workflows/ci.yml` při pushi nebo pull requestu:

1. sestaví runtime,
2. spustí unit, statické a PowerShell testy,
3. ověří synchronizaci generovaných souborů,
4. spustí Chromium,
5. provede izolovaný browser smoke test,
6. provede reálný HTTP test a IndexedDB test.

## Kompatibilita

Datové schéma zůstává 6. Verze 6.1.0 nemění obsah uživatelských projektů a zachovává import starších záloh.
