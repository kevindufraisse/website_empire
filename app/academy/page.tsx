import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyHowItWorksSection from '@/components/sections/AcademyHowItWorksSection'
import AcademyTwoPathsSection from '@/components/sections/AcademyTwoPathsSection'
import AcademyProgramSection from '@/components/sections/AcademyProgramSection'
import AcademyProofStrip from '@/components/sections/AcademyProofStrip'
import AcademyTestimonialsSection from '@/components/sections/AcademyTestimonialsSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyPricingSection from '@/components/sections/AcademyPricingSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'
import AcademySocialProofToast from '@/components/sections/AcademySocialProofToast'

export const metadata = {
  title: 'Bootcamp Viralité 21 jours - Empire Internet',
  description: '21 jours pour apprendre la viralité sans écrire ton contenu. On trouve les sujets, tu parles 15 min, on rédige tout. Sur sélection, 20 places.'
}

export default function AcademyPage() {
  return (
    <main className="relative">
      {/* Hero */}
      <AcademyHeroSection />

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


      {/* Toast candidatures */}
      <AcademySocialProofToast />
    </main>
  )
}
