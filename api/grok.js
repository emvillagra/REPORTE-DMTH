export default async function handler(req, res) {
  // Permite preflight si alguna vez se consume desde otro origen.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido. Usá POST.'
    });
  }

  try {
    const apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        error: 'Falta configurar GROK_API_KEY o XAI_API_KEY en Vercel.'
      });
    }

    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Falta el campo prompt o no es texto.'
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || 'grok-2-latest',
        messages: [
          {
            role: 'system',
            content: 'Sos un analista ejecutivo de gestión hospitalaria para SIPROSA/DGIME. Respondé siempre en español, con tono directivo, claro y concreto. Devolvé contenido HTML simple usando solo p, strong, ul, li y ol.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.35,
        max_tokens: 1200
      })
    });

    clearTimeout(timeout);

    let data = null;
    try {
      data = await response.json();
    } catch (jsonError) {
      data = null;
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || data?.message || 'Error llamando a Grok/xAI.',
        details: data
      });
    }

    const text = data?.choices?.[0]?.message?.content || '';

    return res.status(200).json({ text });
  } catch (error) {
    const isAbort = error?.name === 'AbortError';
    return res.status(isAbort ? 504 : 500).json({
      error: isAbort ? 'Timeout llamando a Grok/xAI.' : 'Error interno en api/grok.',
      details: error?.message || String(error)
    });
  }
}
