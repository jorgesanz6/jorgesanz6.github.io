# jorgesanz.github.io

Web personal de Jorge Sanz Muñoz — Data Analyst & BI Consultant.

## Stack

- [Next.js 14](https://nextjs.org/) con exportación estática
- CSS Modules
- Deploy automático via GitHub Actions → GitHub Pages

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy

El deploy es automático: cada push a `main` construye y publica la web en `https://jorgesanz6.github.io`.

Para activarlo la primera vez, ve a:
`Settings → Pages → Source → GitHub Actions`

## Editar contenido

Todo el contenido está en `lib/data.js`. Edita ese archivo para actualizar proyectos, experiencia y datos de contacto.

## ⚠️ Si trabajas desde el pendrive/USB: `npm run build` puede fallar

Si el proyecto vive en una memoria USB (para llevar siempre la última versión entre varios PCs sin publicar el `.env`), el sistema de archivos del USB (normalmente exFAT) puede hacer que `fs.readlink` de Node.js falle con un error `EISDIR` en **cualquier** archivo del proyecto — no es un bug del código. Síntoma:

```
Error: EISDIR: illegal operation on a directory, readlink '...\pages\_app.js'
```

- `npm run dev` **funciona bien** en el USB (solo aparece un aviso inofensivo de caché de webpack: `Unable to snapshot resolve dependencies`). Para desarrollar y ver cambios en vivo, no hace falta hacer nada especial.
- `npm run build` (la exportación estática de producción) **sí falla** en el USB. Si necesitas generar el build de producción (por ejemplo para probarlo antes de un deploy manual, ya que el deploy real lo hace GitHub Actions en sus propios runners y no le afecta esto), el flujo es:

  1. Copia el proyecto completo (sin `node_modules` ni `.next`) a una ruta en disco local, p. ej. `C:\dev\jorgesanz.github.io`.
  2. `npm install` y `npm run build` ahí.
  3. Cuando termines de revisar el build, sigue editando el código **en el USB** (la fuente de verdad) y repite la copia la próxima vez que necesites compilar — así el USB siempre tiene la versión más actualizada y el build solo se genera puntualmente en local.
