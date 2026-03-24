'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { X, Users, FileCode, Zap, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// ── Academy countdown config (sync with AcademyPriceCountdown) ──────────────
const NEXT_PRICE = 597
const PRICE_DEADLINE = new Date('2026-04-10T23:59:59')
// ────────────────────────────────────────────────────────────────────────────

function useAcademyCountdown() {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null)
  useEffect(() => {
    const calc = () => {
      const diff = PRICE_DEADLINE.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft(null); return }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [])
  return timeLeft
}

export function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { lang } = useLanguage()
  const scriptContainerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  
  // Disable on partners and academy pages
  const isPartnersPage = pathname === '/partners'
  const isAcademyPage = pathname === '/academy'

  useEffect(() => {
    // Don't show on partners page
    if (isPartnersPage) return
    
    // Check if already shown in this session
    const hasShown = sessionStorage.getItem('exitPopupShown')
    if (hasShown) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true)
        sessionStorage.setItem('exitPopupShown', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [dismissed, isPartnersPage])

  // Load Systeme.io script when popup shows
  useEffect(() => {
    if (show && scriptContainerRef.current) {
      scriptContainerRef.current.innerHTML = ''
      
      const script = document.createElement('script')
      script.id = 'form-script-tag-exit-intent'
      script.src = 'https://www.join.empire-internet.com/public/remote/page/3637777627559af498e066585d240ec44e2df68b.js'
      script.async = true
      scriptContainerRef.current.appendChild(script)
    }
  }, [show])

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (show && !dismissed) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [show, dismissed])

  const content = {
    fr: {
      badge: '🎁 Accès Gratuit',
      title: 'Attendez !',
      subtitle: 'Rejoignez +700 entrepreneurs et récupérez :',
      benefit1: 'Templates N8N',
      benefit1Desc: 'Automatisations prêtes à l\'emploi',
      benefit2: 'Prompts de contenu',
      benefit2Desc: 'Nos meilleurs prompts IA',
      benefit3: 'Automatisations',
      benefit3Desc: 'Les dernières techniques',
      social: '+700 entrepreneurs nous font confiance',
    },
    en: {
      badge: '🎁 Free Access',
      title: 'Wait!',
      subtitle: 'Join 700+ entrepreneurs and get:',
      benefit1: 'N8N Templates',
      benefit1Desc: 'Ready-to-use automations',
      benefit2: 'Content Prompts',
      benefit2Desc: 'Our best AI prompts',
      benefit3: 'Automations',
      benefit3Desc: 'Latest techniques',
      social: '700+ entrepreneurs trust us',
    }
  }

  const t = content[lang as keyof typeof content] || content.en
  const academyCountdown = useAcademyCountdown()

  if (!show || dismissed) return null

  // ── Academy-specific popup ────────────────────────────────────────────────
  if (isAcademyPage) {
    return (
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9998] flex items-center justify-center p-4 animate-fade-in"
        onClick={() => setDismissed(true)}
      >
        <div
          className="relative max-w-md w-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-empire rounded-2xl shadow-[0_0_60px_rgba(218,252,104,0.3)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors z-10"
          >
            <X size={22} />
          </button>

          <div className="p-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-empire/20 border border-empire/30 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
              <span className="text-xs font-bold text-empire tracking-widest uppercase">Offre de lancement</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Attends — le prix monte bientôt.
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Tu pars, mais le prix de <span className="text-white font-semibold">497€</span> ne sera plus disponible longtemps.
            </p>

            {/* Countdown */}
            {academyCountdown && (
              <div className="mb-6">
                <p className="text-xs text-neutral-500 mb-3">
                  Le prix passe à <span className="text-empire font-bold">{NEXT_PRICE}€</span> dans
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[
                    { val: academyCountdown.d, unit: 'j' },
                    { val: academyCountdown.h, unit: 'h' },
                    { val: academyCountdown.m, unit: 'm' },
                    { val: academyCountdown.s, unit: 's' },
                  ].map(({ val, unit }) => (
                    <div key={unit} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-black border border-empire/40 flex items-center justify-center">
                        <span className="text-empire font-black text-xl tabular-nums leading-none">
                          {String(val).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-600 mt-1 uppercase">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <a
              href="https://www.join.empire-internet.com/academy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setDismissed(true)}
              className="block w-full py-4 rounded-xl bg-empire text-black font-bold text-base hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.35)] mb-3"
            >
              Rejoindre à 497€ maintenant →
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              Non merci, je préfère payer plus tard
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fade-in 0.3s ease-out; }
        `}</style>
      </div>
    )
  }
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9998] flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setDismissed(true)}
    >
      <div 
        className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-empire rounded-2xl shadow-[0_0_60px_rgba(218,252,104,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-empire/20 border border-empire/30 mb-4">
            <span className="text-sm font-semibold text-empire">{t.badge}</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {t.title}
          </h3>
          <p className="text-neutral-300">
            {t.subtitle}
          </p>
            </div>
            
        {/* Benefits */}
        <div className="px-6 py-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <FileCode className="text-empire mx-auto mb-2" size={24} />
            <p className="text-white font-semibold text-xs sm:text-sm">{t.benefit1}</p>
            <p className="text-neutral-400 text-[10px] sm:text-xs mt-1 hidden sm:block">{t.benefit1Desc}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <Zap className="text-empire mx-auto mb-2" size={24} />
            <p className="text-white font-semibold text-xs sm:text-sm">{t.benefit2}</p>
            <p className="text-neutral-400 text-[10px] sm:text-xs mt-1 hidden sm:block">{t.benefit2Desc}</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <Sparkles className="text-empire mx-auto mb-2" size={24} />
            <p className="text-white font-semibold text-xs sm:text-sm">{t.benefit3}</p>
            <p className="text-neutral-400 text-[10px] sm:text-xs mt-1 hidden sm:block">{t.benefit3Desc}</p>
              </div>
            </div>
            
        {/* Systeme.io Form */}
        <div className="px-6 py-4">
          <div 
            ref={scriptContainerRef}
            className="min-h-[150px] flex items-center justify-center"
          >
            <div className="text-neutral-400 text-sm">
              {lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </div>
          </div>
            </div>

        {/* Social proof */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
            <Users size={16} className="text-empire" />
            <span>{t.social}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
