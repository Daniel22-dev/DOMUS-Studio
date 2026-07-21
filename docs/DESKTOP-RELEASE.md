# Desktopové vydání DOMUS Studio

## Co je připraveno

- Tauri v2 projekt ve `src-tauri/`,
- Windows, Linux a macOS matrix v `.github/workflows/release.yml`,
- updater artefakty,
- připojení aktualizačního kanálu k GitHub Releases,
- volitelný Authenticode podpis Windows balíčku,
- ad-hoc podpis macOS balíčku, pokud není dodán Apple certifikát,
- draft release před zveřejněním.

## Povinné GitHub Secrets pro updater

- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- `TAURI_UPDATER_PUBLIC_KEY`

Veřejný updater klíč se do konfigurace vloží až během release workflow. V repozitáři proto není žádný soukromý klíč ani neplatný placeholder.

## Volitelné Windows Secrets

- `WINDOWS_CERTIFICATE` – PFX certifikát v Base64,
- `WINDOWS_CERTIFICATE_PASSWORD` – heslo PFX.

Bez nich se vytvoří funkční, ale Authenticode nepodepsaný Windows balíček. Updater podpis a podpis Windows instalátoru jsou dvě odlišné věci.

## Vydání

1. Nastavte Secrets.
2. Zkontrolujte zelený CI běh.
3. Vytvořte tag, například `v7.2.0`.
4. Workflow sestaví platformní balíčky a draft release.
5. Zkontrolujte instalační soubory a `latest.json`.
6. Publikujte release.

## Lokální sestavení

```bash
npm ci
npm test
npm run desktop:build
```

Linux vyžaduje WebKitGTK a další systémové balíčky uvedené ve workflow. Windows podpis vyžaduje kódový podpisový certifikát.
