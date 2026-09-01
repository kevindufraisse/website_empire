import FormatsHero from '@/components/sections/formats/FormatsHero'
import FormatsList from '@/components/sections/formats/FormatsList'
import BonusSection from '@/components/sections/BonusSection'
import FAQSection from '@/components/sections/FAQSection'
import FormatsCTA from '@/components/sections/formats/FormatsCTA'

export const metadata = {
  title: 'Formats d\'enregistrement - Empire Internet',
  description: 'Interview, dictée, screen recording, scripts. Vous parlez, on publie sur 7 réseaux.',
  robots: { index: false, follow: false },
}

export default function FormatsPage() {
  return (
    <main className="relative">
      {/* Hero */}
      <FormatsHero />

      {/* Comparison Table removed */}

      {/* The 6 Formats */}
      <FormatsList />

      {/* Bonus Features - LinkedIn AI Setter + API */}
      <BonusSection />

      {/* FAQ Formats */}
      <FAQSection variant="formats" />

      {/* CTA */}
      <FormatsCTA />
    </main>
  )
}
