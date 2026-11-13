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
    <main lang="fr" className="bg-[#f7f7f2] text-neutral-950">
      <section className="pt-20 md:pt-24">
        <div className="container">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <p className="mb-5 text-xs font-semibold leading-relaxed text-neutral-600">SUR SÉLECTION UNIQUEMENT — 10 PLACES PAR MOIS</p>
              <p className="mb-3 text-sm font-semibold text-neutral-600">Empire Academy · Deviens Head of Content</p>
              <h1 className="max-w-2xl text-[34px] font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-5xl">Génère <span className="whitespace-nowrap">3 000 €</span> par mois en <span className="decoration-empire decoration-[6px] underline underline-offset-4">6 heures</span> d’accompagnement par semaine.</h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700 sm:text-lg">On t'apprend la viralité et le système Empire gratuitement pour générer des millions de vues pour des entrepreneurs (avocats, médecins, dirigeants) et encaisser des récurrences tous les mois.</p>
              <div className="mt-6 max-w-sm"><a href="#candidature" className={CTA_PRIMARY}>Candidater maintenant</a></div>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-neutral-600">Formation 100% offerte. Sélection sur dossier. Réponse sous 48h sur WhatsApp.</p>
            </div>
            <div>
              <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:gap-4">
                {[testimonials[2], testimonials[3], testimonials[0], testimonials[1]].map((person, index) => (
                  <a href="#testimonials-title" key={person.id} className={`group min-w-0 ${index % 2 ? 'lg:translate-y-6' : ''}`} aria-label={`Découvrir le témoignage de ${person.name}`}>
                    {/* Real students, from the same recordings shown below. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://image.mux.com/${person.id}/thumbnail.jpg?time=${person.time}&width=600`} alt={person.name} width={480} height={600} className={`aspect-[4/5] w-full rounded-xl bg-neutral-200 object-cover transition-opacity group-hover:opacity-90 lg:aspect-square lg:rounded-2xl ${index === 0 ? 'object-[30%_center]' : 'object-center'}`} />
                    <span className="mt-2 block truncate text-xs font-semibold lg:text-sm">{person.name.split(' ')[0]}</span>
                  </a>
                ))}
              </div>
              <a href="#testimonials-title" className="mt-4 inline-block text-xs text-neutral-600 underline underline-offset-4 lg:mt-10">Les visages du Bootcamp Empire</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="container">
          <div className="grid items-center gap-8 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8 lg:grid-cols-[1fr_380px] lg:gap-16 lg:p-12">
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-500">Le marché</p>
              <h2 className="mb-8 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">Un métier au cœur de la Creator Economy</h2>
              <div className="divide-y divide-neutral-200">
                {[
                  ['3 000 €+ / mois', 'Objectif de CA avec 6 clients ou plus. Scénario de 6h d’accompagnement par semaine grâce au système Empire.'],
                  ['+26 %', 'Croissance prévue des budgets publicitaires créateurs aux États-Unis en 2025 (IAB).'],
                  ['44 Milliards $', 'Dépenses publicitaires prévues dans la Creator Economy américaine en 2026 (IAB).'],
                ].map(([number, label]) => <div key={number} className="py-5 first:pt-0"><strong className="text-3xl font-semibold tracking-tight">{number}</strong><p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">{label}</p></div>)}
              </div>
              <a href="https://www.iab.com/insights/2025-Creator-economy-ad-spend-strategy-report/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs leading-relaxed text-neutral-500 underline underline-offset-4">Source : IAB · Creator Economy Ad Spend &amp; Strategy Report</a>
            </div>
            <figure className="mx-auto w-full max-w-[380px]">
              <div className="relative rounded-[44px] border-[3px] border-neutral-400 bg-neutral-950 px-2 pb-4 pt-8 shadow-xl">
                <div aria-hidden="true" className="absolute left-1/2 top-3 h-3 w-20 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
                <span aria-hidden="true" className="absolute -left-[5px] top-28 h-12 w-[3px] rounded-l bg-neutral-400" />
                <span aria-hidden="true" className="absolute -right-[5px] top-36 h-16 w-[3px] rounded-r bg-neutral-400" />
              <Image src="/academy/hormozi-head-of-content.png" alt="Annonce originale d’Alex Hormozi : Head of Content, 150 000 à 300 000 dollars plus performance" width={1290} height={2796} priority className="h-auto w-full rounded-xl object-contain" sizes="(max-width: 480px) 85vw, 380px" />
              </div>
              <figcaption className="mt-3 text-sm leading-relaxed text-neutral-600">Même Alex Hormozi recrute ce profil : son annonce affiche 150 000 à 300 000 $ + performance.</figcaption>
            </figure>
          </div>
          <div className="mt-6 grid gap-6 rounded-2xl bg-[#eaf0d5] p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <p className="text-sm font-semibold text-neutral-600">Le travail change</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">92 millions</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">d’emplois pourraient être supprimés d’ici 2030, et 170 millions créés, sous l’effet des grandes transformations économiques et technologiques.</p>
              <a className="mt-3 inline-block text-xs text-neutral-600 underline underline-offset-4" href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noopener noreferrer">Projection mondiale · World Economic Forum, 2025</a>
            </div>
            <div>
              <h3 className="text-2xl font-bold leading-tight sm:text-3xl">L’IA produit. Tu pilotes.</h3>
              <p className="mt-4 text-base leading-relaxed text-neutral-700">Comprendre un entrepreneur, choisir ses angles, porter sa voix et décider quoi publier : c’est le rôle du Head of Content. Avec Empire, tu apprends à utiliser l’IA et à garder la main sur la stratégie, la relation client et les décisions éditoriales.</p>
              <div className="mt-6 max-w-sm"><a href="#candidature" className={CTA_PRIMARY}>Candidater maintenant</a></div>
            </div>
          </div>
        </div>
      </section>

      <ApplicationModal />
      <section className="border-t border-neutral-200 bg-white pb-12 pt-8 md:pb-16 md:pt-12" aria-labelledby="testimonials-title">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div><p className="mb-3 text-sm font-semibold text-neutral-500">Bootcamp &amp; Academy</p><h2 id="testimonials-title" className="scroll-mt-24 text-3xl font-bold sm:text-4xl">Ils ont rejoint le programme</h2></div>
            <a href="#candidature" className={`${CTA_PRIMARY} !h-auto !w-auto`}>Candidater maintenant</a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(person => (
              <figure key={person.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-[#f7f7f2]">
                <video controls playsInline preload="none" className="aspect-video w-full bg-neutral-950 object-contain" aria-label={`Témoignage de ${person.name}`} poster={`https://image.mux.com/${person.id}/thumbnail.jpg?time=${person.time}`} src={`https://stream.mux.com/${person.id}/medium.mp4`} />
                <figcaption className="p-5"><strong className="block text-base font-semibold">{person.name}</strong><span className="mt-1 block text-sm text-neutral-600">{person.role}</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { name: 'Evelyne', text: 'En seulement 21 jours, j’ai franchi le cap des 100 000 vues et des 1 050 abonnés.' },
              { name: 'Tristan', text: 'J’ai démarré il y a 50 jours et je suis à près d’1 million d’impressions.' },
              { name: 'Caroline', text: 'Mon premier succès : 18K d’impressions. Le maximum jusqu’à présent était 2K !' },
            ].map(person => <figure key={person.name} className="flex flex-col justify-between rounded-2xl bg-[#f7f7f2] p-6"><blockquote className="text-base leading-relaxed text-neutral-800">« {person.text} »</blockquote><figcaption className="mt-6 text-sm font-semibold">{person.name}<span className="mt-1 block text-xs font-normal text-neutral-600">Participant au bootcamp Empire</span></figcaption></figure>)}
          </div>
          <div className="mt-10 border-t border-neutral-200 pt-8 text-center">
            <p className="text-2xl font-semibold">À toi de rejoindre le programme.</p>
            <div className="mx-auto mt-5 max-w-sm"><a href="#candidature" className={CTA_PRIMARY}>Candidater maintenant</a></div>
            <p className="mt-3 text-xs text-neutral-600">Formation offerte · 10 places par mois · Réponse sous 48h</p>
          </div>
        </div>
      </section>
    </main>
  )
}
