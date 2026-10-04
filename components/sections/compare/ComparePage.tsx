import Link from 'next/link'
import { Check } from 'lucide-react'

/**
 * Gabarit des pages comparatives (« Empire vs X », « alternative à X »).
 *
 * La comparaison suit la formule du site (FormulaBar) :
 *   Message × Format × Diffusion ÷ (Temps + Coût) = Visibilité → Clients
 * Un concurrent couvre en général un seul terme (MagicPost : l'écriture d'un
 * message LinkedIn ; Opus Clip : un format ; un freelance : du temps). La page
 * le montre terme par terme au lieu d'aligner des fonctionnalités.
 *
 * Règle : la publicité comparative n'est licite que si elle est exacte et
 * vérifiable. Chaque fait sur le concurrent vient de son site, avec la date du
 * relevé (`checkedOn`) et la source (`sourceUrl`) affichées sous le tableau.
 */

export type FormulaTermId = 'message' | 'format' | 'diffusion' | 'time' | 'cost' | 'visibility'

export type FormulaRow = {
  term: FormulaTermId
  empire: string
  other: string
}

export type ComparePageProps = {
  competitor: string
  /** Une phrase : ce que fait le concurrent, ce que fait Empire. */
  verdict: string
  rows: FormulaRow[]
  chooseOther: string[]
  chooseEmpire: string[]
  sourceUrl: string
  checkedOn: string
  faq: Array<{ q: string; a: string }>
}

const APPLY_URL = '/postuler'

const TERMS: Record<FormulaTermId, { label: string; question: string }> = {
  message: { label: 'Message', question: 'Quoi dire ?' },
  format: { label: 'Format', question: 'Comment le dire pour être regardé ?' },
  diffusion: { label: 'Diffusion', question: 'Où ça part ?' },
  time: { label: 'Temps', question: 'Combien de temps pour toi ?' },
  cost: { label: 'Coût', question: 'Combien ça coûte ?' },
  visibility: { label: 'Visibilité → clients', question: 'Est-ce que ça ramène des clients ?' },
}

function FormulaLine() {
  const part = (t: string) => <span className="font-bold text-white">{t}</span>
  return (
    <p className="mx-auto max-w-3xl rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-neutral-400 md:text-base">
      {part('Message')} × {part('Format')} × {part('Diffusion')} ÷ ({part('Temps')} + {part('Coût')}) ={' '}
      <span className="font-bold text-empire">Visibilité → Clients</span>
    </p>
  )
}

// Repris tels quels de la section fondateur de la page d'accueil, pour que
// les deux pages disent la même chose.
const FOUNDER_STATS = [
  { stat: '#1', label: 'Lead Generation France' },
  { stat: '#9', label: 'Lead Generation monde' },
  { stat: '#55', label: 'Influence LinkedIn France' },
  { stat: '700M+', label: 'vues générées pour nos clients' },
]

const PROOFS = [
  {
    title: 'Chaque format est testé sur le compte de Kevin',
    body: 'Réaction, classement, devine, citation, questions, actu : un format n’entre dans l’app qu’après avoir marché sur son propre compte. Et ça continue : ce qui ne marche plus en sort.',
  },
  {
    title: 'Une méthode appliquée depuis 5 ans',
    body: 'Message, format, diffusion : la même méthode qui a rendu Kevin visible sur tous les réseaux, transformée en logiciel. Tu ne pars pas d’une page blanche, tu pars de ce qui a fait ses preuves.',
  },
]

export default function ComparePage(props: ComparePageProps) {
  const { competitor, verdict, rows, chooseOther, chooseEmpire, sourceUrl, checkedOn, faq } = props
  return (
    <main className="relative">
      <section className="w-full bg-gradient-to-b from-black to-[#0f0f0f] pb-10 pt-24 md:pt-32">
        <div className="container max-w-4xl text-center">
          <p className="mb-5 inline-block rounded-full border border-empire/30 bg-empire/10 px-4 py-1.5 text-sm font-semibold text-empire">
            Comparatif
          </p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">Empire vs {competitor}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-300 md:text-xl">{verdict}</p>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <Link href={APPLY_URL} className="rounded-lg bg-empire px-6 py-3 font-semibold text-black transition hover:opacity-90">
              Postuler pour Empire
            </Link>
            <a href="#formule" className="rounded-lg border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-white/30">
              Comparer terme par terme
            </a>
          </div>
          <FormulaLine />
        </div>
      </section>

      <section id="formule" className="w-full scroll-mt-24 py-12">
        <div className="container max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">La formule, terme par terme</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-neutral-400">
            Être visible, c&apos;est le bon message, dans un format qui se regarde, diffusé partout, sans y passer ta semaine ni payer une équipe.
          </p>
          <div className="space-y-3">
            {rows.map((row) => {
              const term = TERMS[row.term]
              return (
                <div key={row.term} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-[180px_1fr_1fr] md:items-start md:gap-5 md:p-5">
                  <div>
                    <p className="font-bold text-white">{term.label}</p>
                    <p className="text-sm text-neutral-500">{term.question}</p>
                  </div>
                  <div className="rounded-xl border border-empire/30 bg-empire/[0.06] p-3.5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-empire">Empire</p>
                    <p className="text-sm leading-relaxed text-neutral-100">{row.empire}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">{competitor}</p>
                    <p className="text-sm leading-relaxed text-neutral-300">{row.other}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-center text-xs text-neutral-500">
            Prix et fonctionnalités de {competitor} relevés sur{' '}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-300">
              {sourceUrl.replace(/^https?:\/\//, '')}
            </a>{' '}
            le {checkedOn}. Ils peuvent avoir changé depuis.
          </p>
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

      <section className="w-full py-12">
        <div className="container max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">Ce qu&apos;aucun outil ne peut copier</h2>
          <p className="mb-8 text-center text-neutral-400">Empire est construit par Kevin Dufraisse, sur sa propre méthode.</p>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {FOUNDER_STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-3xl font-extrabold text-empire">{s.stat}</p>
                <p className="mt-1 text-sm text-neutral-400">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {PROOFS.map((proof) => (
              <div key={proof.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="mb-2 font-bold text-white">{proof.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-300">{proof.body}</p>
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
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">Le bon message, dans le bon format, partout</h2>
          <p className="mb-8 text-neutral-300">Dis-nous où tu en es : on te répond sur WhatsApp et on te recommande le bon plan.</p>
          <Link href={APPLY_URL} className="inline-block rounded-lg bg-empire px-8 py-3.5 font-semibold text-black transition hover:opacity-90">
            Postuler pour Empire
          </Link>
        </div>
      </section>
    </main>
  )
}
