'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

type Step = 'choice' | 'community'

export function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [step, setStep] = useState<Step>('choice')
  const { lang } = useLanguage()
  const scriptContainerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const isPartnersPage = pathname === '/partners'
  const isAcademyPage = pathname === '/academy'
  const isCandidaturePage = pathname === '/candidature' || pathname === '/decouverte' || pathname === '/join-us'
  const isQuizPage = pathname === '/quiz'

  useEffect(() => {
    if (isPartnersPage || isCandidaturePage || isQuizPage) return

    const hasShown = sessionStorage.getItem('exitPopupShown')
    if (hasShown) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        // Don't trigger if the quiz fullscreen popup is open
        if (document.getElementById('quiz-popup-overlay')) return
        setShow(true)
        sessionStorage.setItem('exitPopupShown', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [dismissed, isPartnersPage, isCandidaturePage, isQuizPage])

  useEffect(() => {
    if (step === 'community' && scriptContainerRef.current) {
      scriptContainerRef.current.innerHTML = ''
      const script = document.createElement('script')
      script.id = 'form-script-tag-exit-intent'
      script.src = 'https://www.join.empire-internet.com/public/remote/page/3637777627559af498e066585d240ec44e2df68b.js'
      script.async = true
      scriptContainerRef.current.appendChild(script)
    }
  }, [step])

  useEffect(() => {
    if (show && !dismissed) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [show, dismissed])

  if (!show || dismissed) return null

  // ── Academy-specific popup ──
  if (isAcademyPage) {
    return (
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9998] flex items-center justify-center p-4 animate-fade-in"
        onClick={() => setDismissed(true)}
      >
        <div
          className="relative max-w-md w-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-academy rounded-2xl shadow-[0_0_60px_rgba(252,165,165,0.3)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors z-10"
          >
            <X size={22} />
          </button>
          <div className="p-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-academy/20 border border-academy/30 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-academy animate-pulse" />
              <span className="text-xs font-bold text-academy tracking-widest uppercase">Offre de lancement</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              497€ au lieu de 897€
            </h3>
            <p className="text-neutral-400 text-sm mb-4">
              21 posts LinkedIn + 21 Shorts créés pour toi.{' '}
              <span className="text-white font-semibold">+3 000€ de contenu inclus.</span>
            </p>
            <div className="flex flex-col gap-1.5 text-left mb-5">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <span className="text-academy">✓</span>
                <span>Paiement en 3x possible (165€/semaine)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <span className="text-academy">✓</span>
                <span>Pas besoin de projet - on t&apos;en trouve un</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <span className="text-academy">✓</span>
                <span>497€ jusqu&apos;au 9 mai, puis 697€, puis 897€</span>
              </div>
            </div>
            <a
              href="https://join.empire-internet.com/academy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setDismissed(true)}
              className="block w-full py-4 rounded-xl bg-academy text-black font-bold text-base hover:scale-105 transition-all shadow-[0_0_20px_rgba(252,165,165,0.35)] mb-3"
            >
              Confirmer ma place - 497€
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs text-neutral-400 hover:text-neutral-400 transition-colors"
            >
              Non merci
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

  // ── Default popup: choice → community ──
  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9998] flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setDismissed(true)}
    >
      <div
        className="relative max-w-sm w-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-empire rounded-2xl shadow-[0_0_60px_rgb(var(--empire-rgb)_/_0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {step === 'choice' && (
          <div className="p-5 text-center">
            <p className="text-xs text-empire font-bold uppercase tracking-widest mb-3">⚠️ Avant de partir</p>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-5">
              {lang === 'fr'
                ? <>Les 3 erreurs à ne pas faire<br />avant d&apos;automatiser son contenu</>
                : <>3 mistakes to avoid<br />before automating your content</>}
            </h3>
            <p className="text-neutral-400 text-sm mb-5">
              {lang === 'fr'
                ? '8 mois de recherche pour créer un système 100% automatisé.'
                : '8 months of research to build a 100% automated system.'}
            </p>
            <button
              onClick={() => window.open('/vsl', '_blank')}
              className="w-full py-3.5 rounded-xl bg-empire text-black font-bold text-sm hover:scale-[1.03] active:scale-100 transition-all shadow-[0_0_20px_rgb(var(--empire-rgb)_/_0.35)] mb-2.5"
            >
              {lang === 'fr' ? 'Oui, je veux voir →' : 'Yes, show me →'}
            </button>
            <button
              onClick={() => setStep('community')}
              className="text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
            >
              {lang === 'fr' ? 'Non, ça ne m\'intéresse pas' : 'No, not interested'}
            </button>
          </div>
        )}

        {step === 'community' && (
          <div className="p-5 text-center">
            <p className="text-xs text-empire font-bold uppercase tracking-widest mb-3">🎁 Gratuit</p>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-2">
              {lang === 'fr'
                ? 'Rejoignez +700 entrepreneurs'
                : 'Join 700+ entrepreneurs'}
            </h3>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                <img src="/n8n-logo.png" alt="n8n" className="w-4 h-4 rounded" />
                <span className="text-[11px] text-neutral-300 font-medium">Templates N8N</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="text-[11px]">🤖</span>
                <span className="text-[11px] text-neutral-300 font-medium">Prompts IA</span>
              </div>
            </div>
            <div
              ref={scriptContainerRef}
              className="min-h-[120px] flex items-center justify-center"
            >
              <div className="text-neutral-400 text-xs">
                {lang === 'fr' ? 'Chargement...' : 'Loading...'}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}
