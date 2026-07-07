import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import AbVariantTracker from '@/components/AbVariantTracker'

const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const FounderSection = dynamic(() => import('@/components/sections/FounderSection'))
const WhyEmpireSection = dynamic(() => import('@/components/sections/WhyEmpireSection'))
const ForWhoSection = dynamic(() => import('@/components/sections/ForWhoSection'))
const WhyNowSection = dynamic(() => import('@/components/sections/WhyNowSection'))
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'))
const FinalBoostCTA = dynamic(() => import('@/components/sections/FinalBoostCTA'))

export default function Page() {
  return (
    <main className="relative">
      <AbVariantTracker experiment="hero_minimal" />

      {/* Hero with VSL */}
      <HeroSection />

      {/* How It Works - 4 steps */}
      <HowItWorksAccordion />

      {/* Deliverables - what Empire creates every month (3 pillars) */}
      <WhyNowSection />

      {/* Testimonials - social proof after the mechanism */}
      <TestimonialsSection />

      {/* Before/After comparison */}
      <QuickWinsSection />

      {/* Founder Credibility - trust before urgency */}
      <FounderSection />

      {/* Why now - the AI marketing gap */}
      <WhyEmpireSection />

      {/* Pour qui / Pas pour qui */}
      <ForWhoSection />

      {/* FAQ */}
      <FAQSection variant="home" />

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
