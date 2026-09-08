import HeroSection from '@/components/sections/HeroSection'
import HomeDemoSection from '@/components/sections/HomeDemoSection'
import FormatsShowcaseSection from '@/components/sections/FormatsShowcaseSection'
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
      {/* Bandeau "Vu dans" juste sous le hero (choix Kevin, 8 septembre) :
          la preuve doit arriver avant le catalogue. Il a vécu sous le pricing
          un temps, trop bas pour quelqu'un qui décroche à la première page. */}
      <section className="w-full bg-black py-8 sm:py-10">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection />
        </div>
      </section>
      {/* Les formats tels qu'ils sortent de l'app, juste après la promesse :
          le hero dit « les formats qui marchent », cette section les montre
          avant que la démo n'explique le pipeline. */}
      <FormatsShowcaseSection />
      {/* Mur des plus gros créateurs FR tout de suite après les formats :
          on vient de montrer ce qu'on fait, voici qui le dit. Même widget
          Senja que sur `/pricing` et `/join/empire` de l'app. */}
      <TopCreatorsSection />
      <HomeDemoSection />
      <HowItWorksAccordion />
      <CaseStudiesSection />
      <HomeApplySection />
      <TestimonialsSection />
      <QuickWinsSection />
      <FounderSection />
      <FAQSection variant="home" />
      <FinalBoostCTA />
    </main>
  )
}
