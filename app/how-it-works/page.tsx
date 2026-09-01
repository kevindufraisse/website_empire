import HowItWorksSection from '@/components/sections/HowItWorksSection'
import BentoGridSection from '@/components/sections/BentoGridSection'
import FeatureDetailsSection from '@/components/sections/FeatureDetailsSection'
import MultiPlatformSection from '@/components/sections/MultiPlatformSection'
import CalendarSection from '@/components/sections/CalendarSection'
import ContentReadySection from '@/components/sections/ContentReadySection'
import BonusSection from '@/components/sections/BonusSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'

export const metadata = {
  title: 'Comment ça marche - Empire Internet',
  description: '1 h de parole par semaine, publié sur 7 réseaux. Voici comment Empire transforme votre voix en présence.',
  robots: { index: false, follow: false },
}

export default function HowItWorksPage() {
  return (
    <main className="relative">
      {/* Process détaillé */}
      <HowItWorksSection />

      {/* Bento Grid - Visualisation */}
      <BentoGridSection useAnchors={true} />

      {/* Feature Details - Content transformation */}
      <FeatureDetailsSection />

      {/* Multi-Platform - 1 input → 50+ outputs */}
      <MultiPlatformSection />

      {/* Calendar - Human verification & publishing */}
      <CalendarSection />

      {/* Content Ready - AI cloning */}
      <ContentReadySection />

      {/* Bonus Features - API & AI Setter (with Globe & conversations) */}
      <BonusSection />

      {/* CTA vers pricing */}
      <FinalBoostCTA />
    </main>
  )
}

