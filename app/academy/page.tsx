import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyPainSection from '@/components/sections/AcademyPainSection'
import AcademyForWhoSection from '@/components/sections/AcademyForWhoSection'
import AcademyProofStrip from '@/components/sections/AcademyProofStrip'
import AcademyEmpireAlphaSection from '@/components/sections/AcademyEmpireAlphaSection'
import AcademyTestimonialsSection from '@/components/sections/AcademyTestimonialsSection'
import AcademyTwoPathsSection from '@/components/sections/AcademyTwoPathsSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyPricingSection from '@/components/sections/AcademyPricingSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'
import AcademyStickyBar from '@/components/sections/AcademyStickyBar'
import AcademySocialProofToast from '@/components/sections/AcademySocialProofToast'
import { ScrollProgress } from '@/components/magicui/scroll-progress'

export const metadata = {
  title: 'Bootcamp Viralité 21 jours - Empire Internet',
  description: 'Maîtrise la viralité en 21 jours. Tu parles 15 min, on rédige tout, tu publies. Sur sélection, 20 places. Les meilleurs deviennent partenaires Empire.'
}

export default function AcademyPage() {
  return (
    <main className="relative">
      <ScrollProgress />
      {/* Hero */}
      <AcademyHeroSection />

      {/* Douleur - pourquoi maintenant */}
      <AcademyPainSection />

      {/* Pour qui */}
      <AcademyForWhoSection />

      {/* Comment ça marche + déroulé bootcamp */}
      <AcademyEmpireAlphaSection />

      {/* Preuve avant/après clients agence */}
      <AcademyProofStrip />

      {/* Témoignages */}
      <AcademyTestimonialsSection />

      {/* 2 options après le bootcamp */}
      <AcademyTwoPathsSection />

      {/* Qui on est */}
      <AcademyWhoSection />

      {/* Offre récap + CTA */}
      <AcademyPricingSection />

      {/* FAQ */}
      <AcademyFAQSection />

      {/* Sticky CTA */}
      <AcademyStickyBar />

      {/* Toast candidatures */}
      <AcademySocialProofToast />
    </main>
  )
}
