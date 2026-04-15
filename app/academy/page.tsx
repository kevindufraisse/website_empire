import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyProofStrip from '@/components/sections/AcademyProofStrip'
import AcademyEmpireAlphaSection from '@/components/sections/AcademyEmpireAlphaSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyProcessSection from '@/components/sections/AcademyProcessSection'
import AcademyTwoPathsSection from '@/components/sections/AcademyTwoPathsSection'
import AcademyPricingSection from '@/components/sections/AcademyPricingSection'
import AcademyTestimonialsSection from '@/components/sections/AcademyTestimonialsSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'
import AcademyStickyBar from '@/components/sections/AcademyStickyBar'
import AcademySocialProofToast from '@/components/sections/AcademySocialProofToast'
import { ScrollProgress } from '@/components/magicui/scroll-progress'

export const metadata = {
  title: 'Bootcamp Viralité 21 jours - Empire Internet',
  description: 'Maîtrisez la viralité en 21 jours. On vous crée votre contenu chaque jour. Sur sélection, 20 places. Les meilleurs rejoignent le réseau Empire.'
}

export default function AcademyPage() {
  return (
    <main className="relative">
      <ScrollProgress />
      {/* Hero */}
      <AcademyHeroSection />

      {/* Preuve avant/après */}
      <AcademyProofStrip />

      {/* Game changer : on publie ton contenu à ta place */}
      <AcademyEmpireAlphaSection />

      {/* Qui on est */}
      <AcademyWhoSection />

      {/* Du bootcamp aux premières missions */}
      <AcademyProcessSection />

      {/* Les 2 chemins : poster pour vous vs poster pour Empire */}
      <AcademyTwoPathsSection />

      {/* Offre pricing */}
      <AcademyPricingSection />

      {/* Témoignages Senja */}
      <AcademyTestimonialsSection />

      {/* FAQ */}
      <AcademyFAQSection />

      {/* Sticky CTA */}
      <AcademyStickyBar />

      {/* Toast candidatures */}
      <AcademySocialProofToast />
    </main>
  )
}
