/* Scroll illustrates a choice; a visitor's deliberate choice always wins. */
(() => {
 'use strict';
 const root = document.querySelector('.ac-story');
 if (!root) return;
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const scenes = [...root.querySelectorAll('.v53-scene,.v53-flow')];
 const choice = root.querySelector('.v53-choice');
 let manualChoice = false, queued = 0, bounds = [], header = 68;
 const clamp = v => Math.max(0, Math.min(1, v));
 function choose(value, automatic = false) {
  if (!choice) return;
  choice.querySelectorAll('[data-v53-choice]').forEach(n => n.setAttribute('aria-pressed', String(n.dataset.v53Choice === value)));
  choice.querySelectorAll('[data-profile]').forEach(n => n.classList.toggle('is-selected', n.dataset.profile === value));
  choice.querySelector('.v53-choice-answer').textContent = value === 'left'
   ? 'Vous avez suivi mon aventure : les vêtements, les cours, le premier client. Vous avez vu comment je réagis et comment je travaille. À service égal, cela peut vous donner davantage envie de travailler avec moi. C’est ce que vous allez aider un entrepreneur à montrer.'
   : value === 'right' ? 'Vous préférez mon concurrent. C’est possible aussi. Connaître une histoire apporte du contexte et peut créer de la confiance ; cela ne décide pas à votre place.'
   : value === 'ai' ? 'Pour une tâche précise, un outil peut suffire. Votre histoire, votre façon de décider et la relation avec votre client apportent un autre contexte au choix.'
   : 'Moi, un concurrent, une IA : une même tâche. Qu’est-ce qui change votre choix ?';
 }
 choice?.addEventListener('click', e => { const b=e.target.closest('[data-v53-choice]'); if (!b) return; manualChoice=true; choose(b.dataset.v53Choice); });
 function paint() {
  queued=0;
  const still = reduced.matches || root.classList.contains('ac-reading');
  for (const {node,top,height} of bounds) {
   if (!still && (top>scrollY+innerHeight*1.2 || top+height<scrollY-innerHeight*.2)) continue;
   const pinned=getComputedStyle(node.querySelector('.ac-frame')).position==='sticky';
   const p=still || !pinned ? 1 : clamp((scrollY+header-top)/Math.max(1,height-innerHeight+header));
   node.querySelectorAll('[data-v53-reveal]').forEach((n,i)=>{
    const t=still||!pinned?1:clamp((p-.1-i*.13)/.22);
    n.style.opacity=String(.35+.65*t); n.style.transform=`translateY(${(1-t)*18}px)`;
   });
   if(node.id==='histoire-vecu' && !manualChoice) choose(p>=.45?'left':null,p>=.45);
   if(node.id==='histoire-transmettre') {
    const img=node.querySelector('.v53-community-image img');
    img.style.transform=still?'none':`scale(${1.04-.04*p})`;
   }
  }
 }
 function schedule(){if(!queued)queued=requestAnimationFrame(paint);}
 function measure(){header=document.querySelector('.empire-header')?.offsetHeight||68; bounds=scenes.map(node=>({node,top:node.getBoundingClientRect().top+scrollY,height:node.offsetHeight}));schedule();}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});
 reduced.addEventListener('change',measure);
 new MutationObserver(measure).observe(root,{attributes:true,attributeFilter:['class']});
 if('ResizeObserver' in window){const ro=new ResizeObserver(measure);scenes.forEach(n=>ro.observe(n));}
 document.fonts?.ready.then(measure);root.dataset.v53Ready='true';measure();
})();
