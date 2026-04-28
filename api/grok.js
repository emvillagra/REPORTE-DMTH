// ═══════════════════════════════════════════════════════════════
//  /api/grok.js  — Proxy Vercel para xAI Grok
//  Resuelve CORS: el browser llama a /api/grok (mismo dominio),
//  este proxy llama a api.x.ai desde el servidor.
//
//  SETUP EN VERCEL:
//  1. Copiá este archivo como /api/grok.js en tu repo
//  2. Vercel Dashboard → Settings → Environment Variables:
//       XAI_API_KEY  =  xai-xxxxxxxxxxxxxxxxxxxx   (tu clave de console.x.ai)
//  3. Deploy → listo
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {

  // Cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'XAI_API_KEY no configurada. Agregala en Vercel → Settings → Environment Variables.'
    });
  }

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Falta el campo "prompt"' });

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       'grok-3-mini',   // modelos disponibles: grok-3, grok-3-mini, grok-2
        max_tokens:  1200,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content: 'Sos un analista estratégico de gestión hospitalaria para SIPROSA (Sistema Provincial de Salud de Tucumán, Argentina). Respondés siempre en español, de forma concisa y profesional, orientado a directivos. Generás informes en HTML básico usando solo <p>, <strong>, <ul>, <li>, <ol>. Sin html/head/body/style.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Grok API error:', response.status, errText);
      return res.status(response.status).json({ error: `Grok API error ${response.status}: ${errText}` });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ text });

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
