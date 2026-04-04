import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import BentoGridSection from '@/components/sections/BentoGridSection'
import QuickWinsSection from '@/components/sections/QuickWinsSection'
import RolesReplacedSection from '@/components/sections/RolesReplacedSection'
import FounderSection from '@/components/sections/FounderSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'
import WhyNowSection from '@/components/sections/WhyNowSection'

export default function Page() {
  return (
    <main className="relative">
      {/* Hero with VSL */}
      <HeroSection />

      {/* How It Works - 3 steps */}
      <HowItWorksAccordion />

      {/* Testimonials - Senja widget */}
      <TestimonialsSection />

      {/* Roles Replaced */}
      <RolesReplacedSection />

      {/* Founder Credibility Section */}
      <FounderSection />

      {/* Quick Wins - Before/After */}
      <QuickWinsSection />

      {/* Why Now - commoditisation des compétences */}
      <WhyNowSection />

      {/* FAQ - Essential questions */}
      <FAQSection variant="home" />

      {/* Visual explanation - Bento Grid */}
      <BentoGridSection />

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
