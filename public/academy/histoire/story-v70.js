/* Progressive comic: native scrolling, one stage, readable HTML when motion is disabled. */
(() => {
 'use strict';
 const root=document.querySelector('.v60-story'); if(!root)return;
 const panels=[...root.querySelectorAll('.v60-tableau')];
 const scenes=[root.querySelector('#histoire-intro'),...panels];
 const nav=document.querySelector('.ac-nav'),header=document.querySelector('.empire-header');
 const previous=document.getElementById('ac-previous'),next=document.getElementById('ac-next'),readingButton=document.getElementById('ac-reading');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),short=matchMedia('(max-height:620px), (max-width:700px) and (max-height:740px)');
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 let bounds=[],head=60,pending=0,current=0,readingChosen=false,manualChoice=false,reading=false,navigated=false;
 const seen=new Set();
 // Replay a short fade on a node whose text has just been swapped (headings, captions).
 function swap(node){if(reduced.matches||!root.classList.contains('v60-ready'))return;node.classList.remove('v71-swap');void node.offsetWidth;node.classList.add('v71-swap')}
 function setText(node,text){if(node&&node.textContent!==text){node.textContent=text;swap(node)}}
 function track(event,data){try{(window.dataLayer=window.dataLayer||[]).push({event,story_version:'v70',...data})}catch{}}
 function choose(value){
  const choice=root.querySelector('.v60-choice'); if(!choice)return;
  choice.querySelectorAll('[data-v60-choice]').forEach(b=>b.setAttribute('aria-pressed',String(value===b.dataset.v60Choice)));
  choice.querySelectorAll('[data-profile]').forEach(n=>n.classList.toggle('is-selected',value===n.dataset.profile));
  const text=value==='left'?'Vous avez vu comment je travaille : chercher une solution, annoncer un délai, livrer. Mon histoire donne des raisons concrètes de me faire confiance.':value==='right'?'C’est votre choix. Vous pouvez aussi demander à ce concurrent de montrer ses projets et sa façon de travailler.':'Deux offres similaires. Mais une façon de travailler que vous connaissez déjà.';
  setText(choice.querySelector('.v60-choice-answer'),text);
 }
 root.addEventListener('click',e=>{const b=e.target.closest('[data-v60-choice]');if(b){manualChoice=true;choose(b.dataset.v60Choice);track('academy_story_choice',{profile:b.dataset.v60Choice})}});
 function setBeat(panel,index,all){
  const beats=[...panel.querySelectorAll('.v60-beat')];
  beats.forEach((beat,i)=>{const active=all||i===index;beat.classList.toggle('is-active',active);beat.inert=!active;if(active)beat.removeAttribute('aria-hidden');else beat.setAttribute('aria-hidden','true')});
  panel.querySelectorAll('[data-dot]').forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
  panel.dataset.activeStep=String(index);
 }
 function paintActions(panel,index,local,all,changeHeading){
  const active=panel.querySelector(`.v60-beat[data-step="${index}"]`);
  panel.style.setProperty('--v70-action',String(all?1:local));
  const shared=panel.querySelector('.v70-shared-project');
  if(shared){
   const show=!all&&(index===2||index===3);shared.hidden=!show;
   const course=panel.querySelector('[data-step="2"]'),confiscated=all||(index===2&&local>.5);
   if(all||index===2){changeHeading(course,confiscated?'Mon professeur intervient.':'J’apprends, même en cours.',confiscated?'Il me confisque l’ordinateur.':'Mon projet m’obsède.');setText(course.querySelector('.v60-caption'),confiscated?'Il me le confisque. Ce soir, je reprendrai mes essais chez moi.':'En cours, je cherche comment faire fonctionner mon site.');}
   if(show){
    const ready=index===3&&local>.62,state=index===2?(confiscated?'confiscated':'classroom'):(ready?'ready':'home');panel.dataset.projectState=state;
    const vr=active.querySelector('.v60-visual').getBoundingClientRect(),pr=panel.querySelector('.v60-pin').getBoundingClientRect(),mobile=innerWidth<=700;
    shared.style.setProperty('--laptop-left',`${vr.left-pr.left+vr.width*(mobile?.2:.63)}px`);shared.style.setProperty('--laptop-top',`${vr.top-pr.top+vr.height*(mobile?.67:.26)}px`);shared.style.setProperty('--laptop-width',`${vr.width*(mobile?.6:.29)}px`);shared.style.setProperty('--laptop-height',`${vr.height*(mobile?.30:.6)}px`);
    shared.style.setProperty('--site-completion',String(ready?1:index===3?Math.min(.85,local/.75):.08));
    const label=confiscated&&index===2?'L’ordinateur est confisqué':ready?'Mon site est prêt':'Mon site en construction';shared.querySelector('[data-project-label]').textContent=label;shared.setAttribute('aria-label',label);
   }else if(all)panel.dataset.projectState='ready';
  }
  const agreement=panel.querySelector('.v70-agreement');
  if(agreement&&(all||active===agreement)){
   const tomorrow=all||local>.5;
   changeHeading(agreement,all?'J’accepte. On se serre la main.':tomorrow?'Je lui annonce :':'J’accepte.',tomorrow?'« Demain, c’est prêt. »':'On se serre la main.');
   setText(agreement.querySelector('.v60-caption'),all?'Je lui annonce que je peux livrer son site dès le lendemain.':tomorrow?'Sa réaction me surprend.':'Il me reste à lui annoncer quand son site sera prêt.');
  }
  const delivery=panel.querySelector('.v70-delivery');
  if(delivery&&(all||active===delivery)){
   const paid=all||local>.5;delivery.dataset.paid=String(paid);delivery.querySelector('.v70-payment').setAttribute('aria-hidden',String(!paid));
   changeHeading(delivery,all?'Le lendemain, son site est prêt.':paid?'Il est ravi.':'Le lendemain,',paid?'J’ai gagné 3 000 €.':'je lui livre son site.');
   setText(delivery.querySelector('.v60-caption'),paid?'Il n’achetait pas mes heures. Il voulait son site, enfin prêt.':'Le site promis est là. Il peut enfin l’utiliser.');
  }
  const production=panel.querySelector('.v70-production');
  if(production&&(all||active===production)){
   const phase=all?3:Math.min(3,Math.floor(local*4));production.dataset.flowPhase=String(phase);
   production.querySelectorAll('[data-flow-step]').forEach((card,i)=>{const visible=all||i===phase;card.classList.toggle('is-current',visible);card.inert=!visible;if(visible)card.removeAttribute('aria-hidden');else card.setAttribute('aria-hidden','true')});
   production.querySelectorAll('.v70-flow-steps li').forEach((n,i)=>{if(!all&&i===phase)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current')});
   const words=[['Elle raconte son expérience.','« Juste un petit ajout… »','Le point de départ, ce sont ses mots et son expérience.'],['Vous faites ressortir la leçon.','Poser les limites dès le départ.','Vous choisissez avec elle une idée utile à ses futurs clients.'],['Empire prépare le contenu.','Son expérience devient un post.','Un brouillon à relire et à ajuster avec votre cliente.'],['Vous relisez ensemble.','Le contenu est prêt à publier.','Son expérience devient un contenu qui montre sa façon de travailler.']];
   if(all){changeHeading(production,'De sa phrase brute','à sa publication.');setText(production.querySelector('.v60-caption'),'Vous choisissez l’angle, Empire prépare le contenu, puis vous relisez avec votre cliente avant publication.');}else{changeHeading(production,words[phase][0],words[phase][1]);setText(production.querySelector('.v60-caption'),words[phase][2]);}
  }
 }
 function measure(){
  head=header?.offsetHeight||60;
  // Dense content flows on small screens; the comic still animates where there is room.
  panels.forEach(n=>n.classList.toggle('v60-flow',!reading&&(n.matches('.v60-press-scene')||innerWidth<=700&&innerHeight<=740&&n.matches('.v60-client-scene,.v60-choice-scene,.v64-context-scene,.v64-practice-scene,#histoire-formats'))));
  root.style.setProperty('--stage-height',`${innerHeight-head}px`);
  bounds=scenes.map(n=>{
   const beats=[...n.querySelectorAll('.v60-beat')],weights=beats.map(b=>Math.max(.5,Number(b.dataset.dwell)||1));
   const starts=[];let total=0;weights.forEach(w=>{starts.push(total);total+=w});
   if(beats.length&&!reading&&!n.classList.contains('v60-flow')){
    const target=`${Math.ceil(innerHeight-head+total*Math.max(440,Math.min(600,innerHeight*.66)))}px`;
    if(n.style.height!==target)n.style.height=target;
   }else n.style.removeProperty('height');
   return {n,top:n.getBoundingClientRect().top+scrollY,height:n.offsetHeight,beats,weights,starts,total};
  });
  schedule();
 }
 function paint(){
  pending=0;const y=scrollY+head+2;
  let found=0;for(let i=0;i<bounds.length;i++)if(y>=bounds[i].top)found=i;current=found;
  const last=bounds.at(-1),end=last.top+last.height;
  nav.hidden=y>end-40;
  root.dataset.activeScene=scenes[current].id;
  const chapter=scenes[current].dataset.chapter;
  nav.querySelector('.ac-current-chapter').textContent=chapter;
  nav.querySelectorAll('[data-ac-chapter]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.acChapter===chapter)));
  previous.disabled=current===0;
  nav.style.setProperty('--ac-progress',String(clamp((y-bounds[0].top)/Math.max(1,end-bounds[0].top-innerHeight+head))));
  for(const b of bounds){
   if(!b.beats.length)continue;
   const all=reading||b.n.classList.contains('v60-flow');
   if(!all&&(b.top>scrollY+innerHeight*1.5||b.top+b.height<scrollY-innerHeight*.3))continue;
   const p=all?1:clamp((y-b.top)/Math.max(1,b.height-innerHeight+head));
   const count=b.beats.length,phase=p*b.total;let index=0;
   if(!all)for(let i=0;i<count;i++)if(phase>=b.starts[i])index=i;
   setBeat(b.n,index,all);
   const local=all?1:clamp((phase-b.starts[index])/b.weights[index]);
   b.n.dataset.stepLabel=`${String(index+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
   b.n.style.setProperty('--camera',String(clamp(local/.18)));
   const origin=b.beats[index].dataset.v63Scene||b.n.id;
   const sourceStep=Number(b.beats[index].dataset.v63SourceStep||0);
   b.n.style.setProperty('--beat-progress',String(all?1:local));
   b.n.style.setProperty('--v69-reveal',String(all?1:clamp(local/.35)));
   const changeHeading=(beat,first,second)=>{const h=beat?.querySelector('h2');if(!h)return;const html=first+'<br><em>'+second+'</em>';if(h.dataset.v71Html!==html){h.dataset.v71Html=html;h.innerHTML=html;swap(h)}};
   if(all&&b.n.querySelector('.v69-days-scene')){
    const beat=b.n.querySelector('.v69-days-scene');changeHeading(beat,'Deux semaines plus tard,','mon site est prêt.');setText(beat.querySelector('.v60-caption'),'Fier du résultat, je le montre à mes amis.');b.n.classList.add('is-ready');b.n.style.setProperty('--night','0');const day=b.n.querySelector('[data-day-label]');if(day)day.textContent='Jour 14';
   }
   if(origin==='histoire-cours'){
    const finished=all||(sourceStep===1&&local>.62);
    b.n.classList.toggle('is-ready',finished);
    const day=finished?14:Math.min(14,1+Math.floor(local*22.6));
    const darkness=all||finished||sourceStep!==1?0:(1-Math.cos(local/.62*Math.PI*4))/2;
    b.n.style.setProperty('--night',String(darkness));
    const label=b.n.querySelector('[data-day-label]');label.textContent=`${darkness>.5?'Nuit':'Jour'} ${day}`;
    const beat=b.n.querySelector('.v69-days-scene');if(beat){changeHeading(beat,finished?'Deux semaines plus tard,':'Pendant deux semaines,',finished?'mon site est prêt.':'je cherche et je teste.');setText(beat.querySelector('.v60-caption'),finished?'Fier du résultat, je le montre à mes amis.':'Le jour, la nuit, je recommence. Jusqu’à obtenir un site qui fonctionne.');}
   }
   if(b.n.id==='histoire-cinq-ans'&&(all||sourceStep===1)){
    const silent=all||local>.5,beat=b.n.querySelector('.v69-phone-scene');
    b.n.style.setProperty('--busy',all?'0':String(1-clamp((local-.2)/.3)));b.n.style.setProperty('--phone-busy',silent?'0':'1');
    if(beat){changeHeading(beat,silent?'Puis… plus rien.':'Au début,',silent?'Mon téléphone ne sonne plus.':'le téléphone sonnait.');beat.querySelector('[data-phone-period]').textContent=silent?'PLUS TARD':'AU DÉBUT';setText(beat.querySelector('.v60-caption'),silent?'Mon avantage disparaît. Je dois trouver une autre façon d’être utile.':'Puis WordPress se simplifie. Mes clients peuvent créer leur site eux-mêmes.');}
   }
   paintActions(b.n,index,local,all,changeHeading);
   if(b.n.id==='histoire-vecu'&&!manualChoice)choose(p>=.5?'left':null);
   if(b.n.id==='histoire-presse'){
    const window=b.n.querySelector('.v60-press-window'),track=b.n.querySelector('.v60-press-track');
    const smooth=t=>t*t*(3-2*t);
    const progress=p<.25?0:p<.35?.5*smooth((p-.25)/.1):p<.65?.5:p<.75?.5+.5*smooth((p-.65)/.1):1;const travel=Math.max(0,track.scrollWidth-window.clientWidth+20);
    track.style.transform=all?'none':`translateX(${-travel*progress}px)`;
    b.n.querySelector('[data-press-count]').textContent=`0${p<.3?1:p<.7?2:3} / 03`;
   }
   if(b.n===scenes[current]&&!seen.has(b.n.id+':'+index)){
    seen.add(b.n.id+':'+index);track('academy_story_progress',{story_step:b.n.id,beat:index,chapter});
   }
  }
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(paint)}
 function go(node,step=0,behavior=reduced.matches?'instant':'smooth',localFraction=.18){
  if(!node)return;
  const panel=node.closest('.v60-tableau')||node;
  const beat=node.closest('.v60-beat');if(beat)step=Number(beat.dataset.step);
  const b=bounds.find(b=>b.n===panel);
  if(b&&!reading&&!panel.classList.contains('v60-flow')){
   const n=b.beats.length||1;
   const offset=step?((b.starts[step]+b.weights[step]*localFraction)/b.total)*Math.max(0,b.height-innerHeight+head):0;
   scrollTo({top:b.top-head+offset,behavior});
  }else node.scrollIntoView({block:'start',behavior});
 }
 function advance(direction){
  navigated=true;
  const b=bounds[current],index=Number(b.n.dataset.activeStep||0);
  const beat=b.beats[index];
  if(!reading&&beat?.classList.contains('v70-production')){
   const phase=Number(beat.dataset.flowPhase||0),target=phase+direction;
   if(target>=0&&target<=3){go(b.n,index,reduced.matches?'instant':'smooth',(target+.35)/4);return}
  }
  if(!reading&&direction<0&&b.beats[index-1]?.classList.contains('v70-production')){go(b.n,index-1,reduced.matches?'instant':'smooth',.92);return}

  if(!reading&&!b.n.classList.contains('v60-flow')&&b.beats.length&&index+direction>=0&&index+direction<b.beats.length){go(b.n,index+direction);return}
  go(scenes[current+direction]||document.getElementById(direction>0?'apres':'histoire-intro'),direction<0?Math.max(0,(bounds[current-1]?.beats.length||1)-1):0);
 }
 previous.addEventListener('click',()=>advance(-1));next.addEventListener('click',()=>advance(1));
 function setReading(preserve=false){
  const anchor=scenes[current];reading=readingChosen||reduced.matches||short.matches;
  root.classList.toggle('v60-reading',reading);root.classList.toggle('ac-reading',reading);root.dataset.readingLock=String(short.matches||reduced.matches);
  panels.forEach(n=>setBeat(n,0,reading||n.classList.contains('v60-flow')));
  readingButton.setAttribute('aria-pressed',String(reading));readingButton.disabled=short.matches||reduced.matches;
  readingButton.textContent=short.matches?'Lecture adaptée':reduced.matches?'Mouvements réduits':reading?'Reprendre l’animation':'Lire sans animation';
  measure();if(preserve)anchor.scrollIntoView({block:'start',behavior:'instant'});
 }
 readingButton.addEventListener('click',()=>{readingChosen=!reading;setReading(true);track('academy_story_reading_mode',{enabled:reading})});
 reduced.addEventListener('change',()=>setReading(true));short.addEventListener('change',()=>setReading(true));
 document.querySelector('#replay')?.addEventListener('click',()=>go(scenes[0]));
 document.querySelectorAll('.ac-nav a[href^="#"],#story a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=document.getElementById(a.hash.slice(1));if(!target)return;navigated=true;e.preventDefault();history.replaceState(null,'',a.hash);go(target);
 }));
 // Off-screen article links remain reachable from the keyboard.
 root.querySelector('.v60-press-track')?.addEventListener('focusin',e=>{
  if(reading||document.querySelector('#histoire-presse').classList.contains('v60-flow'))return;
  const article=e.target.closest('.v60-newspaper');if(!article)return;
  const index=[...article.parentElement.children].indexOf(article),b=bounds.find(b=>b.n.id==='histoire-presse');
  scrollTo({top:b.top-head+(index/2)*Math.max(0,b.height-innerHeight+head),behavior:'instant'});
 });
 // Existing header and daily price labels, unchanged in behavior.
 const toggle=document.getElementById('empire-menu-toggle'),menu=document.getElementById('empire-menu');
 function closeMenu(){if(!toggle||!menu)return;menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Ouvrir le menu')}
 toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu')});
 document.addEventListener('click',e=>{if(!e.target.closest('.empire-header')){closeMenu();document.querySelectorAll('.empire-resources').forEach(n=>n.open=false)}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();document.querySelectorAll('.empire-resources').forEach(n=>n.open=false)}});
 const day=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Paris',weekday:'short'}).format(new Date());
 document.querySelectorAll('[data-partner-price]').forEach(n=>n.textContent=String(day==='Sun'?700:['Fri','Sat'].includes(day)?600:500));
 root.classList.add('v60-ready');root.dataset.storyVersion='v70';
 panels.forEach(n=>setBeat(n,0,false));setReading();
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);
 if('ResizeObserver'in window){const observer=new ResizeObserver(measure);scenes.forEach(n=>observer.observe(n));if(header)observer.observe(header)}
 document.fonts?.ready.then(measure);
 // Deep links into former individual scenes land on the corresponding action.
 function followAlias(){const target=document.getElementById(location.hash.slice(1));if(target&&(target.classList.contains('v60-anchor')||target.classList.contains('v60-tableau')||target.id==='histoire-intro'))requestAnimationFrame(()=>{measure();go(target,0,'instant')})}
 addEventListener('hashchange',followAlias);
 const followInitialAlias=()=>Promise.resolve(document.fonts?.ready).then(()=>{if(!navigated)followAlias()});
 if(document.readyState==='complete')followInitialAlias();else addEventListener('load',followInitialAlias,{once:true});
})();
