'use strict';
// Même logique que lib/meta.ts et WebinarJamRegister.tsx, pour cette page statique :
// - provenance des pubs (fbclid, utm) gardée dans des cookies partagés avec app.empire-internet.com ;
// - liens vers le site et l'app complétés avec cette provenance ;
// - inscription aux portes ouvertes : Lead + CompleteRegistration, puis page « place réservée ».
(() => {
const ATTR = 'empire_attr', DAYS = 90, UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const OPEN_HOUSE = 'r0w4xps2';
const read = n => { try { const c = document.cookie.split(';').map(x => x.trim()).find(x => x.startsWith(n + '=')); return c ? decodeURIComponent(c.slice(n.length + 1)) : undefined; } catch (e) { return undefined; } };
function write(n, v, days) {
  const domain = /(^|\.)empire-internet\.com$/.test(location.hostname) ? '; domain=.empire-internet.com' : '';
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  try {
    document.cookie = `${n}=${encodeURIComponent(v)}; max-age=${days * 86400}; path=/; SameSite=Lax${domain}${secure}`;
    if ((n === '_fbp' || n === '_fbc') && domain && location.hostname !== 'empire-internet.com') document.cookie = `${n}=; max-age=0; path=/; SameSite=Lax${secure}`;
  } catch (e) {}
}
function readAttr() {
  let a = {};
  try { const s = JSON.parse(read(ATTR) || '{}'); if (s && typeof s === 'object' && !Array.isArray(s)) for (const k of [...UTM, 'fbc', 'fbp']) if (typeof s[k] === 'string') a[k] = s[k].slice(0, k.startsWith('utm_') ? 200 : 300); } catch (e) { a = {}; }
  const fbc = read('_fbc'), fbp = read('_fbp');
  if (fbc && (!a.fbc || Number(fbc.split('.')[2]) >= Number(a.fbc.split('.')[2]))) a.fbc = fbc;
  if (fbp) a.fbp = fbp;
  return a;
}
function capture() {
  const q = new URLSearchParams(location.search), a = readAttr(), id = q.get('fbclid');
  if (id && /^[A-Za-z0-9_-]{1,200}$/.test(id) && !(a.fbc || '').endsWith('.' + id)) { a.fbc = `fb.1.${Date.now()}.${id}`; write('_fbc', a.fbc, DAYS); }
  if (UTM.some(k => q.get(k))) for (const k of UTM) { const v = q.get(k); if (v) a[k] = v.slice(0, 200); else delete a[k]; }
  if (!a.fbp) a.fbp = `fb.1.${Date.now()}.${Math.floor(Math.random() * 2147483647)}`;
  write('_fbp', a.fbp, DAYS); if (a.fbc) write('_fbc', a.fbc, DAYS); write(ATTR, JSON.stringify(a), DAYS);
}
function attributed(href) {
  try {
    const u = new URL(href, location.origin);
    if (!/(^|\.)empire-internet\.com$/.test(u.hostname)) return href;
    const a = readAttr();
    for (const k of UTM) if (a[k] && !u.searchParams.has(k)) u.searchParams.set(k, a[k]);
    const click = a.fbc && a.fbc.split('.').slice(3).join('.');
    if (click && !u.searchParams.has('fbclid')) u.searchParams.set('fbclid', click);
    return u.toString();
  } catch (e) { return href; }
}
capture();
document.addEventListener('click', e => { const a = e.target instanceof Element ? e.target.closest('a[href]') : null; if (a && !a.getAttribute('href').startsWith('#')) a.href = attributed(a.href); }, true);

// Portes ouvertes : WebinarJam envoie « redirect » une fois l'inscription faite.
let redirecting = false;
addEventListener('message', ev => {
  let host = ''; try { host = new URL(ev.origin || 'null', 'https://x').hostname; } catch (e) {}
  if (!/(^|\.)webinarjam\.com$/.test(host)) return;
  const d = ev.data;
  if (!d || d.func !== 'redirect' || !d.url || d.hash !== OPEN_HOUSE) return;
  ev.stopImmediatePropagation();
  if (redirecting) return; redirecting = true;
  const params = { content_name: 'portes_ouvertes', content_category: 'academy_partner', source: 'academy_histoire' };
  const eventId = 'CompleteRegistration.' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
  try { if (typeof window.fbq === 'function') { window.fbq('track', 'Lead', params); window.fbq('track', 'CompleteRegistration', params, { eventID: eventId }); } } catch (e) {}
  fetch('/api/meta/event', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event_name: 'CompleteRegistration', event_id: eventId, event_source_url: location.origin + location.pathname, custom_data: params, attribution: readAttr() }) }).catch(() => {});
  try { (window.dataLayer = window.dataLayer || []).push({ event: 'open_house_registered', open_house_source: 'academy_histoire' }); } catch (e) {}
  setTimeout(() => location.assign('/academy/inscrit?next=' + encodeURIComponent(d.url)), 600);
}, true);
})();
