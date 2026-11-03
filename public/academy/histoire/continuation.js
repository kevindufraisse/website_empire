'use strict';
window.makeAcademyContinuation=({show,move,el,ease,lerp,caption,jump})=>{
 const pieces=Array.from(document.querySelectorAll('#continuation>.next-piece'),n=>n.id),data=window.academyStoryData,panels=window.academyPanels;
 const put=(id,x=0,y=0,s=1,a=1,r=0)=>{show(id,a);move(id,x,y,s,r);};
 const actor=(id,x,y,s=1,a=1)=>put('a33-'+id,x,y,s,a);
 const cohortCount=el('a33-cohort').querySelector('.next-huge');
 const studentDots=Array.from(el('a33-cohort').querySelectorAll('.student-dot'),n=>({n,base:n.getAttribute('transform')}));
 const lines=[
 [0,'','Moins cher, plus rapide, <br><em>et je leur apprenais à s’en servir.</em>','',''],
 [0.055,'','Pendant cinq ans : 3 000, 5 000, puis 10 000 € par mois, <br><em>pendant que j’étais encore en cours.</em>','',''],
 [0.105,'','Puis tout le monde a découvert WordPress. <br><em>Un jour, le téléphone a moins sonné.</em>','',''],
 [0.145,'','J’ai compris qu’un outil secret pouvait rendre riche <br><em>et donner un avantage injuste à mes clients.</em>','',''],
 [0.175,'','Alors, j’ai cherché des outils. <br><em>Puis d’autres. Chaque jour.</em>','',''],
 [0.205,'','Et j’en ai fait une formation <br><em>qui a rassemblé plus de 4 000 personnes.</em>','',''],
 [0.255,'','J’ai été invité dans les plus gros podcasts francophones <br><em>pour parler de ces avantages injustes.</em>','',''],
 [0.335,'','Puis l’IA est arrivée <br><em>et a détruit des métiers.</em>','',''],
 [0.425,'','Elle peut écrire, monter, coder. Elle peut remplacer un humain. <br><em>Alors, quelle place reste-t-il aux humains ?</em>','',''],
 [0.465,'','Deux formateurs, la même offre. <br><em>Lequel choisiriez-vous ?</em>','',''],
 [0.535,'','Vous avez choisi le formateur B, <br><em>parce que vous connaissez déjà son histoire.</em>','',''],
 [0.555,'','Le métier de demain, c’est ce que l’IA ne remplacera jamais : <br><em>l’histoire.</em>','',''],
 [0.58,'','Votre métier : <br><em>créer la légende des entrepreneurs.</em>','',''],
 [0.615,'','Être connu, <br><em>c’est la seule barrière qui protège de l’IA.</em>','',''],
 [0.67,'','Et cette visibilité <br><em>fait grandir leur activité.</em>','',''],
 [0.73,'','Avant, il fallait une équipe à plus de 10 000 € par mois. <br><em>Aujourd’hui, il y a Empire.</em>','',''],
 [0.79,'','Une entrepreneuse veut créer du contenu. <br><em>Elle vous appelle.</em>','',''],
 [0.825,'','Vous l’écoutez raconter son histoire. <br><em>Ce sont ses prochains sujets.</em>','',''],
 [0.865,'','Vous lui envoyez un lien <br><em>vers son espace Empire.</em>','',''],
 [0.89,'','Chaque idée devient <br><em>un contenu au bon format.</em>','',''],
 [0.93,'','Tout est prêt. <br><em>Vous validez.</em>','',''],
 [0.955,'','Les contenus validés <br><em>se programment dans son calendrier.</em>','',''],
 [0.975,'','Vous vendez cette longueur d’avance. <br><em>Et chaque mois, vous recommencez.</em>','','']
 ];
 let featureKey='',clientNumber=1,selection='',approved=false,currentT=0;
 const feature=(key,html)=>{el('stage').classList.toggle('feature-mode',!!key);el('story-feature').hidden=!key;if(key&&key!==featureKey){el('story-feature').innerHTML=html;featureKey=key;}};
 const activate=(id,fn)=>{el(id).addEventListener('click',fn);el(id).addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}});};
 activate('a33-accept',()=>jump(.26+.74*.832));
 activate('a33-pass',()=>{clientNumber=clientNumber%3+1;el('a33-client-name').textContent='Entrepreneuse '+clientNumber;});
 el('story-feature').addEventListener('click',e=>{const approve=e.target.closest('[data-approve]');if(approve){approved=true;featureKey='';feature('board-review-true',panels.board('review',true));el('scene-note').textContent='Les quatre contenus sont validés. Faites défiler pour les voir dans le calendrier.';}});
 const note=copy=>el('scene-note').textContent=copy;
 return {paint(t){
  currentT=t;pieces.forEach(id=>show(id,0));feature('',null);
  if(innerWidth<=700)el('world').setAttribute('viewBox',t>=.79&&t<.825?'300 200 600 540':t>=.825&&t<.89?'230 200 740 540':'140 185 920 560');
  el('study-link').hidden=true;el('session-timer').hidden=t<.825;note('');
  let index=0;for(let i=1;i<lines.length;i++)if(t>=lines[i][0])index=i;caption('next-'+index,lines[index]);
  if(t<.055){feature('comparison',panels.comparison);el('story-feature').style.setProperty('--phase',ease(t,0,.05));note('Le devis reçu et mon service de l’époque, d’après mon expérience.');}
  else if(t<.105){feature('earnings',panels.earnings);const q=ease(t,.057,.10);el('story-feature').style.setProperty('--phase',q);document.getElementById('earnings-value').textContent=q<.3?'3 000 €':q<.65?'5 000 €':'10 000 €';note('Chiffre d’affaires de mon parcours, avant frais et charges.');}
  else if(t<.145){feature('decline',panels.decline);el('story-feature').style.setProperty('--phase',ease(t,.107,.14));note('WordPress devient largement connu. Le logiciel était déjà libre.');}
  else if(t<.205){
   put('a34-studio',0,0,1,.18);for(let i=0;i<9;i++)put('a34-tool-'+i,340+(i%3)*250,310+Math.floor(i/3)*155,1);
   const q=ease(t,.145,.204)*8,j=Math.floor(q),f=q-j,n=Math.min(8,j+1);put('a34-lens',lerp(340+(j%3)*250,340+(n%3)*250,f),lerp(310+Math.floor(j/3)*155,310+Math.floor(n/3)*155,f));
   note('Trouver. Tester. Garder les techniques utiles. Recommencer le lendemain.');
  }else if(t<.255){
   const gather=ease(t,.218,.248);put('a34-library',0,0,1,1-gather);
   for(let i=0;i<9;i++){const q=ease(t,.218+i*.0015,.239+i*.0015);put('a34-tool-'+i,lerp(300+(i%5)*150,600+(i%3)*50,q),lerp(400+Math.floor(i/5)*155,565,q),lerp(.85,.12,q),1-q);}
   put('a33-cohort',660,465,1.18,gather);cohortCount.textContent=new Intl.NumberFormat('fr-FR').format(Math.round(4000*gather/50)*50);studentDots.forEach(({n,base},i)=>{const enter=ease(gather,i/45,Math.min(1,i/45+.28));n.style.opacity=String(enter);n.setAttribute('transform',base+' scale('+enter.toFixed(3)+')');});actor('guide',285,720,.78,gather);note(gather<.5?'Les découvertes deviennent une bibliothèque de techniques.':'Plus de 4 000 élèves dans ma formation francophone de growth hacking.');
  }else if(t<.335){feature('media',panels.media(data));}
  else if(t<.425){const n=Math.min(4,Math.floor((t-.335)/.018));feature('jobs-news-'+n,panels.newspaper(data.studies[n],n,5));note('Cinq études : des missions, des emplois ou des intentions, selon la source.');}
  else if(t<.465){feature('ai',panels.ai);el('story-feature').style.setProperty('--phase',ease(t,.427,.46));note('L’exécution devient plus accessible. La question du choix reste entière.');}
  else if(t<.535){const pick=t>=.5?'story':'';feature('choice-'+pick,panels.choice(pick));note('Choisissez une approche. Il n’y a pas de bonne réponse imposée.');}
  else if(t<.58){feature('revelation',panels.revelation);el('story-feature').style.setProperty('--phase',ease(t,.537,.575));note('Mon point de vue : une histoire sincère peut renforcer le lien et la confiance.');}
  else if(t<.615){feature('operator',panels.operator);note('Créer une légende : révéler un parcours, sans inventer une vie.');}
  else if(t<.67){const n=t<.6425?0:1;feature('trust-news-'+n,panels.newspaper(data.contentStudies[n],n,2,true));note('Ce que disent les enquêtes sur le contenu, le réseau et la confiance.');}
  else if(t<.73){const n=t<.70?0:1;feature('cases-'+n,panels.cases(data,n));}
  else if(t<.79){feature('team-cost',panels.teamCost);el('story-feature').style.setProperty('--phase',ease(t,.735,.775));
  }else if(t<.825){put('a34-studio',0,0,1,.35);put('a33-phone');note('Scénario de mission : accepter l’appel ou passer.');}
  else if(t<.865){put('a34-studio',0,0,1,.2);put('a33-call');note('« Pourquoi avez-vous créé votre activité ? Qu’avez-vous appris sur le terrain ? »');}
  else if(t<.89){feature('link',panels.link);note('Le lien donne accès à son espace de création.');}
  else if(t<.93){feature('board-create',panels.board('create',false));el('story-feature').style.setProperty('--phase',ease(t,.89,.925));note('Les sujets deviennent quatre contenus, adaptés à leur réseau et à leur format.');}
  else if(t<.955){feature('board-review-'+approved,panels.board('review',approved));el('story-feature').style.setProperty('--phase',1);note(approved?'Les quatre contenus sont validés. Faites défiler pour voir leur calendrier.':'Vérifiez les contenus, puis cliquez sur « Valider les 4 contenus ».');}
  else if(t<.975){feature('board-calendar',panels.board('calendar',true));el('story-feature').style.setProperty('--phase',1);note('Après validation, les contenus sont programmés. Suite illustrative de la mission.');}
  else{put('a34-studio',0,0,1,.3);actor('adult',310,710,.88);actor('client',940,710,.84);put('a33-receipt',625,465,.95);const m=Math.min(3,Math.floor(ease(t,.977,.998)*4));el('a33-receipt').querySelectorAll('.receipt-month').forEach((n,i)=>n.classList.toggle('on',i<=m));note('« Merci ! » · 500 € : exemple d’honoraires mensuels, avant frais et charges.');}
  if(t>=.825)el('session-time').textContent=String(Math.round(lerp(0,45,ease(t,.825,.975)))).padStart(2,'0')+':00';
 }};
};
