'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { getCalApi } from "@calcom/embed-react"
import { Calendar, ArrowRight, Phone } from 'lucide-react'
import CallbackFormModal from '@/components/CallbackFormModal'
import { useCalLink } from '@/hooks/useCalLink'

export default function CalStickyBar() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [isVisible, setIsVisible] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const pathname = usePathname()

  const accent = autopilot
    ? {
        border: 'border-autopilot/30',
        bgSoft: 'bg-autopilot/20',
        text: 'text-autopilot',
        btnBorderHover: 'hover:border-autopilot/40 hover:text-autopilot',
        btnBg: 'bg-autopilot',
        btnShadow: 'shadow-[0_0_20px_rgba(212,165,116,0.3)]',
      }
    : {
        border: 'border-empire/30',
        bgSoft: 'bg-empire/20',
        text: 'text-empire',
        btnBorderHover: 'hover:border-empire/40 hover:text-empire',
        btnBg: 'bg-empire',
        btnShadow: 'shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.3)]',
      }

  // Hide on partners and academy pages
  const isPartnersPage = pathname === '/partners'
  const isAcademyPage = pathname === '/academy'
  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname === '/vsl'

  const namespace = 'audit-empire'
  const calLink = useCalLink()

  useEffect(() => {
    if (isPartnersPage || isAcademyPage) return
    
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
      
      // Facebook Pixel tracking for booking confirmation
      cal("on", {
        action: "bookingSuccessful",
        callback: (e: any) => {
          console.log('Cal.com booking successful!', e)
          // Via GTM dataLayer
          if (typeof window !== 'undefined') {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              'event': 'cal_booking_confirmed',
              'booking_data': e
            });
            // Direct fbq call (fallback)
            if ((window as any).fbq) {
              (window as any).fbq('track', 'Schedule')
            }
          }
        }
      })
    })()
  }, [namespace, isPartnersPage])

  useEffect(() => {
    if (isPartnersPage || isAcademyPage) return
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight * 0.5
      const nearBottom = scrollY + window.innerHeight > document.body.scrollHeight - 400
      
      if (nearBottom || scrollY < 100) {
        setIsVisible(false)
      } else if (scrollY > heroHeight) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isPartnersPage])

  if (isPartnersPage || isAcademyPage || isCandidaturePage || pathname === '/academy/merci') return null

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Background blur */}
      <div className={`absolute inset-0 bg-black/90 backdrop-blur-md border-t ${accent.border}`} />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Text (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${accent.bgSoft} flex items-center justify-center`}>
              <Calendar className={accent.text} size={20} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {lang === 'fr' ? '300 000 vues/mois garanties' : '300K views/mo guaranteed'}
              </p>
              <p className="text-neutral-400 text-xs">
                {lang === 'fr' ? '45 min · Sans engagement' : '45 min · No commitment'}
              </p>
            </div>
          </div>

          {/* Mobile - Compact text */}
          <div className="sm:hidden flex items-center gap-2">
            <Calendar className={`${accent.text} flex-shrink-0`} size={18} />
            <p className="text-white font-medium text-sm">
              {lang === 'fr' ? '300 000 vues/mois garanties' : '300K views/mo guaranteed'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCallbackOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-2.5 bg-white/10 border border-white/20 text-white font-bold rounded-lg ${accent.btnBorderHover} transition-all text-sm sm:text-base whitespace-nowrap`}
            >
              <Phone size={16} />
              <span>{lang === 'fr' ? 'On vous rappelle' : 'We call you'}</span>
            </button>
            <button
              type="button"
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className={`flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-2.5 ${accent.btnBg} text-black font-bold rounded-lg hover:scale-105 transition-all ${accent.btnShadow} text-sm sm:text-base group whitespace-nowrap`}
            >
              {t.common.startNow}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      <CallbackFormModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </div>
  )
}
