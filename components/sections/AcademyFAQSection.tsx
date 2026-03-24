'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const notFor = [
  'Tu cherches un résultat sans rien faire',
  'Tu veux juste "apprendre" sans appliquer',
  'Tu as déjà une grosse audience et un système qui tourne',
  "Tu n'es pas prêt à créer du contenu chaque jour pendant 21 jours",
]

const yesFor = [
  'Tu veux créer une activité en ligne de zéro',
  'Tu veux apprendre à faire des millions de vues',
  "Tu veux survivre à l'IA et maîtriser un vrai métier",
  'Tu veux potentiellement travailler avec Empire Internet',
]

const faqs = [
  {
    q: 'C'est pour qui exactement ?',
    a: "Pour toute personne qui veut maîtriser les mécaniques de la viralité et potentiellement travailler avec nous. Aucune expérience requise — juste la volonté d'agir chaque jour.",
  },
  {
    q: 'Est-ce que le réseau Empire est garanti ?',
    a: "Non, et c'est honnête. On repère les meilleurs profils dans le groupe. Si tu t'impliques, crées et te démarques, les missions viendront naturellement. Deux missions suffisent à rembourser l'investissement.",
  },
  {
    q: 'Combien de temps dois-je y consacrer ?',
    a: "Environ 1 à 2 heures par jour pendant 21 jours. Une vidéo courte + un exercice posté dans le groupe. Si tu es prêt à ça, tu seras dans les meilleurs.",
  },
  {
    q: "Est-ce que j'ai accès à vie ?",
    a: 'Oui. Les vidéos et les replays des lives sont accessibles à vie. Tu peux reprendre le programme quand tu veux, autant de fois que tu veux.',
  },
  {
    q: 'Quelle différence entre Standard et VIP ?',
    a: "Le Standard te donne accès à tout le contenu du bootcamp. Le VIP ajoute un accompagnement personnalisé, la priorité sur les missions Empire, et l'accès au réseau clients pendant 12 mois.",
  },
  {
    q: 'Puis-je rejoindre si je suis débutant complet ?',
    a: "Absolument. Le bootcamp est conçu pour partir de zéro. Pas besoin d'audience, d'expérience ou d'équipement. Si tu peux créer du contenu chaque jour, tu peux réussir.",
  },
]

export default function AcademyFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black via-[#0f0f0f] to-black overflow-hidden">
      <div className="container">
        <div className="max-w-4xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">FAQ</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Pour qui est ce programme —<br />
                <span className="text-empire">et toutes vos questions.</span>
              </h2>
            </div>
          </FadeInBlock>

          {/* Fit / No fit */}
          <FadeInBlock delay={0.1}>
            <div className="grid md:grid-cols-2 gap-5 mb-14">
              {/* Not for */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/30 to-transparent border border-red-500/20">
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-4">Ce n'est pas pour toi si...</p>
                <div className="space-y-2.5">
                  {notFor.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <X className="text-red-400 flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-neutral-400 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yes for */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-empire/15 to-transparent border border-empire/30">
                <p className="text-xs font-bold text-empire tracking-widest uppercase mb-4">C'est pour toi si...</p>
                <div className="space-y-2.5">
                  {yesFor.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="text-empire flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-white text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* Accordion */}
          <FadeInBlock delay={0.2}>
            <div className="space-y-2.5">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <div
                    key={i}
                    className={cn(
                      'rounded-xl border transition-all overflow-hidden',
                      isOpen
                        ? 'bg-gradient-to-br from-white/10 to-white/[0.02] border-empire/30'
                        : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                    )}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full p-5 flex items-center justify-between text-left group min-h-[52px]"
                    >
                      <h3 className={cn(
                        'text-base md:text-lg font-semibold transition-colors pr-3',
                        isOpen ? 'text-empire' : 'text-white group-hover:text-empire'
                      )}>
                        {faq.q}
                      </h3>
                      <ChevronDown
                        className={cn(
                          'text-neutral-400 transition-all duration-300 flex-shrink-0',
                          isOpen ? 'rotate-180 text-empire' : 'group-hover:text-empire'
                        )}
                        size={18}
                      />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-white/10">
                        <p className="text-sm md:text-base text-neutral-300 leading-relaxed pt-4">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </FadeInBlock>

          {/* CTA final */}
          <FadeInBlock delay={0.3}>
            <div className="mt-14 text-center">
              <a
                href="#academy-pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-empire text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.3)]"
              >
                Je rejoins le bootcamp à 500€ →
              </a>
              <p className="text-xs text-neutral-500 mt-3">Places limitées · Offre de lancement</p>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
