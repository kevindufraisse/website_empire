'use client'
import { useState, useEffect } from 'react'
import { X, Zap, Gift, Clock, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { openLumaCalendar } from './GlobalLumaCalendar'

export function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
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
  }, [dismissed])

  if (!show || dismissed) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9998] flex items-center justify-center p-4 animate-fade-in">
      <div className="relative max-w-md w-full bg-gradient-to-br from-empire/20 via-black to-black border-2 border-empire rounded-2xl p-8 shadow-[0_0_60px_rgba(218,252,104,0.3)]">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-empire/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="text-empire" size={32} />
          </div>

          <h3 className="text-3xl font-bold text-white mb-3">
            {t.exitPopup.title}
          </h3>
          
          <p 
            className="text-neutral-300 mb-6"
            dangerouslySetInnerHTML={{ __html: t.exitPopup.subtitle }}
          />

          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <Zap className="text-empire flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-white font-semibold text-sm">{t.exitPopup.bonus1Title}</p>
                <p className="text-xs text-neutral-400">{t.exitPopup.bonus1Desc}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <Zap className="text-empire flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-white font-semibold text-sm">{t.exitPopup.bonus2Title}</p>
                <p className="text-xs text-neutral-400">{t.exitPopup.bonus2Desc}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <Zap className="text-empire flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-white font-semibold text-sm">{t.exitPopup.bonus3Title}</p>
                <p className="text-xs text-neutral-400">{t.exitPopup.bonus3Desc}</p>
              </div>
            </div>
          </div>

          {/* Main CTA */}
          <button
            onClick={() => {
              openLumaCalendar()
            }}
            className="w-full p-5 rounded-xl bg-gradient-to-r from-empire to-green-400 text-black font-bold hover:scale-[1.02] transition-all text-center mb-4 shadow-[0_0_30px_rgba(218,252,104,0.4)] group"
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-lg">{t.exitPopup.ctaButton}</p>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </div>
            <p className="text-sm opacity-80 mt-1">{t.exitPopup.ctaSchedule}</p>
          </button>

          {/* Secondary link */}
          <a
            href="/order"
            className="block text-center text-sm text-neutral-400 hover:text-empire transition-colors mb-6"
            onClick={() => setDismissed(true)}
          >
            {t.exitPopup.ctaSecondary} →
          </a>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <Clock size={12} />
            <span>{t.exitPopup.footer}</span>
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


