import type { Metadata } from 'next'
import ComparePage, { type FormulaRow } from '@/components/sections/compare/ComparePage'

export const metadata: Metadata = {
  title: 'Alternative à MagicPost : Empire vs MagicPost (comparatif 2026)',
  description:
    'MagicPost t’aide à écrire des posts LinkedIn. Empire te donne le message, le format qui se regarde et la diffusion sur 7 réseaux, pour 20 minutes à 1 heure par semaine. Comparatif terme par terme.',
  alternates: { canonical: '/alternative-magicpost' },
  openGraph: {
    title: 'Empire vs MagicPost',
    description: 'Message × Format × Diffusion : le comparatif terme par terme.',
  },
}

// Faits MagicPost relevés sur magicpost.in/pricing le 4 octobre 2026.
const ROWS: FormulaRow[] = [
  {
    term: 'message',
    empire: 'Tes sujets sont prêts chaque semaine : tes notes Telegram, la veille de tes concurrents, les sujets qui font des vues dans ta niche, croisés avec ton positionnement. Tu cliques.',
    other: 'Une bibliothèque de 2M+ posts LinkedIn et un générateur d’idées et d’accroches. Tu cherches ton sujet, puis tu écris.',
  },
  {
    term: 'format',
    empire: 'Ton sujet entre dans un format qui se regarde, testé sur le compte de Kevin : réaction à un reel, classement, devine, pour ou contre, citation, questions, actu illustrée, vidéo longue, reel cloné à ton image, carrousel, newsletter.',
    other: 'Post texte, carrousel et visuel IA. Pas de vidéo.',
  },
  {
    term: 'diffusion',
    empire: 'Une idée devient 10+ contenus publiés sur 7 réseaux (LinkedIn, Instagram, TikTok, YouTube, Facebook, X, Threads). Ce qui a marché est republié automatiquement. Plusieurs comptes ? Tu crées une fois, ça part partout.',
    other: 'LinkedIn uniquement.',
  },
  {
    term: 'time',
    empire: '20 minutes à 1 heure par semaine : tu filmes ou tu dictes, on écrit, on monte, on sous-titre et on publie.',
    other: 'Tu écris ou ajustes chaque post toi-même avec l’IA, puis tu le programmes.',
  },
  {
    term: 'cost',
    empire: '199 à 799 €/mois selon ton rythme (tous les 2 jours à 2 fois par jour), ou à la consommation dès 25 €. Une équipe monteur + rédacteur + community manager coûte 5 000 €+/mois.',
    other: '49 à 69 $/mois (29 à 39 $/mois en annuel), pour LinkedIn seul.',
  },
  {
    term: 'visibility',
    empire: 'Liens trackés du reel au rendez-vous (Tally, Cal.com, Systeme.io), commentaires et DM de tous tes réseaux dans une seule boîte, et chaque semaine ce qui a marché, format par format.',
    other: 'Statistiques LinkedIn et détection de leads dans les interactions LinkedIn.',
  },
]

export default function AlternativeMagicPostPage() {
  return (
    <ComparePage
      competitor="MagicPost"
      verdict="MagicPost t'aide à écrire des posts LinkedIn. Empire te donne le bon message, le format qui se regarde et la diffusion sur 7 réseaux, pour 20 minutes à 1 heure par semaine."
      rows={ROWS}
      chooseOther={[
        'Tu ne publies que sur LinkedIn, en texte et en carrousels.',
        'Tu aimes écrire toi-même et tu veux une IA pour t’aider.',
        'Ton budget est d’environ 50 $ par mois.',
      ]}
      chooseEmpire={[
        'Tu veux être visible partout, pas seulement sur LinkedIn.',
        'Tu veux des vidéos dans les formats qui font des vues.',
        'Tu ne veux ni chercher quoi dire, ni écrire, ni monter.',
        'Tu veux savoir quel contenu t’a ramené quel client.',
      ]}
      sourceUrl="https://magicpost.in/pricing"
      checkedOn="4 octobre 2026"
      faq={[
        {
          q: 'Empire remplace-t-il MagicPost ?',
          a: 'Pour LinkedIn, oui : Empire te donne les sujets, écrit tes posts et tes carrousels, et les publie. Il ajoute ce que MagicPost ne fait pas : les formats vidéo, les newsletters, la diffusion sur les 6 autres réseaux et le suivi des leads jusqu’au rendez-vous.',
        },
        {
          q: 'Je ne publie que sur LinkedIn. Empire est-il utile ?',
          a: 'Oui si tu veux de la vidéo sur LinkedIn ou ne plus écrire toi-même. Si tu veux seulement un assistant d’écriture pour des posts texte, un outil comme MagicPost suffit et coûte moins cher.',
        },
        {
          q: 'Faut-il se filmer ?',
          a: 'Non. Une note vocale ou texte sur Telegram, une actu de ta veille : Empire en fait un post illustré, sans tournage. Se filmer quelques minutes ouvre simplement plus de formats.',
        },
        {
          q: 'D’où viennent les formats ?',
          a: 'Du compte de Kevin Dufraisse. Chaque format est testé chez lui avant d’arriver dans l’app, et continue de l’être. Tu ne testes pas à l’aveugle : tu pars de ce qui marche déjà.',
        },
      ]}
    />
  )
}
