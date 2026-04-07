'use client'
import { X, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LAUNCH_OFFER_ACTIVE, PRICING } from '@/lib/pricing-config'
import { getCalApi } from "@calcom/embed-react"
import CallbackFormModal from '@/components/CallbackFormModal'
import { useCalLink } from '@/hooks/useCalLink'

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const { lang, t } = useLanguage()

  const namespace = 'audit-empire'
  const calLink = useCalLink()

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
    })()
  }, [namespace])

  // Ne pas afficher si pas en mode lancement ou si déjà fermé
  if (!LAUNCH_OFFER_ACTIVE || dismissed) return null

  const savings = PRICING.monthlyNormal - PRICING.monthly

  return (
    <div className="sticky top-0 left-0 right-0 bg-gradient-to-r from-empire via-[#c8e860] to-empire text-black py-1.5 px-4 z-[60] shadow-md">
      <div className="max-w-7xl mx-auto relative">
        <div className="relative flex items-center justify-center gap-2 text-center text-xs flex-wrap px-8 pr-10 py-0.5">
          <span className="font-bold">
            🔥 {lang === 'fr' ? 'LANCEMENT' : 'LAUNCH'}:
          </span>
          <span className="font-semibold">
            {lang === 'fr' 
              ? `Économisez ${savings}€/mois sur tous les plans`
              : `Save €${savings}/month on all plans`}
          </span>
          <button 
            type="button"
            title={t.common.ctaReassurance}
            data-cal-namespace={namespace}
            data-cal-link={calLink}
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="flex flex-col items-center gap-0 px-2 py-1 bg-black text-empire font-bold rounded hover:scale-105 transition-all ml-1"
          >
            <span className="leading-none text-[10px] sm:text-xs whitespace-nowrap">
              {t.common.startNow} →
            </span>
            <span className="text-[7px] sm:text-[8px] font-semibold text-empire/90 leading-tight text-center max-w-[8rem] sm:max-w-[10rem]">
              {t.common.ctaReassuranceCompact}
            </span>
          </button>
          <button
            onClick={() => setCallbackOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-black/80 text-white font-semibold rounded hover:scale-105 transition-all whitespace-nowrap ml-1"
          >
            <Phone size={10} />
            {lang === 'fr' ? 'Être recontacté' : 'Callback'}
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
