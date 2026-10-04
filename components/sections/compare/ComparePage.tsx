import Link from 'next/link'
import { Check } from 'lucide-react'
import { COMPARISONS, EMPIRE_ALSO, EMPIRE_TERMS, PROOF_DATE, PROOF_POSTS, TOOL_STACK } from './comparisons'

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
  /** Par défaut : EMPIRE_TERMS[term], le même texte sur toutes les pages. */
  empire?: string
  other: string
}

export type ComparePageProps = {
  /** Slug de la page, pour ne pas se lister elle-même dans « Autres comparatifs ». */
  slug: string
  competitor: string
  /** Titre affiché : « Empire vs MagicPost » par défaut. */
  title?: string
  /** Une phrase : ce que fait le concurrent, ce que fait Empire. */
  verdict: string
  rows: FormulaRow[]
  chooseOther: string[]
  chooseEmpire: string[]
  /** Concurrent outil : page de prix relevée et date du relevé. */
  sourceUrl?: string
  checkedOn?: string
  /** Sans page de prix (freelance, agence) : d'où viennent les chiffres. */
  sourceNote?: string
  faq: Array<{ q: string; a: string }>
}

const APPLY_URL = '/vsl'

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
      <span className="font-bold text-empire">100 M de vues → Clients</span>
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
  const { slug, competitor, title, verdict, rows, chooseOther, chooseEmpire, sourceUrl, checkedOn, sourceNote, faq } = props
  const others = COMPARISONS.filter((c) => c.slug !== slug)
  return (
    <main className="relative">
      <section className="w-full bg-gradient-to-b from-black to-[#0f0f0f] pb-10 pt-24 md:pt-32">
        <div className="container max-w-4xl text-center">
          <p className="mb-5 inline-block rounded-full border border-empire/30 bg-empire/10 px-4 py-1.5 text-sm font-semibold text-empire">
            Comparatif
          </p>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl">{title || `Empire vs ${competitor}`}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-300 md:text-xl">{verdict}</p>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <Link href={APPLY_URL} className="rounded-lg bg-empire px-6 py-3 font-semibold text-black transition hover:opacity-90">
              Voir le workshop gratuit
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
                    <p className="text-sm leading-relaxed text-neutral-100">{row.empire || EMPIRE_TERMS[row.term]}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">{competitor}</p>
                    <p className="text-sm leading-relaxed text-neutral-300">{row.other}</p>
                  </div>
                </div>
              )
            })}
          </div>
          {sourceUrl ? (
            <p className="mt-4 text-center text-xs text-neutral-500">
              Prix et fonctionnalités de {competitor} relevés sur{' '}
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-300">
                {sourceUrl.replace(/^https?:\/\//, '')}
              </a>{' '}
              le {checkedOn}. Ils peuvent avoir changé depuis.
            </p>
          ) : sourceNote ? (
            <p className="mt-4 text-center text-xs text-neutral-500">{sourceNote}</p>
          ) : null}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="mb-3 text-sm font-semibold text-white">Et aussi, dans Empire</p>
            <ul className="flex flex-wrap gap-2">
              {EMPIRE_ALSO.map((item) => (
                <li key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-300">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">La preuve, sur le compte de Kevin</h2>
          <p className="mb-8 text-center text-neutral-400">Les formats d&apos;Empire sont d&apos;abord testés ici. Vues relevées le {PROOF_DATE}.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {PROOF_POSTS.map((post) => (
              <div key={post.title} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-empire">{post.format}</p>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-300">{post.title}</p>
                <div className="space-y-2">
                  {post.stats.map((stat) => (
                    <a key={stat.href} href={stat.href} target="_blank" rel="noopener noreferrer" className="flex items-baseline justify-between gap-2 rounded-lg border border-white/10 px-3 py-2 transition hover:border-empire/50">
                      <span className="text-xl font-extrabold text-white">{stat.views}</span>
                      <span className="text-xs text-neutral-400">vues · {stat.network} ↗</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h2 className="mb-5 text-xl font-bold md:text-2xl">Et si tu recomposais Empire avec des outils ?</h2>
            <div className="space-y-2">
              {TOOL_STACK.tools.map((tool) => (
                <div key={tool.name} className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-2 text-sm">
                  <span className="text-neutral-300"><span className="font-semibold text-white">{tool.name}</span> pour {tool.role}</span>
                  <span className="shrink-0 tabular-nums text-neutral-300">{tool.price}</span>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-3 pt-1 text-sm">
                <span className="font-semibold text-white">Total, plus ton temps</span>
                <span className="shrink-0 font-bold tabular-nums text-white">{TOOL_STACK.total}</span>
              </div>
            </div>
            <p className="mb-2 mt-6 text-sm font-semibold text-neutral-300">Et il te manque encore :</p>
            <ul className="mb-6 grid gap-1.5 text-sm text-neutral-400 md:grid-cols-2">
              {TOOL_STACK.missing.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-neutral-600">-</span>{item}</li>
              ))}
            </ul>
            <p className="rounded-xl border border-empire/30 bg-empire/[0.06] px-4 py-3 text-sm font-semibold text-white">{TOOL_STACK.empire}</p>
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

      <section className="w-full py-10">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-center text-lg font-bold text-neutral-300">Autres comparatifs</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {others.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-neutral-300 transition hover:border-empire/50 hover:text-white">
                Empire vs {c.competitor}
              </Link>
            ))}
            <Link href="/comparatif" className="rounded-full border border-empire/40 px-4 py-1.5 text-sm font-semibold text-empire">Tous les comparatifs</Link>
          </div>
        </div>
      </section>

      <section className="w-full pb-24 pt-8">
        <div className="container max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">Le bon message, dans le bon format, partout</h2>
          <p className="mb-8 text-neutral-300">La formule en 1 h 26, puis 7 jours pour la tester gratuitement.</p>
          <Link href={APPLY_URL} className="inline-block rounded-lg bg-empire px-8 py-3.5 font-semibold text-black transition hover:opacity-90">
            Voir le workshop gratuit
          </Link>
        </div>
      </section>
    </main>
  )
}
