# Dashboard SIPROSA/DGIME - Deploy en Vercel

Estructura esperada del repo:

```txt
/
├── api/
│   └── grok.js
├── index.html
├── package.json
├── vercel.json
└── .env.example
```

## Deploy

1. Subir estos archivos a la raíz del repo en GitHub.
2. En Vercel, importar el repo.
3. Framework Preset: Other.
4. Build Command: vacío.
5. Output Directory: vacío.
6. Root Directory: raíz del repo, salvo que hayas subido estos archivos dentro de una carpeta.

## IA Grok

El dashboard viene con Grok apagado por defecto para que no se bloquee ni tire HTTP 401.
En `index.html` está:

```js
const USE_GROK_PROXY = false;
```

Si querés activar Grok:

1. En Vercel > Project > Settings > Environment Variables agregar `GROK_API_KEY` con tu clave de xAI.
2. Redeploy.
3. Cambiar en `index.html`:

```js
const USE_GROK_PROXY = true;
```

Si la API key falla, el dashboard igual usa análisis local automático.

## Google Sheets

La hoja debe estar compartida como:

Cualquier persona con el enlace -> Lector
