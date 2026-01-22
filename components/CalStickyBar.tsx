'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { getCalApi } from "@calcom/embed-react"
import { Calendar, ArrowRight } from 'lucide-react'

export default function CalStickyBar() {
  const { lang } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // Hide on partners page
  const isPartnersPage = pathname === '/partners'

  const namespace = 'empire-demo'
  const calLink = 'jules-bernard-g7tpow/empire-demo'

  useEffect(() => {
    if (isPartnersPage) return
    
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
        callback: () => {
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Schedule')
            console.log('Facebook Pixel: Schedule event fired')
          }
        }
      })
    })()
  }, [namespace, isPartnersPage])

  useEffect(() => {
    if (isPartnersPage) return
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight * 0.5
      
      if (scrollY > heroHeight) {
        setIsVisible(true)
      } else if (scrollY < 100) {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isPartnersPage])

  // Don't render on partners page
  if (isPartnersPage) return null

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Background blur */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md border-t border-empire/30" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Text (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-empire/20 flex items-center justify-center">
              <Calendar className="text-empire" size={20} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {lang === 'fr' ? 'Prêt à transformer votre contenu ?' : 'Ready to transform your content?'}
              </p>
              <p className="text-neutral-400 text-xs">
                {lang === 'fr' ? '30+ contenus/semaine • Résultats en 24h' : '30+ contents/week • Results in 24h'}
              </p>
            </div>
          </div>

          {/* Mobile - Compact text */}
          <div className="sm:hidden flex items-center gap-2">
            <Calendar className="text-empire flex-shrink-0" size={18} />
            <p className="text-white font-medium text-sm">
              {lang === 'fr' ? '30+ contenus/semaine' : '30+ contents/week'}
            </p>
          </div>

          {/* CTA Button */}
          <button
            data-cal-namespace={namespace}
            data-cal-link={calLink}
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-empire text-black font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)] text-sm sm:text-base whitespace-nowrap group"
          >
            {lang === 'fr' ? 'Audit gratuit' : 'Free Audit'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
