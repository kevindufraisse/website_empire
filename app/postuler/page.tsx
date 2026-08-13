import type { Metadata } from 'next'
import { Suspense } from 'react'
import EmpireApplyForm from '@/components/EmpireApplyForm'

export const metadata: Metadata = {
  title: 'Demander un accès - Empire Internet',
  description: 'Demandez un accès à Empire Internet. Candidature sur sélection.',
  robots: { index: false, follow: false },
}

export default function PostulerPage() {
  return (
    <main className="relative min-h-screen bg-black pt-24 pb-20">
      <div className="container max-w-xl mx-auto px-4">
        <div className="mb-8 rounded-2xl border border-empire/30 bg-empire/10 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-white leading-relaxed">
            Demande un accès - on lit chaque candidature.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 min-h-[420px] flex flex-col justify-center">
          <Suspense fallback={<p className="text-center text-neutral-400 text-sm">…</p>}>
            <EmpireApplyForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
