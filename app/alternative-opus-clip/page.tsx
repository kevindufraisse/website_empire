import type { Metadata } from 'next'
import ComparePage from '@/components/sections/compare/ComparePage'

export const metadata: Metadata = {
  title: 'Alternative à Opus Clip : Empire vs Opus Clip (comparatif 2026)',
  description:
    'Opus Clip découpe une vidéo longue que tu as déjà. Empire te dit quoi dire, te donne le format qui se regarde, écrit et publie sur 7 réseaux. Comparatif terme par terme.',
  alternates: { canonical: '/alternative-opus-clip' },
  openGraph: { title: 'Empire vs Opus Clip', description: 'Message × Format × Diffusion : le comparatif terme par terme.' },
}

// Faits Opus Clip relevés sur opus.pro/pricing le 4 octobre 2026.
export default function AlternativeOpusClipPage() {
  return (
    <ComparePage
      slug="alternative-opus-clip"
      competitor="Opus Clip"
      verdict="Opus Clip découpe une vidéo longue que tu as déjà en extraits courts. Empire commence avant : il te dit quoi dire, te donne le format qui se regarde, écrit, monte et publie sur 7 réseaux."
      rows={[
        { term: 'message', other: 'Rien en amont : il te faut déjà une vidéo longue (podcast, webinar, live). L’IA y cherche les meilleurs passages.' },
        { term: 'format', other: 'Extraits verticaux d’une vidéo longue, sous-titrés, avec un score de viralité. Pas de posts écrits ni de newsletters.' },
        { term: 'diffusion', other: 'Programmation sur YouTube Shorts, TikTok, Instagram, LinkedIn, Facebook et X à partir du plan Pro.' },
        { term: 'time', other: 'Il faut tourner la vidéo longue avant, puis trier et retoucher les extraits.' },
        { term: 'cost', other: 'Gratuit à 29 $/mois ; offre Business sur devis.' },
        { term: 'visibility', other: 'Statistiques des extraits sur l’offre Business. Aucun suivi des leads annoncé.' },
      ]}
      chooseOther={[
        'Tu tournes déjà une vidéo longue chaque semaine (podcast, live, webinar).',
        'Tu veux seulement en tirer des extraits courts.',
        'Tu n’as pas besoin de posts écrits ni de newsletters.',
      ]}
      chooseEmpire={[
        'Tu n’as pas de vidéo longue à découper : tu veux savoir quoi dire.',
        'Tu veux des formats pensés pour les réseaux, pas des morceaux d’une autre vidéo.',
        'Tu veux aussi des posts LinkedIn, des carrousels et des newsletters.',
        'Tu veux savoir quel contenu t’a ramené quel client.',
      ]}
      sourceUrl="https://www.opus.pro/pricing"
      checkedOn="4 octobre 2026"
      faq={[
        { q: 'Empire découpe-t-il aussi mes vidéos longues ?', a: 'Oui. Une interview ou une vidéo longue enregistrée dans Empire est découpée en reels, et donne aussi des posts écrits et des newsletters. Mais la plupart des clients partent de formats courts faits pour les réseaux.' },
        { q: 'Je fais déjà un podcast. Lequel choisir ?', a: 'Si tu veux seulement en tirer des extraits, Opus Clip suffit. Si tu veux aussi publier entre deux épisodes, avec des formats qui font des vues et du texte, Empire couvre les deux.' },
        { q: 'Faut-il se filmer ?', a: 'Non. Une note vocale ou texte sur Telegram, une actu de ta veille : Empire en fait un post illustré, sans tournage.' },
        { q: 'D’où viennent les formats ?', a: 'Du compte de Kevin Dufraisse. Chaque format est testé chez lui avant d’arriver dans l’app, et continue de l’être.' },
      ]}
    />
  )
}
