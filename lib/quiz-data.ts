/**
 * Quiz "Découvrez votre archétype de Creator".
 * Pure data — no React, no I/O. Imported by both client and server.
 */

export type ArchetypeId = 'storyteller' | 'builder' | 'educator' | 'provocateur'
export type ScoreBand = 'low' | 'medium' | 'high'
export type RecommendedOffer = 'academy' | 'autopilot' | 'copilot' | 'nurture'

export interface QuizOption {
  id: string
  label: string
  /** Optional emoji shown on the left of the option button — helps fast scanning. */
  emoji?: string
  /**
   * Points awarded to each archetype when this option is picked.
   * Missing keys = 0.
   */
  archetype?: Partial<Record<ArchetypeId, number>>
  /** Stage / engagement score contribution (0–10). */
  score?: number
  /** Pulls the recommendation toward a specific offer. */
  pull?: Partial<Record<RecommendedOffer, number>>
}

export interface QuizQuestion {
  id: string
  step: number
  /** Short tag shown above the question. */
  kicker: string
  question: string
  helper?: string
  options: QuizOption[]
}

// ─── Archetype definitions ────────────────────────────────────────────────────

export interface IconFigure {
  name: string
  /** Twitter / X handle without the @, used to fetch the avatar via unavatar.io. */
  handle: string
  /** One-line role description ("Le bâtisseur visionnaire", etc.). */
  role: string
  /** Direct image URL override (used when unavatar may not have a clean shot). */
  image?: string
}

export interface WeekPlan {
  week: number
  title: string
  tasks: string[]
}

export interface ArchetypeProfile {
  id: ArchetypeId
  name: string
  emoji: string
  tagline: string
  description: string
  strengths: string[]
  watchOuts: string[]
  bestFormats: string[]
  /** 3 iconic figures - first is the primary "face" of the archetype. */
  icons: IconFigure[]
  /** 10 concrete post topics the person can write today. */
  topics: string[]
  /** Diagnostic per blocker ID - explains WHY their posts don't convert. */
  diagnostics: Record<string, string>
  /** 4-week action plan. */
  plan30: WeekPlan[]
  accentClass: string
}

/**
 * Resolve the avatar URL for a figure. Uses unavatar.io which proxies the
 * latest X/Twitter avatar — keeps photos fresh without us having to host them.
 */
export function iconAvatarUrl(icon: IconFigure): string {
  if (icon.image) return icon.image
  return `https://unavatar.io/x/${encodeURIComponent(icon.handle)}`
}

export const ARCHETYPES: Record<ArchetypeId, ArchetypeProfile> = {
  storyteller: {
    id: 'storyteller',
    name: 'Le Storyteller',
    emoji: '🎙️',
    tagline: 'Vous transformez votre vécu en aimant à audience.',
    description:
      "Vous touchez votre audience parce que vous osez raconter. Vous avez une matière première rare : votre parcours, vos échecs, vos prises de conscience. Quand vous vous autorisez à les partager, les gens s'arrêtent et lisent.",
    strengths: [
      'Connexion émotionnelle forte',
      'Posts qui se partagent en DM',
      'Audience ultra fidèle',
    ],
    watchOuts: [
      'Vous pouvez vous censurer par peur du jugement',
      'Vous avez du mal à structurer une offre claire',
    ],
    bestFormats: ['Posts narratifs LinkedIn', 'Threads X', 'Vidéos talking-head'],
    icons: [
      { name: 'Chris Williamson', handle: 'ChrisWillx', role: 'Le storyteller de Modern Wisdom', image: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d4f950bcf495c7dfb2_Williamson.webp' },
      { name: 'Casey Neistat', handle: 'CaseyNeistat', role: 'Le maître du vlog cinématique' },
      { name: 'Brené Brown', handle: 'BreneBrown', role: 'La voix de la vulnérabilité' },
    ],
    topics: [
      'Le jour où j\'ai failli tout abandonner (et ce qui m\'a fait rester)',
      'Ce que personne ne dit sur [votre métier] - mon expérience après X ans',
      'J\'ai fait cette erreur pendant 2 ans. Voici ce que ça m\'a coûté.',
      'La conversation qui a changé ma carrière (et la leçon derrière)',
      'Pourquoi j\'ai dit non à [opportunité évidente]. Et pourquoi c\'était la meilleure décision.',
      '3 choses que je ferais différemment si je recommençais à zéro',
      'Mon pire client. Ce que j\'ai appris.',
      'Le conseil qu\'on m\'a donné à 25 ans et que je n\'ai compris qu\'à [votre âge]',
      'Mes revenus mois par mois, année 1. Sans filtre.',
      'Ce que je fais chaque lundi matin qui a tout changé dans mes résultats',
    ],
    diagnostics: {
      fear: 'Vous diluez votre message pour ne froisser personne. Résultat : vous ne touchez personne non plus. Votre archétype Storyteller a besoin de vulnérabilité pour fonctionner - c\'est votre force, pas votre faiblesse.',
      no_traction: 'Vous avez la matière mais pas le format. Un Storyteller qui poste des listes de tips perd sa force. Vos posts doivent commencer par un moment vécu, pas par un chiffre.',
      no_idea: 'Vous pensez qu\'il faut être expert pour publier. Faux. Un Storyteller n\'enseigne pas - il raconte. Vous avez déjà la matière : vos échecs, vos décisions, vos doutes. 1 post = 1 moment vécu + 1 leçon.',
      no_time: 'Vous croyez que raconter prend plus de temps qu\'enseigner. C\'est l\'inverse. Une histoire vécue s\'écrit en 15 min parce que vous la connaissez déjà. Le problème c\'est pas le temps, c\'est que vous cherchez la perfection.',
      no_money: 'Vous touchez les gens mais vous ne leur proposez rien. Votre audience est émotionnellement investie - c\'est de l\'or. Il vous manque un CTA et un tunnel derrière chaque post.',
    },
    plan30: [
      { week: 1, title: 'Fondations', tasks: [
        'Lister 10 moments-clés de votre parcours (échecs, victoires, tournants)',
        'Poster 3 fois : histoire courte + leçon (LinkedIn ou X)',
        'Mettre en place 1 lead magnet simple (PDF "mes 5 erreurs" ou newsletter)',
      ]},
      { week: 2, title: 'Rythme', tasks: [
        'Poster 5 fois (alterner histoire courte / histoire longue)',
        'Ajouter un CTA en fin de chaque post (newsletter, DM, lien)',
        'Mesurer : quel post a eu le plus de saves/partages ?',
      ]},
      { week: 3, title: 'Conversion', tasks: [
        'Écrire votre premier post "vulnérable" (celui qui fait peur)',
        'Répondre à TOUS les commentaires en DM ("Merci, vous faites quoi ?")',
        'Envoyer votre première newsletter à votre liste email',
      ]},
      { week: 4, title: 'Système', tasks: [
        'Automatiser la republication multi-canal (1 post = LinkedIn + X + newsletter)',
        'Identifier vos 3 "posts piliers" (ceux qui ont le mieux marché) et les recycler',
        'Booker 3 appels avec les leads les plus engagés',
      ]},
    ],
    accentClass: 'from-cyan-300 via-sky-400 to-blue-500',
  },
  builder: {
    id: 'builder',
    name: 'Le Builder',
    emoji: '🏗️',
    tagline: 'Vous documentez ce que vous construisez — votre meilleur marketing.',
    description:
      "Vous n'avez pas envie de poser, vous avez envie de bâtir. Et la bonne nouvelle : votre process, vos essais-erreurs, vos wins, tout ça est du contenu en or. Le « build in public » est votre terrain naturel.",
    strengths: [
      'Crédibilité instantanée (vous prouvez ce que vous faites)',
      'Audience qualifiée business',
      'Vous attirez des partenaires et clients sans pitcher',
    ],
    watchOuts: [
      'Vous sous-évaluez la mise en scène',
      "Vous publiez en mode 'logbook' au lieu de raconter",
    ],
    bestFormats: ['Build in public X/LinkedIn', 'Newsletter avec metrics', 'Lives produit'],
    icons: [
      { name: 'Matt Gray', handle: 'matt_gray_', role: 'Le builder systèmes', image: 'https://yt3.googleusercontent.com/W_GKaSoEuny3REkdSVW-AD6wcB_z5Ltr3hY_Mos94yDKlFLupVnJ6Gf8w1YfjEGps2nr62fB=s800-c-k-c0x00ffffff-no-rj' },
      { name: 'Pieter Levels', handle: 'levelsio', role: 'Le solopreneur culte' },
      { name: 'Naval Ravikant', handle: 'naval', role: "Le philosophe-entrepreneur" },
    ],
    topics: [
      'J\'ai lancé [projet] il y a X mois. Voici mes vrais chiffres.',
      'Ce que j\'ai dépensé vs ce que j\'ai gagné - mois par mois, sans filtre.',
      'La feature que personne n\'a demandée mais qui a tout changé.',
      'J\'ai automatisé [process]. Voici le before/after en temps et en €.',
      'Mon stack technique complet pour [résultat]. Outil par outil.',
      'L\'erreur à 10k€ que j\'ai faite et comment l\'éviter.',
      'Semaine 12 : ce qui marche, ce qui marche pas, ce que je change.',
      'Comment je suis passé de 0 à [chiffre] sans pub (process exact).',
      'Les 3 outils qui me font gagner 10h/semaine.',
      'Mon process pour transformer 1 idée en 7 contenus en 45 min.',
    ],
    diagnostics: {
      no_time: 'Vous documentez tout dans votre tête mais vous ne publiez rien. Un Builder qui ne publie pas est invisible. La solution : 15 min le lundi pour écrire vos 3 chiffres de la semaine. C\'est tout.',
      no_traction: 'Vous publiez des updates mais personne ne s\'accroche. Pourquoi ? Parce que vous documentez sans structure. Pas de hook, pas de leçon, pas de CTA. Ajoutez "Ce que j\'ai appris" à chaque post et ça change tout.',
      no_idea: 'Vous pensez que documenter c\'est ennuyeux. Faux. Les gens adorent les coulisses - surtout les vrais chiffres. Chaque décision business est un post. Chaque milestone est un thread.',
      fear: 'Vous avez peur de montrer vos chiffres. Normal. Mais les Builders qui partagent leurs vrais chiffres (même modestes) gagnent plus de confiance que ceux qui se cachent derrière du contenu générique.',
      no_money: 'Vous avez la crédibilité mais pas le tunnel. Chaque post "build in public" devrait pointer vers une newsletter, un template, ou un appel. Sans ça, votre audience applaudit et va acheter ailleurs.',
    },
    plan30: [
      { week: 1, title: 'Fondations', tasks: [
        'Lister 10 milestones de votre business (lancements, chiffres, pivots)',
        'Poster 3 fois : 1 chiffre + 1 leçon + 1 prochaine étape',
        'Créer une newsletter "Behind the scenes" (même si 0 abonné)',
      ]},
      { week: 2, title: 'Rythme', tasks: [
        'Poster 5 fois (alterner milestone / process / outil)',
        'Partager un vrai screenshot ou chiffre dans chaque post',
        'Ajouter un CTA newsletter ou DM sous chaque post',
      ]},
      { week: 3, title: 'Conversion', tasks: [
        'Publier votre "process post" complet (étape par étape, outils, temps)',
        'Répondre aux commentaires par DM avec une question ("Vous bossez sur quoi ?")',
        'Créer un lead magnet (template, checklist, ou notion dupliqué)',
      ]},
      { week: 4, title: 'Système', tasks: [
        'Automatiser la diffusion multi-canal (1 post = LinkedIn + X + newsletter)',
        'Recycler vos 3 meilleurs posts en formats différents (carrousel, short, thread)',
        'Identifier vos leads les plus engagés et booker 3 appels',
      ]},
    ],
    accentClass: 'from-empire via-emerald-400 to-empire',
  },
  educator: {
    id: 'educator',
    name: "L'Éducateur",
    emoji: '🎓',
    tagline: 'Vous rendez simple ce que les autres rendent compliqué.',
    description:
      "Vous avez une expertise réelle et une envie sincère de transmettre. Votre arme : transformer du savoir dense en formats limpides. Avec le bon système, vous devenez la référence de votre sujet en 12 mois.",
    strengths: [
      'Trafic SEO + recommandations naturelles',
      "Crédibilité d'expert facile à monétiser",
      'Audience prête à acheter formations / consulting',
    ],
    watchOuts: [
      "Vous pouvez tomber dans le 'je liste 10 trucs' générique",
      "Vous sous-monétisez parce que vous donnez trop avant d'oser proposer",
    ],
    bestFormats: ['Carrousels LinkedIn', 'YouTube long-format', 'Threads pédagogiques'],
    icons: [
      { name: 'Alex Hormozi', handle: 'AlexHormozi', role: 'Le pragmatique des frameworks', image: 'https://yt3.googleusercontent.com/29XFUn3pc3cC81yUUCFiyCKKdgi856IGMJ4EZBnf53zTfrWWUGvmYnYGx86K08f4XR03UxpWyw=s900-c-k-c0x00ffffff-no-rj' },
      { name: 'Ali Abdaal', handle: 'aliabdaal', role: 'Le pédagogue moderne', image: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d436f96370e8ccb7c4_Abdaal.webp' },
      { name: 'Justin Welsh', handle: 'thejustinwelsh', role: 'Le solopreneur teacher' },
    ],
    topics: [
      'Le framework en 3 étapes que j\'utilise pour [résultat concret]',
      'Tout le monde fait [erreur commune]. Voici pourquoi c\'est faux.',
      'J\'ai testé 7 méthodes pour [objectif]. Une seule marche.',
      'Le guide complet pour [sujet] - de débutant à avancé en 1 post.',
      '[Concept complexe] expliqué comme à un débutant total.',
      'Les 5 mythes sur [votre domaine] qui vous coûtent de l\'argent.',
      'Comment j\'ai aidé [type de client] à passer de [avant] à [après].',
      'La checklist que j\'aurais aimé avoir quand j\'ai commencé [activité].',
      'Pourquoi 90% des gens échouent à [objectif] (et le fix en 3 points).',
      'Le système exact que j\'utilise pour [résultat] en [temps] par semaine.',
    ],
    diagnostics: {
      no_idea: 'Vous savez beaucoup de choses mais vous ne savez pas par où commencer. Normal. Un Éducateur doit identifier ses 7 piliers d\'abord - après, chaque pilier vous donne 10+ sujets. Le problème c\'est pas le manque d\'idées, c\'est le manque de structure.',
      no_traction: 'Vous publiez du contenu éducatif mais c\'est trop générique. "5 tips pour..." c\'est du bruit. Ce qui marche : UN framework propriétaire, bien nommé, que les gens associent à vous.',
      no_money: 'Vous donnez trop de valeur gratuite sans jamais vendre. Votre audience pense que tout est gratos. La règle : 80% éducation, 20% pitch. Et chaque post éducatif doit pointer vers votre newsletter ou votre offre.',
      no_time: 'Vous passez 3h sur un carrousel pour 47 likes. Le problème c\'est pas le temps, c\'est l\'absence de système. 1 vidéo de 30 min = 7 carrousels + 14 posts + 3 shorts. Automatisez la déclinaison.',
      fear: 'Vous avez peur qu\'on vous dise "vous n\'êtes pas légitime". Personne ne l\'est à 100%. Mais vous en savez plus que 95% de votre audience - et c\'est suffisant. Publiez ce que vous savez, pas ce que vous ne savez pas.',
    },
    plan30: [
      { week: 1, title: 'Fondations', tasks: [
        'Identifier vos 7 piliers d\'expertise (les 7 sous-sujets que vous maîtrisez)',
        'Poster 3 fois : 1 framework + 1 mythe détruit + 1 checklist',
        'Créer une newsletter hebdo (même si 0 abonné)',
      ]},
      { week: 2, title: 'Rythme', tasks: [
        'Poster 5 fois (alterner carrousel / thread / post court)',
        'Nommer votre framework principal (un nom propriétaire que les gens retiennent)',
        'Ajouter un CTA lead magnet sous chaque post',
      ]},
      { week: 3, title: 'Conversion', tasks: [
        'Créer votre lead magnet signature (checklist, template, mini-cours gratuit)',
        'Répondre à chaque commentaire par DM ("Vous voulez que je vous aide sur [sujet] ?")',
        'Publier 1 post "offre" clair (ce que vous proposez, pour qui, à quel prix)',
      ]},
      { week: 4, title: 'Système', tasks: [
        'Enregistrer 1 vidéo de 30 min et la décliner en 7+ contenus',
        'Automatiser la publication multi-canal',
        'Booker 3 appels avec les leads qui ont téléchargé votre lead magnet',
      ]},
    ],
    accentClass: 'from-amber-200 via-autopilot to-amber-300',
  },
  provocateur: {
    id: 'provocateur',
    name: 'Le Provocateur',
    emoji: '⚡',
    tagline: 'Vous prenez position quand les autres se taisent.',
    description:
      "Vous n'avez pas peur de déranger et c'est votre plus gros levier. Une opinion forte bien formulée bat 10 posts consensuels. Le risque : confondre provoc gratuite et prise de position argumentée.",
    strengths: [
      'Reach naturel élevé (l\'algo adore le débat)',
      'Vous attirez une tribu fidèle qui vous défend',
      "Vous vous positionnez 'top of mind' sur votre sujet",
    ],
    watchOuts: [
      'Bad buzz si pas de fond derrière la forme',
      "Difficulté à scaler en B2B sans softener",
    ],
    bestFormats: ['Hot takes X', 'Posts opinion LinkedIn', 'Podcasts en interview'],
    icons: [
      { name: 'Grant Cardone', handle: 'GrantCardone', role: 'Le motivateur 10X', image: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4295dabe20aff6b9885_Cardone.webp' },
      { name: 'Gary Vaynerchuk', handle: 'garyvee', role: 'Le hustler prolifique' },
      { name: 'Chris Williamson', handle: 'ChrisWillx', role: 'Le penseur tranchant' },
    ],
    topics: [
      'Unpopular opinion : [croyance de votre secteur] est complètement fausse.',
      'Tout le monde fait [pratique commune]. C\'est pour ça que tout le monde galère.',
      'J\'ai arrêté de [chose que tout le monde fait]. Résultats en 30 jours.',
      'Le mensonge que les "experts" de [votre domaine] ne veulent pas que vous sachiez.',
      '3 "bonnes pratiques" de [secteur] qui sont en fait des pièges.',
      'Pourquoi les gens qui réussissent dans [domaine] font exactement l\'inverse.',
      'J\'ai dit [opinion forte] en public. Voici ce qui s\'est passé.',
      'Le problème avec [tendance populaire] que personne n\'ose pointer.',
      'Si vous faites encore [erreur commune] en 2026, vous méritez de galérer.',
      'La vérité sur [sujet controversé] - chiffres à l\'appui.',
    ],
    diagnostics: {
      no_traction: 'Vous provoquez mais personne ne réagit. Pourquoi ? Parce que vous donnez une opinion sans preuve. Un Provocateur sans data c\'est un troll. Ajoutez des chiffres, un exemple vécu, un screenshot - et votre provoc devient une thèse.',
      no_time: 'Vous pensez qu\'il faut 1h pour écrire un hot take. Non. 3 phrases + 1 opinion forte = 5 min. Le problème c\'est que vous voulez que ce soit parfait. Les meilleurs provocs sont bruts, pas polis.',
      fear: 'Vous avez peur du backlash. Bonne nouvelle : le backlash C\'EST le reach. L\'algo récompense le débat. Tant que votre opinion est argumentée (pas gratuite), le "hate" vous rend visible.',
      no_idea: 'Vous ne savez pas sur quoi prendre position. Commencez par lister 5 trucs qui vous énervent dans votre secteur. 5 croyances que vous trouvez fausses. 5 pratiques que vous trouvez absurdes. Chacune = 1 post.',
      no_money: 'Vous faites du bruit mais vos DMs sont vides. Parce que vous ne proposez rien après le buzz. Chaque post viral doit avoir un CTA (newsletter, DM, appel). Sinon votre portée s\'évapore en 24h.',
    },
    plan30: [
      { week: 1, title: 'Fondations', tasks: [
        'Lister 10 opinions fortes / contrarian sur votre secteur',
        'Poster 3 hot takes : opinion + preuve + "change my mind"',
        'Créer un lead magnet provocateur ("Les 5 mensonges de [secteur]")',
      ]},
      { week: 2, title: 'Rythme', tasks: [
        'Poster 1x/jour minimum (court, punchy, 3-5 phrases)',
        'Tester 3 formats : question polémique / mythe détruit / "je suis le seul à penser que"',
        'Répondre à CHAQUE hater avec des faits (ça alimente l\'algo)',
      ]},
      { week: 3, title: 'Conversion', tasks: [
        'Publier 1 post storytelling ("J\'ai dit X en public. Voici ce qui s\'est passé.")',
        'DM chaque personne qui commente "tellement vrai" ("Vous vivez ça aussi ? Racontez.")',
        'Envoyer votre première newsletter avec vos 3 meilleurs posts de la semaine',
      ]},
      { week: 4, title: 'Système', tasks: [
        'Automatiser : 1 post LinkedIn = auto-repost X + newsletter + short',
        'Recycler vos 3 posts les plus viraux en vidéo / carrousel / thread',
        'Booker 3 appels avec les leads les plus engagés de vos DMs',
      ]},
    ],
    accentClass: 'from-rose-500 via-orange-500 to-amber-400',
  },
}

// ─── Questions ────────────────────────────────────────────────────────────────

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'persona',
    step: 1,
    kicker: 'Étape 1 / 10',
    question: 'Pour bien vous orienter, vous êtes plutôt :',
    options: [
      { id: 'coach', label: 'Coach, consultant ou prestataire de service', emoji: '🎯' },
      { id: 'founder', label: 'Founder ou CEO (PME, agence, SaaS)', emoji: '🏗️', archetype: { builder: 1 } },
      { id: 'solo', label: 'Solopreneur ou freelance', emoji: '🚀' },
      { id: 'employee', label: 'Salarié qui veut se lancer / personal brand', emoji: '💼' },
      { id: 'creator', label: 'Créateur de contenu déjà actif', emoji: '🎙️' },
    ],
  },
  {
    id: 'situation',
    step: 2,
    kicker: 'Étape 2 / 10',
    question: 'Soyons honnête. Sur le contenu, vous êtes plutôt :',
    options: [
      { id: 'zero', label: 'Je publie zéro - je sais que je devrais', emoji: '😶' },
      { id: 'sometimes', label: 'Je publie de temps en temps, sans système', emoji: '🌿', archetype: { storyteller: 1 } },
      { id: 'regular_no_convert', label: 'Je publie régulièrement mais ça ne convertit pas', emoji: '📉', archetype: { educator: 1 } },
      { id: 'works_scaling', label: 'Je publie + ça marche, mais je veux scaler', emoji: '🔥', archetype: { builder: 1 } },
      { id: 'system_optimize', label: "J'ai un système qui tourne, je cherche à optimiser", emoji: '⚙️', archetype: { builder: 2 } },
    ],
  },
  {
    id: 'inspiration',
    step: 3,
    kicker: 'Étape 3 / 10',
    question: 'Quand vous suivez quelqu\'un, ce qui vous attire le plus c\'est :',
    helper: 'Pensez aux 2-3 personnes que vous suivez vraiment.',
    options: [
      { id: 'story', label: 'Ses histoires, son parcours, sa vulnérabilité', emoji: '🎙️', archetype: { storyteller: 3 } },
      { id: 'process', label: 'Ses chiffres, ses process, ses behind-the-scenes', emoji: '🏗️', archetype: { builder: 3 } },
      { id: 'frameworks', label: 'Ses frameworks, ses tutos, son expertise pédagogique', emoji: '🎓', archetype: { educator: 3 } },
      { id: 'opinions', label: 'Ses opinions tranchées, ses prises de position fortes', emoji: '⚡', archetype: { provocateur: 3 } },
    ],
  },
  {
    id: 'writing',
    step: 4,
    kicker: 'Étape 4 / 10',
    question: 'Quand vous écrivez (mail, message, post), vous êtes plutôt :',
    options: [
      { id: 'narrative', label: 'Narratif - je raconte, je donne du contexte, je partage le ressenti', emoji: '📖', archetype: { storyteller: 3 } },
      { id: 'factual', label: 'Factuel - je documente les faits, les chiffres, les étapes', emoji: '📊', archetype: { builder: 3 } },
      { id: 'pedagogic', label: 'Pédagogique - je structure, je fais comprendre, j\'explique', emoji: '🧠', archetype: { educator: 3 } },
      { id: 'punchy', label: 'Direct - je vais droit au but, sans détour, parfois cash', emoji: '⚡', archetype: { provocateur: 3 } },
    ],
  },
  {
    id: 'angle',
    step: 5,
    kicker: 'Étape 5 / 10',
    question: 'Si vous deviez publier UN post demain, votre angle serait :',
    options: [
      { id: 'experience', label: 'Une expérience vécue qui a marqué votre parcours', emoji: '🎙️', archetype: { storyteller: 3 } },
      { id: 'data', label: 'Un chiffre, un résultat, ou une métrique de votre business', emoji: '📈', archetype: { builder: 3 } },
      { id: 'method', label: 'Une méthode ou un framework que vous maîtrisez', emoji: '🎓', archetype: { educator: 3 } },
      { id: 'take', label: 'Une opinion forte que personne n\'ose dire dans votre secteur', emoji: '🔥', archetype: { provocateur: 3 } },
    ],
  },
  {
    id: 'business',
    step: 6,
    kicker: 'Étape 6 / 10',
    question: 'Aujourd\'hui, votre business génère environ :',
    helper: 'Pour calibrer un plan d\'action réaliste pour vous.',
    options: [
      { id: 'pre_revenue', label: 'Pas encore de CA récurrent', emoji: '🌱' },
      { id: 'lt5k', label: '0 à 5k€/mois', emoji: '🌿' },
      { id: '5_20k', label: '5 à 20k€/mois', emoji: '💵' },
      { id: '20_50k', label: '20 à 50k€/mois', emoji: '💰' },
      { id: 'gt50k', label: 'Plus de 50k€/mois', emoji: '👑' },
    ],
  },
  {
    id: 'inaction_cost',
    step: 7,
    kicker: 'Étape 7 / 10',
    question: 'Combien vous coûte aujourd\'hui ne PAS avoir un système de contenu qui convertit ?',
    helper: 'Soyez honnête - c\'est ça qui révèle si on peut vraiment vous aider.',
    options: [
      { id: 'never_thought', label: "Je n'y avais pas pensé", emoji: '🤷' },
      { id: 'few', label: 'Quelques opportunités manquées', emoji: '😕' },
      { id: 'thousands', label: 'Plusieurs milliers d\'€ par mois en clients perdus', emoji: '😬' },
      { id: 'ten_plus', label: 'Probablement 10k+/mois en CA non capté', emoji: '🔥' },
      { id: 'biggest', label: "C'est ma plus grosse perte business actuelle", emoji: '🚨' },
    ],
  },
  {
    id: 'frustration',
    step: 8,
    kicker: 'Étape 8 / 10',
    question: 'Votre plus grosse frustration sur le contenu actuellement :',
    options: [
      { id: 'no_time', label: 'Je n\'ai pas le temps de produire régulièrement', emoji: '⏳' },
      { id: 'no_idea', label: 'Je ne sais pas quoi dire qui ait de la valeur', emoji: '🤔', archetype: { educator: 1 } },
      { id: 'no_traction', label: 'Je publie mais ça stagne, ça ne décolle pas', emoji: '📉' },
      { id: 'no_convert', label: 'J\'ai des likes mais zéro lead qualifié', emoji: '👻', archetype: { builder: 1 } },
      { id: 'no_focus', label: 'Je m\'éparpille - je ne sais pas quoi prioriser', emoji: '🌪️' },
      { id: 'fear', label: 'Peur du jugement, peur de me dévoiler', emoji: '😨', archetype: { storyteller: 1 } },
    ],
  },
  {
    id: 'budget',
    step: 9,
    kicker: 'Étape 9 / 10',
    question: 'Pour investir dans votre croissance business :',
    helper: "Ça nous permet de vous proposer la bonne solution sans vous faire perdre du temps.",
    options: [
      { id: 'high_decider', label: 'Je décide seul, j\'ai déjà investi 5k€+ dans des programmes', emoji: '🚀' },
      { id: 'mid_decider', label: 'Je décide seul, budget jusqu\'à 5k€ ce trimestre', emoji: '💰' },
      { id: 'low_test', label: 'Je décide seul, mais je préfère tester petit (<1k€)', emoji: '💵' },
      { id: 'need_partner', label: "Je dois en parler à un associé ou partenaire", emoji: '🤝' },
      { id: 'not_yet', label: "Je n'investis pas tant que je ne suis pas convaincu", emoji: '🚧' },
    ],
  },
  {
    id: 'timing',
    step: 10,
    kicker: 'Étape 10 / 10',
    question: 'Quand voulez-vous que ça change ?',
    options: [
      { id: 'now', label: 'Maintenant - prêt à agir cette semaine', emoji: '🔥' },
      { id: 'month', label: 'Dans le mois - je veux pas perdre encore 30 jours', emoji: '⚡' },
      { id: 'quarter', label: 'Dans le trimestre - je m\'organise', emoji: '📅' },
      { id: 'six_months', label: 'Dans 6-12 mois - je prépare le terrain', emoji: '🛤️' },
      { id: 'no_pressure', label: 'Pas de pression - je découvre', emoji: '☁️' },
    ],
  },
]

// ─── Encouraging messages between questions (Timeleft style) ─────────────────

/**
 * Tiny celebratory chip shown briefly at the top of certain questions to
 * reduce abandonment in the middle of the quiz.
 */
export const STEP_MESSAGES: Record<number, { emoji: string; text: string }> = {
  4: { emoji: '👏', text: 'Bien joué, on apprend à vous connaître !' },
  6: { emoji: '💪', text: 'À mi-parcours, vous tenez le rythme' },
  9: { emoji: '⚡', text: 'Dernière ligne droite !' },
}

export const TOTAL_QUESTIONS = QUESTIONS.length
