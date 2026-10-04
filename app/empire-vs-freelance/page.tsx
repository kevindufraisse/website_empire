import type { Metadata } from 'next'
import ComparePage from '@/components/sections/compare/ComparePage'

export const metadata: Metadata = {
  title: 'Empire vs freelances : ghostwriter, monteur, community manager (comparatif 2026)',
  description:
    'Un ghostwriter, un monteur et un community manager coûtent 5 000 €+ par mois et attendent ton brief. Empire te donne le message, le format et la diffusion pour 20 minutes à 1 heure par semaine.',
  alternates: { canonical: '/empire-vs-freelance' },
  openGraph: { title: 'Empire vs des freelances', description: 'Message × Format × Diffusion : le comparatif terme par terme.' },
}

export default function EmpireVsFreelancePage() {
  return (
    <ComparePage
      slug="empire-vs-freelance"
      competitor="des freelances"
      title="Empire vs des freelances"
      verdict="Un ghostwriter, un monteur et un community manager font le travail, mais c'est toi qui trouves les sujets, qui briefes et qui coordonnes. Empire fait les trois métiers, avec une méthode qui a fait ses preuves."
      rows={[
        { term: 'message', other: 'Le freelance attend ton brief : c’est toi qui trouves les sujets chaque semaine.' },
        { term: 'format', other: 'Selon l’expérience de chacun : le monteur fait la vidéo, le ghostwriter l’écrit. Rien ne garantit que le format a déjà marché.' },
        { term: 'diffusion', other: 'Un community manager en plus pour publier sur chaque réseau.' },
        { term: 'time', other: 'Environ 5 heures par semaine à briefer, relire et relancer.' },
        { term: 'cost', other: 'Monteur + rédacteur + community manager : 5 000 €+ par mois.' },
        { term: 'visibility', other: 'Tu sais combien de vues, rarement quel client est venu de quel contenu.' },
      ]}
      chooseOther={[
        'Tu veux une personne dédiée, avec une direction créative sur mesure.',
        'Ton budget contenu dépasse 5 000 € par mois.',
        'Tu as le temps de briefer et de coordonner chaque semaine.',
      ]}
      chooseEmpire={[
        'Tu ne veux plus chercher quoi dire ni briefer personne.',
        'Tu veux les trois métiers pour le prix d’un seul.',
        'Tu veux des formats qui ont déjà marché, pas des essais.',
        'Tu veux savoir quel contenu t’a ramené quel client.',
      ]}
      sourceNote="Coûts des freelances : estimation pour un monteur, un rédacteur et un community manager à temps partiel en France."
      faq={[
        { q: 'Est-ce qu’il y a des humains chez Empire ?', a: 'Oui : une équipe qui monte, relit et anime un live chaque semaine. Mais c’est l’app qui te donne les sujets et prépare tout : tu n’as personne à briefer.' },
        { q: 'Je travaille déjà avec un monteur. Empire sert à quoi ?', a: 'À lui donner quoi monter et à faire le reste : les sujets, les formats, l’écrit et la diffusion sur 7 réseaux. Beaucoup gardent leur monteur pour les vidéos longues.' },
        { q: 'Est-ce que ça sonne comme moi ?', a: 'Oui, parce que ça part de toi : ta voix, ta vidéo ou ta note. Empire ne remplace pas ta parole, il la met en forme.' },
        { q: 'D’où viennent les formats ?', a: 'Du compte de Kevin Dufraisse. Chaque format est testé chez lui avant d’arriver dans l’app, et continue de l’être.' },
      ]}
    />
  )
}
