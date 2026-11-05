/* Original independent poses. Animation follows native scroll, never moves the document. */
(() => {
  'use strict';
  const root = document.querySelector('.ac-story');
  if (!root) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [...root.querySelectorAll('.v52-cinema,.v52-evidence')];
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = (p, a, b) => { const t = clamp((p-a)/(b-a)); return t*t*(3-2*t); };
  const parts = new Map(scenes.map(s => [s, Object.fromEntries([...s.querySelectorAll('[data-v52-part]')].map(n => [n.dataset.v52Part, n]))]));
  let bounds = [], pending = 0, header = 68;
  function part(s, key, x=0, y=0, opacity=1, scale=1, rotation=0) {
    const node = parts.get(s)?.[key]; if (!node) return;
    node.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) translate(450 300) scale(${scale.toFixed(4)}) rotate(${rotation.toFixed(2)}) translate(-450 -300)`);
    node.style.opacity = String(clamp(opacity));
  }
  function paint() {
    pending = 0;
    const still = reduced.matches || root.classList.contains('ac-reading');
    for (const {s, top, height} of bounds) {
      if (!still && (top > scrollY+innerHeight*1.3 || top+height < scrollY-innerHeight*.2)) continue;
      const pinned = getComputedStyle(s.querySelector('.ac-frame')).position === 'sticky';
      const p = still || !pinned ? .85 : clamp((scrollY+header-top)/Math.max(1,height-(innerHeight-header)));
      const arrive = ease(p,.04,.32);
      if (s.id === 'histoire-cinq-ans') {
        part(s,'kevin',-25*(1-arrive),0,1);
        part(s,'year1',50*(1-arrive),12*(1-arrive),.5+.5*arrive);
        const next = ease(p,.27,.55);part(s,'year2',65*(1-next),25*(1-next),next);
        const years = ease(p,.5,.72);part(s,'years',0,18*(1-years),years);
      } else if (s.id === 'histoire-decouvert') {
        part(s,'wordpress',0,-20*(1-arrive),1,.94+.06*arrive);
        const spread = ease(p,.22,.6);part(s,'connections',0,0,spread);
        part(s,'person1',-90*(1-spread),0,.2+.8*spread);part(s,'person2',90*(1-spread),0,.2+.8*spread);
        part(s,'screen1',0,35*(1-spread),spread);const last=ease(p,.36,.7);part(s,'screen2',0,35*(1-last),last);
      } else if (s.id === 'histoire-chercher') {
        part(s,'researcher',0,still?0:Math.sin(p*30)*1.3,1);
        part(s,'searchbar',40*(1-arrive),0,.5+.5*arrive);
        for(let i=0;i<3;i++){const t=ease(p,.12+i*.12,.36+i*.12);part(s,'tool'+i,70*(1-t),0,t);}
      } else if (s.id === 'histoire-partager') {
        part(s,'guide',-28*(1-arrive),0,1);
        const listen=ease(p,.12,.4);part(s,'listener',100*(1-listen),0,.35+.65*listen);
        const share=ease(p,.24,.62);part(s,'shared',-55+110*share,-Math.sin(share*Math.PI)*20,.6+.4*share);
        const msg=ease(p,.45,.7);part(s,'message',0,22*(1-msg),msg);
      }
      s.querySelectorAll('[data-v52-card]').forEach((n,i)=>{
        const t=still||!pinned?1:ease(p,.02+i*.09,.2+i*.09);
        n.style.transform=`translateY(${(1-t)*18}px)`;
        n.style.opacity=String(.82+.18*t);
      });
    }
  }
  function schedule(){if(!pending)pending=requestAnimationFrame(paint);}
  function measure(){root.querySelectorAll('.v52-world').forEach(n=>n.setAttribute('viewBox',innerWidth<=700?'65 20 770 560':'0 0 900 600'));header=document.querySelector('.empire-header')?.offsetHeight||68;bounds=scenes.map(s=>({s,top:s.getBoundingClientRect().top+scrollY,height:s.offsetHeight}));schedule();}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);
  reduced.addEventListener('change',measure);
  new MutationObserver(measure).observe(root,{attributes:true,attributeFilter:['class']});
  if('ResizeObserver' in window){const ro=new ResizeObserver(measure);scenes.forEach(s=>ro.observe(s));}
  if(document.fonts)document.fonts.ready.then(measure);
  root.dataset.v52Ready='true';measure();
})();
