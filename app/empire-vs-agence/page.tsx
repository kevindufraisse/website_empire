import type { Metadata } from 'next'
import ComparePage from '@/components/sections/compare/ComparePage'

export const metadata: Metadata = {
  title: 'Empire vs agence social media ou personal branding (comparatif 2026)',
  description:
    'Une agence coûte souvent plusieurs milliers d’euros par mois, avec engagement et allers-retours. Empire te donne le message, le format et la diffusion sur 7 réseaux, sans engagement.',
  alternates: { canonical: '/empire-vs-agence' },
  openGraph: { title: 'Empire vs une agence', description: 'Message × Format × Diffusion : le comparatif terme par terme.' },
}

export default function EmpireVsAgencePage() {
  return (
    <ComparePage
      slug="empire-vs-agence"
      competitor="une agence"
      title="Empire vs une agence"
      verdict="Une agence prend tout en charge, mais coûte cher, t'engage sur la durée et passe par des briefs et des validations. Empire fait le même travail sur ta propre voix, résiliable en un clic."
      rows={[
        { term: 'message', other: 'Des réunions de brief et de validation pour fixer les sujets du mois.' },
        { term: 'format', other: 'Les formats définis par l’agence, selon son expérience.' },
        { term: 'diffusion', other: 'Les réseaux prévus au contrat.' },
        { term: 'time', other: 'Briefs, validations et allers-retours chaque semaine.' },
        { term: 'cost', other: 'Souvent 3 000 à 15 000 € par mois, avec un engagement de plusieurs mois.' },
        { term: 'visibility', other: 'Un rapport de statistiques mensuel ; le lien entre un contenu et un client est rarement suivi.' },
      ]}
      chooseOther={[
        'Tu veux déléguer entièrement, y compris la stratégie de marque.',
        'Tu veux du contenu de marque sans visage, où tu ne parles pas.',
        'Ton budget dépasse plusieurs milliers d’euros par mois.',
      ]}
      chooseEmpire={[
        'Tu veux que ce soit ta voix et ton visage, pas ceux d’une agence.',
        'Tu veux publier tous les jours sans réunions de validation.',
        'Tu veux arrêter quand tu veux, sans engagement.',
        'Tu es toi-même une agence : Empire gère tes clients et les fait filmer à distance.',
      ]}
      sourceNote="Prix des agences : fourchette constatée pour un accompagnement social media ou personal branding en France ; chaque agence fixe ses tarifs."
      faq={[
        { q: 'Je suis une agence. Empire peut-il m’aider ?', a: 'Oui : un espace par client, les crédits payés par l’agence, et un lien pour faire filmer ton client à distance. Chaque contenu part sur les comptes de ton client.' },
        { q: 'Est-ce qu’il y a des humains chez Empire ?', a: 'Oui : une équipe qui monte, relit et anime un live chaque semaine. Mais c’est l’app qui te donne les sujets : pas de réunion de brief.' },
        { q: 'Y a-t-il un engagement ?', a: 'Non. Mensuel, résiliable en un clic. Le trimestriel et l’annuel existent pour payer moins cher, pas pour te retenir.' },
        { q: 'D’où viennent les formats ?', a: 'Du compte de Kevin Dufraisse. Chaque format est testé chez lui avant d’arriver dans l’app, et continue de l’être.' },
      ]}
    />
  )
}
