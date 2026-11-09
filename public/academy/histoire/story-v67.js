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
 function track(event,data){try{(window.dataLayer=window.dataLayer||[]).push({event,story_version:'v67',...data})}catch{}}
 function choose(value){
  const choice=root.querySelector('.v60-choice'); if(!choice)return;
  choice.querySelectorAll('[data-v60-choice]').forEach(b=>b.setAttribute('aria-pressed',String(value===b.dataset.v60Choice)));
  choice.querySelectorAll('[data-profile]').forEach(n=>n.classList.toggle('is-selected',value===n.dataset.profile));
  const text=value==='left'?'Vous avez vu comment je cherche une solution et tiens une promesse. Ces expériences vous donnent des éléments concrets pour me juger.':value==='right'?'Vous préférez mon concurrent. C’est possible aussi. Connaître une histoire apporte du contexte ; cela ne décide pas à votre place.':'Deux offres identiques. Faites défiler pour voir ce que le récit apporte au choix.';
  const answer=choice.querySelector('.v60-choice-answer');if(answer.textContent!==text)answer.textContent=text;
 }
 root.addEventListener('click',e=>{const b=e.target.closest('[data-v60-choice]');if(b){manualChoice=true;choose(b.dataset.v60Choice);track('academy_story_choice',{profile:b.dataset.v60Choice})}});
 function setBeat(panel,index,all){
  const beats=[...panel.querySelectorAll('.v60-beat')];
  beats.forEach((beat,i)=>{const active=all||i===index;beat.classList.toggle('is-active',active);beat.inert=!active;if(active)beat.removeAttribute('aria-hidden');else beat.setAttribute('aria-hidden','true')});
  panel.querySelectorAll('[data-dot]').forEach((dot,i)=>dot.classList.toggle('is-active',i===index));
  panel.dataset.activeStep=String(index);
 }
 function measure(){
  head=header?.offsetHeight||60;
  // Dense content flows on small screens; the comic still animates where there is room.
  panels.forEach(n=>n.classList.toggle('v60-flow',!reading&&innerWidth<=700&&innerHeight<=740&&n.matches('.v60-client-scene,.v60-choice-scene,.v60-press-scene,.v64-context-scene,.v64-practice-scene,#histoire-formats')));
  root.style.setProperty('--stage-height',`${innerHeight-head}px`);
  bounds=scenes.map(n=>{
   const beats=[...n.querySelectorAll('.v60-beat')],weights=beats.map(b=>Math.max(.5,Number(b.dataset.dwell)||1));
   const starts=[];let total=0;weights.forEach(w=>{starts.push(total);total+=w});
   if(beats.length&&!reading&&!n.classList.contains('v60-flow')){
    const target=`${Math.ceil(innerHeight-head+total*Math.max(540,Math.min(720,innerHeight*.82)))}px`;
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
   if(origin==='histoire-cours'){
    const finished=all||(sourceStep===1&&local>.62);
    b.n.classList.toggle('is-ready',finished);
    const day=finished?14:Math.min(14,1+Math.floor(local*22.6));
    const darkness=all?0:(1-Math.cos(local*Math.PI*8))/2;
    b.n.style.setProperty('--night',String(darkness));
    const label=b.n.querySelector('[data-day-label]');label.textContent=`${darkness>.5?'Nuit':'Jour'} ${day}`;
   }
   if(origin==='histoire-cinq-ans'){b.n.style.setProperty('--busy',all?'0':String(1-clamp(local/.8)));b.n.style.setProperty('--phone-busy',all||local>.45?'0':'1')}
   if(b.n.id==='histoire-vecu'&&!manualChoice)choose(p>=.43?'left':null);
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
 function go(node,step=0,behavior=reduced.matches?'instant':'smooth'){
  if(!node)return;
  const panel=node.closest('.v60-tableau')||node;
  const beat=node.closest('.v60-beat');if(beat)step=Number(beat.dataset.step);
  const b=bounds.find(b=>b.n===panel);
  if(b&&!reading&&!panel.classList.contains('v60-flow')){
   const n=b.beats.length||1;
   const offset=step?((b.starts[step]+b.weights[step]*.18)/b.total)*Math.max(0,b.height-innerHeight+head):0;
   scrollTo({top:b.top-head+offset,behavior});
  }else node.scrollIntoView({block:'start',behavior});
 }
 function advance(direction){
  navigated=true;
  const b=bounds[current],index=Number(b.n.dataset.activeStep||0);
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
 root.classList.add('v60-ready');root.dataset.storyVersion='v67';
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
