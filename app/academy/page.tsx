import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyContextSection from '@/components/sections/AcademyContextSection'
import AcademyProcessSection from '@/components/sections/AcademyProcessSection'
import AcademyLivesSection from '@/components/sections/AcademyLivesSection'
import AcademyMarqueeStrip from '@/components/sections/AcademyMarqueeStrip'
import AcademyTestimonialsSection from '@/components/sections/AcademyTestimonialsSection'
import AcademyPricingSection from '@/components/sections/AcademyPricingSection'
import AcademyCertificationSection from '@/components/sections/AcademyCertificationSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'
import AcademyStickyBar from '@/components/sections/AcademyStickyBar'
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

      {/* Marquee bénéfices */}
      <AcademyMarqueeStrip />

      {/* Qui on est */}
      <AcademyWhoSection />

      {/* L'IA a tué des métiers */}
      <AcademyContextSection />

      {/* Du bootcamp aux premières missions */}
      <AcademyProcessSection />

      {/* Les 6 lives + 2 Q&A */}
      <AcademyLivesSection />

      {/* Offre pricing */}
      <AcademyPricingSection />

      {/* Certifications */}
      <AcademyCertificationSection />

      {/* Témoignages Senja */}
      <AcademyTestimonialsSection />

      {/* FAQ */}
      <AcademyFAQSection />

      {/* Sticky CTA spécifique academy */}
      <AcademyStickyBar />
    </main>
  )
}
