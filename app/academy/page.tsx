import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyWhyViralitySection from '@/components/sections/AcademyWhyViralitySection'
import AcademyHowItWorksSection from '@/components/sections/AcademyHowItWorksSection'
import AcademyTwoPathsSection from '@/components/sections/AcademyTwoPathsSection'
import AcademyProgramSection from '@/components/sections/AcademyProgramSection'
import AcademyProofStrip from '@/components/sections/AcademyProofStrip'
import AcademyTestimonialsSection from '@/components/sections/AcademyTestimonialsSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyPricingSection from '@/components/sections/AcademyPricingSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'
import AcademySocialProofToast from '@/components/sections/AcademySocialProofToast'
import CrossSellCTA from '@/components/sections/CrossSellCTA'

export const metadata = {
  title: 'Bootcamp Viralité 21 jours - Empire Internet',
  description: '21 jours pour apprendre la viralité sans écrire votre contenu. On trouve les sujets, vous parlez 15 min, on rédige tout. Sur sélection, 20 places.'
}

export default function AcademyPage() {
  return (
    <main className="relative">
      {/* Hero */}
      <AcademyHeroSection />

      {/* Pourquoi ce métier */}
      <AcademyWhyViralitySection />

      {/* Comment ça marche */}
      <AcademyHowItWorksSection />

      {/* 2 voies */}
      <AcademyTwoPathsSection />

      {/* Pricing - paiement direct */}
      <AcademyPricingSection />

      {/* Comment ça marche + programme */}
      <AcademyProgramSection />

      {/* Preuves avant/après */}
      <AcademyProofStrip />

      {/* Témoignages */}
      <AcademyTestimonialsSection />

      {/* Qui on est */}
      <AcademyWhoSection />

      {/* FAQ */}
      <AcademyFAQSection />

      {/* Cross-sell → Empire */}
      <CrossSellCTA variant="academy-to-empire" />

      {/* Toast candidatures */}
      <AcademySocialProofToast />
    </main>
  )
}
