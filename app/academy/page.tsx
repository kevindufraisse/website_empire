import type { Metadata } from 'next'
import Image from 'next/image'
import { CTA_PRIMARY } from '@/components/ui/cta'
import ApplicationModal from './ApplicationModal'
import styles from './academy.module.css'

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
    <main lang="fr" className={styles.page}>
      <section className="container academy-hero">
        <div>
          <p className="mb-4 text-sm font-semibold text-empire">Formation gratuite · Sur sélection · 10 places par mois</p>
          <h1 className="text-[30px] font-extrabold leading-[1.15] sm:text-4xl md:text-5xl">Deviens Head of Content.<br /><span className="text-empire">Fais de la visibilité ton métier.</span></h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-300">Apprends la viralité et utilise Empire pour créer les contenus d’entrepreneurs. Développe ta propre activité en les accompagnant chaque mois.</p>
          <div className="academy-numbers">
            <div><strong className="block text-2xl text-empire">3 000 €+/mois</strong><span className="text-sm text-neutral-300">Vise plus de 3 000 € de CA mensuel.</span></div>
            <div><strong className="block text-2xl text-empire">+26 %</strong><span className="text-sm text-neutral-300">Croissance prévue des budgets publicitaires créateurs aux USA en 2025 (IAB).</span></div>
            <div><strong className="block text-2xl text-empire">150–300 k$</strong><span className="text-sm text-neutral-300">+ performance : l’annonce d’Hormozi.</span></div>
          </div>
          <div className="max-w-[320px]"><a href="#candidature" className={CTA_PRIMARY}>Candidater</a></div>
          <p className="mt-3 text-xs text-neutral-400">L’équipe te contacte sous 48 h si ton profil est retenu.</p>
          <details className="mt-4 text-xs leading-relaxed text-neutral-400"><summary className="cursor-pointer underline underline-offset-4">Sources et repères</summary><p className="mt-2">Plus de 3 000 € par mois est un objectif de chiffre d’affaires avant charges et frais, sans garantie de clients ni de revenu. Par exemple, 7 clients à 500 € représentent 3 500 € de CA mensuel. Le temps dépend des missions, de la prospection et de la gestion.</p><p className="mt-2"><a href="https://www.iab.com/insights/2025-Creator-economy-ad-spend-strategy-report/" target="_blank" rel="noopener noreferrer" className="underline">IAB, Creator Economy Ad Spend &amp; Strategy Report 2025</a> : +26 % de dépenses publicitaires prévues dans la creator economy américaine en 2025, à 37 milliards de dollars. Ce chiffre mesure les budgets publicitaires, pas les recherches d’emploi ni les recrutements de Head of Content.</p><p className="mt-2">Hormozi : montant affiché dans la story et le formulaire transmis, pour un poste exigeant à temps plein, sans activité parallèle. Date limite affichée : 9 novembre. Exemple de recrutement, sans partenariat avec Empire ni promesse de salaire à l’issue de la formation.</p></details>
        </div>
        <figure className="academy-proof">
          <a href="/academy/hormozi-head-of-content.png" target="_blank" rel="noopener noreferrer" aria-label="Ouvrir la story complète d’Alex Hormozi"><Image src="/academy/hormozi-head-of-content.png" alt="Alex Hormozi recrute un Head of Content, rémunération annoncée de 150 à 300 k$ plus performance" width={1290} height={2796} priority className="academy-portrait" sizes="(min-width: 700px) 360px, 100vw" /></a>
          <figcaption className="mt-2 text-center text-xs text-neutral-400">Story d’Alex Hormozi · Cliquer pour agrandir</figcaption>
        </figure>
      </section>
      <ApplicationModal />
      <section className="container py-8 md:py-10" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">Ils se sont formés avec Empire.</h2>
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
        <p className="mt-4 text-center text-xs text-neutral-500">Retours sur les programmes Empire. Résultats individuels, sans garantie de résultats similaires.</p>
        <div className="mx-auto mt-7 max-w-[320px]"><a href="#candidature" className={CTA_PRIMARY}>Candidater à la formation gratuite</a></div>
      </section>
    </main>
  )
}
