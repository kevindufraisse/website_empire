'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import EmpireSalesCta from '@/components/EmpireSalesCta'

const COPY = {
  formats: { fr: 'Choisissez votre premier format. Empire prépare le reste.', en: 'Choose your first format. Empire prepares the rest.' },
  proof: { fr: 'À votre tour de créer vos premiers contenus.', en: 'Your turn to create your first content.' },
  time: { fr: 'Vos prochains contenus commencent avec une idée.', en: 'Your next content starts with an idea.' },
}

export default function HomeTrialPrompt({ moment }: { moment: keyof typeof COPY }) {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  if (autopilot) return null
  return (
    <section data-trial-prompt={moment} className="border-y border-white/[0.06] bg-empire/[0.025] px-5 py-10 md:py-12">
      <p className="mx-auto mb-5 max-w-2xl text-center text-xl font-semibold text-white">{COPY[moment][lang]}</p>
      <EmpireSalesCta source={`home-${moment}`} showDemo={false} />
    </section>
  )
}
