import type { Metadata } from 'next'
import ComparePage, { type CompareRow } from '@/components/sections/compare/ComparePage'

export const metadata: Metadata = {
  title: 'Alternative à MagicPost : Empire vs MagicPost (comparatif 2026)',
  description:
    'MagicPost écrit tes posts LinkedIn. Empire te dit quoi publier, écrit, monte tes reels et publie sur 7 réseaux, avec des formats testés sur le compte de Kevin Dufraisse. Comparatif complet.',
  alternates: { canonical: '/alternative-magicpost' },
  openGraph: {
    title: 'Empire vs MagicPost',
    description: 'LinkedIn seul ou les 7 réseaux, en écrit et en vidéo : le comparatif.',
  },
}

// Faits MagicPost relevés sur magicpost.in/pricing le 4 octobre 2026.
const ROWS: CompareRow[] = [
  { label: 'Réseaux', empire: '7 réseaux : LinkedIn, Instagram, TikTok, YouTube, Facebook, X, Threads', other: 'LinkedIn uniquement' },
  { label: 'Reels et vidéos montés (accroche, sous-titres)', empire: true, other: false },
  { label: 'Formats vidéo qui font des vues (réaction, classement, citation, questions…)', empire: true, other: false },
  { label: 'Posts LinkedIn écrits', empire: 'Oui, à partir de ta voix (vidéo, dictée, notes)', other: 'Oui, générateur IA' },
  { label: 'Carrousels et visuels', empire: true, other: true },
  { label: 'Newsletters', empire: true, other: false },
  { label: 'Idées de sujets', empire: 'Chaque semaine, depuis ta veille, tes notes et ce qui marche', other: 'Bibliothèque de 2M+ posts, générateur d’idées' },
  { label: 'Publication programmée', empire: 'Sur les 7 réseaux', other: 'Sur LinkedIn' },
  { label: 'Suivi des clics et des leads jusqu’à la vente', empire: 'Liens trackés, Tally, Cal.com, Systeme.io', other: 'Détection de leads dans les interactions LinkedIn' },
  { label: 'Live avec l’équipe chaque semaine', empire: 'Oui (plans Growth et Scale)', other: false },
  { label: 'Prix', empire: '199 à 799 €/mois, ou à la consommation dès 25 €', other: '49 à 69 $/mois (29 à 39 $/mois en annuel)' },
]

export default function AlternativeMagicPostPage() {
  return (
    <ComparePage
      competitor="MagicPost"
      verdict="MagicPost t'aide à écrire tes posts LinkedIn. Empire te dit quoi publier, écrit, monte tes reels et publie sur 7 réseaux, avec des formats testés d'abord sur le compte de son fondateur."
      chooseOther={[
        'Tu ne publies que sur LinkedIn, en texte et carrousels.',
        'Tu veux écrire toi-même, avec une IA pour t’aider.',
        'Ton budget est d’environ 50 $ par mois.',
      ]}
      chooseEmpire={[
        'Tu veux être visible partout : LinkedIn, Instagram, TikTok, YouTube…',
        'Tu veux des vidéos montées, pas seulement du texte.',
        'Tu ne veux ni écrire ni monter : tu filmes ou tu dictes quelques minutes.',
        'Tu veux une méthode qui a fait ses preuves, pas un générateur.',
      ]}
      rows={ROWS}
      sourceUrl="https://magicpost.in/pricing"
      checkedOn="4 octobre 2026"
      faq={[
        {
          q: 'Empire remplace-t-il MagicPost ?',
          a: 'Pour la partie LinkedIn, oui : Empire écrit tes posts, tes carrousels et les publie. Il ajoute ce que MagicPost ne fait pas : les vidéos montées, les newsletters et la publication sur les 6 autres réseaux.',
        },
        {
          q: 'Je ne publie que sur LinkedIn. Empire est-il utile ?',
          a: 'Oui si tu veux aussi de la vidéo sur LinkedIn ou ne plus écrire toi-même. Si tu veux seulement un assistant d’écriture pour des posts texte, un outil comme MagicPost suffit et coûte moins cher.',
        },
        {
          q: 'Faut-il se filmer ?',
          a: 'Non. Tu peux dicter une note vocale, envoyer tes idées sur Telegram ou partir d’une actu : Empire en fait un post illustré, sans tournage. Se filmer quelques minutes ouvre simplement plus de formats.',
        },
        {
          q: 'Combien ça coûte ?',
          a: 'De 199 € à 799 € par mois selon ton rythme de publication (tous les 2 jours, tous les jours, 2 fois par jour), ou à la consommation dès 25 €. Résiliable en un clic.',
        },
      ]}
    />
  )
}
