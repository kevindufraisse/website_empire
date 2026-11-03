(() => {
'use strict';
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const menuToggle=$('#empire-menu-toggle'),menu=$('#empire-menu');
function closeMenu(){menu.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Ouvrir le menu');}
menuToggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();$$('.empire-resources').forEach(n=>n.open=false);}});
document.addEventListener('click',e=>{if(!e.target.closest('.empire-header')){closeMenu();$$('.empire-resources').forEach(n=>n.open=false);}});
const partnerDay=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Paris',weekday:'short'}).format(new Date());
$$('[data-partner-price]').forEach(n=>n.textContent=String(partnerDay==='Sun'?700:['Fri','Sat'].includes(partnerDay)?600:500));
const scene=$('#story'),stage=$('#stage'),world=$('#world'),media=matchMedia('(prefers-reduced-motion: reduce)');
const cache={},el=id=>cache[id]||(cache[id]=document.getElementById(id));
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,p)=>a+(b-a)*p;
const ease=(p,a,b)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
function show(id,a=1){const n=el(id);n.style.opacity=String(clamp(a));n.style.visibility=a>.001?'visible':'hidden';}
function move(id,x=0,y=0,s=1,r=0){el(id).setAttribute('transform',`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(4)}) rotate(${r.toFixed(2)})`);}
const layers=['chair','floor','bedroom','school','client-room','parcel-0','parcel-1','parcel-2','kevin','teacher','parent','desk','laptop','invoice','teacher-speech','ouch','success','parent-speech','client-label','delivery','order-0','order-1','small-spark-0','small-spark-1','first-payment'];
const captions=[
 [0,'','<span class="founder-kicker">L’histoire du fondateur</span>Je vais vous raconter pourquoi j’ai créé un nouveau métier : <br><em>Content Operator.</em>','',''],
 [0.05,'','À l’école, j’étais nul. <br><em>Tout le monde pensait que je ne ferais rien de ma vie.</em>','',''],
 [0.1,'','Moi, je voulais vendre un truc sur Internet. Il me fallait un site… 20 000 €. <br><em>Impossible.</em>','',''],
 [0.29,'','Alors je me suis dit : je vais le faire moi-même. <br><em>Même en plein cours.</em>','',''],
 [0.45,'','Mes profs ? Ils m’ont pris mon ordi. <br><em>Pour eux, j’étais encore en train de tout rater.</em>','',''],
 [0.68,'','Mais je n’ai pas lâché. Le soir, dans ma chambre, <br><em>j’ai fini mon site.</em>','',''],
 [0.79,'','Mes potes l’ont montré à leurs parents. <br><em>Et ils sont devenus mes premiers clients.</em>','',''],
 [0.94,'','Premier site vendu : 3 000 €, en quelques heures. <br><em>Moi, le mec dont personne n’attendait rien.</em>','','']
];
let currentCaption=-1,currentP=0,pending=0,playing=false,playRaf=0,playStart=0,playFrom=0,simple=false,modeChosen=false;
// Complete rendered poses keep shoulders, elbows and hands anatomically consistent.
function actor(id,x,y,scale=1){show(id);move(id,x,y,scale);}
function place(id,plane){if(el(id).parentNode!==el(plane))el(plane).appendChild(el(id));}
function studentPose(shock=0,standing=0){const upright=standing>=.5;show('student-type',!upright&&shock<.5?1:0);show('student-shock',!upright&&shock>=.5?1:0);show('student-standing',upright?1:0);place('kevin',upright?'front-people':'rear-people');}
function teacherPose(carry=0){show('teacher-reach',carry<.5?1:0);show('teacher-carry',carry>=.5?1:0);}
function laptop(x,y,open=1,rotation=0,scale=.7){show('laptop');move('laptop',x,y,scale,rotation);el('lid').setAttribute('transform',`matrix(1 ${lerp(.04,0,open)} 0 ${Math.max(.035,open)} 0 0)`);}
function screens(shop,code,done){show('shop-screen',shop);show('code-screen',code);show('done-screen',done);}
function setCaption(key,c){if(currentCaption===key)return;currentCaption=key;$('#era').textContent=c[1];$('#headline').innerHTML=c[2];$('#caption').textContent=c[3];$('#scene-word').textContent=c[4];}
function text(p){let index=0;for(let n=1;n<captions.length;n++)if(p>=captions[n][0])index=n;setCaption('start-'+index,captions[index]);}
function paintPrologue(p){
 text(p);el('stage').classList.remove('feature-mode');el('story-feature').hidden=true;el('session-timer').hidden=true;el('scene-note').textContent=p>=.45&&p<.61?'Le professeur : « On ferme l’ordinateur. »':p>=.755&&p<.79?'Mon premier site est en ligne.':p>=.82&&p<.925?'Un parent d’un ami : « Tu pourrais faire le mien ? »':p>=.925?'Mon premier site vendu : 3 000 €. Le raccourci s’appelait WordPress.':' ';
place('laptop','surface-plane');layers.forEach(id=>show(id,0));show('floor');show('moon',0);show('sun');show('lamp-beam',0);show('stamp',0);show('code-cover');move('camera');move('desk');move('bedroom');move('school');move('client-room');move('laptop');move('invoice');move('floor');
 const compact=innerWidth<=700;
 // The mobile camera follows the important action while retaining the shared scene.
 let cameraX=compact?255:0, cameraW=compact?700:1200;
 if(compact&&p>=.40&&p<.68)cameraX=lerp(255,330,ease(p,.40,.50));if(compact&&p>=.79)cameraX=lerp(255,330,ease(p,.79,.84));
 world.setAttribute('viewBox',compact?`${cameraX} 200 ${cameraW} 520`:'0 140 1200 600');
 stage.classList.toggle('night',p>=.685&&p<.785);
 show('bedroom',p<.29?1-ease(p,.23,.29):p>=.68&&p<.79?ease(p,.68,.705)*(1-ease(p,.77,.79)):0);
 show('school',ease(p,.23,.29)*(1-ease(p,.65,.705)));
 show('client-room',ease(p,.77,.81));
 actor('kevin',460,490);studentPose();teacherPose();show('desk');show('chair',1-ease(p,.77,.82));laptop(620,482,1);screens(1,0,0);
 if(p<.29){
  for(let n=0;n<3;n++){const a=1-ease(p,.105,.17);show(`parcel-${n}`,a);move(`parcel-${n}`,840+(n%2)*105,425+n*65,.76,Math.sin(p*25+n)*5);}
  const entry=ease(p,.055,.11),exit=ease(p,.22,.29);show('invoice',entry*(1-exit));
  move('invoice',lerp(920,760,entry)+exit*280,lerp(510,444,entry)-exit*460,lerp(.55,.92,entry)*(1-exit*.55),lerp(14,-5,entry)+exit*30);
  studentPose(ease(p,.105,.125)*(1-ease(p,.23,.27)));
  show('stamp',ease(p,.16,.2));move('stamp',0,73,1,-9);
 }
 if(p>=.23&&p<.68){
  screens(0,1,0);studentPose(ease(p,.49,.515));const progress=ease(p,.29,.47);el('code-cover').setAttribute('y',-112+progress*90);el('code-cover').setAttribute('height',100-progress*90);move('cursor',0,Math.floor(progress*4)*20);
  const appear=ease(p,.40,.475),leave=ease(p,.62,.68);const teacherX=lerp(1260,845,appear)+leave*520;
  actor('teacher',teacherX,490+Math.sin(p*130)*(appear<.99||leave>0?2:0));show('teacher',ease(p,.4,.41));
  const announce=ease(p,.45,.48)*(1-ease(p,.56,.595));show('teacher-speech',announce);move('teacher-speech',960,280,.68);
  const close=ease(p,.525,.57),carry=ease(p,.57,.615),held=ease(p,.595,.615),openness=1-close*.955;
  const lx=lerp(620,810,carry)+leave*520,ly=lerp(482,452,carry);
  laptop(lx,ly,openness,lerp(0,-7,carry));show('laptop',held<.5?1:0);teacherPose(held);if(carry>0)place('laptop','moving-props');
  show('ouch',ease(p,.49,.52)*(1-ease(p,.58,.62)));move('ouch',449,270,.72);
 }
 if(p>=.68&&p<.79){
  show('moon');show('sun',0);show('lamp-beam');screens(0,1-ease(p,.737,.762),ease(p,.737,.762));
  const arrive=ease(p,.68,.705);laptop(lerp(1010,620,arrive),lerp(445,482,arrive),ease(p,.693,.72));
  el('code-cover').setAttribute('y',-112+ease(p,.7,.74)*100);el('code-cover').setAttribute('height',100-ease(p,.7,.74)*100);move('cursor',0,Math.floor(ease(p,.7,.74)*4)*20);
  studentPose();show('success',ease(p,.755,.77));move('success',558,253,.75);
  show('small-spark-0',ease(p,.755,.77));move('small-spark-0',775,393,.5,p*200);
 }
 if(p>=.77){
  const unfold=ease(p,.77,.82),arrival=ease(p,.785,.84),present=ease(p,.87,.94);
  screens(0,0,1);laptop(620,482,1);
  actor('kevin',lerp(460,390,unfold),lerp(490,495,unfold));studentPose(0,unfold);
  actor('parent',lerp(1180,900,arrival),495);
  show('parent-speech',ease(p,.82,.85)*(1-ease(p,.905,.93)));move('parent-speech',700,285,.67);
  show('client-label',ease(p,.81,.84)*(1-ease(p,.9,.94)));move('client-label',900,722,.72);
  show('delivery',ease(p,.875,.9));move('delivery',lerp(590,745,present),lerp(415,475,present)-Math.sin(present*Math.PI)*25,lerp(.64,.75,present),Math.sin(present*Math.PI)*-8);
  show('order-0',ease(p,.925,.953));move('order-0',835,270,.9,3);
  show('order-1',ease(p,.96,.985));move('order-1',850,333,.9,-3);
  show('small-spark-0',ease(p,.93,.95));move('small-spark-0',703,262,.8,p*130);
  show('small-spark-1',ease(p,.97,.985));move('small-spark-1',1051,380,.5,-p*90);
  show('desk');show('first-payment',ease(p,.94,.97));move('first-payment',660,298,.85);
 }
}
const next=window.makeAcademyContinuation({show,move,el,ease,lerp,caption:setCaption,jump});
const chapterPoints=[0, 0.26, 0.4117, 0.5079, 0.6041000000000001, 0.7151000000000001, 0.8446];
function paint(p){
 currentP=p;el('stage-cta').hidden=p<.985;el('skip-offer').hidden=p>.03;
 el('camera').style.display=p<.26?'':'none';
 el('continuation').style.display=p>=.26?'':'none';
 if(p<.26){el('study-link').hidden=true;paintPrologue(p/.26);}
 else{stage.classList.remove('night');world.setAttribute('viewBox',innerWidth<=700?'140 185 920 560':'0 185 1200 560');next.paint((p-.26)/.74);}
 let chapter=0;for(let i=1;i<chapterPoints.length;i++)if(p>=chapterPoints[i]-.0001)chapter=i;
 $$('.chapters [data-at]').forEach((n,i)=>n.setAttribute('aria-current',String(chapter===i)));track(chapter,p);
 $('#progress').style.width=(p*100)+'%';
 $('#scroll-cue').innerHTML=p>.985?'<i>↓</i> Découvrez le programme.':'<i>↓</i> Faites défiler, l’histoire avance.';
}
const seen=new Set();
function track(chapter,p){const key=p>.985?'fin':'chapitre_'+(chapter+1);if(seen.has(key))return;seen.add(key);try{(window.dataLayer=window.dataLayer||[]).push({event:'academy_story_progress',story_step:key});}catch(e){}}
let settleTimer=0;
function scenePoints(){return [...captions.map(c=>c[0]*.26),...next.points.map(t=>.26+.74*t),1];}
function settle(){
 if(playing||simple||media.matches)return;
 const d=distance(),p=(scrollY-top())/d;if(p<=.002||p>=.995)return;
 const pts=scenePoints();let i=0;for(let k=1;k<pts.length;k++)if(p>=pts[k])i=k;
 const a=pts[i],b=pts[Math.min(i+1,pts.length-1)],target=a+(b-a)*.72;
 if(Math.abs(target-p)*d<6)return;
 scrollTo({top:top()+d*target,behavior:'smooth'});
}
function distance(){return Math.max(1,scene.offsetHeight-innerHeight);}
function top(){return scene.getBoundingClientRect().top+scrollY;}
function update(){pending=0;if(!simple)paint(clamp((scrollY-top())/distance()));}
function schedule(){if(!pending)pending=requestAnimationFrame(update);}
function stop(){playing=false;cancelAnimationFrame(playRaf);$('#play').setAttribute('aria-pressed','false');$('#play').innerHTML='<span aria-hidden="true">▷</span> Lecture automatique';}
function jump(p){stop();scrollTo({top:top()+distance()*Math.min(1,p+.0001),behavior:media.matches?'auto':'smooth'});}
$$('[data-at]').forEach(b=>b.addEventListener('click',()=>jump(Number(b.dataset.at))));
function tick(now){if(!playing)return;const p=Math.min(1,playFrom+(now-playStart)/245000);scrollTo({top:top()+distance()*p,behavior:'auto'});if(p>=1){stop();return;}playRaf=requestAnimationFrame(tick);}
$('#play').addEventListener('click',()=>{if(playing){stop();return;}playFrom=currentP>.985?0:currentP;playStart=performance.now();playing=true;$('#play').setAttribute('aria-pressed','true');$('#play').innerHTML='<span aria-hidden="true">Ⅱ</span> Mettre en pause';playRaf=requestAnimationFrame(tick);});
addEventListener('wheel',stop,{passive:true});addEventListener('touchstart',stop,{passive:true});addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))stop();});
function reading(on){stop();simple=on;document.body.classList.toggle('simple',on);$('#reading').hidden=!on;$('#reading-toggle').setAttribute('aria-pressed',String(on));$('#reading-toggle').textContent=on?'Voir l’animation':'Lire sans animation';scrollTo({top:0,behavior:'auto'});schedule();}
$('#reading-toggle').addEventListener('click',()=>{modeChosen=true;reading(!simple);});$('#back-animation').addEventListener('click',()=>{modeChosen=true;reading(false);});$('#replay').addEventListener('click',()=>{if(simple)reading(false);jump(0);});
addEventListener('scroll',()=>{schedule();clearTimeout(settleTimer);settleTimer=setTimeout(settle,220);},{passive:true});addEventListener('resize',schedule);media.addEventListener('change',()=>{if(!modeChosen)reading(media.matches);});
if(media.matches)reading(true);update();
})();
