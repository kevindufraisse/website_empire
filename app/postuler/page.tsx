import type { Metadata } from 'next'
import EmpireApplyForm from '@/components/EmpireApplyForm'

export const metadata: Metadata = {
  title: 'Liste d\'attente Empire Internet',
  description:
    'Rejoignez la liste d\'attente Empire Internet. On sélectionne les profils les plus motivés.',
  robots: { index: false, follow: false },
}

export default function PostulerPage() {
  return (
    <main className="relative min-h-screen bg-black pt-24 pb-20">
      <div className="container max-w-xl mx-auto">
        <div className="mb-8 rounded-2xl border border-empire/30 bg-empire/10 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-white leading-relaxed">
            Liste d&apos;attente. On lit chaque candidature et on sélectionne les profils les plus motivés.
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2">
          Rejoindre la liste d&apos;attente
        </h1>
        <p className="text-center text-neutral-400 text-sm mb-8">
          Pas d&apos;achat en ligne. Vous postulez, on choisit qui entre.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          <EmpireApplyForm />
        </div>
      </div>
    </main>
  )
}
