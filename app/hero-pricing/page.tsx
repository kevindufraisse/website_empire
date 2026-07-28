import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import AbVariantTracker from '@/components/AbVariantTracker'
import HomePricingSection from '@/components/sections/HomePricingSection'
import PricingVariantCtaRedirect from '@/components/PricingVariantCtaRedirect'

const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const FounderSection = dynamic(() => import('@/components/sections/FounderSection'))
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'))
const FinalBoostCTA = dynamic(() => import('@/components/sections/FinalBoostCTA'))

// Variant "pricing" of the hero_minimal A/B test: classic SaaS homepage with
// the app pricing shown directly on the home. Users land here via the
// middleware rewrite (URL stays "/").
export const metadata = {
  robots: { index: false, follow: false },
}

export default function HeroPricingPage() {
  return (
    <main className="relative">
      <AbVariantTracker experiment="hero_minimal" />
      {/* Pay-first: all onboarding CTAs scroll to the pricing section instead */}
      <PricingVariantCtaRedirect />

      {/* Hero with VSL */}
      <HeroSection />

      {/* How It Works - 4 steps */}
      <HowItWorksAccordion />

      {/* Testimonials (Senja) - social proof before asking for money */}
      <TestimonialsSection />

      {/* Pricing - classic SaaS placement, trial CTA per plan */}
      <HomePricingSection />

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
