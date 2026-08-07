// /api/auth.js
// 팀 내부 접속 암호 확인. 별도 계정/DB 없이 공유 암호 하나로 게이트를 겁니다.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.status(400).json({ ok: false, error: 'bad request' });
    return;
  }
  const { code } = body || {};
  if (!process.env.ACCESS_CODE) {
    res.status(500).json({ ok: false, error: 'ACCESS_CODE 환경변수가 설정되지 않았습니다.' });
    return;
  }
  const ok = typeof code === 'string' && code === process.env.ACCESS_CODE;
  res.status(ok ? 200 : 401).json({ ok });
};
