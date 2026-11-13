import type { Metadata } from 'next'
import Image from 'next/image'
import { CTA_PRIMARY } from '@/components/ui/cta'
import ApplicationModal from './ApplicationModal'

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
      <section className="container grid items-center gap-8 pb-8 pt-24 lg:grid-cols-[1fr_280px] lg:gap-12">
        <div>
          <p className="mb-4 text-sm font-semibold text-empire">Formation gratuite · Sur sélection · 10 places par mois</p>
          <h1 className="text-[30px] font-extrabold leading-[1.15] sm:text-4xl md:text-5xl">Deviens Head of Content.<br /><span className="text-empire">Fais de la visibilité ton métier.</span></h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-300">Apprends la viralité et utilise Empire pour créer les contenus d’entrepreneurs. Développe ta propre activité en les accompagnant chaque mois.</p>
          <div className="my-6 grid gap-4 sm:grid-cols-3">
            <div><strong className="block text-2xl text-empire">3 000 €/mois</strong><span className="text-sm text-neutral-300">Objectif de CA : 6 clients à 500 €.</span></div>
            <div><strong className="block text-2xl text-empire">41 000 €/an</strong><span className="text-sm text-neutral-300">Salaire brut moyen du Brand Content Manager en France.</span></div>
            <div><strong className="block text-2xl text-empire">150–300 k$</strong><span className="text-sm text-neutral-300">+ performance : l’annonce d’Hormozi.</span></div>
          </div>
          <div className="max-w-[320px]"><a href="#candidature" className={CTA_PRIMARY}>Candidater</a></div>
          <p className="mt-3 text-xs text-neutral-400">L’équipe te contacte sous 48 h si ton profil est retenu.</p>
          <details className="mt-4 text-xs leading-relaxed text-neutral-400"><summary className="cursor-pointer underline underline-offset-4">Sources et repères de rémunération</summary><p className="mt-2">3 000 € est un scénario de chiffre d’affaires avant charges et frais, sans garantie de clients ni de revenu. Le temps dépend des missions, de la prospection et de la gestion.</p><p className="mt-2"><a href="https://www.apec.fr/tous-nos-metiers/communication-creation/brand-content-manager.html" target="_blank" rel="noopener noreferrer" className="underline">Apec, consultée le 13 novembre 2026</a> : 41 000 € brut/an en moyenne, fixe et variable compris, pour le Brand Content Manager, métier voisin. Ce n’est pas une moyenne spécifique aux Head of Content.</p><p className="mt-2">Hormozi : montant affiché dans la story et le formulaire transmis, pour un poste exigeant à temps plein, sans activité parallèle. Date limite affichée : 9 novembre. Exemple de recrutement, sans partenariat avec Empire ni promesse de salaire à l’issue de la formation.</p></details>
        </div>
        <figure className="mx-auto w-full max-w-[240px] lg:max-w-[280px]">
          <Image src="/academy/hormozi-head-of-content.png" alt="Alex Hormozi recrute un Head of Content, rémunération annoncée de 150 à 300 k$ plus performance" width={1290} height={2796} priority className="h-auto w-full rounded-xl border border-white/10" sizes="280px" />
          <figcaption className="mt-2 text-center text-xs text-neutral-400">Alex Hormozi recrute son Head of Content.</figcaption>
        </figure>
      </section>
      <ApplicationModal />
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
