import type { Metadata } from 'next'
import ComparePage from '@/components/sections/compare/ComparePage'

export const metadata: Metadata = {
  title: 'Empire vs ChatGPT pour créer son contenu (comparatif 2026)',
  description:
    'ChatGPT écrit ce que tu lui demandes. Empire te dit quoi dire, te donne le format qui se regarde, monte et publie sur 7 réseaux, et suit les leads jusqu’au client.',
  alternates: { canonical: '/empire-vs-chatgpt' },
  openGraph: { title: 'Empire vs ChatGPT', description: 'Message × Format × Diffusion : le comparatif terme par terme.' },
}

export default function EmpireVsChatGptPage() {
  return (
    <ComparePage
      slug="empire-vs-chatgpt"
      competitor="ChatGPT"
      verdict="ChatGPT écrit ce que tu lui demandes. Tout le reste, c'est toi : trouver le sujet, monter la vidéo, publier réseau par réseau. Empire fait la chaîne entière, avec une méthode qui a fait ses preuves."
      rows={[
        { term: 'message', other: 'Il répond à ton prompt : il ne connaît ni ta veille, ni tes notes, ni ce qui fait des vues cette semaine dans ta niche.' },
        { term: 'format', other: 'Du texte. La vidéo, le montage et les sous-titres, c’est toi, avec un autre outil.' },
        { term: 'diffusion', other: 'Tu copies, tu colles et tu publies toi-même, réseau par réseau.' },
        { term: 'time', other: 'Plusieurs heures par semaine entre l’écriture, le montage et la publication.' },
        { term: 'cost', other: 'Environ 20 $/mois pour ChatGPT Plus, plus ton temps et un outil de montage.' },
        { term: 'visibility', other: 'Aucun suivi : tu ne sais pas quel contenu t’a ramené un client.' },
      ]}
      chooseOther={[
        'Tu publies peu et tu as le temps de tout faire toi-même.',
        'Tu sais déjà quoi dire et comment le formater.',
        'Ton budget contenu est proche de zéro.',
      ]}
      chooseEmpire={[
        'Tu veux publier tous les jours sans y passer tes soirées.',
        'Tu veux des vidéos montées, pas seulement du texte.',
        'Tu veux une méthode, pas une page blanche.',
        'Tu veux savoir quel contenu t’a ramené quel client.',
      ]}
      sourceNote="Prix public de ChatGPT Plus (20 $/mois) au 4 octobre 2026."
      faq={[
        { q: 'Empire utilise-t-il de l’IA ?', a: 'Oui, mais elle part de toi : ta voix, ta vidéo, tes notes et ton positionnement, avec des formats testés sur un vrai compte. Le résultat ne ressemble pas à un texte d’IA générique.' },
        { q: 'Est-ce que ça sonne comme moi ?', a: 'Oui, parce que ça part de ta parole. Empire ne t’invente pas d’avis : il met en forme ce que tu dis.' },
        { q: 'Faut-il se filmer ?', a: 'Non. Une note vocale ou texte sur Telegram, une actu de ta veille : Empire en fait un post illustré, sans tournage.' },
        { q: 'D’où viennent les formats ?', a: 'Du compte de Kevin Dufraisse. Chaque format est testé chez lui avant d’arriver dans l’app, et continue de l’être.' },
      ]}
    />
  )
}
