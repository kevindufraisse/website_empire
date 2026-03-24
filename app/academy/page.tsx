import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyProofStrip from '@/components/sections/AcademyProofStrip'
import AcademySelectionSection from '@/components/sections/AcademySelectionSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyContextSection from '@/components/sections/AcademyContextSection'
import AcademyProcessSection from '@/components/sections/AcademyProcessSection'
import AcademyLivesSection from '@/components/sections/AcademyLivesSection'
import AcademyCertificationSection from '@/components/sections/AcademyCertificationSection'
import AcademyPricingSection from '@/components/sections/AcademyPricingSection'
import AcademyTestimonialsSection from '@/components/sections/AcademyTestimonialsSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'
import AcademyStickyBar from '@/components/sections/AcademyStickyBar'
import AcademySocialProofToast from '@/components/sections/AcademySocialProofToast'
import { ScrollProgress } from '@/components/magicui/scroll-progress'

export const metadata = {
  title: 'Academy — Empire Internet',
  description: 'Bootcamp 21 jours. Deviens Head of Viralité. 3 000€/mois en 4h/semaine. Les meilleurs rejoignent le réseau Empire.'
}

export default function AcademyPage() {
  return (
    <main className="relative">
      <ScrollProgress />
      {/* Hero */}
      <AcademyHeroSection />

      {/* Preuve avant/après — résultats animés */}
      <AcademyProofStrip />

      {/* Pourquoi sur sélection + critères + timeline après clic */}
      <AcademySelectionSection />

      {/* Qui on est */}
      <AcademyWhoSection />

      {/* L'IA a tué des métiers */}
      <AcademyContextSection />

      {/* Du bootcamp aux premières missions */}
      <AcademyProcessSection />

      {/* Les 6 lives + 2 Q&A */}
      <AcademyLivesSection />

      {/* Certifications — avant pricing (valeur long terme) */}
      <AcademyCertificationSection />

      {/* Offre pricing */}
      <AcademyPricingSection />

      {/* Témoignages Senja */}
      <AcademyTestimonialsSection />

      {/* FAQ */}
      <AcademyFAQSection />

      {/* Sticky CTA spécifique academy */}
      <AcademyStickyBar />

      {/* Toast candidatures en temps réel */}
      <AcademySocialProofToast />
    </main>
  )
}
