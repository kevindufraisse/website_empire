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
  { name: 'Zahra Chikhi', role: 'Bootcamp Empire', id: '6enMZWOKymdE002xEeJTQ00uTgwUN1x75NiCxYSjgJLls', time: 5 },
  { name: 'Léa Marie Lecordier', role: 'Première promotion du bootcamp', id: 'DlhRBPUoRM2dQWaNSaFJlNlzrPjkpQtVdh1S4GaPYbs', time: 5 },
  { name: 'Amélie Faligot', role: 'Bootcamp Empire', id: '8fzR9Inuae1s3l4Z3NTt01OwiJktsvSUGuE5Lx78L9dI', time: 5 },
  { name: 'Sébastien Min', role: 'Bootcamp Empire', id: 'ujvVeDFFJ3MaZm8bsHDd1dfDOZ5KgVm1GXXB7NSamOg', time: 10 },
  { name: 'Marc Dufraisse', role: 'Programme partenaire · Frère de Kevin', id: 'nxgu0275x00yQe01pECaRLhBs02L6udvY4RiEOblhBSsOdc', time: 10 },
]

export default function AcademyPage() {
  return (
    <main lang="fr">
      <section className="pb-6 pt-20 text-center md:pb-8 md:pt-24">
        <div className="container">
        <p className="mb-5 text-xs font-semibold tracking-widest text-empire">SUR SÉLECTION UNIQUEMENT — 10 PLACES PAR MOIS</p>
        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">Vise 3 000 €+ par mois avec 6h d’accompagnement par semaine en devenant Head of Content.</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-neutral-300">On t'apprend la viralité et le système Empire gratuitement pour générer des millions de vues pour des entrepreneurs (avocats, médecins, dirigeants) et encaisser des récurrences tous les mois.</p>
        <div className="mx-auto mt-7 max-w-sm"><a href="#candidature" className={CTA_PRIMARY}>Candidater maintenant</a></div>
        <p className="mt-3 text-sm text-neutral-400">Formation 100% offerte. Sélection sur dossier. Réponse sous 48h sur WhatsApp.</p>
        </div>
      </section>
      <section className="container py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['3 000 €+ / mois', 'Objectif de CA avec 6 clients ou plus. Scénario de 6h d’accompagnement par semaine grâce au système Empire.'],
            ['+26 %', 'Croissance prévue des budgets publicitaires créateurs aux États-Unis en 2025 (IAB).'],
            ['44 Milliards $', 'Dépenses publicitaires prévues dans la Creator Economy américaine en 2026 (IAB).'],
          ].map(([number, label]) => <div key={number} className="rounded-xl border border-white/10 bg-[#111] p-6 text-center"><strong className="text-3xl font-bold text-empire">{number}</strong><p className="mt-3 text-sm leading-relaxed text-neutral-300">{label}</p></div>)}
        </div>
        <a href="https://www.iab.com/insights/2025-Creator-economy-ad-spend-strategy-report/" target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-xs text-neutral-400 underline">Source : IAB · Creator Economy Ad Spend &amp; Strategy Report</a>
        <figure className="mx-auto mt-8 max-w-[430px]">
          <Image src="/academy/hormozi-head-of-content.png" alt="Annonce originale d’Alex Hormozi : Head of Content, 150 000 à 300 000 dollars plus performance" width={1290} height={2796} priority className="h-auto w-full rounded-xl object-contain" sizes="(max-width: 480px) 100vw, 430px" />
          <figcaption className="mt-3 text-center text-sm text-neutral-300">Même Alex Hormozi recrute ce profil : son annonce affiche 150 000 à 300 000 $ + performance.</figcaption>
        </figure>
      </section>
      <ApplicationModal />
      <section className="container py-8 md:py-10" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">Ils ont rejoint le programme</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(person => (
            <figure key={person.id}>
              <video controls playsInline preload="none" className="aspect-video w-full rounded-xl border border-white/10 bg-[#111] object-contain" aria-label={`Témoignage de ${person.name}`} poster={`https://image.mux.com/${person.id}/thumbnail.jpg?time=${person.time}`} src={`https://stream.mux.com/${person.id}/medium.mp4`} />
              <figcaption className="mt-3"><strong className="block text-sm font-semibold text-white">{person.name}</strong><span className="mt-1 block text-xs text-neutral-400">{person.role}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { name: 'Evelyne', text: 'En seulement 21 jours, j’ai franchi le cap des 100 000 vues et des 1 050 abonnés.' },
            { name: 'Tristan', text: 'J’ai démarré il y a 50 jours et je suis à près d’1 million d’impressions.' },
            { name: 'Caroline', text: 'Mon premier succès : 18K d’impressions. Le maximum jusqu’à présent était 2K !' },
          ].map(person => <figure key={person.name} className="rounded-xl border border-white/10 bg-[#111] p-5"><blockquote className="text-sm leading-relaxed text-neutral-200">« {person.text} »</blockquote><figcaption className="mt-5 text-sm font-semibold text-white">{person.name}<span className="mt-1 block text-xs font-normal text-neutral-400">Participant au bootcamp Empire</span></figcaption></figure>)}
        </div>


      </section>
    </main>
  )
}
