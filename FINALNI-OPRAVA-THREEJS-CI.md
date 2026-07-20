# Finální oprava Three.js a browser CI

## Příčina

Soubor `vendor/three.module.min.js` ve Three.js r185 není samostatný. Importuje relativní soubor `./three.core.min.js`. Ten v předchozím balíčku chyběl, takže server vracel HTTP 404 a RealSpace 3D se nemohl načíst.

## Provedené opravy

- doplněn přesně odpovídající `vendor/three.core.min.js` z balíčku Three.js 0.185.1;
- soubor je součástí `dist/vendor`;
- doplněn do PWA cache;
- doplněn do bezpečného whitelistu lokálního serveru;
- browser test kontroluje core soubor i skutečný dynamický import Three.js;
- statický test nově rekurzivně ověřuje všechny relativní ES-module importy ve složce `vendor`;
- přidán samostatný `vendor-module-tests.mjs`, který importuje Three.js, OrbitControls i GLTFExporter a kontroluje revizi proti `package.json`;
- změněn název cache service workeru, aby se odstranila stará neúplná cache.

## Ověření

- `npm test`: OK
- statická kontrola importního grafu: OK
- přímý import Three.js + OrbitControls + GLTFExporter: OK, revize 185
- sestavení `dist`: OK
