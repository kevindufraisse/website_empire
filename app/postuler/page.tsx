import type { Metadata } from 'next'
import { Suspense } from 'react'
import EmpireApplyForm from '@/components/EmpireApplyForm'

export const metadata: Metadata = {
  title: 'Parler à l’équipe - Empire Internet',
  description: 'Échangez avec notre équipe pour trouver l’offre Empire la plus adaptée à votre profil.',
  robots: { index: false, follow: false },
}

export default function PostulerPage() {
  return (
    <main className="relative min-h-screen bg-black pt-10 pb-24">
      <div className="container max-w-xl mx-auto px-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 min-h-[420px] flex flex-col justify-center">
          <Suspense fallback={<p className="text-center text-neutral-400 text-sm">…</p>}>
            <EmpireApplyForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
