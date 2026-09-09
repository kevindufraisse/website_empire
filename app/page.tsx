import HeroSection from '@/components/sections/HeroSection'
import HomeDemoSection from '@/components/sections/HomeDemoSection'
import FormatsShowcaseSection from '@/components/sections/FormatsShowcaseSection'
import RepurposingSection from '@/components/sections/RepurposingSection'
import MobileAppSection from '@/components/sections/MobileAppSection'
import IncludedFeaturesSection from '@/components/sections/IncludedFeaturesSection'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import HomeApplySection from '@/components/sections/HomeApplySection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import QuickWinsSection from '@/components/sections/QuickWinsSection'
import FounderSection from '@/components/sections/FounderSection'
import FAQSection from '@/components/sections/FAQSection'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'
import FeaturedInSection from '@/components/FeaturedInSection'
import FormulaBar from '@/components/FormulaBar'

export default function Page() {
  return (
    <main className="relative">
      <HeroSection />
      {/* Preuve d'abord (choix Kevin, 8 septembre) : presse, créateurs,
          clients, puis la démo. Tout ce qui explique le produit vient après. */}
      <section className="w-full bg-black py-8 sm:py-10">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection />
        </div>
      </section>
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
      {/* ÷ Temps + Coût en deux temps : l'app montre le temps (une heure par
          mois), le comparatif Seul / Freelances / Empire montre le coût. */}
      <div id="formula-cost">
        <MobileAppSection />
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
