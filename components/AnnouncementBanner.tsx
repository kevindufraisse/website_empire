'use client'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LAUNCH_OFFER_ACTIVE, PRICING } from '@/lib/pricing-config'

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false)
  const { lang } = useLanguage()

  // Ne pas afficher si pas en mode lancement ou si déjà fermé
  if (!LAUNCH_OFFER_ACTIVE || dismissed) return null

  const savings = PRICING.monthlyNormal - PRICING.monthly

  return (
    <div className="sticky top-0 left-0 right-0 bg-gradient-to-r from-empire via-[#c8e860] to-empire text-black py-1.5 px-4 z-[60] shadow-md">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-center gap-2 text-center text-xs">
          <span className="font-bold">
            🔥 {lang === 'fr' ? 'LANCEMENT' : 'LAUNCH'}:
          </span>
          <span className="font-semibold">
            {lang === 'fr' 
              ? `Économisez ${savings}€/mois sur tous les plans`
              : `Save €${savings}/month on all plans`}
          </span>
          <a 
            href="/pricing"
            className="px-2 py-0.5 bg-black text-empire font-bold rounded hover:scale-105 transition-all whitespace-nowrap ml-1"
          >
            {lang === 'fr' ? "J'en profite" : 'Get Offer'} →
          </a>
          
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-2 p-0.5 hover:bg-black/10 rounded transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

