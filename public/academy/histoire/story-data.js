'use strict';
window.academyStoryData={
 media:[
 {name:'Little Big Things',detail:'Épisode 42 · Growth hacking',image:'./assets/media/little-big-things.jpg',url:'https://www.youtube.com/watch?v=uPW_OHnGKVQ'},
 {name:'Le Déclic · Alec Henry',detail:'Épisode 086 · Hacker le système',image:'./assets/media/le-declic.png',url:'https://podcastledeclic.fr/podcast/hacker-le-systeme-pour-reussir-il-devoile-ses-secrets-du-growth-hacking-pour-booster-sa-croissance/'},
 {name:'La Chapelle · Hugo Bentz',detail:'Tout recommencer avec l’IA',image:'./assets/media/la-chapelle.jpeg',url:'https://podcast.ausha.co/la-chapelle-radio-hugo-bentz/pourquoi-90-des-entrepreneurs-se-trompent-sur-le-scaling-kevin-dufraisse'}
 ],
 studies:[
 {source:'CESifo · Demirci, Hannane & Zhu',date:'2024 · publié en 2025',kind:'DEMANDE OBSERVÉE',title:'Rédaction et code : les missions freelance reculent.',number:'−21 %',unit:'d’annonces pour les tâches automatisables',body:'Sur une grande plateforme, dans les huit mois suivant l’arrivée de ChatGPT, relativement aux tâches manuelles.',note:'Des annonces de missions, pas un décompte de métiers disparus.',url:'https://www.ifo.de/en/cesifo/publications/2024/working-paper/who-ai-replacing-impact-generative-ai-online-freelancing-platforms'},
 {source:'Society of Authors',date:'11 avril 2024',kind:'ENQUÊTE AUPRÈS DES CRÉATEURS',title:'Traduction : du travail déjà perdu face à l’IA.',number:'36 %',unit:'des traducteurs répondants',body:'déclarent avoir perdu du travail à cause de l’IA générative. Les illustrateurs répondants sont 26 % dans ce cas.',note:'Enquête volontaire et déclarative, non représentative du marché.',url:'https://societyofauthors.org/2024/04/11/soa-survey-reveals-a-third-of-translators-and-quarter-of-illustrators-losing-work-to-ai/'},
 {source:'Stanford Digital Economy Lab',date:'Révision · 12 août 2026',kind:'EMPLOI AUX ÉTATS-UNIS',title:'Les jeunes actifs décrochent dans les métiers exposés.',number:'−19 %',unit:'d’écart relatif d’emploi chez les 22–25 ans',body:'Par rapport à la trajectoire des jeunes dans les métiers moins exposés à l’IA. L’écart vient surtout d’embauches moins nombreuses.',note:'Données jusqu’à juin 2026. Corrélation, pas causalité démontrée.',url:'https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/'},
 {source:'Organisation internationale du Travail × NASK',date:'20 mai 2025',kind:'EXPOSITION MONDIALE',title:'Un emploi sur quatre pourrait voir ses tâches transformées.',number:'1 sur 4',unit:'travailleurs dans un métier exposé',body:'L’IA générative touche désormais des tâches de rédaction, d’image, de vidéo et de développement web.',note:'Exposition ≠ suppression. La transformation est jugée plus probable.',url:'https://www.ilo.org/publications/generative-ai-and-jobs-2025-update'},
 {source:'World Economic Forum',date:'Future of Jobs Report · 2025',kind:'INTENTIONS À L’HORIZON 2030',title:'Des employeurs anticipent des réductions d’effectifs.',number:'41 %',unit:'des employeurs interrogés',body:'envisagent de réduire certains effectifs lorsque l’IA peut reproduire leurs fonctions, entre 2025 et 2030.',note:'Intentions, pas licenciements constatés. Le rapport prévoit aussi des recrutements.',url:'https://www.weforum.org/publications/the-future-of-jobs-report-2025/4-workforce-strategies'}
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
