import HeroSection from '@/components/sections/HeroSection'
import QuickProblemSolution from '@/components/sections/QuickProblemSolution'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import BentoGridSection from '@/components/sections/BentoGridSection'
import QuickWinsSection from '@/components/sections/QuickWinsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'

export default function Page() {
  return (
    <main className="relative">
      {/* Hero with VSL */}
      <HeroSection />

      {/* Quick Problem/Solution - Conversion focused */}
      <QuickProblemSolution />

      {/* How It Works - 3 steps */}
      <HowItWorksAccordion />

      {/* Visual explanation - Bento Grid */}
      <BentoGridSection />

      {/* Quick Wins - Before/After */}
      <QuickWinsSection />

      {/* Testimonials - Senja widget */}
      <TestimonialsSection />

      {/* FAQ - Essential questions */}
      <FAQSection variant="home" />

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
