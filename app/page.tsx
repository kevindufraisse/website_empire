import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'

const ContentMachineSection = dynamic(() => import('@/components/sections/ContentMachineSection'))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const FounderSection = dynamic(() => import('@/components/sections/FounderSection'))
const VolumeSection = dynamic(() => import('@/components/sections/VolumeSection'))
const WhyEmpireSection = dynamic(() => import('@/components/sections/WhyEmpireSection'))
const ForWhoSection = dynamic(() => import('@/components/sections/ForWhoSection'))
const WhyNowSection = dynamic(() => import('@/components/sections/WhyNowSection'))
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'))
const FinalBoostCTA = dynamic(() => import('@/components/sections/FinalBoostCTA'))

export default function Page() {
  return (
    <main className="relative">
      {/* Hero with VSL */}
      <HeroSection />

      {/* How It Works - 4 steps */}
      <HowItWorksAccordion />

      {/* Content Machine - services bento */}
      <ContentMachineSection />

      {/* Testimonials - social proof early */}
      <TestimonialsSection />

      {/* Before/After comparison */}
      <QuickWinsSection />

      {/* Founder Credibility - trust before urgency */}
      <FounderSection />

      {/* Volume = Probability */}
      <VolumeSection />

      {/* Why now - the AI marketing gap */}
      <WhyEmpireSection />

      {/* Pour qui / Pas pour qui */}
      <ForWhoSection />

      {/* Features - 3 pillars */}
      <WhyNowSection />

      {/* FAQ */}
      <FAQSection variant="home" />

      {/* Final CTA */}
      <FinalBoostCTA />
    </main>
  )
}
