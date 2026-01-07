import PriceComparisonSection from '@/components/sections/PriceComparisonSection'
import PricingPlansSection from '@/components/sections/PricingPlansSection'
import InclusionsTableSection from '@/components/sections/InclusionsTableSection'
import GuaranteeSection from '@/components/sections/GuaranteeSection'
import ObjectionsSection from '@/components/sections/ObjectionsSection'
import FAQSection from '@/components/sections/FAQSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import PricingPageHero from '@/components/sections/PricingPageHero'
import LaunchUrgencySection from '@/components/sections/LaunchUrgencySection'
import RolesReplacedSection from '@/components/sections/RolesReplacedSection'

export const metadata = {
  title: 'Pricing — Empire Internet',
  description: 'From €833/month to €1,000/month. Compare to hiring a team (€12,000/month). See why Empire is the smart choice.'
}

export default function PricingPage() {
  return (
    <main className="relative">
      {/* Hero Pricing */}
      <PricingPageHero />

      {/* Testimonials - Social proof BEFORE price */}
      <TestimonialsSection />

      {/* Price Comparison Table - Agency vs In-house vs Empire */}
      <PriceComparisonSection />

      {/* Roles Replaced - NEW */}
      <RolesReplacedSection />

      {/* Pricing Plans - Monthly/Quarterly/Yearly */}
      <PricingPlansSection />

      {/* Launch Urgency - Why join now */}
      <LaunchUrgencySection />

      {/* What's Included - Simple table */}
      <InclusionsTableSection />

      {/* Guarantee - Flexible Trial */}
      <GuaranteeSection />

      {/* Objections - Address common concerns */}
      <ObjectionsSection />

      {/* FAQ Pricing */}
      <FAQSection variant="pricing" />
    </main>
  )
}
