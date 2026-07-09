'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Flame } from 'lucide-react'
import { LAUNCH_OFFER_ACTIVE } from '@/lib/pricing-config'
import { SPOTS_ENABLED, SPOTS_LABEL_FR, SPOTS_LABEL_EN } from '@/lib/launch-offer'

export default function CalStickyBar() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [isVisible, setIsVisible] = useState(false)

  const pathname = usePathname()

  const accent = autopilot
    ? { border: 'border-autopilot/30', text: 'text-autopilot' }
    : { border: 'border-empire/30', text: 'text-empire' }

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
  if (!LAUNCH_OFFER_ACTIVE || !SPOTS_ENABLED) return null

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
      <div className="relative max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center gap-2">
          <Flame className={`${accent.text} flex-shrink-0`} size={14} />
          <p className="text-white font-semibold text-xs sm:text-sm">
            <span className={accent.text}>{lang === 'fr' ? 'Offre de lancement' : 'Launch offer'}</span>
            {' — '}
            {(lang === 'fr' ? SPOTS_LABEL_FR : SPOTS_LABEL_EN).toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  )
}
