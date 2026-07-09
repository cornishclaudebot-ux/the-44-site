#!/usr/bin/env node
/*  Pulls the current event list from Posh (group: the44) and rewrites events.json.
    Runs daily via .github/workflows/update-events.yml; the site loads events.json
    at runtime and falls back to the list baked into app.js if it's missing.

    Guards: exits non-zero WITHOUT touching events.json if the API is unreachable,
    the payload shape changes, or it returns suspiciously few events — a bad day
    at Posh must never wipe the calendar. */

import { readFileSync, writeFileSync } from 'node:fs';

const API = 'https://posh.vip/api/web/v2/util/group_url/the44';
const OUT = new URL('../events.json', import.meta.url);

const res = await fetch(API, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    'Accept': 'application/json',
  },
});
if (!res.ok) { console.error(`Posh API returned ${res.status}`); process.exit(1); }
const data = await res.json();
if (!Array.isArray(data.events)) { console.error('Payload has no events array. API shape changed?'); process.exit(1); }

function to12h(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const seen = new Set();
const events = data.events
  .filter(e => e && e.status === 'live' && e.url && e.name && typeof e.start === 'string')
  // `start` is the venue-local wall clock with a fake Z suffix. Slice it, never Date-parse it.
  .map(e => ({
    sort: e.start,
    date: e.start.slice(0, 10),
    time: to12h(e.start.slice(11, 16)),
    // titles are injected via innerHTML on the site, so strip anything tag-shaped
    title: e.name.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim(),
    url: `https://posh.vip/e/${encodeURIComponent(e.url)}`,
  }))
  .filter(e => (seen.has(e.url) ? false : seen.add(e.url)))
  .sort((a, b) => a.sort.localeCompare(b.sort))
  .map(({ sort, ...e }) => e);

if (events.length < 3) { console.error(`Only ${events.length} events. Refusing to overwrite.`); process.exit(1); }

let previous = null;
try { previous = JSON.stringify(JSON.parse(readFileSync(OUT, 'utf8')).events); } catch {}
if (previous === JSON.stringify(events)) { console.log(`No changes (${events.length} events).`); process.exit(0); }

writeFileSync(OUT, JSON.stringify({ updated: new Date().toISOString(), source: API, events }, null, 1) + '\n');
console.log(`Wrote ${events.length} events.`);
