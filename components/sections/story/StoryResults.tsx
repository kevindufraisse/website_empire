'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Award, Newspaper } from 'lucide-react'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function StoryResults() {
  return (
    <section className="container py-20 md:py-32 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Les <span className="bg-gradient-to-r from-empire via-green-400 to-empire bg-clip-text text-transparent">Résultats</span>
            </h2>
            <p className="text-xl text-neutral-300">
              Vraie traction. Vraie reconnaissance.
            </p>
          </div>
        </FadeInBlock>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Top 50 LinkedIn France */}
          <FadeInBlock delay={0.1}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-empire to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-empire/5 to-transparent border-2 border-empire/20 overflow-hidden shadow-[0_0_30px_rgba(218,252,104,0.15)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-empire/30 border-2 border-empire flex items-center justify-center shadow-[0_0_15px_rgba(218,252,104,0.4)]">
                    <Award className="text-empire" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Top 50 LinkedIn France</h3>
                    <p className="text-sm text-neutral-400">Classement des influenceurs</p>
                  </div>
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src="https://d1yei2z3i6k35z.cloudfront.net/3647172/68c9e9f667659_1.png"
                    alt="Kevin Dufraisse - Top 50 LinkedIn France"
                    width={600}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* Media Coverage */}
          <FadeInBlock delay={0.2}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent border-2 border-blue-400/20 overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/30 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    <Newspaper className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Couverture Médiatique</h3>
                    <p className="text-sm text-neutral-400">Présence dans la presse</p>
                  </div>
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src="https://d1yei2z3i6k35z.cloudfront.net/3647172/67406b1e63374_KEVINDUFRAISSE1.png"
                    alt="Kevin Dufraisse - Media Coverage"
                    width={600}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>

        {/* Final Message */}
        <FadeInBlock delay={0.3}>
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-empire via-green-400 to-empire rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-1000" />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border-2 border-empire/30 shadow-[0_0_40px_rgba(218,252,104,0.2)]">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ce n'est pas de la chance. C'est un système.
                </p>
                <p className="text-lg text-neutral-300 mb-6">
                  Et maintenant, je veux le partager avec toi.
                </p>
                <p className="text-empire font-semibold text-xl mb-8 drop-shadow-[0_0_10px_rgba(218,252,104,0.5)]">
                  Bienvenue chez Empire Internet.
                </p>
                <a
                  href="/pricing"
                  className="inline-block px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.5)] hover:shadow-[0_0_40px_rgba(218,252,104,0.7)]"
                >
                  C'est comme ça que j'ai construit Empire. Tu veux l'utiliser ?
                </a>
              </div>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

