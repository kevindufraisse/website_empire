'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCalApi } from '@calcom/embed-react'

const CAL_NAMESPACE = 'yt-booking'
const CAL_BASE = 'team/empire-internet/audit-empire'

const AVATARS = [
  'https://i.pravatar.cc/48?img=11',
  'https://i.pravatar.cc/48?img=22',
  'https://i.pravatar.cc/48?img=33',
  'https://i.pravatar.cc/48?img=44',
]

export default function YoutubeAdForm() {
  const [step, setStep] = useState<'form' | 'booking'>('form')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [calLink, setCalLink] = useState(CAL_BASE)

  // Init Cal.com embed
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !email.trim()) return
    setLoading(true)

    // Build pre-filled Cal.com link
    const params = new URLSearchParams({
      name: firstName.trim(),
      email: email.trim(),
    })

    // Preserve emp referral param if present
    const emp = sessionStorage.getItem('emp') || new URLSearchParams(window.location.search).get('emp')
    if (emp) params.set('emp', emp)

    setCalLink(`${CAL_BASE}?${params.toString()}`)
    setLoading(false)
    setStep('booking')

    // Scroll to booking section smoothly
    setTimeout(() => {
      document.getElementById('yt-booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="w-full">
      {/* ── Step 1 : Form ─────────────────────────────── */}
      <AnimatePresence>
        {step === 'form' && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <div>
              <input
                type="text"
                placeholder="Ton prénom *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-empire/60 transition-colors text-sm"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Ton email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-empire/60 transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !firstName.trim() || !email.trim()}
              className="w-full py-4 rounded-xl bg-empire text-black font-bold text-base hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(218,252,104,0.35)] disabled:opacity-50 disabled:scale-100"
            >
              {loading ? 'Un instant…' : 'Choisir mon créneau →'}
            </button>
            <p className="text-center text-[11px] text-neutral-600">
              Appel de 30 min · Gratuit · Sans engagement
            </p>

            {/* Social proof mini */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="flex -space-x-2">
                {AVATARS.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-7 h-7 rounded-full border-2 border-black object-cover" />
                ))}
              </div>
              <p className="text-xs text-neutral-400">+200 entrepreneurs accompagnés</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── Step 2 : Cal.com booking ───────────────────── */}
      <AnimatePresence>
        {step === 'booking' && (
          <motion.div
            key="booking"
            id="yt-booking"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Confirmation message */}
            <div className="text-center mb-6 p-4 rounded-xl bg-empire/10 border border-empire/30">
              <p className="text-lg font-bold text-white">
                Parfait{firstName ? `, ${firstName}` : ''} 👋
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Choisis le créneau qui te convient — tes infos sont déjà pré-remplies.
              </p>
            </div>

            {/* Cal.com inline embed */}
            <div
              data-cal-namespace={CAL_NAMESPACE}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              style={{ width: '100%', height: '100%', overflow: 'scroll' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
