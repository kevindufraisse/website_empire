import type { Metadata } from 'next'
import { CTA_PRIMARY } from '@/components/ui/cta'
import ApplicationForm from './ApplicationForm'

export const metadata: Metadata = {
  title: 'Deviens Head of Content | Empire Academy',
  description: 'Apprends la viralité et le système Empire pour accompagner des entrepreneurs. Formation gratuite sur sélection. 10 places par mois.',
  alternates: { canonical: 'https://www.empire-internet.com/academy' },
}

// Only the existing bootcamp and partner testimonials. Software customers are
// not presented as Academy students. Keep Marc’s relationship disclosed.
const testimonials = [
  { name: 'Amélie Faligot', role: 'Bootcamp Empire', id: '8fzR9Inuae1s3l4Z3NTt01OwiJktsvSUGuE5Lx78L9dI', time: 5 },
  { name: 'Sébastien Min', role: 'Bootcamp Empire', id: 'ujvVeDFFJ3MaZm8bsHDd1dfDOZ5KgVm1GXXB7NSamOg', time: 10 },
  { name: 'Marc Dufraisse', role: 'Programme partenaire · Frère de Kevin', id: 'nxgu0275x00yQe01pECaRLhBs02L6udvY4RiEOblhBSsOdc', time: 10 },
]

export default function AcademyPage() {
  return (
    <main lang="fr">
      <section className="relative border-b border-white/10 bg-gradient-to-b from-black to-[#0f0f0f] pb-8 pt-20 md:pb-10 md:pt-24">
        <div className="container grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="lg:pt-6">
            <p className="mb-4 inline-flex rounded-full border border-empire/40 bg-empire/10 px-4 py-1.5 text-xs font-bold text-empire">Formation gratuite · 10 places par mois</p>
            <h1 className="text-[27px] font-extrabold leading-[1.15] min-[380px]:text-3xl sm:text-4xl md:text-5xl">Deviens Head of Content.<br /><span className="text-empire">Vise 3 000 €/mois.</span></h1>
            <p className="mt-4 text-xl font-semibold leading-snug text-neutral-300">Avec environ 6 h d’accompagnement par semaine.</p>
            <p className="mt-5 text-base leading-relaxed text-neutral-300">Apprends la viralité et utilise le système Empire pour développer la visibilité d’entrepreneurs.</p>
            <div className="mt-6 max-w-[320px]"><a href="#candidature" className={CTA_PRIMARY}>Candidater</a></div>
            <details className="mt-5 max-w-lg text-xs leading-relaxed text-neutral-400">
              <summary className="cursor-pointer py-2 underline decoration-white/25 underline-offset-4">Le calcul : 6 clients à 500 €/mois</summary>
              <p className="mt-2">Objectif de chiffre d’affaires avant charges et frais. Environ 4 h d’accompagnement par client et par mois, soit 24 h sur 4 semaines. Formation, prospection et gestion viennent en plus. Les résultats et le temps réel varient selon les missions.</p>
            </details>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-[#111] p-6 lg:mt-6">
            <h2 className="text-2xl font-bold">Deviens le Head of Content d’entrepreneurs.</h2>
            <p className="mt-4 leading-relaxed text-neutral-300">Ils ont une expertise, une entreprise à faire tourner et peu de temps pour créer du contenu. Tu les aides à transformer ce qu’ils savent en contenus qui attirent l’attention.</p>
            <p className="mt-4 leading-relaxed text-neutral-300">Ton rôle : définir les sujets, préparer les contenus et piloter leur diffusion avec Empire. Tu développes ta propre activité et factures ton accompagnement chaque mois.</p>
          </div>
        </div>
      </section>
      <section className="container py-10 md:py-14">
        <h2 className="text-2xl font-bold md:text-3xl">La viralité s’apprend. Le métier aussi.</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-neutral-300">Tu n’as pas besoin de savoir trouver les bons sujets aujourd’hui. C’est précisément ce que tu viens apprendre.</p>
        <div className="mt-7 grid gap-6 md:grid-cols-3">
          {[
            ['Comprendre ce qui fait des vues', 'Repérer les sujets, construire une accroche et choisir un format qui donne envie de regarder, de lire et de partager.'],
            ['Maîtriser le système Empire', 'Utiliser Empire pour préparer, créer et diffuser les contenus des entrepreneurs que tu accompagnes.'],
            ['Construire ton activité', 'Définir ton accompagnement, proposer tes services et organiser le travail avec tes clients pour en faire une activité récurrente.'],
          ].map(([title, text]) => <div key={title} className="rounded-[20px] border border-white/10 bg-[#111] p-6"><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-300">{text}</p></div>)}
        </div>
      </section>
      <section className="container grid items-start gap-8 border-t border-white/10 py-10 md:py-14 lg:grid-cols-2 lg:gap-12">
        <div className="lg:pt-6">
          <h2 className="text-2xl font-bold md:text-3xl">10 profils retenus par mois.</h2>
          <p className="mt-4 leading-relaxed text-neutral-300">La formation est gratuite pour les candidats sélectionnés. Nous cherchons des personnes prêtes à pratiquer, à apprendre et à construire une activité au service d’entrepreneurs.</p>
          <p className="mt-4 leading-relaxed text-neutral-300">Ton expérience compte, mais aussi ton regard sur le contenu, ton projet et le temps que tu peux y consacrer. Tes réponses nous permettent de comprendre où tu en es.</p>
          <p className="mt-4 leading-relaxed text-neutral-300">Présente ta candidature. Si ton profil est retenu, l’équipe te contacte sous 48 heures. Tu pourras aussi découvrir les portes ouvertes après l’envoi.</p>
        </div>
        <ApplicationForm />
      </section>
      <section className="container py-8 md:py-10" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">Leurs retours sur nos programmes</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map(person => (
            <figure key={person.id}>
              <video controls playsInline preload="none" className="aspect-video w-full rounded-xl border border-white/10 bg-[#111] object-contain" aria-label={`Témoignage de ${person.name}`} poster={`https://image.mux.com/${person.id}/thumbnail.jpg?time=${person.time}`} src={`https://stream.mux.com/${person.id}/medium.mp4`} />
              <figcaption className="mt-3"><strong className="block text-sm font-semibold text-white">{person.name}</strong><span className="mt-1 block text-xs text-neutral-400">{person.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
