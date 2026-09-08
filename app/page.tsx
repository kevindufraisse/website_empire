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
      <TestimonialsSection />
      <HomeDemoSection />
      {/* Le produit : les formats tels qu'ils sortent de l'app, pourquoi une
          idée sort partout, ce qui est inclus au-delà des formats, puis la
          comparaison avec les alternatives et les cas clients. */}
      <FormatsShowcaseSection />
      <RepurposingSection />
      <IncludedFeaturesSection />
      <QuickWinsSection />
      <CaseStudiesSection />
      {/* L'app en dernier argument, juste avant le formulaire. */}
      <MobileAppSection />
      <HomeApplySection />
      <FounderSection />
      <FAQSection variant="home" />
      <FinalBoostCTA />
    </main>
  )
}
