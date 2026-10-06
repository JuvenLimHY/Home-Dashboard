# Home-Dashboard

A self-hosted new-tab dashboard: one `index.html` (Alpine.js + Tailwind via CDN), all data kept in the browser's localStorage.

Includes a main-focus task with daily carry-over, habit tracker, grouped links, Pomodoro focus mode, notes, music, world clocks, weather and a month calendar with a day timeline.

## Run it
Open `index.html`, or host the folder anywhere static (GitHub Pages, nginx). To install on iPhone: Safari → Share → Add to Home Screen.

## Calendar sync (optional)
Browsers can't read Google/Outlook/iCloud calendar feeds directly, so a small proxy is needed:
- GitHub Pages: deploy `calendar-proxy-worker.js` as a Cloudflare Worker, then paste its URL in Settings → Calendar → Proxy URL. Edit `ALLOWED_ORIGINS` in the worker to your site's address.
- Own nginx server: add the blocks from `nginx-calendar-proxy.conf`.

Use your calendar's private iCal link. It stays in this browser and is not included in backups.
