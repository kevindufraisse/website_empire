import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import BetaHeroExtras from '@/components/sections/BetaHeroExtras'
import AbVariantTracker from '@/components/AbVariantTracker'

const HomePricingSection = dynamic(() => import('@/components/sections/HomePricingSection'))

// Variant "minimal" of the hero_minimal A/B test.
// Users land here via the middleware rewrite (URL stays "/").
// Shows the current hero only, without the rest of the homepage sections.
export const metadata = {
  robots: { index: false, follow: false },
}

export default function HeroMinimalPage() {
  return (
    <main className="relative min-h-screen">
      <AbVariantTracker experiment="hero_minimal" />
      <HeroSection />
      <BetaHeroExtras />
      <HomePricingSection />
    </main>
  )
}
