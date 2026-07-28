import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import AbVariantTracker from '@/components/AbVariantTracker'

const HowItWorksAccordion = dynamic(() => import('@/components/sections/HowItWorksAccordion'))
const CaseStudiesSection = dynamic(() => import('@/components/sections/CaseStudiesSection'))
const LegendProofSection = dynamic(() => import('@/components/sections/LegendProofSection'))
const HomePricingSection = dynamic(() => import('@/components/sections/HomePricingSection'))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const FounderSection = dynamic(() => import('@/components/sections/FounderSection'))
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

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
