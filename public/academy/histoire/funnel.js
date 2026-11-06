'use strict';
// Suite de l'histoire : calculateur, prix du jour, compte à rebours, témoignages Senja, portes ouvertes.
(() => {
const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
const eur = n => new Intl.NumberFormat('fr-FR').format(n) + ' €';
const push = (event, data) => { try { (window.dataLayer = window.dataLayer || []).push({ event, ...data }); } catch (e) {} };

// Calculateur : environ 4 h par client et par mois.
const hours = $('#f-hours');
function calc() {
  if (!hours) return;
  const rate = Number(($('input[name=lvl]:checked') || {}).value || 500);
  const h = Number(hours.value), clients = Math.max(1, Math.floor(h / 4));
  $('#f-hours-out').textContent = h + ' h';
  $('#f-clients').textContent = clients + (clients > 1 ? ' clients' : ' client');
  $('#f-rate').textContent = eur(rate);
  $('#f-total').textContent = eur(clients * rate);
  const you = $('.f-you'); you.style.flex = String(rate); you.textContent = 'Vous · ' + eur(rate);
}
if (hours) { hours.addEventListener('input', calc); $$('input[name=lvl]').forEach(n => n.addEventListener('change', calc)); calc(); }

// Prix du jour (heure de Paris) : 500 € lundi → jeudi, 600 € vendredi et samedi, 700 € dimanche.
function parisNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), secs: Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second) };
}
const pad = n => String(n).padStart(2, '0');
function prices() {
  const { day, secs } = parisNow();
  const price = day === 0 ? 700 : day >= 5 ? 600 : 500;
  $$('#f-tiers li').forEach(li => li.classList.toggle('current', Number(li.dataset.tier) === price));
  const cd = $('#f-countdown'), next = $('#f-next-price');
  if (!cd) return;
  // Jours restants avant la prochaine hausse : vendredi 0 h (→ 600 €) ou dimanche 0 h (→ 700 €).
  const daysLeft = price === 500 ? 5 - day : price === 600 ? 7 - day : 0;
  if (!daysLeft) { cd.hidden = true; next.hidden = true; return; }
  const left = daysLeft * 86400 - secs, d = Math.floor(left / 86400), h = Math.floor(left % 86400 / 3600), m = Math.floor(left % 3600 / 60), s = left % 60;
  const nextPrice = price === 500 ? 600 : 700;
  next.hidden = false; next.textContent = nextPrice + ' €';
  cd.hidden = false;
  cd.innerHTML = `Le prix passe à <b>${nextPrice} €</b> dans <b>${d ? d + ' j ' : ''}${pad(h)}:${pad(m)}:${pad(s)}</b>`;
}
prices(); setInterval(prices, 1000);

// Témoignages Senja et popup des portes ouvertes : chargés quand on approche de la suite.
let loaded = false;
function loadExtras() {
  if (loaded) return; loaded = true;
  const senja = document.createElement('script'); senja.async = true;
  senja.src = 'https://widget.senja.io/widget/2a990f91-6426-436a-b50d-318fc49a7851/platform.js';
  document.body.appendChild(senja);
  const wj = document.createElement('script'); wj.async = true;
  wj.src = 'https://event.webinarjam.com/register/r0w4xps2/embed-button?formTemplate=2&formColor=1&buttonText=' + encodeURIComponent('S’inscrire');
  document.body.appendChild(wj);
}
const after = $('#suite') || $('#apres');
if (after && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { io.disconnect(); loadExtras(); } }, { rootMargin: '2500px' });
  io.observe(after);
} else loadExtras();
$$('.js-open-house').forEach(a => a.addEventListener('click', () => { loadExtras(); push('academy_open_house_clicked', { source: a.closest('section,header,div[id]')?.className || 'histoire' }); }));
$$('.js-pay').forEach(a => a.addEventListener('click', () => push('academy_partner_checkout_clicked', { source: a.closest('section')?.className || 'histoire' })));
})();
