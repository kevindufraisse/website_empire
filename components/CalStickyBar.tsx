'use client'
import { useEffect, useState, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Users, ArrowRight } from 'lucide-react'
import OnboardingLink from '@/components/OnboardingLink'
import { LAUNCH_OFFER_ACTIVE } from '@/lib/pricing-config'
import { SPOTS_ENABLED, SPOTS_LEFT } from '@/lib/launch-offer'

export default function CalStickyBar() {
  const { t, lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [isVisible, setIsVisible] = useState(false)

  // Randomized only after mount: Math.random() during render caused a hydration mismatch (SSR vs client)
  const [socialProofCount, setSocialProofCount] = useState(47)
  useEffect(() => {
    setSocialProofCount(47 + Math.floor(Math.random() * 7) - 3)
  }, [])
  const showSpots = LAUNCH_OFFER_ACTIVE && SPOTS_ENABLED
  const socialProof = useMemo(() => ({
    count: socialProofCount,
    text: lang === 'fr' ? `${socialProofCount} créateurs actifs ce mois` : `${socialProofCount} active creators this month`,
    spots: lang === 'fr' ? `${SPOTS_LEFT} places restantes` : `${SPOTS_LEFT} spots left`,
  }), [lang, socialProofCount])

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
            <p className="text-white font-semibold text-sm">
              {socialProof.text}
              {showSpots && <span className={`${accent.text} font-bold`}> · {socialProof.spots}</span>}
            </p>
          </div>

          {/* Mobile - Compact social proof */}
          <div className="sm:hidden flex items-center gap-2">
            <Users className={`${accent.text} flex-shrink-0`} size={16} />
            <p className="text-white font-medium text-xs">
              {showSpots ? <span className={`${accent.text} font-bold`}>{socialProof.spots}</span> : socialProof.text}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <OnboardingLink
              className={`flex flex-col items-center px-4 py-1.5 sm:px-6 sm:py-2 ${accent.btnBg} text-black font-bold rounded-lg hover:scale-105 transition-all ${accent.btnShadow} text-sm sm:text-base group whitespace-nowrap`}
            >
              <span className="flex items-center gap-2">
                {t.common.startNow}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </OnboardingLink>
          </div>
        </div>
      </div>
    </div>
  )
}
