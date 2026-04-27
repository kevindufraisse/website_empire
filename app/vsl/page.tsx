'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { getEmpParam } from '@/hooks/useCalLink'
import YtLeadForm from '@/components/YtLeadForm'

const CREATORS = [
  { name: 'Grant Cardone', img: '/creators/cardone.webp', cost: '~€100K/mo' },
  { name: 'Alex Hormozi', img: '/creators/hormozi.jpg', cost: '~€80K/mo' },
  { name: 'Ali Abdaal', img: '/creators/abdaal.webp', cost: '~€75K/mo' },
  { name: 'Matt Gray', img: '/creators/gray.jpg', cost: '~€60K/mo' },
  { name: 'Chris Williamson', img: '/creators/williamson.webp', cost: '~€70K/mo' },
]

export default function VslPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const empFromUrl = params.get('emp')
    if (empFromUrl) {
      sessionStorage.setItem('emp', empFromUrl)
    }
  }, [])

  return (
    <>
      <Script
        src="https://widget.senja.io/widget/a7bf7e4a-0f3b-4751-8190-849f83d16306/platform.js"
        strategy="lazyOnload"
      />

      <main className="min-h-screen bg-black text-white overflow-x-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.08),transparent)]" />

        <div className="relative z-10">
          {/* ── Hero + Video ── */}
          <section className="pt-16 md:pt-20 pb-12 md:pb-16">
            <div className="container max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-4"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                  Installez le système des plus gros
                  <br />
                  <span className="text-empire">créateurs business mondiaux</span>
                </h1>
                <p className="text-neutral-400 text-sm md:text-base mt-2">
                  et générez des milliers de ventes grâce au personal branding
                </p>
              </motion.div>

              {/* Creators - compact inline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mb-4"
              >
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-[11px] text-neutral-400 mr-1">Utilisé par</span>
                  <div className="flex items-center -space-x-2">
                    {CREATORS.map((c) => (
                      <div
                        key={c.name}
                        className="w-7 h-7 rounded-full bg-neutral-800 overflow-hidden border-2 border-black"
                        title={`${c.name} · ${c.cost}`}
                      >
                        <img
                          src={c.img}
                          alt={c.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">et les plus grands créateurs mondiaux</span>
                </div>
              </motion.div>

              <div className="flex justify-center mb-3">
                <span className="text-[11px] text-neutral-400 flex items-center gap-1.5 animate-bounce">
                  Découvrir leur système
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </span>
              </div>

              {/* Loom Video */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-6"
              >
                <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-900/50" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://www.loom.com/embed/184e8823d9154d74aeca55a5cd488f08?hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_speed=true&hide_title=true&t=0"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </motion.div>

              {/* Form after video */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="max-w-lg mx-auto"
              >
                <div className="relative rounded-2xl border border-empire/25 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8 shadow-[0_0_40px_-8px_rgb(var(--empire-rgb)_/_0.12)]">
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgb(var(--empire-rgb)_/_0.06),transparent)] pointer-events-none" />
                  <div className="relative">
                    <p className="text-empire text-xs font-semibold tracking-wider uppercase mb-2">Appel stratégique offert</p>
                    <h2 className="text-xl font-bold text-white mb-1">Réservez votre appel gratuit</h2>
                    <p className="text-neutral-400 text-sm mb-6">45 min avec un expert pour auditer votre stratégie</p>
                    <YtLeadForm />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Testimonials (Senja) ── */}
          <section className="py-10 md:py-14 bg-gradient-to-b from-black via-[#0f0f0f] to-black">
            <div className="container max-w-5xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-center mb-10"
              >
                <h2 className="text-2xl md:text-3xl font-bold">
                  +100 entrepreneurs accompagnés
                </h2>
                <p className="text-neutral-400 mt-2">
                  Ce qu'en disent ceux qui sont passés par là
                </p>
              </motion.div>

              <div
                className="senja-embed"
                data-id="a7bf7e4a-0f3b-4751-8190-849f83d16306"
                data-mode="shadow"
                data-lazyload="false"
                style={{ display: 'block', width: '100%' }}
              />
            </div>
          </section>

          {/* ── Bottom Form ── */}
          <section className="py-16 md:py-20">
            <div className="container max-w-lg mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative rounded-2xl border border-empire/25 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8 shadow-[0_0_40px_-8px_rgb(var(--empire-rgb)_/_0.12)]">
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgb(var(--empire-rgb)_/_0.06),transparent)] pointer-events-none" />
                  <div className="relative">
                    <p className="text-empire text-xs font-semibold tracking-wider uppercase mb-2">Dernière étape</p>
                    <h2 className="text-xl font-bold text-white mb-1">Prêt à passer à l'action ?</h2>
                    <p className="text-neutral-400 text-sm mb-6">Réservez votre appel stratégique gratuit maintenant</p>
                    <YtLeadForm />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
