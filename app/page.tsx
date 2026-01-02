import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import BentoGridSection from '@/components/sections/BentoGridSection'
import QuickWinsSection from '@/components/sections/QuickWinsSection'
import RolesReplacedSection from '@/components/sections/RolesReplacedSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'

export default function Page() {
  return (
    <main className="relative">
      {/* Hero with VSL */}
      <HeroSection />

      {/* How It Works - 3 steps */}
      <HowItWorksAccordion />

      {/* Roles Replaced */}
      <RolesReplacedSection />

      {/* Quick Wins - Before/After */}
      <QuickWinsSection />

      {/* Testimonials - Senja widget */}
      <TestimonialsSection />

      {/* FAQ - Essential questions */}
      <FAQSection variant="home" />

      {/* Visual explanation - Bento Grid */}
      <BentoGridSection />

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
