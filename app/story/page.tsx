import StoryHero from '@/components/sections/story/StoryHero'
import StoryJourney from '@/components/sections/story/StoryJourney'
import StoryBreakthrough from '@/components/sections/story/StoryBreakthrough'
import StoryResults from '@/components/sections/story/StoryResults'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'

export const metadata = {
  title: 'Our Story — Empire Internet',
  description: 'How I went from burnout to 1M+ views per month, and why I built Empire to help creators escape the content treadmill.'
}

export default function StoryPage() {
  return (
    <main className="relative">
      {/* Hero - Impactful */}
      <StoryHero />

      {/* The Journey - Visual timeline */}
      <StoryJourney />

      {/* The Breakthrough */}
      <StoryBreakthrough />

      {/* Results with images */}
      <StoryResults />

      {/* CTA */}
      <FinalBoostCTA />
    </main>
  )
}
