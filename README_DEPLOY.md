# Dashboard SIPROSA - Deploy Vercel

Estructura compatible con Vercel cuando el Output Directory está configurado como `public`.

## Estructura

```
api/grok.js
public/index.html
package.json
vercel.json
.env.example
```

## Vercel

- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `public`
- Install Command: `npm install` o vacío

## Grok

El dashboard viene con Grok apagado por defecto en `public/index.html`:

```js
const USE_GROK_PROXY = false;
```

Cuando cargues la variable `GROK_API_KEY` en Vercel y redeployes, podés cambiarlo a `true`.
