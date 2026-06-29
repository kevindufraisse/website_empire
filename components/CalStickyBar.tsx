'use client'
import { useEffect, useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { getCalApi } from "@calcom/embed-react"
import { Users, ArrowRight, Flame } from 'lucide-react'
import { useCalLink } from '@/hooks/useCalLink'

export default function CalStickyBar() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [isVisible, setIsVisible] = useState(false)

  const socialProof = useMemo(() => {
    const base = 47
    const jitter = Math.floor(Math.random() * 7) - 3
    const count = base + jitter
    return {
      count,
      text: lang === 'fr' ? `${count} créateurs actifs ce mois` : `${count} active creators this month`,
      spotsText: lang === 'fr' ? `Plus que ${100 - count} places` : `Only ${100 - count} spots left`,
    }
  }, [lang])

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
  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us' || pathname === '/vsl' || pathname === '/webinar' || pathname === '/webinar/merci' || pathname === '/live'
  const isPaygPage = pathname?.startsWith('/hire-our-team')

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

  if (isPartnersPage || isAcademyPage || isCandidaturePage || isPaygPage || pathname === '/academy/merci') return null

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
          {/* Left side - Social proof (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${accent.bgSoft} flex items-center justify-center`}>
              <Users className={accent.text} size={20} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {socialProof.text}
              </p>
              <p className={`text-xs flex items-center gap-1 ${accent.text}`}>
                <Flame size={12} />
                {socialProof.spotsText}
              </p>
            </div>
          </div>

          {/* Mobile - Compact social proof */}
          <div className="sm:hidden flex items-center gap-2">
            <Flame className={`${accent.text} flex-shrink-0`} size={16} />
            <p className="text-white font-medium text-xs">
              {socialProof.spotsText}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className={`flex flex-col items-center px-4 py-1.5 sm:px-6 sm:py-2 ${accent.btnBg} text-black font-bold rounded-lg hover:scale-105 transition-all ${accent.btnShadow} text-sm sm:text-base group whitespace-nowrap`}
            >
              <span className="flex items-center gap-2">
                {t.common.startNow}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
