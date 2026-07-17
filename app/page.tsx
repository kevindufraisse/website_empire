import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import AbVariantTracker from '@/components/AbVariantTracker'

const CaseStudiesSection = dynamic(() => import('@/components/sections/CaseStudiesSection'))
const HomePricingSection = dynamic(() => import('@/components/sections/HomePricingSection'))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const FounderSection = dynamic(() => import('@/components/sections/FounderSection'))
const WhyEmpireSection = dynamic(() => import('@/components/sections/WhyEmpireSection'))
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

      {/* Case Studies - real client results with numbers */}
      <CaseStudiesSection />

      {/* Pricing */}
      <HomePricingSection />

      {/* Testimonials (Senja) - social proof after pricing to reassure */}
      <TestimonialsSection />

      {/* Deliverables - what Empire creates every month (3 pillars) */}
      <WhyNowSection />

      {/* Before/After comparison */}
      <QuickWinsSection />

      {/* Founder Credibility - trust before urgency */}
      <FounderSection />

      {/* Why now - the AI marketing gap */}
      <WhyEmpireSection />

      {/* FAQ */}
      <FAQSection variant="home" />

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
