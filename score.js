// /api/score.js
// Anthropic API를 서버에서만 호출하는 프록시. 클라이언트에는 API 키가 절대 노출되지 않습니다.
// 로그인 없이 동작합니다. 필요한 환경변수는 ANTHROPIC_API_KEY 하나뿐입니다.
//
// 주의: 로그인이 없으므로 배포 URL을 아는 사람은 누구나 이 엔드포인트를 통해
// 팀장님의 Anthropic API 사용량을 소비할 수 있습니다. 내부 테스트 용도로만
// URL을 공유하고, 외부에 노출되지 않도록 주의하십시오.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다. Vercel 프로젝트 설정을 확인하십시오.' });
    return;
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.status(400).json({ error: '요청 본문을 해석할 수 없습니다.' });
    return;
  }

  const { prompt, useSearch, forceJson } = body || {};
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'prompt가 필요합니다.' });
    return;
  }

  const messages = [{ role: 'user', content: prompt }];
  if (forceJson) messages.push({ role: 'assistant', content: '{' });

  const anthropicBody = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages
  };
  if (useSearch) {
    anthropicBody.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }

  async function callOnce() {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(anthropicBody)
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      const err = new Error('Anthropic API ' + r.status + (t ? ': ' + t.slice(0, 300) : ''));
      err.status = r.status;
      throw err;
    }
    return r.json();
  }

  try {
    let data, lastErr;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        data = await callOnce();
        break;
      } catch (e) {
        lastErr = e;
        if (e.status === 429 || (e.status && e.status >= 500)) {
          await new Promise((r) => setTimeout(r, 700 * attempt));
          continue;
        }
        throw e;
      }
    }
    if (!data) throw lastErr;

    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');

    res.status(200).json({ text: forceJson ? '{' + text : text });
  } catch (e) {
    res.status(502).json({ error: e.message || String(e) });
  }
};
