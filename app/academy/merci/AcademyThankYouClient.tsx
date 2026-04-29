'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, ArrowRight, Calendar, Mail, Sparkles, Share2, X } from 'lucide-react'
import { COHORT_RANGE_SHORT } from '@/lib/cohort-config'
import CalPopupButton from '@/components/CalPopupButton'

type Choice = null | 'later' | 'maybe'

const founders = [
  { name: 'Kevin', img: '/founders/kevin.jpg' },
  { name: 'Marc', img: '/founders/marc.jpg' },
]

export default function AcademyThankYouClient() {
  const [choice, setChoice] = useState<Choice>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ event: 'academy_purchase_confirmed' })
      if ((window as any).fbq) {
        ;(window as any).fbq('track', 'Purchase', { value: 497, currency: 'EUR' })
      }
    }
  }, [])

  function shareLink() {
    const url = 'https://empire-internet.com/academy'
    if (navigator.share) {
      navigator.share({ title: 'Empire Academy', url })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden pt-20 md:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(252,165,165,0.1),transparent)]" />

      <div className="relative z-10 container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Confirmation Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-14 h-14 rounded-full bg-academy/20 border-2 border-academy flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="text-academy" size={28} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-4xl font-black text-white mb-3"
            >
              Bienvenue dans <span className="text-academy">Empire Academy.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base text-neutral-400 max-w-lg mx-auto"
            >
              Votre paiement est confirmé. Vous recevrez votre accès au groupe privé 3 jours avant le démarrage ({COHORT_RANGE_SHORT}).
            </motion.p>
          </div>

          {/* Upsell card */}
          <AnimatePresence mode="wait">
            {choice === null && (
              <motion.div
                key="offer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative rounded-2xl border border-academy/30 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 md:p-8 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-academy to-transparent" />

                  <p className="text-xs font-bold text-academy tracking-widest uppercase mb-2">Vous voulez aller plus loin ?</p>
                  <h2 className="text-lg md:text-xl font-bold text-white leading-tight mb-4">
                    Empire peut tout faire pour vous.
                  </h2>

                  <div className="space-y-2 mb-5 text-sm text-neutral-300 leading-relaxed">
                    <p>
                      L&apos;Academy vous apprend le systeme. <span className="text-white font-semibold">Empire, c&apos;est l&apos;etape d&apos;apres :</span> on prend en charge votre production de contenu. Vous n&apos;avez plus a publier.
                    </p>
                    <p className="text-academy font-semibold text-sm">
                      Si vous rejoignez Empire, vos 497 euros d&apos;Academy sont rembourses.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2">
                    <CalPopupButton className="p-3.5 rounded-xl bg-academy text-black font-bold text-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(252,165,165,0.2)] cursor-pointer text-center">
                      Reserver un appel
                    </CalPopupButton>
                    <button
                      onClick={() => setChoice('maybe')}
                      className="p-3.5 rounded-xl bg-white/[0.06] border border-white/15 text-white font-semibold text-sm hover:bg-white/[0.1] transition-all text-center"
                    >
                      En savoir plus
                    </button>
                    <button
                      onClick={() => setChoice('later')}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-neutral-400 text-sm hover:bg-white/[0.06] transition-all text-center"
                    >
                      Plus tard
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {choice === 'maybe' && (
              <motion.div
                key="maybe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="relative rounded-2xl border border-academy/30 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 md:p-8 overflow-hidden">
                  <button
                    onClick={() => setChoice(null)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>

                  <p className="text-xs font-bold text-academy tracking-widest uppercase mb-2">Comment ca se passe</p>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-5">
                    Un appel de 15 minutes avec notre equipe.
                  </h2>

                  <div className="space-y-3 mb-6">
                    {[
                      { t: 'On regarde votre business', d: 'Votre activite, vos objectifs, ce que vous faites deja.' },
                      { t: 'On vous explique ce qu\'on ferait', d: 'Production quotidienne LinkedIn + Shorts + newsletter. Vous validez, on publie.' },
                      { t: 'Vous decidez', d: 'Si c\'est non, l\'Academy demarre comme prevu. Si c\'est oui, on rembourse les 497 euros.' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-academy/10 border border-academy/30 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-academy">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{s.t}</p>
                          <p className="text-xs text-neutral-400 leading-relaxed">{s.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <CalPopupButton className="w-full block px-6 py-3.5 bg-academy text-black font-bold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(252,165,165,0.25)] cursor-pointer text-center">
                    Reserver mon creneau
                  </CalPopupButton>
                  <button
                    onClick={() => setChoice('later')}
                    className="block mx-auto mt-3 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    Plus tard, je commence l&apos;Academy
                  </button>
                </div>
              </motion.div>
            )}

            {choice === 'later' && (
              <motion.div
                key="later"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 md:p-8 text-center">
                  <button
                    onClick={() => setChoice(null)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>

                  <p className="text-lg font-bold text-white mb-2">
                    Pas de souci. Concentrez-vous sur l&apos;Academy.
                  </p>
                  <p className="text-sm text-neutral-400 max-w-md mx-auto">
                    L&apos;offre reste valable pendant les 21 jours du bootcamp. Ecrivez-nous a tout moment a support@empire-internet.com.
                  </p>
                  <button
                    onClick={() => setChoice(null)}
                    className="mt-4 text-xs text-academy hover:underline"
                  >
                    Revoir l&apos;offre
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
            <p className="text-xs font-bold text-neutral-500 tracking-widest uppercase mb-3 text-center">Prochaines etapes</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-white text-sm font-semibold mb-1">Bloquez votre agenda</p>
                <p className="text-neutral-400 text-xs leading-relaxed">{COHORT_RANGE_SHORT}. 15 min/jour pour publier.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-white text-sm font-semibold mb-1">Preparez 3 sujets</p>
                <p className="text-neutral-400 text-xs leading-relaxed">Les themes sur lesquels vous voulez etre reconnu.</p>
              </div>
            </div>
          </motion.div>

          {/* Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-neutral-500 mb-3">Quelqu&apos;un dans votre entourage devrait faire le bootcamp ?</p>
            <button
              onClick={shareLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white font-medium hover:bg-white/[0.1] transition-all"
            >
              <Share2 size={14} className="text-academy" />
              {copied ? 'Lien copie' : 'Partager le bootcamp'}
            </button>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-neutral-500">
              Une question ? <a href="mailto:support@empire-internet.com" className="text-neutral-300 hover:text-white transition-colors">support@empire-internet.com</a>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
