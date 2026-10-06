// Calendar feed proxy for Momentum Pro  (Cloudflare Worker, free plan is plenty)
// ---------------------------------------------------------------------------
// Why: Google, Outlook and iCloud don't let a web page on another domain (like
// your GitHub Pages site) read their calendar feeds. This worker fetches the
// feed for the page and adds the permission header the browser needs.
//
// Setup (about 3 minutes):
//   1. dash.cloudflare.com -> Workers & Pages -> Create -> Create Worker.
//   2. Replace the sample code with this file, then Deploy.
//   3. Copy the worker's URL (https://<name>.<you>.workers.dev) into
//      Momentum Pro -> Settings -> Calendar -> Proxy URL.
//
// Safety: GET only, only your own site may call it, and only calendar hosts
// are fetched, so it can't be used as an open proxy. Nothing is stored.

const ALLOWED_ORIGINS = ['https://juvenlimhy.github.io'];   // <- your dashboard's address
const ALLOWED_HOSTS = ['calendar.google.com', 'outlook.office365.com', 'outlook.live.com'];

export default {
  async fetch(req) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Vary': 'Origin',
    };
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Max-Age': '86400' } });
    }
    if (req.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: cors });
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return new Response('Forbidden', { status: 403, headers: cors });

    let target;
    try { target = new URL(new URL(req.url).searchParams.get('url')); }
    catch (e) { return new Response('Missing or invalid ?url=', { status: 400, headers: cors }); }

    const okHost = target.protocol === 'https:' &&
      (ALLOWED_HOSTS.includes(target.hostname) || /^p\d+-caldav\.icloud\.com$/.test(target.hostname));
    if (!okHost) return new Response('Host not allowed', { status: 403, headers: cors });

    const upstream = await fetch(target.toString(), { headers: { 'User-Agent': 'MomentumPro/1.0' } });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  },
};
