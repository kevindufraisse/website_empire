import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyContextSection from '@/components/sections/AcademyContextSection'
import AcademyProcessSection from '@/components/sections/AcademyProcessSection'
import AcademyProgramSection from '@/components/sections/AcademyProgramSection'
import AcademyLivesSection from '@/components/sections/AcademyLivesSection'
import AcademyPricingSection from '@/components/sections/AcademyPricingSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'

export const metadata = {
  title: 'Academy — Empire Internet',
  description: 'Bootcamp 21 jours. Deviens Head of Viralité. 3 000€/mois en 4h/semaine. Les meilleurs rejoignent le réseau Empire.'
}

export default function AcademyPage() {
  return (
    <main className="relative">
      {/* Hero */}
      <AcademyHeroSection />

      {/* Qui on est */}
      <AcademyWhoSection />

      {/* L'IA a tué des métiers */}
      <AcademyContextSection />

      {/* Du bootcamp aux premières missions */}
      <AcademyProcessSection />

      {/* Le programme 21 jours */}
      <AcademyProgramSection />

      {/* Les 6 lives + 2 Q&A */}
      <AcademyLivesSection />

      {/* Offre pricing */}
      <AcademyPricingSection />

      {/* FAQ */}
      <AcademyFAQSection />
    </main>
  )
}
