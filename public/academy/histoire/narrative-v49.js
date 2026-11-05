/* All text exists in HTML. Scroll affects only presentation, never the wheel/touch input. */
(() => {
  'use strict';
  const story = document.querySelector('.ac-story');
  if (!story) return;
  const scenes = [...story.querySelectorAll('.ac-scene')];
  const nav = document.querySelector('.ac-nav');
  const previous = document.getElementById('ac-previous');
  const next = document.getElementById('ac-next');
  const readingButton = document.getElementById('ac-reading');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const compactScreen = matchMedia('(max-width:360px) and (max-height:620px)');
  const header = document.querySelector('.empire-header');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  let current = 0, pending = 0, readingChosen = null;
  let bounds = [], headerHeight = 68;
  const seen = new Set();
  function track(event, data = {}) {
    try { (window.dataLayer = window.dataLayer || []).push({ event, ...data }); } catch (_) { /* Optional analytics. */ }
  }
  function measure() {
    headerHeight = header ? header.getBoundingClientRect().height : 68;
    bounds = scenes.map(node => ({ top: node.getBoundingClientRect().top + scrollY, height: node.offsetHeight }));
    schedule();
  }
  function paint() {
    pending = 0;
    if (!bounds.length) return;
    const y = scrollY + headerHeight + 2;
    let index = 0;
    for (let i = 1; i < bounds.length; i++) if (y >= bounds[i].top) index = i;
    current = index;
    const bottom = bounds[bounds.length - 1].top + bounds[bounds.length - 1].height;
    const inStory = y < bottom - 45 && scrollY + innerHeight > bounds[0].top;
    nav.hidden = !inStory;
    const chapter = scenes[current].dataset.chapter;
    nav.querySelector('.ac-current-chapter').textContent = chapter;
    nav.querySelectorAll('[data-ac-chapter]').forEach(a => a.setAttribute('aria-current', String(a.dataset.acChapter === chapter)));
    previous.disabled = current === 0;
    next.setAttribute('aria-label', current === scenes.length - 1 ? 'Découvrir le programme' : 'Scène suivante');
    const fraction = clamp((y - bounds[0].top) / Math.max(1, bottom - bounds[0].top - innerHeight + headerHeight));
    nav.style.setProperty('--ac-progress', fraction.toFixed(4));
    // Entrance ends early; most of each pinned scene is a still reading plateau.
    for (let i = Math.max(0, current - 1); i <= Math.min(scenes.length - 1, current + 1); i++) {
      const local = clamp((y - bounds[i].top) / Math.max(1, bounds[i].height - (innerHeight - headerHeight)));
      const arrival = 1 - clamp(local / .24);
      scenes[i].style.setProperty('--ac-motion', (reducedMotion.matches || story.classList.contains('ac-reading') ? 0 : arrival).toFixed(3));
    }
    if (inStory && !seen.has(current)) {
      seen.add(current);
      track('academy_story_progress', { story_version: 'v53', story_step: scenes[current].id, chapter });
    }
  }
  function schedule() { if (!pending) pending = requestAnimationFrame(paint); }
  function goTo(node, focus = false) {
    if (!node) return;
    node.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    if (focus) {
      const heading = node.querySelector('h1,h2') || node;
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
  previous.addEventListener('click', () => goTo(scenes[Math.max(0, current - 1)]));
  next.addEventListener('click', () => goTo(current === scenes.length - 1 ? document.getElementById('apres') : scenes[current + 1]));
  function setReading(value, preservePosition = false) {
    const anchor = scenes[current];
    value = value || reducedMotion.matches || compactScreen.matches;
    story.classList.toggle('ac-reading', value);
    readingButton.setAttribute('aria-pressed', String(value));
    readingButton.textContent = value ? 'Lecture au scroll' : 'Lire sans animation';
    readingButton.disabled = reducedMotion.matches || compactScreen.matches;
    if (compactScreen.matches) readingButton.textContent = 'Lecture adaptée';
    if (reducedMotion.matches) readingButton.textContent = 'Mouvements réduits';
    measure();
    if (preservePosition) anchor.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  readingButton.addEventListener('click', () => {
    readingChosen = !story.classList.contains('ac-reading');
    setReading(readingChosen, true);
    track('academy_story_reading_mode', { enabled: readingChosen });
  });
  reducedMotion.addEventListener('change', () => setReading(reducedMotion.matches || readingChosen === true, true));
  compactScreen.addEventListener('change', () => setReading(compactScreen.matches || readingChosen === true, true));
  const replay = document.getElementById('replay');
  if (replay) replay.addEventListener('click', () => goTo(scenes[0], true));
  nav.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.getElementById(a.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    history.replaceState(null, '', a.hash);
    goTo(target, true);
  }));
  // Demo only: no network requests, recording, publishing or payment.
  const review = document.getElementById('ac-review');
  const correct = document.getElementById('ac-correct');
  const approve = document.getElementById('ac-approve');
  const calendar = document.getElementById('ac-calendar');
  const reset = document.getElementById('ac-reset');
  const status = document.getElementById('ac-review-status');
  correct.addEventListener('click', () => {
    review.classList.add('is-corrected');
    correct.hidden = true; approve.hidden = false;
    status.textContent = 'Correction appliquée : la formulation respecte maintenant son expérience.';
    approve.focus({ preventScroll: true });
    track('academy_demo_corrected', { story_version: 'v53' });
  });
  approve.addEventListener('click', () => {
    review.classList.add('is-approved'); approve.hidden = true; calendar.hidden = false; reset.hidden = false;
    status.textContent = 'Version validée. Voici sa programmation illustrative ; rien n’a été publié.';
    reset.focus({ preventScroll: true });
    track('academy_demo_approved', { story_version: 'v53' });
  });
  reset.addEventListener('click', () => {
    review.classList.remove('is-corrected', 'is-approved'); correct.hidden = false; approve.hidden = true; calendar.hidden = true; reset.hidden = true;
    status.textContent = 'Le sens change. Votre relecture fait la différence.';
    correct.focus({ preventScroll: true });
  });
  // Header behavior previously provided by story.js.
  const toggle = document.getElementById('empire-menu-toggle');
  const menu = document.getElementById('empire-menu');
  function closeMenu() {
    if (!toggle || !menu) return;
    menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Ouvrir le menu');
  }
  if (toggle && menu) toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  document.addEventListener('click', e => { if (!e.target.closest('.empire-header')) { closeMenu(); document.querySelectorAll('.empire-resources').forEach(n => n.open = false); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); document.querySelectorAll('.empire-resources').forEach(n => n.open = false); } });
  // Preserve existing price labels. Checkout, attribution and offer logic are unchanged.
  const day = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', weekday: 'short' }).format(new Date());
  document.querySelectorAll('[data-partner-price]').forEach(n => n.textContent = String(day === 'Sun' ? 700 : ['Fri','Sat'].includes(day) ? 600 : 500));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('pageshow', measure);
  if ('ResizeObserver' in window) { const observer = new ResizeObserver(measure); scenes.forEach(n => observer.observe(n)); if (header) observer.observe(header); }
  if (document.fonts) document.fonts.ready.then(measure);
  setReading(reducedMotion.matches);
})();

// v50: progressively enhance the existing accessible narrative with the original animated cast.
(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = '/academy/histoire/animated-v50.css?v=50';
  css.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = '/academy/histoire/animated-v50.js?v=53';
    script.addEventListener('load', () => {
      const extra = document.createElement('script');
      extra.src = '/academy/histoire/story-v52.js?v=52';
      extra.addEventListener('load', () => { const final = document.createElement('script'); final.src = '/academy/histoire/story-v53.js?v=53'; document.head.appendChild(final); }, { once: true });
      document.head.appendChild(extra);
    }, { once: true });
    document.head.appendChild(script);
  }, { once: true });
  document.head.appendChild(css);
})();
