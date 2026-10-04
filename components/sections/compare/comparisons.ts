import type { FormulaTermId } from './ComparePage'

/**
 * Ce que fait Empire, terme par terme de la formule. Une seule source pour
 * toutes les pages comparatives : si une capacité change, on la corrige ici.
 * Tout ce qui est cité existe dans l'app (relu dans le code le 4 octobre 2026).
 */
export const EMPIRE_TERMS: Record<FormulaTermId, string> = {
  message:
    'Tes sujets sont prêts chaque semaine : tes notes envoyées au bot Telegram (vocal, lien, idée), la veille de tes concurrents, les sujets qui font des vues dans ta niche, croisés avec ton positionnement. Tu cliques. Tu peux aussi te faire interviewer à l’oral par une IA.',
  format:
    'Ton sujet entre dans un format qui se regarde, testé sur le compte de Kevin : réaction à un reel, classement, devine, pour ou contre, citation, questions, actu illustrée, vidéo longue façon podcast, cours en slides, carrousel, newsletter. Et un reel viral refait avec ton visage et ta voix.',
  diffusion:
    'Une idée devient 10+ contenus sur 7 réseaux (LinkedIn, Instagram, TikTok, YouTube, Facebook, X, Threads), plus Substack et Skool. Ce qui a marché est republié automatiquement. Agence ou plusieurs comptes : tu crées une fois, ça part partout, et tu peux faire filmer tes clients à distance.',
  time:
    '20 minutes à 1 heure par semaine : tu filmes (aussi depuis l’app iPhone) ou tu dictes ; on écrit, on monte, on sous-titre et on publie.',
  cost:
    '199 à 799 €/mois selon ton rythme (tous les 2 jours à 2 fois par jour), ou à la consommation dès 25 €. Une équipe monteur + rédacteur + community manager coûte 5 000 €+/mois.',
  visibility:
    'Liens trackés du reel au rendez-vous et à la vente (Tally, Cal.com, Systeme.io). Un setter IA répond à tes DM Instagram. Sur Instagram, ton lien devient un mot-clé à commenter. Commentaires et DM de tous tes réseaux dans une seule boîte. API et webhooks pour tes outils (Make, n8n…).',
}

/** Ce qu'Empire fait en plus, affiché sous la comparaison sur chaque page. */
export const EMPIRE_ALSO = [
  'Podcast publié sur Spotify et Apple (flux RSS)',
  'Best-of YouTube de tes reels',
  'Miniatures, titres et descriptions YouTube',
  'Cours en slides prêts à présenter',
  'Interview à deux, à distance',
  'App iPhone pour filmer en rafale',
  'CRM des leads avec étapes de suivi',
  'App en français, anglais et espagnol',
]

export type ComparisonEntry = {
  slug: string
  competitor: string
  /** Une ligne pour la page /comparatif. */
  summary: string
}

/** Toutes les pages comparatives, dans l'ordre de la page /comparatif. */
export const COMPARISONS: ComparisonEntry[] = [
  { slug: 'alternative-magicpost', competitor: 'MagicPost', summary: 'Écrit des posts LinkedIn. LinkedIn seul, pas de vidéo.' },
  { slug: 'alternative-taplio', competitor: 'Taplio', summary: 'Écrit et programme des posts LinkedIn, prospection automatisée. LinkedIn seul.' },
  { slug: 'alternative-opus-clip', competitor: 'Opus Clip', summary: 'Découpe une vidéo longue que tu as déjà en extraits courts.' },
  { slug: 'empire-vs-freelance', competitor: 'des freelances', summary: 'Un monteur, un rédacteur, un community manager : à briefer et coordonner.' },
  { slug: 'empire-vs-agence', competitor: 'une agence', summary: 'Tout délégué, mais cher, avec engagement et des allers-retours.' },
  { slug: 'empire-vs-chatgpt', competitor: 'ChatGPT', summary: 'Gratuit ou presque, mais tu fais tout le reste toi-même.' },
]

/**
 * Preuves sur le compte de Kevin : vues lues via Postproxy (statistiques des
 * réseaux) le 4 octobre 2026, liens publics des publications.
 */
export const PROOF_DATE = '4 octobre 2026'
export const PROOF_POSTS: Array<{ format: string; title: string; stats: Array<{ views: string; network: string; href: string }> }> = [
  {
    format: 'Actu illustrée',
    title: '« Il fait 40 degrés à Paris et l’État se réveille sur l’écologie… »',
    stats: [{ views: '426 747', network: 'Instagram', href: 'https://www.instagram.com/p/DaDE4DyghYp' }],
  },
  {
    format: 'Une idée, plusieurs réseaux',
    title: '« HugoDécrypte a lancé sa chaîne YouTube en disant qu’il voulait créer un média… »',
    stats: [
      { views: '304 535', network: 'Threads', href: 'https://www.threads.net/@kevin.dufraisse/post/DZZ878kDqBx' },
      { views: '69 785', network: 'Instagram', href: 'https://www.instagram.com/p/DZcnQL2DNjP' },
    ],
  },
  {
    format: 'Reel cloné',
    title: '« Cette vidéo est un clone de Macron venant de la vidéo la plus virale de mon compte… »',
    stats: [{ views: '95 269', network: 'Instagram', href: 'https://www.instagram.com/p/Ddi44f8DN1J' }],
  },
]

/**
 * « Recomposer Empire avec des outils » : ce que coûtent les deux outils les
 * plus proches (prix publics relevés le 4 octobre 2026) et ce qui manque encore.
 */
export const TOOL_STACK = {
  tools: [
    { name: 'MagicPost Creator', role: 'écrire des posts LinkedIn', price: '69 $/mois' },
    { name: 'Opus Clip Pro', role: 'découper une vidéo longue en extraits', price: '29 $/mois' },
  ],
  total: '98 $/mois',
  missing: [
    'les sujets prêts chaque semaine',
    'les formats testés (réaction, classement, devine, citation…)',
    'les newsletters, Substack et Skool',
    'l’écrit sur les 6 autres réseaux',
    'le suivi des leads jusqu’au rendez-vous',
    'le setter IA Instagram',
  ],
  empire: 'Empire couvre tout ça : dès 199 €/mois, ou à la consommation dès 25 €.',
}
