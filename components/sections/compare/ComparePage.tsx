import Link from 'next/link'
import { Check, X } from 'lucide-react'

/**
 * Gabarit des pages comparatives (« Empire vs X », « alternative à X »).
 *
 * Règle : la publicité comparative n'est licite que si elle est exacte et
 * vérifiable. Chaque fait sur le concurrent vient de son site, avec la date du
 * relevé (`checkedOn`) et la source (`sourceUrl`) affichées sous le tableau.
 * Les arguments sur Kevin ne citent que des classements sourcés.
 */

export type CompareCell = string | boolean

export type CompareRow = {
  label: string
  empire: CompareCell
  other: CompareCell
}

export type ComparePageProps = {
  competitor: string
  /** Une phrase : ce que fait le concurrent, ce que fait Empire. */
  verdict: string
  chooseOther: string[]
  chooseEmpire: string[]
  rows: CompareRow[]
  sourceUrl: string
  checkedOn: string
  faq: Array<{ q: string; a: string }>
}

const APPLY_URL = '/postuler'

function Cell({ value, strong }: { value: CompareCell; strong?: boolean }) {
  if (value === true) return <Check className="h-5 w-5 text-empire" aria-label="Oui" />
  if (value === false) return <X className="h-5 w-5 text-neutral-500" aria-label="Non" />
  return <span className={strong ? 'text-white' : 'text-neutral-300'}>{value}</span>
}

const PROOFS = [
  {
    title: 'Fait par Kevin Dufraisse',
    body: 'Classé 3e expert growth marketing en France par Favikon en 2026, environ 60 000 abonnés sur LinkedIn. Empire, c’est sa façon de publier, transformée en logiciel.',
    href: 'https://www.favikon.com/blog/top-growth-marketing-experts-france',
    link: 'Voir le classement Favikon',
  },
  {
    title: 'Chaque format est testé sur son compte',
    body: 'Réaction, classement, citation, questions, actu : un format n’entre dans l’app qu’après avoir été testé sur le compte de Kevin. Et ça continue : ce qui ne marche plus en sort.',
  },
  {
    title: 'Une méthode, pas un générateur',
    body: 'Une méthode appliquée depuis 5 ans pour être visible sur tous les réseaux, en vidéo et en écrit. L’app te dit quoi publier, tu filmes ou tu dictes, on écrit, on monte et on publie.',
  },
]

export default function ComparePage(props: ComparePageProps) {
  const { competitor, verdict, chooseOther, chooseEmpire, rows, sourceUrl, checkedOn, faq } = props
  return (
    <main className="relative">
      <section className="w-full bg-gradient-to-b from-black to-[#0f0f0f] pb-12 pt-24 md:pt-32">
        <div className="container max-w-4xl text-center">
          <p className="mb-5 inline-block rounded-full border border-empire/30 bg-empire/10 px-4 py-1.5 text-sm font-semibold text-empire">
            Comparatif
          </p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">
            Empire vs {competitor}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-300 md:text-xl">{verdict}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={APPLY_URL} className="rounded-lg bg-empire px-6 py-3 font-semibold text-black transition hover:opacity-90">
              Postuler pour Empire
            </Link>
            <a href="#tableau" className="rounded-lg border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-white/30">
              Voir le tableau
            </a>
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container grid max-w-4xl gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-lg font-bold">Choisis {competitor} si…</h2>
            <ul className="space-y-2.5 text-neutral-300">
              {chooseOther.map((line) => (
                <li key={line} className="flex gap-2"><span className="text-neutral-500">-</span>{line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-empire/40 bg-empire/[0.06] p-6">
            <h2 className="mb-4 text-lg font-bold">Choisis Empire si…</h2>
            <ul className="space-y-2.5 text-neutral-200">
              {chooseEmpire.map((line) => (
                <li key={line} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-empire" />{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="tableau" className="w-full scroll-mt-24 py-12">
        <div className="container max-w-4xl">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">Ce que tu obtiens, ligne par ligne</h2>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full table-fixed text-left text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="w-[38%] px-4 py-3 font-semibold text-neutral-400"> </th>
                  <th className="px-4 py-3 font-bold text-empire">Empire</th>
                  <th className="px-4 py-3 font-bold text-neutral-300">{competitor}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3.5 align-top font-medium text-neutral-400">{row.label}</td>
                    <td className="px-4 py-3.5 align-top"><Cell value={row.empire} strong /></td>
                    <td className="px-4 py-3.5 align-top"><Cell value={row.other} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-xs text-neutral-500">
            Prix et fonctionnalités de {competitor} relevés sur{' '}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-300">
              {sourceUrl.replace(/^https?:\/\//, '')}
            </a>{' '}
            le {checkedOn}. Ils peuvent avoir changé depuis.
          </p>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">Ce qu&apos;aucun outil ne peut copier</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PROOFS.map((proof) => (
              <div key={proof.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="mb-2 font-bold text-white">{proof.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-300">{proof.body}</p>
                {proof.href && (
                  <a href={proof.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-empire hover:underline">
                    {proof.link} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">Questions fréquentes</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="group rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                <summary className="cursor-pointer list-none font-semibold text-white">{item.q}</summary>
                <p className="mt-3 leading-relaxed text-neutral-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full pb-24 pt-8">
        <div className="container max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">Publie partout, sans écrire ni monter</h2>
          <p className="mb-8 text-neutral-300">Dis-nous où tu en es : on te répond sur WhatsApp et on te recommande le bon plan.</p>
          <Link href={APPLY_URL} className="inline-block rounded-lg bg-empire px-8 py-3.5 font-semibold text-black transition hover:opacity-90">
            Postuler pour Empire
          </Link>
        </div>
      </section>
    </main>
  )
}
