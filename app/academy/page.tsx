import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyHowItWorksSection from '@/components/sections/AcademyHowItWorksSection'
import AcademyWhyViralitySection from '@/components/sections/AcademyWhyViralitySection'
import AcademyProofStrip from '@/components/sections/AcademyProofStrip'
import AcademyTwoPathsSection from '@/components/sections/AcademyTwoPathsSection'
import AcademyCertificationSection from '@/components/sections/AcademyCertificationSection'
import AcademyProgramSection from '@/components/sections/AcademyProgramSection'
import AcademyTestimonialsSection from '@/components/sections/AcademyTestimonialsSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'
import AcademySocialProofToast from '@/components/sections/AcademySocialProofToast'
import CrossSellCTA from '@/components/sections/CrossSellCTA'
import FeaturedInSection from '@/components/FeaturedInSection'
export const metadata = {
  title: 'Devenez Head of Viralité en 21 jours - Empire Internet',
  description:
    "Apprenez à transformer l'expertise d'une marque en contenus qui attirent l'attention - puis faites-en votre métier. Même sans projet. 20 places, sur sélection.",
}

export default function AcademyPage() {
  return (
    <main className="relative">
      <AcademyHeroSection />
      <AcademyHowItWorksSection />
      <AcademyWhyViralitySection />
      <AcademyProofStrip />
      <AcademyTwoPathsSection />
      <AcademyCertificationSection />
      <AcademyProgramSection />
      {/* Bandeau "Vu dans" - déplacé sous le programme (choix Kevin) : après
          que le prospect a vu ce qu'il achète, la crédibilité média
          enchaîne juste avant le mur de témoignages élèves. */}
      <section className="w-full bg-black py-10 sm:py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <FeaturedInSection />
        </div>
      </section>
      <AcademyTestimonialsSection />
      <AcademyWhoSection />
      <AcademyFAQSection />
      <CrossSellCTA variant="academy-to-empire" />
      <AcademySocialProofToast />
    </main>
  )
}
