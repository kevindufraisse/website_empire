import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'

const ContentMachineSection = dynamic(() => import('@/components/sections/ContentMachineSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const VolumeSection = dynamic(() => import('@/components/sections/VolumeSection'))
const WhyEmpireSection = dynamic(() => import('@/components/sections/WhyEmpireSection'))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const WhyNowSection = dynamic(() => import('@/components/sections/WhyNowSection'))
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'))
const FounderSection = dynamic(() => import('@/components/sections/FounderSection'))
const BentoGridSection = dynamic(() => import('@/components/sections/BentoGridSection'))
const FinalBoostCTA = dynamic(() => import('@/components/sections/FinalBoostCTA'))

export default function Page() {
  return (
    <main className="relative">
      {/* Hero with VSL */}
      <HeroSection />

      {/* How It Works */}
      <HowItWorksAccordion />

      {/* Content Machine - services bento */}
      <ContentMachineSection />

      {/* Before/After comparison */}
      <QuickWinsSection />

      {/* Volume = Probability */}
      <VolumeSection />

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
