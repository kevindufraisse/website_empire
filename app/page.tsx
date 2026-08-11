import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import HomePricingSection from '@/components/sections/HomePricingSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import QuickWinsSection from '@/components/sections/QuickWinsSection'
import FounderSection from '@/components/sections/FounderSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'

export default function Page() {
  return (
    <main className="relative">
      <HeroSection />
      <HowItWorksAccordion />
      <CaseStudiesSection />
      <HomePricingSection />
      <TestimonialsSection />
      <QuickWinsSection />
      <FounderSection />
      <FAQSection variant="home" />
      <FinalBoostCTA />
    </main>
  )
}
