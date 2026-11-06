/* Native scroll controls the comic beats, day/night cycle and editorial rails. */
(() => {
 'use strict';
 const root=document.querySelector('.ac-story');if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const nodes=[...root.querySelectorAll('.v56-scene')];
 const clamp=x=>Math.max(0,Math.min(1,x));
 const ease=(p,a,b)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
 let bounds=[],header=68,queued=0;
 function paint(){
  queued=0;const still=reduced.matches||root.classList.contains('ac-reading');
  for(const {n,top,height} of bounds){
   if(!still&&(top>scrollY+innerHeight*1.3||top+height<scrollY-innerHeight*.2))continue;
   const pinned=getComputedStyle(n.querySelector('.ac-frame')).position==='sticky';
   const p=still||!pinned?1:clamp((scrollY+header-top)/Math.max(1,height-innerHeight+header));
   n.querySelectorAll('[data-v56-beat]').forEach(el=>{const i=+el.dataset.v56Beat,t=still?1:ease(p,.08+i*.17,.30+i*.17);el.style.opacity=String(t);el.style.transform=`translateY(${(1-t)*16}px)`;});
   const art=n.querySelector('.v56-stage>.v56-art');
   if(art&&!still)art.style.transform=`translateY(${(1-ease(p,.02,.35))*12}px)`;
   if(n.id==='histoire-cours' && n.querySelector('[data-v56-confiscated]')){
    const take=still?1:ease(p,.3,.62),laptop=n.querySelector('[data-v56-confiscated]');
    laptop.style.transform=`translate(${take*85}px,${-take*50}px)`;laptop.style.opacity=String(1-take);
    const teacher=n.querySelector('.v56-teacher');if(teacher)teacher.style.transform=still?'none':`translateX(${(1-ease(p,.02,.25))*80+ease(p,.7,.95)*150}px)`;
    n.querySelectorAll('[data-v56-teacher]').forEach(el=>el.style.opacity=String(el.dataset.v56Teacher==='holding'?take:1-take));
   }
   if(n.id==='histoire-nuits'){
    const t=clamp(p/.86),early=t<.62,day=early?Math.min(3,Math.floor(t/.62*3)+1):Math.min(14,4+Math.floor((t-.62)/.38*11)),finished=still||p>=.86;
    const cycles=early?t/.62*3:3+(t-.62)/.38;
    const darkness=finished?0:.5-.5*Math.cos(cycles*Math.PI*2);
    n.querySelector('.v56-bedroom').style.setProperty('--v56-night',darkness.toFixed(3));
    n.querySelectorAll('[data-v56-day]').forEach(el=>el.classList.toggle('is-done',+el.dataset.v56Day<day));
    const label=n.querySelector('[data-v56-day-label]'),text=finished?'14 jours ✓':`${darkness>.5?'Nuit':'Jour'} ${day}`;
    if(label.textContent!==text)label.textContent=text;
    const status=n.querySelector('[data-v56-night-status]'),message=finished?'mon site était prêt.':'Chez moi, pendant deux semaines.';
    if(status.textContent!==message)status.textContent=message;
    const first=finished?'Deux semaines plus tard,':'Déterminé, je teste encore et encore.';if(n.querySelector('h2').firstChild.textContent!==first)n.querySelector('h2').firstChild.textContent=first;
    const end=n.querySelector('[data-v56-finish]');end.style.opacity=finished?'1':'0';end.style.transform=`translateY(${finished?0:15}px)`;end.setAttribute('aria-hidden',String(!finished));
    const work=n.querySelector('.v56-bedroom>.v56-art:not(.v56-night-end)'), endPose=n.querySelector('.v56-night-end');
    work.style.opacity=finished?'0':'1';endPose.style.opacity=finished?'1':'0';
    work.setAttribute('aria-hidden',String(finished));endPose.setAttribute('aria-hidden',String(!finished));
    n.dataset.v56Finished=String(finished);n.dataset.v56Day=String(day);
   }
   if(n.classList.contains('v57-negotiation')){
    const change=p>=.43?1:0,hand=n.querySelector('[data-v57-shot="handshake"]'),reaction=n.querySelector('[data-v57-shot="reaction"]');
    hand.style.opacity=still?'1':String(1-change);reaction.style.opacity=still?'1':String(change);
    const title=n.querySelector('[data-v57-negotiation-title]'),sub=n.querySelector('[data-v57-negotiation-subtitle]');
    title.textContent=still?'On s’est serré la main.':change>.5?'Je lui ai répondu : demain.':'On s’est serré la main.';
    sub.textContent=still?'Il pensait six mois. Je lui ai répondu : demain.':change>.5?'Il m’a regardé, incrédule.':'Il pensait attendre six mois.';
    const month=n.querySelector('[data-v57-dialogue="month"]'),tomorrow=n.querySelector('[data-v57-dialogue="tomorrow"]'),challenge=n.querySelector('[data-v57-dialogue="challenge"]');
    month.style.opacity=still?'1':String(ease(p,.02,.16)*(1-change));tomorrow.style.opacity=still?'1':String(ease(p,.44,.6));challenge.style.opacity=still?'1':String(ease(p,.65,.82));
   }
   if(n.classList.contains('v56-press-scene')){
    const viewport=n.querySelector('.v56-mag-viewport'),track=n.querySelector('.v56-mag-track'),cards=[...track.children];
    const horizontal=!still&&pinned&&getComputedStyle(track).display==='flex';
    const travel=Math.max(0,track.scrollWidth-viewport.clientWidth+28);
    track.style.transform=horizontal?`translateX(${-ease(p,.04,.94)*travel}px)`:'none';
    const index=horizontal?Math.min(cards.length-1,Math.floor(ease(p,.04,.94)*cards.length)):0;
    n.querySelector('[data-v56-mag-counter]').textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
    n.dataset.v56Magazine=String(index+1);
   }
  }
 }
 function schedule(){if(!queued)queued=requestAnimationFrame(paint)}
 function measure(){header=document.querySelector('.empire-header')?.offsetHeight||68;bounds=nodes.map(n=>({n,top:n.getBoundingClientRect().top+scrollY,height:n.offsetHeight}));schedule()}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);
 reduced.addEventListener('change',measure);new MutationObserver(measure).observe(root,{attributes:true,attributeFilter:['class']});
 if('ResizeObserver'in window){const ro=new ResizeObserver(measure);nodes.forEach(n=>ro.observe(n))}
 document.fonts?.ready.then(measure);root.dataset.v56Ready='true';root.dataset.storyVersion='v59';measure();
})();
