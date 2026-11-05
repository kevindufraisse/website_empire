/* Academy v50: restore layered characters, props and emotion to the v49 narrative.
   The scroll stays native. Only transforms/opacity are animated; no timed playback.
   Existing HTML remains a complete fallback when this enhancement is unavailable. */
(() => {
  'use strict';
  const root = document.querySelector('.ac-story');
  if (!root) return;
  const asset = '/academy/histoire/assets/';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (p, a = 0, b = 1) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;
  let uid = 0;
  const sprite = (pose, x, y, size, key, adult = false) => {
    const col = pose % 3, row = Math.floor(pose / 3);
    return `<g data-part="${key}"><svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${col * 512} ${row ? 498 : 0} 512 ${row ? 526 : 488}" preserveAspectRatio="xMidYMax meet" overflow="hidden"><image href="${asset}${adult ? 'cast-story-v33' : 'cast-3d-v32'}.webp" width="1536" height="1024"/></svg></g>`;
  };
  function room(type = 'bedroom', night = false) {
    const col = type === 'class' ? 1 : 0, row = type === 'client' ? 1 : 0;
    const id = `am-room-${++uid}`;
    return `<g data-part="room"><svg x="12" y="10" width="876" height="568" viewBox="${col * 768} ${row * 512} 768 512" preserveAspectRatio="xMidYMid slice" overflow="hidden"><image href="${asset}scenes-v34.webp" width="1536" height="1024"/></svg></g>
      ${night ? `<defs><radialGradient id="${id}"><stop stop-color="#ffda9b" stop-opacity=".6"/><stop offset="1" stop-color="#ffda9b" stop-opacity="0"/></radialGradient></defs><g data-part="night" opacity="0"><rect x="12" y="10" width="876" height="568" fill="#091532" opacity=".72" rx="12"/><rect x="503" y="112" width="153" height="192" fill="#101c42"/><path d="M612 136a22 22 0 1 0 20 32a19 19 0 0 1-20-32" fill="#fff4d1"/><g fill="#fff8e4"><circle cx="525" cy="143" r="2"/><circle cx="559" cy="125" r="1.6"/><circle cx="634" cy="211" r="2"/><circle cx="533" cy="251" r="1.5"/></g><path d="M580 112V304M503 208H656" stroke="#70575b" stroke-width="8"/><ellipse cx="438" cy="350" rx="235" ry="155" fill="url(#${id})"/><circle cx="167" cy="310" r="62" fill="url(#${id})"/></g>` : ''}`;
  }
  const desk = `<g data-part="desk"><ellipse cx="452" cy="565" rx="325" ry="15" fill="#322020" opacity=".12"/><path d="M280 379L267 561M664 379L685 561" stroke="#795745" stroke-width="14"/><path d="M268 367H677L700 383H248Z" fill="#b68b6d" stroke="#795745" stroke-width="2"/><path d="M248 383H700V396H248Z" fill="#966d51"/><path d="M278 372H665" stroke="#efcda8" stroke-width="2"/></g>`;
  const laptop = `<g data-part="laptop"><path d="M454 362L483 272H610L584 362Z" fill="#9a9296" stroke="#514951" stroke-width="3"/><path d="M487 282H597L577 352H467Z" fill="#242834"/><g data-part="code"><path d="M492 299H557M490 310H568M487 321H532M484 333H550" stroke="#f398b5" stroke-width="4" stroke-linecap="round"/></g><g data-part="done" opacity="0"><path d="M488 297H582" stroke="#f4a7bd" stroke-width="15"/><path d="M484 318H572M480 332H548" stroke="#fcf3e8" stroke-width="5"/></g><path d="M455 362H585L565 376H425Z" fill="#d4cbd0" stroke="#655963" stroke-width="2"/></g>`;
  const student = () => `<g data-part="chair"><path d="M285 416L275 560M410 432L420 560" stroke="#785a4e" stroke-width="10"/><rect x="270" y="300" width="102" height="141" rx="24" fill="#bca08e" stroke="#9b7b68" stroke-width="3"/><rect x="270" y="423" width="151" height="20" rx="9" fill="#cbb29d"/></g>` + sprite(0, 155, 160, 420, 'student') + sprite(1, 155, 160, 420, 'surprised');
  function stage(content, label, box = '0 0 900 600') {
    return `<div class="am-stage"><svg class="am-world" viewBox="${box}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${content}</svg></div>`;
  }
  const dollar = `<g data-part="payment"><rect x="572" y="94" width="256" height="132" rx="16" fill="#fffbf5" stroke="#d5b9bd"/><circle cx="612" cy="135" r="17" fill="#f7dae5"/><path d="M604 135L610 141L621 128" fill="none" stroke="#a12757" stroke-width="3"/><text x="642" y="141" font-size="16" fill="#6e4a57">Premier site client</text><text x="601" y="191" font-size="40" font-weight="650" fill="#a12757">3 000 €</text></g>`;
  const definitions = {
    'histoire-devis': stage(room() + student() + desk + laptop + `<g data-part="invoice"><rect x="590" y="65" width="245" height="258" rx="12" fill="#fffaf5" stroke="#d5b7b8" stroke-width="2"/><path d="M614 109H810" stroke="#e1c9c8"/><text x="614" y="94" font-size="15" letter-spacing="3" fill="#9a6075">DEVIS</text><text x="614" y="145" font-size="18" fill="#5d4650">Un site internet</text><text x="612" y="204" font-size="48" font-weight="650" fill="#aa2859">20 000 €</text><text x="615" y="242" font-size="18" fill="#7b5d68">6 mois annoncés</text><g data-part="stamp"><rect x="612" y="260" width="192" height="35" rx="4" fill="#f9e2eb"/><text x="627" y="284" font-size="17" fill="#a12757">Pas dans mon budget.</text></g></g>`, 'Le personnage découvre le devis. Le document arrive, puis son expression change.'),
    'histoire-cours': stage(room('class') + student() + sprite(3, 570, 115, 470, 'teacher') + sprite(4, 570, 115, 470, 'teacher-carry') + desk + laptop + `<g data-part="speech"><rect x="600" y="57" width="245" height="62" rx="22" fill="#fff8ee"/><path d="M676 115L692 137L704 113" fill="#fff8ee"/><text x="622" y="95" font-size="18" fill="#513d47">On ferme l’ordinateur.</text></g>`, 'Le professeur arrive dans la classe et repart avec l’ordinateur. Le personnage réagit.'),
    'histoire-nuits': stage(room('bedroom', true) + student() + desk + laptop + `<g data-part="calendar"><rect x="660" y="333" width="205" height="206" rx="18" fill="#fff7ed"/><text x="682" y="369" font-size="18" fill="#775366">Deux semaines</text>${Array.from({ length: 14 }, (_, i) => `<rect data-day="${i}" x="${680 + i % 7 * 24}" y="${390 + Math.floor(i / 7) * 32}" width="18" height="22" rx="4" fill="#e7d6d6"/>`).join('')}<text data-days-label x="682" y="487" font-size="17" fill="#5f4853">Soir 1</text><text x="682" y="515" font-size="13" fill="#8f657b">Apprendre. Essayer. Continuer.</text></g><g data-part="online"><rect x="358" y="77" width="244" height="63" rx="24" fill="#fff7ed"/><text x="387" y="117" font-size="22" fill="#a12757">Mon site est en ligne.</text></g>`, 'La chambre passe du soir à la nuit. La fenêtre, la lumière et le calendrier changent au fil du défilement.'),
    'histoire-client': stage(room('client') + sprite(2, 90, 95, 480, 'kevin') + sprite(5, 480, 95, 480, 'client') + `<g data-part="delivery"><rect x="345" y="238" width="220" height="175" rx="12" fill="#fffaf4" stroke="#b78895" stroke-width="2"/><path d="M345 268H565" stroke="#b78895"/><circle cx="361" cy="254" r="4" fill="#d9618e"/><rect x="361" y="287" width="188" height="44" rx="5" fill="#f3b3cc"/><path d="M365 351H536M365 367H510M365 385H528" stroke="#dbb8c6" stroke-width="8"/></g><g data-part="request"><rect x="498" y="45" width="370" height="78" rx="24" fill="#fff8ee"/><path d="M693 119L708 144L720 118" fill="#fff8ee"/><text x="525" y="94" font-size="26" fill="#513d47">Tu pourrais faire le mien ?</text></g>`, 'Les parents de mes amis découvrent mon site. Un parent arrive et me demande de créer le sien.'),
    'histoire-proposition': stage(room('client') + student() + sprite(5, 470, 100, 480, 'client') + desk + laptop + dollar.replace('Premier site client', 'Sa proposition').replace('<path d="M604 135L610 141L621 128" fill="none" stroke="#a12757" stroke-width="3"/>', '<text x="607" y="142" font-size="21" fill="#a12757">€</text>'), 'Le client me propose 3 000 euros. Mon expression devient surprise : j’ai seulement appris à utiliser un outil.'),
    'histoire-delai': stage(room('client') + sprite(2, 90, 95, 480, 'kevin') + sprite(5, 480, 95, 480, 'client') + `<g data-part="question"><rect x="526" y="36" width="334" height="108" rx="24" fill="#fff8ee"/><path d="M695 141L710 164L722 140" fill="#fff8ee"/><text x="553" y="75" font-size="21" fill="#6e4a57">Le mettre en ligne...</text><text x="553" y="116" font-size="33" font-weight="650" fill="#6e4a57">dans six mois ?</text></g><g data-part="answer"><rect x="42" y="38" width="376" height="104" rx="24" fill="#f9dce7"/><path d="M221 139L238 165L251 138" fill="#f9dce7"/><text x="72" y="80" font-size="23" fill="#a12757">Non.</text><text x="72" y="119" font-size="35" font-weight="650" fill="#a12757">Dans 24 heures.</text></g>`, 'Le client demande si son site sera en ligne dans six mois. Je lui réponds : non, dans 24 heures.'),
    'histoire-valeur': stage(room('client') + sprite(2, 90, 95, 480, 'kevin') + sprite(5, 480, 95, 480, 'client') + `<g data-part="delivery"><rect x="345" y="238" width="220" height="175" rx="12" fill="#fffaf4" stroke="#b78895" stroke-width="2"/><path d="M345 268H565" stroke="#b78895"/><circle cx="361" cy="254" r="4" fill="#d9618e"/><rect x="361" y="287" width="188" height="44" rx="5" fill="#f3b3cc"/><path d="M365 351H536M365 367H510M365 385H528" stroke="#dbb8c6" stroke-width="8"/></g><g data-part="online"><rect x="432" y="48" width="424" height="82" rx="24" fill="#fff8ee"/><circle cx="472" cy="89" r="21" fill="#f7dae5"/><path d="M461 89L470 98L483 81" fill="none" stroke="#a12757" stroke-width="4"/><text x="509" y="99" font-size="29" font-weight="650" fill="#a12757">Enfin, mon site en ligne !</text></g>`, 'Je lui remets son site. Il est heureux de pouvoir enfin le mettre en ligne, sans attendre six mois.'),
    'histoire-silence': `<div class="am-silence"><div class="am-silence-actor">${stage(sprite(0, 50, 0, 600, 'calm') + sprite(1, 50, 0, 600, 'worried'), 'Le personnage comprend que les clients ne rappellent plus.', '170 0 450 600')}</div><div class="am-phone" role="img" aria-label="Un téléphone qui reçoit des appels, puis dont le journal se vide"><div class="am-notch"></div><div class="am-phone-heading">Appels<span data-call-count>De nouvelles demandes</span></div><div class="am-calls">${['Un commerçant','Un entrepreneur','Une recommandation'].map((name, i) => `<div class="am-call" data-call="${i}"><b aria-hidden="true">↙</b><div><strong>${name}</strong><span>Un nouveau site à créer</span></div></div>`).join('')}</div><div class="am-phone-empty"><span aria-hidden="true">◌</span><strong>Plus aucun appel.</strong><p>Je regarde l’écran.<br>Rien ne se passe.</p></div><div class="am-phone-bottom"></div></div><div class="am-silence-message">Et maintenant ?</div></div>`,
    'histoire-vecu': `<div class="am-choice"><div class="am-people"><article class="am-person"><div class="am-portrait"><img src="${asset}personne-a.webp" alt="Un autre professionnel, au visage accueillant" loading="lazy" decoding="async"/></div><div class="am-person-copy"><span>Une autre personne</span><h3>Je crée votre site.</h3><p>Vous connaissez sa prestation.</p><button type="button" data-choice="a" aria-pressed="false">Cette approche</button></div></article><article class="am-person"><div class="am-portrait am-portrait-kevin"><svg viewBox="110 0 360 290" preserveAspectRatio="xMidYMin slice" role="img" aria-label="Kevin, avec une expression calme et un sourire discret"><image href="${asset}cast-3d-v32.webp" width="1536" height="1024"/></svg></div><div class="am-person-copy"><span>Moi, Kevin</span><h3>J’ai commencé sans budget.</h3><p>Vous connaissez aussi mon parcours.</p><button type="button" data-choice="b" aria-pressed="false">Cette approche</button></div></article></div><p class="am-choice-answer" aria-live="polite">La même prestation. Deux personnes. Qu’est-ce qui vous donne confiance ?</p></div>`
  };
  const chapters = [...root.querySelectorAll('.ac-scene')];
  const state = new Map();
  for (const [id, html] of Object.entries(definitions)) {
    const section = document.getElementById(id), visual = section?.querySelector('.ac-visual');
    if (!visual) continue;
    visual.innerHTML = html;
    section.classList.add('am-scene');
    if (id !== 'histoire-vecu' && id !== 'histoire-silence') section.classList.add('am-cinema');
    if (id === 'histoire-silence') section.classList.add('am-silence-scene');
    if (id === 'histoire-vecu') section.classList.add('am-choice-scene');
    state.set(id, { section, visual, parts: Object.fromEntries([...visual.querySelectorAll('[data-part]')].map(n => [n.dataset.part, n])) });
  }
  const choiceHeading = document.querySelector('#histoire-vecu .ac-copy h2');
  if (choiceHeading) choiceHeading.innerHTML = 'Deux personnes proposent le même service.<br><em>Laquelle avez-vous envie de choisir ?</em>';
  // A separate original cut-out remains visible beside the tools: never flatten the cast into a screenshot.
  const tools = document.querySelector('#histoire-partager .ac-visual');
  if (tools && !tools.querySelector('.v52-stage')) { tools.classList.add('am-tools'); tools.insertAdjacentHTML('afterbegin', `<div class="am-tools-actor">${stage(sprite(2, 20, 20, 570, 'guide'), 'Le personnage présente les outils qu’il teste et transmet.')}</div>`); }
  root.classList.add('ac-animated');
  function part(s, name, x = 0, y = 0, scale = 1, opacity = 1, rotate = 0, px = 450, py = 300) {
    const n = s.parts[name]; if (!n) return;
    n.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) translate(${px} ${py}) scale(${scale.toFixed(4)}) rotate(${rotate.toFixed(2)}) translate(${-px} ${-py})`);
    n.style.opacity = String(clamp(opacity));
    n.style.visibility = opacity > .001 ? 'visible' : 'hidden';
  }
  function paintScene(id, p, still) {
    const s = state.get(id); if (!s) return;
    const q = still ? .76 : p, gentle = ease(q, .08, .75);
    part(s, 'room', -gentle * 8, -gentle * 3, 1 + gentle * .025);
    if (id === 'histoire-devis') {
      const arrive = ease(q, .03, .34), surprise = ease(q, .30, .45);
      part(s, 'student', 0, 0, 1, 1 - surprise); part(s, 'surprised', 0, 0, 1, surprise);
      part(s, 'invoice', 150 * (1 - arrive), -80 * (1 - arrive), .86 + arrive * .14, .2 + .8 * arrive, -3 + (1 - arrive) * 12, 710, 180);
      part(s, 'stamp', 0, 12 * (1 - surprise), 1, surprise); part(s, 'done', 0, 0, 1, 0);
    } else if (id === 'histoire-cours') {
      const enter = ease(q, .08, .33), take = ease(q, .38, .50), leave = ease(q, .55, .80);
      const x = (1 - enter) * 300 + leave * 480;
      part(s, 'teacher', x, 0, 1, enter * (1 - take)); part(s, 'teacher-carry', x, 0, 1, take);
      part(s, 'student', 0, 0, 1, 1 - take); part(s, 'surprised', 0, 0, 1, take);
      part(s, 'laptop', take * 160, -take * 32, 1, 1 - take); part(s, 'done', 0, 0, 1, 0);
      part(s, 'speech', x * .4, 0, 1, enter * (1 - ease(q, .56, .65)));
    } else if (id === 'histoire-nuits') {
      const dark = ease(q, .02, .30), progress = ease(q, .24, .72), complete = ease(q, .70, .81);
      part(s, 'night', 0, 0, 1, dark); part(s, 'student', 0, Math.sin(q * 36) * (still ? 0 : 1.2)); part(s, 'surprised', 0, 0, 1, 0);
      part(s, 'code', 0, 0, 1, 1 - complete); part(s, 'done', 0, 0, 1, complete);
      part(s, 'calendar', 35 * (1 - dark), 0, 1, dark); part(s, 'online', 0, 14 * (1 - complete), .96 + complete * .04, complete);
      const days = Math.max(1, Math.round(progress * 14));
      s.visual.querySelectorAll('[data-day]').forEach((n, i) => n.setAttribute('fill', i < days ? '#cd6388' : '#e7d6d6'));
      s.visual.querySelector('[data-days-label]').textContent = days >= 14 ? 'Soir 14 · terminé !' : `Soir ${days} · je continue`;
      s.section.style.setProperty('--am-night', dark.toFixed(3));
    } else if (id === 'histoire-client') {
      const arrival = ease(q, .05, .38), showSite = ease(q, .32, .58), request = ease(q, .42, .62);
      part(s, 'kevin', -60 * (1 - arrival), 0); part(s, 'client', 250 * (1 - arrival), 0, 1, arrival);
      part(s, 'delivery', mix(-70, 50, showSite), -Math.sin(showSite * Math.PI) * 26, .8 + showSite * .2, .6 + showSite * .4);
      part(s, 'request', 0, 20 * (1 - request), 1, request);
    } else if (id === 'histoire-proposition') {
      const offer = ease(q, .12, .38), surprise = ease(q, .38, .58);
      part(s, 'client', 60 * (1 - offer), 0, 1, .6 + .4 * offer);
      part(s, 'payment', -210, -60 + 35 * (1 - offer), .94 + offer * .06, offer);
      part(s, 'student', 0, 0, 1, 1 - surprise); part(s, 'surprised', 0, 0, 1, surprise);
      part(s, 'code', 0, 0, 1, 0); part(s, 'done', 0, 0, 1, 1);
    } else if (id === 'histoire-delai') {
      const question = ease(q, .06, .27), answer = ease(q, .38, .60);
      part(s, 'question', 0, 20 * (1 - question), 1, question);
      part(s, 'answer', 0, 24 * (1 - answer), .96 + .04 * answer, answer);
    } else if (id === 'histoire-valeur') {
      const delivery = ease(q, .08, .43), online = ease(q, .43, .65);
      part(s, 'delivery', mix(-70, 110, delivery), -Math.sin(delivery * Math.PI) * 26, .8 + delivery * .2, .6 + delivery * .4);
      part(s, 'online', 0, 25 * (1 - online), .95 + .05 * online, online);
    } else if (id === 'histoire-silence') {
      const loss = ease(q, .16, .65), worry = ease(q, .47, .72);
      part(s, 'calm', 0, 0, 1, 1 - worry); part(s, 'worried', 0, 10 * worry, 1, worry);
      s.section.style.setProperty('--am-loss', loss.toFixed(3));
      const phone = s.visual.querySelector('.am-phone');
      phone.style.transform = `rotate(${still ? 0 : Math.sin(q * 160) * (1 - loss) * 2}deg) translateY(${loss * 8}px)`;
      s.visual.querySelectorAll('[data-call]').forEach((n, i) => {
        const vanish = ease(q, .18 + i * .11, .30 + i * .11);
        n.style.transform = `translateX(${vanish * 105}%)`; n.style.opacity = String(1 - vanish);
      });
      s.visual.querySelector('[data-call-count]').textContent = loss > .9 ? 'Aucun nouvel appel' : 'De nouvelles demandes';
      s.visual.querySelector('.am-phone-empty').style.opacity = String(ease(q, .56, .71));
      s.visual.querySelector('.am-silence-message').style.opacity = String(worry);
    } else if (id === 'histoire-vecu') {
      s.visual.querySelectorAll('.am-person').forEach((n, i) => {
        const enter = ease(q, .03 + i * .07, .25 + i * .07);
        n.style.transform = `translateY(${(1 - enter) * 38}px)`;
        n.style.opacity = String(.4 + enter * .6);
      });
    }
  }
  const choice = document.querySelector('.am-choice');
  if (choice) choice.addEventListener('click', e => {
    const button = e.target.closest('[data-choice]'); if (!button) return;
    choice.querySelectorAll('[data-choice]').forEach(n => n.setAttribute('aria-pressed', String(n === button)));
    choice.querySelectorAll('.am-person').forEach(n => n.classList.toggle('is-selected', n.contains(button)));
    choice.querySelector('.am-choice-answer').textContent = button.dataset.choice === 'a'
      ? 'Une prestation claire peut suffire. Raconter son parcours donne simplement une autre façon de créer la confiance.'
      : 'Vous connaissez aussi la personne derrière le service. C’est ce lien que j’aide les entrepreneurs à construire.';
  });
  let frame = 0, bounds = [], headerHeight = 68;
  function measure() {
    headerHeight = document.querySelector('.empire-header')?.offsetHeight || 68;
    bounds = chapters.map(section => ({ section, top: section.getBoundingClientRect().top + scrollY, height: section.offsetHeight }));
    schedule();
  }
  function paint() {
    frame = 0;
    const still = reduced.matches || root.classList.contains('ac-reading');
    for (const { section, top, height } of bounds) {
      if (!still && (top > scrollY + innerHeight * 1.3 || top + height < scrollY - innerHeight * .2)) continue;
      const p = clamp((scrollY + headerHeight - top) / Math.max(1, height - (innerHeight - headerHeight)));
      section.style.setProperty('--am-p', (still ? .8 : p).toFixed(3));
      paintScene(section.id, p, still);
      const reveal = section.querySelectorAll('.ac-method-step,.ac-format,.ac-role,.ac-media>a,.ac-task-row>span,.ac-compare>article');
      reveal.forEach((n, i) => {
        const t = still ? 1 : ease(p, .02 + i * .07, .26 + i * .07);
        n.style.transform = `translateY(${(1 - t) * 38}px) scale(${.97 + .03 * t})`;
        n.style.opacity = String(.35 + .65 * t);
      });
      section.querySelectorAll('.ac-wave i').forEach((n, i) => n.style.transform = `scaleY(${still ? 1 : .4 + .6 * Math.abs(Math.sin(p * 24 + i * 1.7))})`);
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('pageshow', measure);
  reduced.addEventListener('change', measure);
  new MutationObserver(measure).observe(root, { attributes: true, attributeFilter: ['class'] });
  if ('ResizeObserver' in window) { const observer = new ResizeObserver(measure); chapters.forEach(n => observer.observe(n)); }
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
})();
