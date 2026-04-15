'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Video, MessageCircle } from 'lucide-react'
import Image from 'next/image'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const lives = [
  {
    num: 'Live 1',
    title: 'La psychologie de la viralité',
    desc: 'Pourquoi certains contenus explosent. Les mécaniques du cerveau humain appliquées au contenu.',
  },
  {
    num: 'Live 2',
    title: 'Millions de vues sur Instagram & TikTok',
    desc: "Formats courts, hooks, rythme. Les techniques exactes derrière nos 10M+ de vues par mois.",
  },
  {
    num: 'Live 3',
    title: 'Dominer LinkedIn',
    desc: 'Le seul réseau où une vue = un client potentiel. Positionnement et posts qui convertissent.',
  },
  {
    num: 'Live 4',
    title: 'YouTube & contenu long',
    desc: "Bâtir une audience durable qui ne dépend pas de l'algo. La stratégie long terme.",
  },
  {
    num: 'Live 5',
    title: 'Des vues aux clients',
    desc: 'Le passage de la visibilité à la monétisation. Générer des RDV, closer sans vendre.',
  },
  {
    num: 'Live 6',
    title: '3 000€/mois en 4h/semaine',
    desc: 'Systèmes, outils, organisation. Comment construire et scaler sans y passer sa vie.',
  },
]

const qas = [
  {
    num: 'Q&A 1 · Avec Kevin & Marc',
    title: 'Déblocage mi-parcours',
    desc: 'On répond à vos questions, on analyse vos contenus en direct, on ajuste votre stratégie.',
  },
  {
    num: 'Q&A 2 · Avec Kevin & Marc',
    title: 'Closing & suite du parcours',
    desc: 'Bilan, prochaines étapes, identification des profils qui rejoignent le réseau Empire.',
  },
]

export default function AcademyLivesSection() {
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Les <span className="text-empire">6 lives experts</span> + 2 Q&A
            </h2>
          </div>
        </FadeInBlock>

        {/* Lives grid */}
        <FadeInBlock delay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {lives.map((live, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                viewport={{ once: true }}
                className="p-5 rounded-xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-white/10 hover:border-empire/25 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-empire/15 border border-empire/25 flex items-center justify-center">
                    <Video className="text-empire" size={14} />
                  </div>
                  <span className="text-xs font-bold text-empire">{live.num}</span>
                </div>
                <h3 className="text-white font-bold text-sm md:text-base mb-1.5 group-hover:text-empire transition-colors">{live.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{live.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeInBlock>

        {/* Q&A */}
        <FadeInBlock delay={0.25}>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {qas.map((qa, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-empire/20 hover:border-empire/40 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-empire/40">
                      <Image
                        src="https://media.licdn.com/dms/image/v2/D4E03AQG4nlTt-7wB9w/profile-displayphoto-crop_800_800/B4EZi8WwoyHEAI-/0/1755506740516?e=1775692800&v=beta&t=3Oq_HdQ6GKMFVN6CwQCbvB2Qh7VWo1ls1KIroOyhPYY"
                        alt="Kevin"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-empire/40">
                      <Image
                        src="https://media.licdn.com/dms/image/v2/D4E03AQF43VvOp7iRkw/profile-displayphoto-scale_400_400/B4EZzc5.uqHAAg-/0/1773232713405?e=1775692800&v=beta&t=Z4CykW-joMs63r3xGQHIdOaqpNtjtC7jQdcL5HSHJNs"
                        alt="Marc"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="text-empire" size={12} />
                      <span className="text-xs font-bold text-empire">{qa.num}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">Kevin & Marc Dufraisse</span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-sm md:text-base mb-1.5">{qa.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{qa.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeInBlock>

        {/* Replay note */}
        <FadeInBlock delay={0.35}>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-sm text-neutral-400">
              Tous les lives sont enregistrés.{' '}
              <span className="text-white font-semibold">Les replays sont disponibles à vie</span> - vous ne ratez rien même si vous ne pouvez pas être en direct.
            </p>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
