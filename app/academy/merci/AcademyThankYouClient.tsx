'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, ArrowRight, Calendar, MessageCircle, Sparkles, X } from 'lucide-react'
import CalPopupButton from '@/components/CalPopupButton'

type Choice = null | 'later' | 'maybe'

const founders = [
  { name: 'Kevin', img: '/founders/kevin.jpg' },
  { name: 'Marc', img: '/founders/marc.jpg' },
]

export default function AcademyThankYouClient() {
  const [choice, setChoice] = useState<Choice>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ event: 'academy_purchase_confirmed' })
      if ((window as any).fbq) {
        ;(window as any).fbq('track', 'Purchase', { value: 497, currency: 'EUR' })
      }
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden pt-20 md:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(252,165,165,0.1),transparent)]" />

      <div className="relative z-10 container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">

          {/* Confirmation Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-16 h-16 rounded-full bg-academy/20 border-2 border-academy flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 className="text-academy" size={32} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-black text-white mb-3"
            >
              Bienvenue dans <span className="text-academy">Empire Academy.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-neutral-400 max-w-xl mx-auto"
            >
              Ton paiement est confirmé. Tu reçois un email avec ton accès au groupe privé dans les prochaines minutes. Démarrage le 18 mai.
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
                <div className="relative rounded-3xl border border-academy/40 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 md:p-10 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-academy to-transparent" />

                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-academy/15 border border-academy/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="text-academy" size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-academy tracking-widest uppercase mb-1">Une dernière chose</p>
                      <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
                        Tu veux qu'on aille plus loin que l'Academy ?
                      </h2>
                    </div>
                  </div>

                  {/* The why - clearly stated */}
                  <div className="space-y-3 mb-6 text-sm md:text-base text-neutral-300 leading-relaxed">
                    <p>
                      L'Academy t'apprend le système. Tu vas savoir publier, créer du contenu viral, attirer des clients.
                    </p>
                    <p>
                      <span className="text-white font-semibold">Empire Internet, c'est l'étape d'après :</span> on prend en charge toute ta production de contenu. Chaque jour. À ta place. Tu n'as même plus à publier - on s'occupe de tout.
                    </p>
                  </div>

                  {/* Key offer */}
                  <div className="p-5 rounded-2xl bg-academy/10 border border-academy/30 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-academy text-black font-black text-sm flex items-center justify-center flex-shrink-0">
                        €
                      </div>
                      <div>
                        <p className="text-white font-bold mb-1">Si tu rejoins Empire Internet, ton bootcamp est offert.</p>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          On te rembourse intégralement les 497€ de l'Academy. Tu profites du système complet sans avoir payé deux fois.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-400 text-center mb-5">
                    30 minutes pour discuter avec l'équipe Empire Internet. Sans engagement, sans pression.
                  </p>

                  {/* 3 choices */}
                  <div className="grid sm:grid-cols-3 gap-2.5">
                    <CalPopupButton className="group relative p-4 rounded-xl bg-academy text-black font-bold text-sm hover:scale-[1.02] transition-all shadow-[0_0_25px_rgba(252,165,165,0.25)] cursor-pointer">
                      <Calendar className="mx-auto mb-2 block" size={18} />
                      <span className="block">Oui, je réserve maintenant</span>
                    </CalPopupButton>
                    <button
                      onClick={() => setChoice('maybe')}
                      className="p-4 rounded-xl bg-white/[0.06] border border-white/15 text-white font-semibold text-sm hover:bg-white/[0.1] hover:border-academy/40 transition-all"
                    >
                      <ArrowRight className="mx-auto mb-2 text-academy" size={18} />
                      <p>OK, pourquoi pas</p>
                      <p className="text-[11px] text-neutral-400 font-normal mt-1">Voir les détails</p>
                    </button>
                    <button
                      onClick={() => setChoice('later')}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-neutral-300 font-medium text-sm hover:bg-white/[0.06] transition-all"
                    >
                      <Clock className="mx-auto mb-2 text-neutral-500" size={18} />
                      <p>Peut-être plus tard</p>
                      <p className="text-[11px] text-neutral-500 font-normal mt-1">Je commence l'Academy</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* "OK pourquoi pas" - more details */}
            {choice === 'maybe' && (
              <motion.div
                key="maybe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="relative rounded-3xl border border-academy/40 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 md:p-10 overflow-hidden">
                  <button
                    onClick={() => setChoice(null)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <p className="text-xs font-bold text-academy tracking-widest uppercase mb-3">Comment se passe l'appel</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-6">
                    30 minutes avec l'équipe Empire Internet.
                  </h2>

                  <div className="space-y-4 mb-8">
                    {[
                      {
                        n: '01',
                        t: 'On regarde ton business',
                        d: 'Ton activité, tes objectifs, ce que tu fais déjà côté contenu. 10 min.',
                      },
                      {
                        n: '02',
                        t: "On t'explique ce qu'on ferait pour toi",
                        d: 'Empire Internet produit ton contenu chaque jour - LinkedIn, Shorts, newsletter - avec une équipe dédiée. Tu valides, on publie. 15 min.',
                      },
                      {
                        n: '03',
                        t: 'Tu décides',
                        d: "Si c'est non, l'Academy démarre comme prévu, aucun souci. Si c'est oui, on te rembourse les 497€ et tu commences direct avec Empire Internet.",
                      },
                    ].map(s => (
                      <div key={s.n} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-academy/10 border border-academy/30 flex items-center justify-center flex-shrink-0 text-xs font-black text-academy">
                          {s.n}
                        </div>
                        <div>
                          <p className="text-white font-semibold mb-0.5">{s.t}</p>
                          <p className="text-sm text-neutral-400 leading-relaxed">{s.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-5">
                    <div className="flex -space-x-2">
                      {founders.map(f => (
                        <img
                          key={f.name}
                          src={f.img}
                          alt={f.name}
                          className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400">Avec Kevin, Marc ou un membre de l'équipe</span>
                  </div>

                  <CalPopupButton className="w-full block px-8 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-[1.01] transition-all shadow-[0_0_30px_rgba(252,165,165,0.3)] cursor-pointer text-center">
                    OK, je réserve mon créneau →
                  </CalPopupButton>
                  <button
                    onClick={() => setChoice('later')}
                    className="block mx-auto mt-3 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    Plutôt plus tard, je commence l'Academy
                  </button>
                </div>
              </motion.div>
            )}

            {/* "Later" - confirmation */}
            {choice === 'later' && (
              <motion.div
                key="later"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-8 md:p-10 overflow-hidden text-center">
                  <button
                    onClick={() => setChoice(null)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <Clock className="mx-auto mb-4 text-academy" size={32} />
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Pas de souci. Concentre-toi sur l'Academy.
                  </h2>
                  <p className="text-neutral-400 leading-relaxed max-w-lg mx-auto mb-6">
                    L'offre reste valable pendant les 21 jours du bootcamp. Si à un moment tu te dis "j'aimerais qu'on s'occupe de tout pour moi", écris-nous - on te recontacte.
                  </p>
                  <button
                    onClick={() => setChoice(null)}
                    className="text-sm text-academy hover:underline"
                  >
                    Revoir l'offre
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next steps - always visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <p className="text-xs font-bold text-neutral-500 tracking-widest uppercase mb-4 text-center">Pendant ce temps</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-academy text-xs font-bold mb-1">01</p>
                <p className="text-white text-sm font-semibold mb-1">Vérifie tes emails</p>
                <p className="text-neutral-400 text-xs leading-relaxed">L'accès au groupe privé arrive dans 5 min.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-academy text-xs font-bold mb-1">02</p>
                <p className="text-white text-sm font-semibold mb-1">Bloque ton agenda</p>
                <p className="text-neutral-400 text-xs leading-relaxed">18 mai → 7 juin. 15 min/jour pour publier.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-academy text-xs font-bold mb-1">03</p>
                <p className="text-white text-sm font-semibold mb-1">Prépare 3 sujets</p>
                <p className="text-neutral-400 text-xs leading-relaxed">Pense aux thèmes sur lesquels tu veux être reconnu.</p>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-neutral-500 mb-3">Une question avant le démarrage ?</p>
            <a
              href="https://wa.me/33665427470"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <MessageCircle size={16} className="text-[#25D366]" />
              <span>WhatsApp +33 6 65 42 74 70</span>
            </a>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
