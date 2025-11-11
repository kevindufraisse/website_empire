'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Frown, AlertCircle, Lightbulb, Rocket } from 'lucide-react'

function TimelineBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const timeline = [
  {
    icon: Frown,
    color: 'from-red-600 via-red-500 to-orange-500',
    glowColor: 'rgba(239,68,68,0.3)',
    title: 'Le Problème',
    year: '2020-2022',
    story: [
      'Tu sais que le contenu pourrait tout changer pour toi.',
      'Mais ça ne colle jamais.',
      'Tu te dis que tu commenceras la semaine prochaine.',
      'Puis un projet client arrive.',
      'Ou tu bloques sur quoi dire.',
      'Alors tu repousses. Encore. Et encore.',
    ],
  },
  {
    icon: AlertCircle,
    color: 'from-orange-500 via-amber-500 to-yellow-500',
    glowColor: 'rgba(251,146,60,0.3)',
    title: 'La Prise de Conscience',
    year: '2022',
    story: [
      'Tu n\'es pas paresseux. Tu n\'es pas perdu.',
      'Tu es juste fatigué d\'essayer de construire une machine… sans pièces.',
      'À chaque fois que tu essaies de publier régulièrement, ça bouffe ton temps, ton énergie, ton cerveau.',
      'Le calendrier reste vide.',
    ],
  },
  {
    icon: Lightbulb,
    color: 'from-blue-400 via-cyan-400 to-teal-400',
    glowColor: 'rgba(56,189,248,0.3)',
    title: 'Le Déclic',
    year: 'Mi 2022',
    story: [
      'J\'étais en call avec un client. Pas un génie du contenu. Juste un gars normal qui galère à publier.',
      'On a parlé une heure. Sans script. Sans agenda.',
      'Et quand j\'ai réécouté… ça m\'a frappé.',
      'Le gars avait de l\'or. Des histoires brutes. Des convictions claires. Une vraie voix.',
      'Le problème n\'est pas ce que les gens savent. C\'est comment l\'extraire.',
    ],
  },
  {
    icon: Rocket,
    color: 'from-green-400 via-emerald-400 to-empire',
    glowColor: 'rgba(218,252,104,0.3)',
    title: 'Le Système',
    year: 'Fin 2022 - 2024',
    story: [
      'J\'ai arrêté d\'écrire from scratch. J\'ai construit un processus.',
      'Une interview → L\'IA écrit → Les humains polissent → Le contenu explose.',
      'Au début, c\'était nul. Je balançais des prompts à ChatGPT, et je recevais de la merde.',
      'Mais je n\'ai pas lâché.',
      'J\'ai passé des mois à affiner chaque mot, chaque structure, chaque transition.',
      'Jusqu\'à ce que ça clique enfin. Le contenu était tranchant. Sonnait comme moi — dans mon meilleur jour.',
      '1 million de vues par mois. Sans effort.',
    ],
  },
]

export default function StoryJourney() {
  return (
    <section className="container py-20 md:py-32 bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      <div className="max-w-4xl mx-auto">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - gradient rainbow */}
          <div className="absolute left-0 md:left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-500 via-blue-400 to-empire opacity-50" />

          <div className="space-y-16 md:space-y-24">
            {timeline.map((item, i) => (
              <TimelineBlock key={i} delay={i * 0.2}>
                <div className="relative pl-12 md:pl-32">
                  {/* Icon with glow */}
                  <div className={`absolute left-0 md:left-8 w-8 h-8 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center border-4 border-black shadow-[0_0_30px_${item.glowColor}]`}>
                    <item.icon className="text-black" size={20} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-empire font-semibold mb-1">{item.year}</p>
                      <h3 className="text-3xl md:text-4xl font-bold">{item.title}</h3>
                    </div>

                    <div className="space-y-3 text-lg md:text-xl text-neutral-300">
                      {item.story.map((line, j) => (
                        <p key={j} className={j === item.story.length - 1 ? 'text-white font-semibold' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </TimelineBlock>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

