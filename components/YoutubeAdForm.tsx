'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCalApi } from '@calcom/embed-react'
import { Check } from 'lucide-react'

const CAL_NAMESPACE = 'yt-booking'
const CAL_BASE = 'team/empire-internet/audit-empire'

const AVATARS = [
  'https://i.pravatar.cc/48?img=11',
  'https://i.pravatar.cc/48?img=22',
  'https://i.pravatar.cc/48?img=33',
  'https://i.pravatar.cc/48?img=44',
  'https://i.pravatar.cc/48?img=55',
]

export default function YoutubeAdForm() {
  const [step, setStep] = useState<'form' | 'booking'>('form')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)
  const calInitialized = useRef(false)

  // Initialize Cal.com UI theme once
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE })
      cal('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
        theme: 'dark',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#dafc68' },
          dark: { 'cal-brand': '#dafc68' },
        },
      })
    })()
  }, [])

  // Trigger inline embed AFTER step switches to 'booking'
  useEffect(() => {
    if (step !== 'booking' || calInitialized.current) return
    calInitialized.current = true

    const params = new URLSearchParams({ email: email.trim() })
    // Cal.com standard field — phone requires a custom field in Cal.com event settings
    if (phone.trim()) params.set('phone', phone.trim())
    const emp = sessionStorage.getItem('emp') || new URLSearchParams(window.location.search).get('emp')
    if (emp) params.set('emp', emp)

    const calLink = `${CAL_BASE}?${params.toString()}`

    ;(async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE })
      cal('inline', {
        elementOrSelector: '#yt-cal-inline',
        calLink,
        layout: 'month_view',
      })
    })()

    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [step, email, phone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !phone.trim()) return
    setLoading(true)
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 400))
    setLoading(false)
    setStep('booking')
  }

  return (
    <div id="yt-form" className="w-full">

      {/* ── Step 1 : Form ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
              <p className="text-xs text-empire font-semibold">Appel offert · 30 min avec Kevin ou Marc</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Ton email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-empire/60 transition-colors text-base"
              />
              <input
                type="tel"
                placeholder="Ton numéro de téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                inputMode="tel"
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-empire/60 transition-colors text-base"
              />
              <button
                type="submit"
                disabled={loading || !email.trim() || !phone.trim()}
                className="w-full py-4 rounded-xl bg-empire text-black font-black text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(218,252,104,0.35)] disabled:opacity-40 disabled:scale-100 min-h-[56px]"
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Un instant…
                    </span>
                  : 'Réserver mon appel gratuit →'}
              </button>
            </form>

            <p className="text-center text-[11px] text-neutral-600 mt-2.5">
              Sans engagement · Tes données ne sont jamais revendues
            </p>

            <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-white/5">
              <div className="flex -space-x-2">
                {AVATARS.map((url, i) => (
                  <img key={i} src={url} alt="" width={28} height={28} className="w-7 h-7 rounded-full border-2 border-black object-cover" />
                ))}
              </div>
              <p className="text-xs text-neutral-400">+200 entrepreneurs accompagnés</p>
            </div>
          </motion.div>
        )}

        {/* ── Step 2 : Booking ───────────────────────────────── */}
        {step === 'booking' && (
          <motion.div
            key="booking"
            ref={bookingRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Success banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-empire/10 border border-empire/30 mb-5">
              <div className="w-7 h-7 rounded-full bg-empire flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-black" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">C'est noté 👋</p>
                <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">
                  Choisis ton créneau — ton email est déjà pré-rempli.
                </p>
              </div>
            </div>

            {/* Cal.com inline target — initialized via cal('inline', ...) */}
            <div
              id="yt-cal-inline"
              style={{ width: '100%', minHeight: '600px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Sticky mobile CTA ────────────────────────────────────────────── */
export function MobileStickyBookCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('yt-form')
      if (!el) return
      setVisible(el.getBoundingClientRect().bottom < 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-md border-t border-empire/20 px-4 py-3 pb-[env(safe-area-inset-bottom)]"
        >
          <button
            onClick={() => document.getElementById('yt-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full py-4 rounded-xl bg-empire text-black font-black text-base shadow-[0_0_30px_rgba(218,252,104,0.4)] active:scale-[0.98] transition-all"
          >
            Réserver mon appel gratuit →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
