import StoryHero from '@/components/sections/story/StoryHero'
import StoryJourney from '@/components/sections/story/StoryJourney'
import StoryCostSection from '@/components/sections/story/StoryCostSection'
import StoryBreakthrough from '@/components/sections/story/StoryBreakthrough'
import StoryResults from '@/components/sections/story/StoryResults'
import FinalBoostCTA from '@/components/sections/FinalBoostCTA'

export const metadata = {
  title: 'Notre Histoire — Empire Internet',
  description: 'Comment je suis passé du burnout à 1M+ de vues par mois, et pourquoi j\'ai créé Empire pour aider les créateurs à échapper au tapis roulant du contenu.'
}

export default function StoryPage() {
  return (
    <main className="relative">
      {/* Hero - Impactful */}
      <StoryHero />

      {/* The Journey - Visual timeline */}
      <StoryJourney />

      {/* The Hidden Cost - NEW SECTION */}
      <StoryCostSection />

      {/* The Breakthrough */}
      <StoryBreakthrough />

      {/* Results with images */}
      <StoryResults />

      {/* CTA */}
      <FinalBoostCTA />
    </main>
  )
}
