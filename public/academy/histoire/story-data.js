'use strict';
window.academyStoryData={
 media:[
 {name:'Little Big Things',detail:'Épisode 42 · Growth hacking',image:'/academy/histoire/assets/media/little-big-things.jpg',url:'https://www.youtube.com/watch?v=uPW_OHnGKVQ'},
 {name:'Le Déclic · Alec Henry',detail:'Épisode 086 · Hacker le système',image:'/academy/histoire/assets/media/le-declic.png',url:'https://podcastledeclic.fr/podcast/hacker-le-systeme-pour-reussir-il-devoile-ses-secrets-du-growth-hacking-pour-booster-sa-croissance/'},
 {name:'La Chapelle · Hugo Bentz',detail:'Tout recommencer avec l’IA',image:'/academy/histoire/assets/media/la-chapelle.jpeg',url:'https://podcast.ausha.co/la-chapelle-radio-hugo-bentz/pourquoi-90-des-entrepreneurs-se-trompent-sur-le-scaling-kevin-dufraisse'}
 ],
 studies:[
 {source:'Organisation internationale du Travail × NASK',date:'20 mai 2025',kind:'1 · LES MÉTIERS EXPOSÉS',title:'Un emploi sur quatre est dans la ligne de mire de l’IA.',number:'1 sur 4',unit:'travailleurs dans un métier exposé',body:'Rédaction, image, vidéo, développement web : l’IA générative sait déjà faire une partie de ces tâches.',note:'Exposition ≠ suppression. L’OIT juge la transformation plus probable.',url:'https://www.ilo.org/publications/generative-ai-and-jobs-2025-update'},
 {source:'World Economic Forum',date:'Future of Jobs Report · janvier 2025',kind:'2 · LES EMPLOYEURS ANTICIPENT',title:'Les entreprises prévoient de remplacer des postes par l’IA.',number:'41 %',unit:'des employeurs interrogés',body:'envisagent de réduire leurs effectifs là où l’IA peut reproduire le travail, d’ici 2030.',note:'Intentions déclarées. Le rapport prévoit aussi des créations de postes.',url:'https://www.weforum.org/publications/the-future-of-jobs-report-2025/4-workforce-strategies'},
 {source:'CESifo · Demirci, Hannane & Zhu',date:'Publié en 2025',kind:'3 · LES MISSIONS DISPARAISSENT',title:'Rédaction et code : les missions freelance reculent.',number:'−21 %',unit:'d’annonces pour les tâches automatisables',body:'Sur une grande plateforme de freelances, dans les huit mois qui ont suivi l’arrivée de ChatGPT.',note:'Des annonces de missions, pas un décompte de métiers disparus.',url:'https://www.ifo.de/en/cesifo/publications/2024/working-paper/who-ai-replacing-impact-generative-ai-online-freelancing-platforms'},
 {source:'Stanford Digital Economy Lab',date:'Révision · 12 août 2026',kind:'4 · LES JEUNES EN PREMIER',title:'Les jeunes décrochent dans les métiers exposés à l’IA.',number:'−19 %',unit:'d’emploi relatif chez les 22–25 ans',body:'Comparé aux jeunes dans des métiers moins exposés. Surtout parce que les entreprises embauchent moins.',note:'Données jusqu’à juin 2026. Corrélation, pas causalité démontrée.',url:'https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/'},
 {source:'Challenger, Gray & Christmas',date:'Rapport · juillet 2026',kind:'5 · LES SUPPRESSIONS ARRIVENT',title:'L’IA devient la première raison des licenciements annoncés.',number:'112 713',unit:'suppressions de postes liées à l’IA en 7 mois',body:'Aux États-Unis, de janvier à juillet 2026 : plus du double de toute l’année 2025. L’IA est la première raison citée pour le cinquième mois de suite.',note:'Raisons déclarées par les employeurs dans leurs annonces de plans sociaux.',url:'https://www.challengergray.com/?p=28706'}
 ],
 cases:[
 {name:'Marguerite Demoures',image:'/case-studies/marguerite-demoures.png',number:'Pipeline ×2',detail:'en un mois',copy:'Une présence qui ouvre des conversations commerciales.'},
 {name:'Olivier Sarezinski',image:'/case-studies/olivier-sarezinski.jpg',number:'1 h / semaine',detail:'pour être présent chaque jour',copy:'Son expertise se décline sur plusieurs réseaux.'},
 {name:'Evelyne Guitard',image:'/case-studies/evelyne-guitard.jpg',number:'100 000 vues',detail:'en 21 jours',copy:'Une voix qui devient visible au-delà de son cercle.'}
 ]
};

window.academyStoryData.contentStudies=[
 {source:'Edelman × LinkedIn',date:'Rapport B2B · 2025',kind:'LA CONFIANCE SE CONSTRUIT',title:'Des idées, plutôt qu’une brochure.',number:'64 %',unit:'des décideurs « en coulisses » interrogés',body:'font davantage confiance aux contenus d’expertise qu’aux supports marketing pour juger les capacités d’un fournisseur.',note:'Enquête auprès de 1 934 dirigeants américains ; chiffre du sous-groupe des décideurs en coulisses. Préférence déclarée.',url:'https://www.edelman.com/sites/g/files/aatuss191/files/2025-07/2025%20Edelman-LinkedIn%20B2B%20Thought%20Leadership%20Impact%20Report_FINAL.pdf'},
 {source:'LinkedIn × Censuswide',date:'26 août 2025',kind:'LA PAROLE DES GENS COMPTE',title:'Les acheteurs écoutent aussi leur réseau.',number:'77 %',unit:'des responsables marketing B2B interrogés',body:'disent que leur audience évalue les marques au-delà des canaux de l’entreprise, en s’appuyant sur son réseau.',note:'7 000 responsables dans 14 marchés dont la France. Perception des marketeurs, pas mesure directe des achats.',url:'https://news.linkedin.com/en-us/2025/networks--not-ai-or-search--are-the--1-trusted-source-amid-infor'}
];
window.academyStoryData.cases.push(
 {name:'Caroline Blivet',image:'/case-studies/caroline-blivet.jpg',number:'8 000 impressions',detail:'sur son premier post avec Empire',copy:'Son précédent record était de 361 impressions.'},
 {name:'Déborah Guillotin',image:'/case-studies/deborah-guillotin.png',number:'10 000 abonnés',detail:'sur Substack, en moins d’un mois',copy:'Un lancement accompagné par les conseils de Kevin.'},
 {name:'Sophie Guibaud',image:'/case-studies/sophie-guibaud.jpg',number:'10 h économisées',detail:'par semaine',copy:'Ses idées partagées plus vite, plus systématiquement.'}
);
const researchReferences=document.getElementById('research-references');
if(researchReferences)researchReferences.innerHTML=[...window.academyStoryData.studies,...window.academyStoryData.contentStudies].map(d=>`<p><a href="${d.url}" target="_blank" rel="noopener">${d.source} · ${d.date}</a> — <strong>${d.title}</strong> ${d.number} ${d.unit} — ${d.body} ${d.note}</p>`).join('');
