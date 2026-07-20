# Oprava browser CI – CSP `frame-ancestors`

## Příčina

Chromium zapisoval hlášení, že direktiva `frame-ancestors` je ignorována, pokud je CSP doručena přes `<meta>` element. Browser smoke test sbíral logy úrovně `error` a toto neškodné diagnostické hlášení vyhodnotil jako pád aplikace.

## Oprava

- `frame-ancestors 'none'` byl odstraněn z meta CSP v `index.html`;
- ochrana proti vložení do rámce zůstává v serverové HTTP hlavičce v `start-domus.ps1`;
- browser test zná přesnou benigní diagnostickou zprávu jako pojistku;
- statický test hlídá, že se `frame-ancestors` nevrátí do meta CSP a zůstane v serverové hlavičce;
- cache service workeru byla zvýšena na revizi `r3`.
