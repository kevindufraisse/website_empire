import PartnerFinalCta from '@/components/sections/PartnerFinalCta'
import dynamic from 'next/dynamic'
import './home-flat.css'
import HeroSection from '@/components/sections/HeroSection'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import FormulaSecretReveal from '@/components/sections/FormulaSecretReveal'
import HomeApplySection from '@/components/sections/HomeApplySection'
import FeaturedInSection from '@/components/FeaturedInSection'
import HomeMasterclassGate, { MasterclassReminder } from '@/components/sections/HomeMasterclassGate'
import HomeTrialPrompt from '@/components/sections/HomeTrialPrompt'
import CompactIntegrations from '@/components/sections/CompactIntegrations'
import EmpireCommunitySection from '@/components/sections/EmpireCommunitySection'

const HomeDemoSection = dynamic(() => import('@/components/sections/HomeDemoSection'))
const CaseStudiesSection = dynamic(() => import('@/components/sections/CaseStudiesSection'))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'))
const FinalBoostCTA = dynamic(() => import('@/components/sections/FinalBoostCTA'))

export default function Page() {
  return (
    <main className="relative home-flat">
      <HeroSection />
      <section className="w-full bg-black py-4 sm:py-5">
        <div className="container mx-auto max-w-5xl px-4"><FeaturedInSection /></div>
      </section>
      <FormulaSecretReveal />
      <div id="home-creators"><TopCreatorsSection /></div>
      <HomeMasterclassGate>
        {/* The demo ends with the app and Claude. Keep the proof sequence uninterrupted. */}
        <div id="formula-message" data-formula-term="message" data-home-section="demo"><HomeDemoSection /></div>
        <div data-home-section="community"><EmpireCommunitySection /></div>
        <div data-home-section="tracking"><CompactIntegrations /></div>
        <div data-formula-term="temps" data-home-section="testimonials"><TestimonialsSection /></div>
        <div data-home-section="results"><CaseStudiesSection /></div>
        <div data-home-section="trial"><HomeTrialPrompt moment="proof" /></div>
        <div id="formula-cost" data-formula-term="cout" data-home-section="cost"><QuickWinsSection /></div>
        <div id="formula-apply" className="scroll-mt-20" data-home-section="apply"><HomeApplySection /></div>
        <MasterclassReminder />
        <FAQSection variant="home" />
        <FinalBoostCTA />
        <PartnerFinalCta />
      </HomeMasterclassGate>
    </main>
  )
}
