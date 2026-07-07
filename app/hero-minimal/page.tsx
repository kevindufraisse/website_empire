import HeroMinimalSection from '@/components/sections/HeroMinimalSection'
import AbVariantTracker from '@/components/AbVariantTracker'

// Variant "minimal" of the hero_minimal A/B test.
// Users land here via the middleware rewrite (URL stays "/").
export const metadata = {
  robots: { index: false, follow: false },
}

export default function HeroMinimalPage() {
  return (
    <main className="relative">
      <AbVariantTracker experiment="hero_minimal" />
      <HeroMinimalSection />
    </main>
  )
}
