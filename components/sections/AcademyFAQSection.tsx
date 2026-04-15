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
  'Vous cherchez un résultat sans rien faire',
  'Vous voulez juste "apprendre" sans appliquer',
  'Vous avez déjà une grosse audience et un système qui tourne',
  "Vous n'êtes pas prêt à publier chaque jour pendant 21 jours",
]

const yesFor = [
  'Vous voulez apprendre les mécaniques de la viralité',
  'Vous voulez créer une activité en ligne de zéro',
  'Vous voulez publier sans passer 3h à rédiger et monter',
  'Vous voulez potentiellement travailler avec Empire Internet',
]

const faqs = [
  {
    q: "Qu'est-ce que j'apprends exactement ?",
    a: "Vous apprenez les mécaniques de la viralité : pourquoi certains contenus explosent, comment construire des hooks, quels formats marchent sur chaque réseau. C'est la compétence la plus demandée aujourd'hui. Et pendant que vous apprenez, on vous crée votre contenu — vous n'avez qu'à publier.",
  },
  {
    q: 'Vous créez vraiment le contenu pour moi ?',
    a: "Oui. Chaque jour pendant le bootcamp, on vous génère votre post LinkedIn et votre Short — rédigé, monté, prêt à poster. Vous vous concentrez sur comprendre la viralité. Vous publiez en 15 min. C'est votre avantage par rapport à tous les autres programmes.",
  },
  {
    q: 'Ça prend combien de temps par jour ?',
    a: "15 minutes pour publier. Le reste du temps, vous regardez les vidéos et vous absorbez les mécaniques de la viralité à votre rythme.",
  },
  {
    q: "C'est quoi la différence entre les 2 chemins ?",
    a: "Chemin 1 : vous utilisez vos nouvelles compétences en viralité pour développer votre propre audience. Chemin 2 : vous rejoignez le réseau Empire. On vous trouve les clients, on vous crée le contenu, vous publiez et vous êtes payé. Le chemin 2 est réservé aux meilleurs profils.",
  },
  {
    q: "C'est pour qui exactement ?",
    a: "Pour toute personne qui veut maîtriser la viralité et devenir visible en ligne. Aucune expérience requise. On vous crée le contenu pendant le bootcamp, donc même si vous ne savez pas écrire ou monter, vous publiez dès le jour 1.",
  },
  {
    q: 'Est-ce que le réseau Empire est garanti ?',
    a: "Non, et c'est honnête. On repère les meilleurs profils du bootcamp. Si vous vous impliquez et vous démarquez, les missions viennent. 2 missions suffisent à rembourser l'investissement.",
  },
  {
    q: "Est-ce que j'ai accès à vie ?",
    a: 'Oui. Les vidéos et replays sont accessibles à vie.',
  },
  {
    q: 'Puis-je rejoindre si je suis débutant complet ?',
    a: "C'est exactement pour ça qu'on a créé ce bootcamp. Pas besoin d'audience ou d'expérience. On vous crée votre contenu. Vous apprenez et vous publiez.",
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
                <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-4">Ce n'est pas pour vous si...</p>
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
                <p className="text-xs font-bold text-empire tracking-widest uppercase mb-4">C'est pour vous si...</p>
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
                href="/candidature"
                className="inline-flex items-center gap-2 px-8 py-4 bg-empire text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(218,252,104,0.3)]"
              >
                Postuler - sur sélection →
              </a>
              <p className="text-xs text-neutral-500 mt-2">Formulaire de 2 min · Aucun engagement</p>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
