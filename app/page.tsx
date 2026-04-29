import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import BentoGridSection from '@/components/sections/BentoGridSection'
import FounderSection from '@/components/sections/FounderSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'
import WhyNowSection from '@/components/sections/WhyNowSection'
import WhyEmpireSection from '@/components/sections/WhyEmpireSection'

export default function Page() {
  return (
    <main className="relative">
      {/* Hero with VSL */}
      <HeroSection />

      {/* How It Works */}
      <HowItWorksAccordion />

      {/* Why now - the AI marketing gap */}
      <WhyEmpireSection />

      {/* Testimonials - Senja widget */}
      <TestimonialsSection />

      {/* Features - 3 pillars */}
      <WhyNowSection />

      {/* FAQ */}
      <FAQSection variant="home" />

      {/* Founder Credibility */}
      <FounderSection />

      {/* Visual explanation - Bento Grid */}
      <BentoGridSection />

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
