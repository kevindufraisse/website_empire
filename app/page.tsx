import HeroSection from '@/components/sections/HeroSection'
import BentoGridSection from '@/components/sections/BentoGridSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import PriceComparisonSection from '@/components/sections/PriceComparisonSection'
import FeatureDetailsSection from '@/components/sections/FeatureDetailsSection'
import ContentReadySection from '@/components/sections/ContentReadySection'
import MultiPlatformSection from '@/components/sections/MultiPlatformSection'
import CalendarSection from '@/components/sections/CalendarSection'
import BonusSection from '@/components/sections/BonusSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'

export default function Page() {
  return (
    <main className="relative">
      {/* Hero with Retro Grid background + Animated Beam */}
      <HeroSection />

      {/* How It Works - Process accordion */}
      <HowItWorksAccordion />

      {/* Bento Grid - Visual explanation */}
      <BentoGridSection />

      {/* Feature Details - Content transformation */}
      <FeatureDetailsSection />

      {/* Content Ready - AI cloning top creators */}
      <ContentReadySection />

      {/* Multi-Platform - Calendar before/after */}
      <MultiPlatformSection />

      {/* Calendar - Human verification & publishing */}
      <CalendarSection />

      {/* Bonus - API & AI Setter */}
      <BonusSection />

      {/* Price Comparison - Why Empire is the smart choice */}
      <PriceComparisonSection />

      {/* Final Boost CTA - After seeing value */}
      <FinalBoostCTA />

      {/* Testimonials - Senja widget */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />
    </main>
  )
}
