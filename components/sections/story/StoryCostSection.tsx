'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { DollarSign, Clock, TrendingDown, Users } from 'lucide-react'
import NumberTicker from '@/components/magicui/number-ticker'

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

const topCreators = [
  {
    name: 'Grant Cardone',
    image: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4295dabe20aff6b9885_Cardone.webp',
    cost: '~€100K/mo',
  },
  {
    name: 'Alex Hormozi',
    image: 'https://yt3.googleusercontent.com/29XFUn3pc3cC81yUUCFiyCKKdgi856IGMJ4EZBnf53zTfrWWUGvmYnYGx86K08f4XR03UxpWyw=s900-c-k-c0x00ffffff-no-rj',
    cost: '~€80K/mo',
  },
  {
    name: 'Ali Abdaal',
    image: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d436f96370e8ccb7c4_Abdaal.webp',
    cost: '~€75K/mo',
  },
  {
    name: 'Matt Gray',
    image: 'https://yt3.googleusercontent.com/W_GKaSoEuny3REkdSVW-AD6wcB_z5Ltr3hY_Mos94yDKlFLupVnJ6Gf8w1YfjEGps2nr62fB=s160-c-k-c0x00ffffff-no-rj',
    cost: '~€60K/mo',
  },
  {
    name: 'Chris Williamson',
    image: 'https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d4f950bcf495c7dfb2_Williamson.webp',
    cost: '~€70K/mo',
  },
]

export default function StoryCostSection() {
  return (
    <section className="container py-20 md:py-32 bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Les systèmes utilisés par les{' '}
              <span className="text-empire">meilleurs créateurs</span> du monde
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-12">
              Ils paient <span className="font-bold text-white">€50-100K/mois</span> pour leurs systèmes de contenu
            </p>
          </div>
        </FadeInBlock>

        {/* Top Creators */}
        <FadeInBlock delay={0.1}>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
            {topCreators.map((creator, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group"
              >
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-center">
                  <p className="text-xs font-bold text-white group-hover:text-empire transition-colors">{creator.name}</p>
                  <p className="text-[10px] text-neutral-500">{creator.cost}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeInBlock>

        {/* Cost Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FadeInBlock delay={0.2}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500" />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-red-950/20 to-black border border-red-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="text-red-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      €<NumberTicker value={5000} />+ / mois
                    </h3>
                    <p className="text-neutral-300 mb-3">
                      Freelance writers, designers, video editors
                    </p>
                    <p className="text-sm text-neutral-400 italic">
                      "J'ai dépensé 8K€ en 3 mois... pour du contenu que personne ne regardait"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.3}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500" />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-orange-950/20 to-black border border-orange-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-orange-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      <NumberTicker value={20} />+ heures / semaine
                    </h3>
                    <p className="text-neutral-300 mb-3">
                      Écriture, édition, publication, planification
                    </p>
                    <p className="text-sm text-neutral-400 italic">
                      "Je passais mes soirées et week-ends... pour 3 posts par semaine"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.4}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500" />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-950/20 to-black border border-purple-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="text-purple-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      €<NumberTicker value={50000} />+ en opportunités
                    </h3>
                    <p className="text-neutral-300 mb-3">
                      Clients perdus, deals manqués, croissance stagnante
                    </p>
                    <p className="text-sm text-neutral-400 italic">
                      "Mes concurrents explosaient pendant que je stagnais à 500 followers"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.5}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-500" />
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-950/20 to-black border border-blue-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      <NumberTicker value={10} />+ employés
                    </h3>
                    <p className="text-neutral-300 mb-3">
                      Community managers, social media managers, coordinateurs
                    </p>
                    <p className="text-sm text-neutral-400 italic">
                      "J'ai embauché une équipe entière... résultat ? Chaos et incohérence"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>

        {/* Bottom CTA */}
        <FadeInBlock delay={0.6}>
          <div className="text-center p-8 md:p-12 rounded-2xl bg-gradient-to-br from-red-950/30 to-black border-2 border-red-500/30">
            <p className="text-3xl md:text-4xl font-bold text-white mb-4">
              Total : <span className="text-red-500">€100,000+</span> par an
            </p>
            <p className="text-xl text-neutral-300 mb-6">
              Et pourtant, la plupart restent <span className="text-red-400 font-semibold">invisibles</span>
            </p>
            <div className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30">
              <p className="text-lg text-white">
                Il existe un meilleur moyen. 
                <span className="text-empire font-semibold ml-2">€1000/mois. Tout compris.</span>
              </p>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

