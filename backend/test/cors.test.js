import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';

const { default: app } = await import('../src/server/index.js');

async function preflight(origin) {
  const server = app.listen(0);
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/login`, {
      method: 'OPTIONS',
      headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' },
    });
    return res.headers.get('access-control-allow-origin');
  } finally {
    server.close();
  }
}

test('frontend AuraFit di Vercel diizinkan', async () => {
  assert.equal(await preflight('https://aurafit-wheat.vercel.app'), 'https://aurafit-wheat.vercel.app');
});

test('server pengembangan lokal diizinkan', async () => {
  assert.equal(await preflight('http://localhost:5173'), 'http://localhost:5173');
  assert.equal(await preflight('http://127.0.0.1:5174'), 'http://127.0.0.1:5174');
});

test('origin lain tidak diizinkan', async () => {
  assert.equal(await preflight('https://situs-lain.example'), null);
  assert.equal(await preflight('https://aurafit-wheat.vercel.app.situs-lain.example'), null);
  assert.equal(await preflight('http://localhost.situs-lain.example:5173'), null);
});
