import FormatsHero from '@/components/sections/formats/FormatsHero'
import FormatsList from '@/components/sections/formats/FormatsList'
import BonusSection from '@/components/sections/BonusSection'
import FAQSection from '@/components/sections/FAQSection'
import FormatsCTA from '@/components/sections/formats/FormatsCTA'

export const metadata = {
  title: 'Recording Formats — Empire Internet',
  description: 'Choose how you want to create content: Interviews, Improvisation, Reels Scripts, or Automations.'
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
