import AcademyHeroSection from '@/components/sections/AcademyHeroSection'
import AcademyForWhoSection from '@/components/sections/AcademyForWhoSection'
import AcademyTwoPathsSection from '@/components/sections/AcademyTwoPathsSection'
import AcademyProgramSection from '@/components/sections/AcademyProgramSection'
import AcademyProofStrip from '@/components/sections/AcademyProofStrip'
import AcademyTestimonialsSection from '@/components/sections/AcademyTestimonialsSection'
import AcademyWhoSection from '@/components/sections/AcademyWhoSection'
import AcademyFAQSection from '@/components/sections/AcademyFAQSection'
import AcademyStickyBar from '@/components/sections/AcademyStickyBar'
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

      {/* Pour qui + 2 voies */}
      <AcademyForWhoSection />
      <AcademyTwoPathsSection />

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

      {/* Sticky CTA */}
      <AcademyStickyBar />

      {/* Toast candidatures */}
      <AcademySocialProofToast />
    </main>
  )
}
