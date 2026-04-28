'use client'

import { useRouter } from 'next/navigation'
import EmpireQuiz from '@/components/quiz/EmpireQuiz'

export default function QuizPage() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.10),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgb(var(--empire-rgb)_/_0.06),transparent_70%)]" />

      <div className="relative z-10 min-h-screen flex items-stretch">
        <EmpireQuiz onDismiss={() => router.push('/')} />
      </div>
    </main>
  )
}
