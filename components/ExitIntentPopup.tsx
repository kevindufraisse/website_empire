'use client'
import { useState, useEffect } from 'react'
import { X, Zap, Gift, Clock } from 'lucide-react'
import { RainbowButton } from './magicui/rainbow-button'

export function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
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
            Wait! Special Offer
          </h3>
          
          <p className="text-neutral-300 mb-6">
            Book a live demo in the next <span className="text-empire font-bold">10 minutes</span> and get:
          </p>

          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <Zap className="text-empire flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-white font-semibold text-sm">Priority Onboarding</p>
                <p className="text-xs text-neutral-400">Skip the waitlist, start next week</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <Zap className="text-empire flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-white font-semibold text-sm">Free Content Audit</p>
                <p className="text-xs text-neutral-400">€500 value · We analyze your current content</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <Zap className="text-empire flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-white font-semibold text-sm">10 Bonus Posts First Month</p>
                <p className="text-xs text-neutral-400">40 posts instead of 30</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-neutral-400 mb-4 text-center">Choose your next step:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <a
              href="https://us06web.zoom.us/meeting/register/_MDUpE-JSJmLRdqwh-OkTg#/registration"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg bg-empire text-black font-bold hover:scale-105 transition-all text-center"
              onClick={() => setDismissed(true)}
            >
                    <p className="text-sm mb-1">Join Live Q&A</p>
                    <p className="text-xs opacity-80">Tue/Thu 1PM CET</p>
            </a>
            <a
              href="/order"
              className="p-4 rounded-lg border-2 border-empire/30 text-white font-semibold hover:bg-empire/10 transition-all text-center"
              onClick={() => setDismissed(true)}
            >
              <p className="text-sm mb-1">Start Now</p>
              <p className="text-xs text-neutral-400">Skip the demo</p>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <Clock size={12} />
            <span>Bonuses expire when we hit 100 clients</span>
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


