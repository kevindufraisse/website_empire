import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyPainSection from '@/components/sections/AcademyPainSection'
import AcademyForWhoSection from '@/components/sections/AcademyForWhoSection'
import AcademyProofStrip from '@/components/sections/AcademyProofStrip'
import AcademyEmpireAlphaSection from '@/components/sections/AcademyEmpireAlphaSection'
import AcademyProgramSection from '@/components/sections/AcademyProgramSection'
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
  description: 'Deviens viral en 21 jours sans écrire ton contenu. On trouve les sujets, tu parles 15 min, on rédige tout. Sur sélection, 20 places.'
}

export default function AcademyPage() {
  return (
    <main className="relative">
      <ScrollProgress />
      {/* Hero */}
      <AcademyHeroSection />

      {/* Douleur - pourquoi maintenant */}
      <AcademyPainSection />

      {/* Pour qui + 2 options */}
      <AcademyForWhoSection />
      <AcademyTwoPathsSection />

      {/* Comment ça marche */}
      <AcademyEmpireAlphaSection />

      {/* Programme semaine par semaine */}
      <AcademyProgramSection />

      {/* Preuve avant/après clients agence */}
      <AcademyProofStrip />

      {/* Témoignages */}
      <AcademyTestimonialsSection />

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
