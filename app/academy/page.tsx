import type { Metadata } from 'next'
import Image from 'next/image'
import { CTA_PRIMARY } from '@/components/ui/cta'
import ApplicationModal from './ApplicationModal'

export const metadata: Metadata = {
  title: 'Empire Academy · Admission sur dossier | Deviens Head of Content',
  description: 'Gagne six chiffres par an en pilotant le personal branding des entrepreneurs. Une vraie reconversion, admission sur dossier validé par Kevin et appel de qualification.',
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
    <main lang="fr" className="bg-[#080808] text-white">
      <section className="relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(var(--empire-rgb)/.12),transparent_70%)]" />
        <div className="container relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.16em] text-neutral-300">
                <span className="h-1.5 w-1.5 rounded-full bg-empire" />Empire Academy · Admission sur dossier
              </p>
              <h1 className="mt-6 max-w-2xl text-[38px] font-bold leading-[1.05] tracking-[-.035em] sm:text-6xl">
                Gagne <span className="text-empire">six chiffres</span> par an en pilotant l’image des entrepreneurs qui comptent.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                Head of Content, c’est le métier qui construit le personal branding des dirigeants, des avocats, des médecins et des fondateurs. Empire Academy en forme une poignée chaque mois. Une vraie reconversion, un vrai investissement, et un dossier que Kevin valide lui-même.
              </p>
              <div className="mt-8 max-w-sm"><a href="#candidature" className={CTA_PRIMARY}>Déposer ma candidature</a></div>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-neutral-500">10 places par mois · Dossier lu par Kevin · Appel de qualification</p>
            </div>
            <div>
              <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:gap-4">
                {[testimonials[2], testimonials[3], testimonials[0], testimonials[1]].map((person, index) => (
                  <a href="#testimonials-title" key={person.id} className={`group min-w-0 ${index % 2 ? 'lg:translate-y-6' : ''}`} aria-label={`Découvrir le témoignage de ${person.name}`}>
                    {/* Real students, from the same recordings shown below. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://image.mux.com/${person.id}/thumbnail.jpg?time=${person.time}&width=600`} alt={person.name} width={480} height={600} className={`aspect-[4/5] w-full rounded-xl bg-neutral-900 object-cover ring-1 ring-white/10 grayscale-[35%] transition group-hover:grayscale-0 lg:aspect-square lg:rounded-2xl ${index === 0 ? 'object-[30%_center]' : 'object-center'}`} />
                    <span className="mt-2 block truncate text-xs font-semibold text-neutral-300 lg:text-sm">{person.name.split(' ')[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_380px] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-neutral-500">Le métier</p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">150 000 à 300 000 $ par an. C’est ce que paie Alex Hormozi pour ce poste.</h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-300">
                Les entrepreneurs ont compris que leur image rapporte plus que leur publicité. Ils cherchent quelqu’un pour la porter : trouver leurs angles, écrire avec leur voix, décider de ce qui sort. L’IA produit. Le Head of Content dirige.
              </p>
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-white/10 pt-8">
                {[
                  ['44 Md $', 'Dépenses publicitaires prévues dans la Creator Economy américaine en 2026.'],
                  ['+26 %', 'Croissance prévue des budgets publicitaires créateurs aux États-Unis en 2025.'],
                ].map(([number, label]) => <div key={number}><strong className="text-3xl font-semibold tracking-tight sm:text-4xl">{number}</strong><p className="mt-2 text-sm leading-relaxed text-neutral-400">{label}</p></div>)}
              </div>
              <p className="mt-4 text-xs text-neutral-600">IAB · Creator Economy Ad Spend &amp; Strategy Report</p>
            </div>
            <figure className="mx-auto w-full max-w-[340px]">
              <div className="relative rounded-[44px] border-[3px] border-neutral-700 bg-neutral-950 px-2 pb-4 pt-8 shadow-[0_30px_80px_rgba(0,0,0,.6)]">
                <div aria-hidden="true" className="absolute left-1/2 top-3 h-3 w-20 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
                <Image src="/academy/hormozi-head-of-content.png" alt="Annonce originale d’Alex Hormozi : Head of Content, 150 000 à 300 000 dollars plus performance" width={1290} height={2796} className="h-auto w-full rounded-xl object-contain" sizes="(max-width: 480px) 85vw, 340px" />
              </div>
              <figcaption className="mt-3 text-center text-sm text-neutral-500">L’annonce originale d’Alex Hormozi.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-neutral-500">Sélection</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">L’Academy n’est pas pour tout le monde.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-empire/30 bg-empire/[.04] p-6 sm:p-8">
              <h3 className="text-lg font-semibold">Ta place est ici si</h3>
              <ul className="mt-5 space-y-4 text-[15px] leading-relaxed text-neutral-300">
                {['Tu veux changer de métier, pas trouver un revenu d’appoint.', 'Tu es prêt à investir dans ta formation, en temps comme en argent.', 'Tu sais écrire, parler ou filmer, et tu veux en vivre.', 'Tu veux travailler avec des dirigeants exigeants, et être à leur niveau.'].map(item => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-empire" />{item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-neutral-400">Passe ton chemin si</h3>
              <ul className="mt-5 space-y-4 text-[15px] leading-relaxed text-neutral-500">
                {['Tu cherches une formation gratuite ou une méthode miracle.', 'Tu ne peux pas bloquer de vraies heures chaque semaine.', 'Tu veux juste « voir ce que ça donne ».'].map(item => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600" />{item}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="mt-20 text-2xl font-bold tracking-tight sm:text-3xl">L’admission</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
            {[
              ['Ton dossier', 'Tu présentes ton parcours, ta situation et ce que tu veux construire. Environ 5 minutes.'],
              ['La lecture par Kevin', 'Kevin lit chaque dossier personnellement. Seuls les profils retenus sont recontactés.'],
              ['L’appel de qualification', 'On fait le point sur ton projet, ton investissement et ta date de démarrage. Puis on décide ensemble.'],
            ].map(([title, text], index) => <li key={title} className="border-t border-white/15 pt-5">
              <span className="text-sm font-semibold tabular-nums text-empire">0{index + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{text}</p>
            </li>)}
          </ol>
          <div className="mt-10 max-w-sm"><a href="#candidature" className={CTA_PRIMARY}>Déposer ma candidature</a></div>
        </div>
      </section>

      <ApplicationModal />
      <section className="border-t border-white/10 py-16 md:py-24" aria-labelledby="testimonials-title">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-neutral-500">Bootcamp &amp; Academy</p>
          <h2 id="testimonials-title" className="mt-4 scroll-mt-24 text-3xl font-bold tracking-tight sm:text-5xl">Ils sont passés par le programme.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(person => (
              <figure key={person.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]">
                <video controls playsInline preload="none" className="aspect-video w-full bg-black object-contain" aria-label={`Témoignage de ${person.name}`} poster={`https://image.mux.com/${person.id}/thumbnail.jpg?time=${person.time}`} src={`https://stream.mux.com/${person.id}/medium.mp4`} />
                <figcaption className="p-5"><strong className="block text-base font-semibold">{person.name}</strong><span className="mt-1 block text-sm text-neutral-400">{person.role}</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { name: 'Evelyne', photo: '/case-studies/evelyne-guitard.jpg', text: 'En seulement 21 jours, j’ai franchi le cap des 100 000 vues et des 1 050 abonnés.' },
              { name: 'Tristan', photo: '/case-studies/tristan-de-vasselot.jpg', text: 'J’ai démarré il y a 50 jours et je suis à près d’1 million d’impressions.' },
              { name: 'Caroline', photo: '/case-studies/caroline-blivet.jpg', text: 'Mon premier succès : 18K d’impressions. Le maximum jusqu’à présent était 2K !' },
            ].map(person => <figure key={person.name} className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[.03] p-6"><blockquote className="text-base leading-relaxed text-neutral-200">« {person.text} »</blockquote><figcaption className="mt-6 flex items-center gap-4 text-sm font-semibold"><Image src={person.photo} alt={person.name} width={80} height={80} className="h-16 w-16 shrink-0 rounded-xl object-cover" sizes="64px" /><span>{person.name}<span className="mt-1 block text-xs font-normal text-neutral-500">Participant au bootcamp Empire</span></span></figcaption></figure>)}
          </div>
          <div className="mt-20 rounded-3xl border border-white/10 bg-[radial-gradient(80%_120%_at_50%_0%,rgb(var(--empire-rgb)/.1),transparent_70%)] px-6 py-14 text-center">
            <p className="mx-auto max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Les dossiers sont étudiés un par un.</p>
            <p className="mx-auto mt-4 max-w-md text-neutral-400">Si ton profil est retenu, tu reçois une réponse personnelle pour ton appel de qualification.</p>
            <div className="mx-auto mt-8 max-w-sm"><a href="#candidature" className={CTA_PRIMARY}>Déposer ma candidature</a></div>
            <p className="mt-3 text-xs text-neutral-500">10 places par mois</p>
          </div>
        </div>
      </section>
    </main>
  )
}
