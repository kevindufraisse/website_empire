import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import LegendProofSection from '@/components/sections/LegendProofSection'
import HomePricingSection from '@/components/sections/HomePricingSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import QuickWinsSection from '@/components/sections/QuickWinsSection'
import FounderSection from '@/components/sections/FounderSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'
import CrossSellCTA from '@/components/sections/CrossSellCTA'

export default function Page() {
  return (
    <main className="relative">
      {/* Hero with VSL */}
      <HeroSection />

      {/* How It Works - 4 steps */}
      <HowItWorksAccordion />

      {/* Case Studies - real client results with numbers */}
      <CaseStudiesSection />

      {/* Légende only - single aggregate proof point */}
      <LegendProofSection />

      {/* Pricing */}
      <HomePricingSection />

      {/* Testimonials (Senja) - social proof after pricing to reassure */}
      <TestimonialsSection />

      {/* Before/After comparison */}
      <QuickWinsSection />

      {/* Founder Credibility - trust before urgency */}
      <FounderSection />

      {/* FAQ */}
      <FAQSection variant="home" />

      {/* Cross-sell Empire → Légende */}
      <CrossSellCTA variant="empire-to-legende" />

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
