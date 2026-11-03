'use strict';
window.makeAcademyContinuation=({show,move,el,ease,lerp,caption,jump})=>{
 const pieces=Array.from(document.querySelectorAll('#continuation>.next-piece'),n=>n.id),data=window.academyStoryData,panels=window.academyPanels;
 const put=(id,x=0,y=0,s=1,a=1,r=0)=>{show(id,a);move(id,x,y,s,r);};
 const actor=(id,x,y,s=1,a=1)=>put('a33-'+id,x,y,s,a);
 const cohortCount=el('a33-cohort').querySelector('.next-huge');
 const studentDots=Array.from(el('a33-cohort').querySelectorAll('.student-dot'),n=>({n,base:n.getAttribute('transform')}));
 const lines=[
 [0,'POURQUOI ILS ME PAYAIENT','Moins cher. Plus rapide.<br><em>Et je leur apprenais à s’en servir.</em>','Mon outil changeait l’équation pour mes clients.','LE VRAI AVANTAGE'],
 [.055,'PENDANT CINQ ANS · MON RÉCIT','3 000. 5 000. 10 000 € par mois.<br><em>Pendant que j’étais en cours.</em>','Je construisais des sites avec un outil que mes clients ne connaissaient pas.','CINQ ANS D’AVANCE'],
 [.105,'PUIS, LES DEMANDES BAISSENT','Un jour, le téléphone<br><em>a moins sonné.</em>','Tout le monde avait découvert WordPress. Les clients pouvaient faire eux-mêmes.','L’AVANCE S’EFFACE'],
 [.145,'UNE NOUVELLE QUÊTE','Alors j’ai cherché un autre outil.<br><em>Puis un autre. Chaque jour.</em>','Automatisation LinkedIn, scraping, contacts professionnels…','RETROUVER L’AVANCE'],
 [.205,'PARTAGER LA MÉTHODE','Ces techniques sont devenues<br><em>une formation.</em>','Mes découvertes, triées et partagées avec d’autres entrepreneurs.','TRANSMETTRE'],
 [.233,'PLUS DE 4 000 ÉLÈVES','Une découverte à la fois.<br><em>Des milliers de personnes formées.</em>','Apprendre à trouver et à utiliser les bons raccourcis.','4 000 ÉLÈVES'],
 [.255,'LES CHIFFRES DE MON PARCOURS','Plus de 3 millions d’euros<br><em>de formations vendues.</em>','En trouvant ces stratégies et en les partageant avec plus de 4 000 élèves.','LA CONNAISSANCE CRÉE DE LA VALEUR'],
 [.28,'PODCASTS · YOUTUBE','Et cette histoire<br><em>a commencé à circuler.</em>','Trois conversations à retrouver, et un classement spécialisé.','VU ET ENTENDU'],
 [.335,'REVUE DE PRESSE · 2024–2026','Puis l’IA a changé<br><em>les règles du jeu.</em>','Ce que les études observent déjà sur le travail.','LE TRAVAIL CHANGE'],
 [.425,'ÉCRIRE · MONTER · CODER · NAVIGUER','Elle peut produire tout ça.<br><em>Quelle place reste à l’humain ?</em>','Quand l’exécution devient plus accessible, qu’est-ce qui nous différencie ?','ET NOUS ?'],
 [.465,'FAISONS UNE EXPÉRIENCE','Deux formateurs.<br><em>Lequel choisiriez-vous ?</em>','Imaginez la même compétence et la même offre.','À VOUS DE CHOISIR'],
 [.535,'VOUS VENEZ DE VIVRE MON DÉCLIC','Vous ne connaissez pas<br><em>seulement mon offre.</em>','Vous connaissez mes débuts, mes échecs, mes expériences.','DERRIÈRE L’OFFRE, UNE PERSONNE'],
 [.555,'CE QUE JE CROIS','À compétences comparables,<br><em>l’histoire peut faire la différence.</em>','Notre vécu, nos rencontres et notre regard donnent des raisons de nous choisir.','LA CONFIANCE SE CONSTRUIT'],
 [.58,'VOTRE MÉTIER DE CONTENT OPERATOR','Créer les légendes<br><em>des entrepreneurs.</em>','Faire émerger leur histoire vraie. La transformer en contenus qui créent du lien.','FAIRE CONNAÎTRE LA PERSONNE'],
 [.615,'POURQUOI ILS VEULENT CRÉER DU CONTENU','Être connu.<br><em>Puis inspirer confiance.</em>','Des études B2B montrent la place des idées et des personnes dans les décisions.','LA VISIBILITÉ A UNE VALEUR'],
 [.67,'DES CLIENTS · DES RÉSULTATS','Cette visibilité sert<br><em>leur activité.</em>','Six expériences réelles publiées par Empire.','LES PREUVES'],
 [.73,'COMME WORDPRESS À L’ÉPOQUE','Avant, il fallait une équipe.<br><em>Aujourd’hui, vous avez Empire.</em>','Copywriter, monteur, rédacteur, community manager… la production se rassemble.','LE NOUVEL OUTIL'],
 [.79,'UNE MISSION · SCÉNARIO ILLUSTRÉ','Une entrepreneuse veut<br><em>créer du contenu.</em>','Elle a besoin d’aide pour faire entendre son histoire. Elle vous appelle.','UNE NOUVELLE DEMANDE'],
 [.825,'01 · VOUS ÉCHANGEZ','Son histoire. Ses convictions.<br><em>Vos prochains sujets.</em>','Vous écoutez, vous posez les bonnes questions, vous préparez ensemble.','LA CONVERSATION'],
 [.865,'02 · VOUS LA CONNECTEZ','Un lien.<br><em>Son espace Empire.</em>','Elle rejoint la plateforme pour enregistrer les sujets préparés ensemble.','SON ESPACE'],
 [.89,'03 · LES CONTENUS PRENNENT FORME','Chaque idée trouve<br><em>le bon format.</em>','FAQ, interview, opinion, post : son visage, sa voix, son point de vue.','CRÉER'],
 [.93,'04 · VOUS GARDEZ LA MAIN','Tout est prêt.<br><em>À vous de valider.</em>','Vous vérifiez les contenus depuis la plateforme.','VALIDER'],
 [.955,'05 · SON CALENDRIER','Les contenus validés<br><em>prennent leur place.</em>','La publication s’organise. Elle peut se concentrer sur son activité.','PROGRAMMER'],
 [.975,'VOTRE PRESTATION','Vous vendez<br><em>cette longueur d’avance.</em>','Un accompagnement mensuel autour de son histoire et de sa visibilité.','VOTRE SERVICE']
 ];
 let featureKey='',clientNumber=1,selection='',approved=false,currentT=0;
 const feature=(key,html)=>{el('stage').classList.toggle('feature-mode',!!key);el('story-feature').hidden=!key;if(key&&key!==featureKey){el('story-feature').innerHTML=html;featureKey=key;}};
 const activate=(id,fn)=>{el(id).addEventListener('click',fn);el(id).addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}});};
 activate('a33-accept',()=>jump(.26+.74*.832));
 activate('a33-pass',()=>{clientNumber=clientNumber%3+1;el('a33-client-name').textContent='Entrepreneuse '+clientNumber;});
 el('story-feature').addEventListener('click',e=>{const choice=e.target.closest('[data-choice]');if(choice){selection=choice.dataset.choice;featureKey='';feature('choice-'+selection,panels.choice(selection));el('story-feature').querySelector(`[data-choice="${selection}"]`).focus({preventScroll:true});}const approve=e.target.closest('[data-approve]');if(approve){approved=true;featureKey='';feature('board-review-true',panels.board('review',true));el('scene-note').textContent='Les quatre contenus sont validés. Faites défiler pour les voir dans le calendrier.';}});
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
  }else if(t<.28){feature('sales',panels.sales);note('Plus de 3 M€ de ventes cumulées de formations, selon mon parcours.');}
  else if(t<.335){feature('media',panels.media(data));}
  else if(t<.425){const n=Math.min(4,Math.floor((t-.335)/.018));feature('jobs-news-'+n,panels.newspaper(data.studies[n],n,5));note('Cinq études : des missions, des emplois ou des intentions, selon la source.');}
  else if(t<.465){feature('ai',panels.ai);el('story-feature').style.setProperty('--phase',ease(t,.427,.46));note('L’exécution devient plus accessible. La question du choix reste entière.');}
  else if(t<.535){feature('choice-'+selection,panels.choice(selection));note('Choisissez une approche. Il n’y a pas de bonne réponse imposée.');}
  else if(t<.58){feature('revelation',panels.revelation);el('story-feature').style.setProperty('--phase',ease(t,.537,.575));note('Mon point de vue : une histoire sincère peut renforcer le lien et la confiance.');}
  else if(t<.615){feature('operator',panels.operator);note('Créer une légende : révéler un parcours, sans inventer une vie.');}
  else if(t<.67){const n=t<.6425?0:1;feature('trust-news-'+n,panels.newspaper(data.contentStudies[n],n,2,true));note('Ce que disent les enquêtes sur le contenu, le réseau et la confiance.');}
  else if(t<.73){const n=t<.70?0:1;feature('cases-'+n,panels.cases(data,n));}
  else if(t<.79){
   put('a34-studio',0,0,1,.25);const converge=ease(t,.748,.779);put('a33-empire',600,475,lerp(.75,1.05,converge));
   for(let i=0;i<6;i++){const angle=(-90+i*60)*Math.PI/180;put('a33-team-'+i,lerp(600+Math.cos(angle)*310,600,converge),lerp(475+Math.sin(angle)*210,475,converge),lerp(.9,.2,converge),1-converge);}
   actor('guide',305,715,.78,ease(t,.778,.788));actor('robot',900,710,.65,ease(t,.778,.788));note('Vous accompagnez la personne. Empire rassemble les outils de production.');
  }else if(t<.825){put('a34-studio',0,0,1,.35);put('a33-phone');note('Scénario de mission : accepter l’appel ou passer.');}
  else if(t<.865){put('a34-studio',0,0,1,.2);put('a33-call');note('« Pourquoi avez-vous créé votre activité ? Qu’avez-vous appris sur le terrain ? »');}
  else if(t<.89){feature('link',panels.link);note('Le lien donne accès à son espace de création.');}
  else if(t<.93){feature('board-create',panels.board('create',false));el('story-feature').style.setProperty('--phase',ease(t,.89,.925));note('Les sujets deviennent quatre contenus, adaptés à leur réseau et à leur format.');}
  else if(t<.955){feature('board-review-'+approved,panels.board('review',approved));el('story-feature').style.setProperty('--phase',1);note(approved?'Les quatre contenus sont validés. Faites défiler pour voir leur calendrier.':'Vérifiez les contenus, puis cliquez sur « Valider les 4 contenus ».');}
  else if(t<.975){feature('board-calendar',panels.board('calendar',true));el('story-feature').style.setProperty('--phase',1);note('Après validation, les contenus sont programmés. Suite illustrative de la mission.');}
  else{put('a34-studio',0,0,1,.3);actor('adult',310,710,.88);actor('client',940,710,.84,1-ease(t,.99,1));put('a33-receipt',625,465,.95);note('« Merci ! » · 500 € : exemple d’honoraires mensuels, avant frais et charges.');}
  if(t>=.825)el('session-time').textContent=String(Math.round(lerp(0,45,ease(t,.825,.975)))).padStart(2,'0')+':00';
 }};
};
