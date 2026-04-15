'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Script from 'next/script'
import { Check, Phone, ArrowRight, Calendar } from 'lucide-react'
import { CtaReassurance } from '@/components/ui/cta-reassurance'

const stats = [
  { value: '10M+', label: 'vues/mois générées' },
  { value: '3 000€', label: 'objectif mensuel élèves' },
  { value: '21j', label: 'pour tout maîtriser' },
]

function CallbackForm() {
  const [form, setForm] = useState({ first_name: '', phone: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.phone && !form.email) {
      setError('Saisissez au moins votre téléphone ou votre email.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'youtube' }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-10 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-empire/20 border border-empire flex items-center justify-center">
          <Check className="text-empire" size={28} />
        </div>
        <p className="text-xl font-black text-white">C'est bon !</p>
        <p className="text-neutral-400 text-sm max-w-xs">
          On vous appelle dans les <span className="text-white font-semibold">24h</span> pour faire le point et voir si on peut vous aider.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Votre prénom"
            value={form.first_name}
            onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-empire/60 transition-colors"
          />
        </div>
        <div className="flex-1">
          <input
            type="tel"
            placeholder="Votre 06 / 07"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-empire/60 transition-colors"
          />
        </div>
      </div>
      <input
        type="email"
        placeholder="Votre email (pour recevoir la confirmation)"
        value={form.email}
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-empire/60 transition-colors"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-empire text-black font-black text-base hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(218,252,104,0.35)] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
      >
        <Phone size={16} />
        {loading ? 'Envoi…' : 'Je veux être rappelé →'}
      </button>
      <p className="text-[11px] text-neutral-600 text-center">
        On ne revend pas vos données · Rappel sous 24h · Aucun engagement
      </p>
    </form>
  )
}

export default function YoutubePageClient() {
  const [calLoaded, setCalLoaded] = useState(false)
  const calRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (calLoaded && calRef.current) {
      window.Cal?.('ui', { theme: 'dark', styles: { branding: { brandColor: '#DAFC68' } } })
    }
  }, [calLoaded])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cal.com embed script */}
      <Script
        src="https://cal.com/embed.js"
        onLoad={() => setCalLoaded(true)}
      />

      {/* No header, no footer - pure conversion */}
      <div className="max-w-xl mx-auto px-4 py-12 md:py-20">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <a href="/" className="text-empire font-black text-xl tracking-tight">
            Empire <span className="text-white">Internet</span>
          </a>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-empire/10 border border-empire/30 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
            <span className="text-xs font-bold text-empire tracking-widest uppercase">Vous venez de regarder notre vidéo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            La prochaine étape,
            <br />
            <span className="text-empire">c'est un appel.</span>
          </h1>
          <p className="text-neutral-400 text-base max-w-md mx-auto">
            En 15 minutes, on voit ensemble si et comment on peut vous aider à atteindre{' '}
            <span className="text-white font-semibold">3 000€/mois en 4h/semaine.</span>
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-lg font-black text-empire leading-none">{s.value}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Primary - Callback form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-empire/15 to-empire/5 border border-empire/40 shadow-[0_0_40px_rgba(218,252,104,0.1)] mb-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-empire/20 border border-empire/40 flex items-center justify-center flex-shrink-0">
              <Phone size={13} className="text-empire" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Être rappelé par Kevin ou Marc</p>
              <p className="text-neutral-500 text-[11px]">On vous appelle dans les 24h - à l'heure qui vous arrange</p>
            </div>
          </div>
          <CallbackForm />
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-neutral-600 uppercase tracking-widest">ou</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Secondary - Cal.com booking */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-14"
        >
          <button
            ref={calRef}
            data-cal-link="team/empire-internet/audit-empire"
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="w-full py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-sm hover:border-empire/40 hover:bg-empire/5 transition-all flex items-center justify-center gap-2"
          >
            <Calendar size={15} className="text-empire" />
            Choisir un créneau dans l'agenda →
          </button>
          <CtaReassurance className="mt-2.5 !text-neutral-500 text-[11px] leading-snug" />
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-16 space-y-3"
        >
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest text-center mb-4">Ce qui se passe après</p>
          {[
            { n: '01', t: 'On vous appelle', d: '15 minutes. On écoute, on comprend où vous en êtes.' },
            { n: '02', t: 'On voit si c\'est fait pour vous', d: 'Pas un pitch. Une vraie conversation.' },
            { n: '03', t: 'On vous dit quoi faire', d: 'Admis dans le bootcamp - ou une autre direction si c\'est mieux pour vous.' },
          ].map((s, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-empire/10 border border-empire/30 flex items-center justify-center flex-shrink-0 text-[11px] font-black text-empire">
                {s.n}
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{s.t}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{s.d}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials - Senja */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest text-center mb-8">Ce qu'en disent ceux qui sont passés par là</p>
          <div
            className="senja-embed"
            data-id="dbb797c0-9c9f-491d-8b35-7bb197153711"
            data-mode="shadow"
            data-lazyload="false"
            style={{ display: 'block', width: '100%' }}
          />
          <Script
            src="https://widget.senja.io/widget/dbb797c0-9c9f-491d-8b35-7bb197153711/platform.js"
            strategy="afterInteractive"
          />
        </motion.div>

        {/* Minimal footer */}
        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-neutral-600">© 2026 Empire Internet</span>
          <a href="/academy" className="text-xs text-neutral-500 hover:text-empire transition-colors flex items-center gap-1">
            Voir le bootcamp <ArrowRight size={11} />
          </a>
        </div>

      </div>
    </div>
  )
}
