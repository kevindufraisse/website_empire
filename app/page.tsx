import HeroSection from '@/components/sections/HeroSection'
import HomeDemoSection from '@/components/sections/HomeDemoSection'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
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
      <HomeDemoSection />
      <HowItWorksAccordion />
      <CaseStudiesSection />
      <HomeApplySection />
      {/* Bandeau "Vu dans" — déplacé sous le bloc pricing/apply (choix Kevin) :
          au-dessus du hero il coupait la promesse ; en tête du bloc preuve, il
          enchaîne le prix vu juste avant, comme sur `/join/empire` et
          `/join/academy`. */}
      <section className="w-full bg-black py-10 sm:py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection />
        </div>
      </section>
      <TestimonialsSection />
      {/* Mur des plus gros créateurs FR — punch social proof, juste après
          les témoignages clients : d'abord les résultats, ensuite les noms
          qui pèsent. Même widget Senja que sur `/pricing` et
          `/join/empire` de l'app. */}
      <TopCreatorsSection />
      <QuickWinsSection />
      <FounderSection />
      <FAQSection variant="home" />
      <FinalBoostCTA />
    </main>
  )
}
