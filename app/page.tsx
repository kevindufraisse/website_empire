import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import HomeApplySection from '@/components/sections/HomeApplySection'
import FeaturedInSection from '@/components/FeaturedInSection'
import FormulaBar from '@/components/FormulaBar'

const HomeDemoSection = dynamic(() => import('@/components/sections/HomeDemoSection'))
const FormatsShowcaseSection = dynamic(() => import('@/components/sections/FormatsShowcaseSection'))
const RepurposingSection = dynamic(() => import('@/components/sections/RepurposingSection'))
const MobileAppSection = dynamic(() => import('@/components/sections/MobileAppSection'))
const IncludedFeaturesSection = dynamic(() => import('@/components/sections/IncludedFeaturesSection'))
const CaseStudiesSection = dynamic(() => import('@/components/sections/CaseStudiesSection'))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'))
const QuickWinsSection = dynamic(() => import('@/components/sections/QuickWinsSection'))
const FounderSection = dynamic(() => import('@/components/sections/FounderSection'))
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'))
const FinalBoostCTA = dynamic(() => import('@/components/sections/FinalBoostCTA'))

export default function Page() {
  return (
    <main className="relative">
      <HeroSection />
      {/* Preuve d'abord (choix Kevin, 8 septembre) : presse, créateurs,
          clients, puis la démo. Tout ce qui explique le produit vient après. */}
      <section className="w-full bg-black py-5 sm:py-6">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection />
        </div>
      </section>
      {/* Sentinelle de la porte email (`HomeEmailGate`) : une fois les logos
          passés, la suite de la page se dévoile contre un email vérifié. */}
      <div id="home-gate-trigger" aria-hidden className="h-px w-full" />
      <TopCreatorsSection />
      {/* Les ancres `formula-*` pilotent la FormulaBar : chaque section révèle
          le terme de la formule qu'elle démontre, dans l'ordre de la formule
          (Message × Format × Diffusion ÷ Temps + Coût = Visibilité). C'est
          pour ça que l'app (÷ Temps) vient juste après la diffusion, et pas
          en dernier argument. */}
      <div id="formula-message">
        <HomeDemoSection />
      </div>
      <div id="formula-format">
        <FormatsShowcaseSection />
      </div>
      <div id="formula-diffusion">
        <RepurposingSection />
      </div>
      {/* Témoignages clients ici et pas en haut (choix Kevin, 9 septembre) :
          le début de page avance plus vite vers la formule, et la preuve
          arrive une fois qu'on a vu ce que le produit fait. */}
      <TestimonialsSection />
      {/* ÷ Temps se révèle à l'app (une heure par mois), ÷ Coût au comparatif
          Seul / Freelances / Empire. */}
      <div id="formula-time">
        <MobileAppSection />
      </div>
      <div id="formula-cost">
        <QuickWinsSection />
      </div>
      <div id="formula-visibility">
        <IncludedFeaturesSection />
      </div>
      <CaseStudiesSection />
      <div id="formula-apply" className="scroll-mt-20">
        <HomeApplySection />
      </div>
      <FounderSection />
      <FAQSection variant="home" />
      <FinalBoostCTA />
      <FormulaBar />
    </main>
  )
}
