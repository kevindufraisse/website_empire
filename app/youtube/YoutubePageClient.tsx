'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { ArrowRight, Phone, Calendar } from 'lucide-react'
import CallbackFormModal from '@/components/CallbackFormModal'

const stats = [
  { value: '10M+', label: 'vues/mois générées' },
  { value: '3 000€', label: 'objectif mensuel élèves' },
  { value: '21j', label: 'pour tout maîtriser' },
]

const steps = [
  { n: '01', t: 'On t\'appelle', d: '15 minutes. On écoute, on comprend où tu en es.' },
  { n: '02', t: 'On voit si c\'est fait pour toi', d: 'Pas un pitch. Une vraie conversation.' },
  { n: '03', t: 'On te dit quoi faire', d: 'Admis dans le bootcamp — ou une autre direction si c\'est mieux pour toi.' },
]

export default function YoutubePageClient() {
  const [callbackOpen, setCallbackOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <CallbackFormModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />

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
            <span className="text-xs font-bold text-empire tracking-widest uppercase">Tu viens de regarder notre vidéo</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            La prochaine étape,
            <br />
            <span className="text-empire">c'est un appel.</span>
          </h1>
          <p className="text-neutral-400 text-base max-w-md mx-auto">
            En 15 minutes, on voit ensemble si et comment on peut t'aider à atteindre{' '}
            <span className="text-white font-semibold">3 000€/mois en 4h/semaine.</span>
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center justify-center gap-8 mb-10"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-lg font-black text-empire leading-none">{s.value}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Primary CTA — callback */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4"
        >
          <button
            onClick={() => setCallbackOpen(true)}
            className="w-full py-4 rounded-xl bg-empire text-black font-black text-base hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(218,252,104,0.35)] flex items-center justify-center gap-2"
          >
            <Phone size={16} />
            Être rappelé par Kevin ou Marc →
          </button>
          <p className="text-[11px] text-neutral-600 text-center mt-2">
            Formulaire 30s · Rappel dans les 24h · Aucun engagement
          </p>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-neutral-600 uppercase tracking-widest">ou</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Secondary — Cal.com booking */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-14"
        >
          <button
            data-cal-link="team/empire-internet/audit-empire"
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="w-full py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-sm hover:border-empire/40 hover:bg-empire/5 transition-all flex items-center justify-center gap-2"
          >
            <Calendar size={15} className="text-empire" />
            Choisir un créneau dans l'agenda →
          </button>
        </motion.div>

        {/* What happens next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-16 space-y-3"
        >
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest text-center mb-4">Ce qui se passe après</p>
          {steps.map((s, i) => (
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

        {/* Testimonials — Senja */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
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
