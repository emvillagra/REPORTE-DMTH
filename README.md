# Dashboard SIPROSA - versión simple Vercel

Esta versión es estática. No usa `/api/grok.js`, no requiere variables de entorno y no necesita runtime de funciones.

Estructura:

```text
public/index.html
package.json
vercel.json
README.md
```

Configuración en Vercel:

- Framework Preset: Other
- Build Command: npm run build
- Output Directory: public
- Install Command: npm install o vacío

Importante: eliminar del repo la carpeta `api/` anterior para evitar errores de runtime.
