'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { getEmpParam } from '@/hooks/useCalLink'
import YtLeadForm from '@/components/YtLeadForm'

const CREATORS = [
  {
    name: 'Grant Cardone',
    img: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4295dabe20aff6b9885_Cardone.webp',
    cost: '~€100K/mo',
  },
  {
    name: 'Alex Hormozi',
    img: 'https://yt3.googleusercontent.com/29XFUn3pc3cC81yUUCFiyCKKdgi856IGMJ4EZBnf53zTfrWWUGvmYnYGx86K08f4XR03UxpWyw=s900-c-k-c0x00ffffff-no-rj',
    cost: '~€80K/mo',
  },
  {
    name: 'Ali Abdaal',
    img: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d436f96370e8ccb7c4_Abdaal.webp',
    cost: '~€75K/mo',
  },
  {
    name: 'Matt Gray',
    img: 'https://yt3.googleusercontent.com/W_GKaSoEuny3REkdSVW-AD6wcB_z5Ltr3hY_Mos94yDKlFLupVnJ6Gf8w1YfjEGps2nr62fB=s160-c-k-c0x00ffffff-no-rj',
    cost: '~€60K/mo',
  },
  {
    name: 'Chris Williamson',
    img: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d4f950bcf495c7dfb2_Williamson.webp',
    cost: '~€70K/mo',
  },
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.08),transparent)]" />

        <div className="relative z-10">
          {/* ── Hero + Video ── */}
          <section className="pt-24 md:pt-32 pb-12 md:pb-16">
            <div className="container max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  Installez le système des plus gros
                  <br />
                  <span className="text-empire">créateurs business mondiaux</span>
                </h1>
                <p className="text-neutral-400 text-base md:text-lg mt-3">
                  et générez des milliers de ventes grâce au personal branding
                </p>
                <div className="mt-4 flex flex-col items-center gap-1 text-neutral-500 animate-bounce">
                  <span className="text-xs">Découvrir leur système dans la vidéo</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </div>
              </motion.div>

              {/* Influencer logos */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mb-8"
              >
                <p className="text-sm text-neutral-400 text-center mb-2">
                  Le système utilisé par les plus grands créateurs au monde
                </p>
                <p className="text-xs text-red-400 font-semibold text-center mb-5">
                  Ils paient 50 à 100K€/mois pour leurs systèmes de contenu
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
                  {CREATORS.map((c) => (
                    <div
                      key={c.name}
                      className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-800 overflow-hidden">
                        <img
                          src={c.img}
                          alt={c.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] md:text-xs font-bold text-white group-hover:text-empire transition-colors">
                          {c.name}
                        </p>
                        <p className="text-[9px] md:text-[10px] text-neutral-500">{c.cost}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

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
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                  <h2 className="text-lg font-bold text-white mb-5">Réservez votre appel gratuit</h2>
                  <YtLeadForm />
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
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                  <h2 className="text-lg font-bold text-white mb-5">Réservez votre appel gratuit</h2>
                  <YtLeadForm />
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
