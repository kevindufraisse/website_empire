'use client'
import { X, Phone } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LAUNCH_OFFER_ACTIVE } from '@/lib/pricing-config'
import CallbackFormModal from '@/components/CallbackFormModal'
import OnboardingLink from '@/components/OnboardingLink'

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const { lang, t } = useLanguage()

  // Ne pas afficher si pas en mode lancement ou si déjà fermé
  if (!LAUNCH_OFFER_ACTIVE || dismissed) return null

  return (
    <div className="sticky top-0 left-0 right-0 bg-empire text-black py-1.5 px-4 z-[60] shadow-md">
      <div className="max-w-7xl mx-auto relative">
        <div className="relative flex items-center justify-center gap-2 text-center text-xs flex-wrap px-8 pr-10 py-0.5">
          <span className="font-bold">
            🔥 {lang === 'fr' ? 'LANCEMENT' : 'LAUNCH'}:
          </span>
          <span className="font-semibold">
            {lang === 'fr' 
              ? `Offre limitée - demandez votre devis personnalisé`
              : `Limited-time offer - request your personalized quote`}
          </span>
          <OnboardingLink className="flex flex-col items-center gap-0 px-2 py-1 bg-black text-empire font-bold rounded hover:scale-105 transition-all ml-1">
            <span className="leading-none text-[10px] sm:text-xs whitespace-nowrap">
              {t.common.startNow} →
            </span>
            <span className="text-[7px] sm:text-[8px] font-semibold text-empire/90 leading-tight text-center max-w-[8rem] sm:max-w-[10rem]">
              {lang === 'fr' ? 'Audit gratuit' : 'Free audit'}
            </span>
          </OnboardingLink>
          <button
            onClick={() => setCallbackOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-black/80 text-white font-semibold rounded hover:scale-105 transition-all whitespace-nowrap ml-1"
          >
            <Phone size={10} />
            {lang === 'fr' ? 'On vous rappelle' : 'We call you'}
          </button>
          
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 hover:bg-black/10 rounded transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <CallbackFormModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </div>
  )
}
