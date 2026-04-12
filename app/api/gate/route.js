const ACCESS_TOKEN = process.env.SITE_ACCESS_TOKEN || 'gt-demo-access-2024';

export async function POST() {
  const response = Response.json({ ok: true });

  // Set access cookie — 7 day expiry
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  response.headers.set(
    'Set-Cookie',
    `gt_access=${ACCESS_TOKEN}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires.toUTCString()}`
  );

  return response;
}
