import dynamic from 'next/dynamic'
import './home-flat.css'
import HeroSection from '@/components/sections/HeroSection'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import HomeApplySection from '@/components/sections/HomeApplySection'
import FeaturedInSection from '@/components/FeaturedInSection'
import FormulaBar from '@/components/FormulaBar'
import HomeMasterclassGate, { MasterclassReminder } from '@/components/sections/HomeMasterclassGate'
import HomeTrialPrompt from '@/components/sections/HomeTrialPrompt'
import CompactIntegrations from '@/components/sections/CompactIntegrations'
import EmpireCommunitySection from '@/components/sections/EmpireCommunitySection'

const HomeDemoSection = dynamic(() => import('@/components/sections/HomeDemoSection'))
const IncludedFeaturesSection = dynamic(() => import('@/components/sections/IncludedFeaturesSection'))
const CaseStudiesSection = dynamic(() => import('@/components/sections/CaseStudiesSection'))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'))
const FinalBoostCTA = dynamic(() => import('@/components/sections/FinalBoostCTA'))

export default function Page() {
  return (
    <main className="relative home-flat">
      <HeroSection />
      {/* Preuve d'abord (choix Kevin, 8 septembre) : presse, créateurs,
          clients, puis la démo. Tout ce qui explique le produit vient après. */}
      <section className="w-full bg-black py-4 sm:py-5">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection />
        </div>
      </section>
      <TopCreatorsSection />
      <HomeMasterclassGate>
      {/* Les ancres `formula-*` pilotent la FormulaBar : chaque section révèle
          le terme de la formule qu'elle démontre, dans l'ordre de la formule
          (Message × Format × Diffusion) / (Temps + Coût). C'est
          pour ça que l'application (Temps), puis le comparatif (Coût), suivent la diffusion. */}
      <div id="formula-message">
        <HomeDemoSection />
      </div>
      <div id="formula-cost"><QuickWinsSection /></div>
      <EmpireCommunitySection />
      <CompactIntegrations />
      <TestimonialsSection />
      <HomeTrialPrompt moment="proof" />
      <div id="formula-visibility">
        <IncludedFeaturesSection />
      </div>
      <CaseStudiesSection />
      {/* Les prix restent sur /tarifs ; l'accueil propose l'essai et un lien vers les offres. */}
      <div id="formula-apply" className="scroll-mt-20">
        <HomeApplySection />
      </div>
      <MasterclassReminder />
      <FAQSection variant="home" />
      <FinalBoostCTA />
      </HomeMasterclassGate>
      <FormulaBar />
    </main>
  )
}
