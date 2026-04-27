'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { User, Users, Check, ArrowRight } from 'lucide-react'
import BorderBeam from '@/components/magicui/border-beam'

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

const path1 = {
  icon: User,
  tag: 'Option 1 - Tu as un projet',
  title: 'Tu communiques pour toi',
  desc: "Tu utilises les compétences du bootcamp pour développer ta propre audience et générer tes clients.",
  perks: [
    'Tu maîtrises les mécaniques de la viralité',
    'Tu sais créer tes hooks, posts et shorts',
    'Tu construis ton audience et génères tes clients',
    'Accès à vie aux replays',
  ],
}

const path2 = {
  icon: Users,
  tag: 'Option 2 - Pas de projet ?',
  title: 'Tu communiques pour Empire',
  desc: "On te trouve les clients. On te crée le contenu. Tu coaches et tu es payé. Pas besoin d'avoir un projet à toi.",
  perks: [
    'On te trouve les clients',
    'On te crée ton contenu chaque jour',
    '500€ par mission - ~4h de coaching',
    'Objectif : 3 000€/mois en 4h/semaine',
  ],
}

export default function AcademyTwoPathsSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-[#0f0f0f] to-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(252, 165, 165,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-14">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">Même sans projet</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                2 voies possibles.{' '}
                <span className="text-academy">Tu choisis.</span>
              </h2>
              <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto">
                Tu as un projet ? Tu communiques dessus. Tu n'en as pas ? Tu communiques pour Empire et on te paye.
              </p>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="grid md:grid-cols-2 gap-6">

              {/* Option 1 - Solo */}
              <div className="relative h-full p-7 md:p-8 rounded-2xl bg-gradient-to-br from-white/8 to-white/[0.02] border border-white/10 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <path1.icon className="text-neutral-300" size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase block">{path1.tag}</span>
                    <h3 className="text-lg font-bold text-white">{path1.title}</h3>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm mb-6 leading-relaxed">{path1.desc}</p>
                <div className="flex-1 space-y-2.5">
                  {path1.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="text-neutral-400 flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-neutral-300 text-sm">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option 2 - Partenaire Empire */}
              <div className="relative h-full p-7 md:p-8 rounded-2xl bg-gradient-to-br from-academy/15 to-academy/5 border border-academy/40 shadow-[0_0_40px_rgba(252, 165, 165,0.1)] flex flex-col overflow-hidden">
                <BorderBeam size={300} duration={9} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-academy/20 border border-academy/40 flex items-center justify-center">
                        <path2.icon className="text-academy" size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-academy/70 tracking-widest uppercase block">{path2.tag}</span>
                        <h3 className="text-lg font-bold text-academy">{path2.title}</h3>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-black bg-academy rounded-full px-2.5 py-1 leading-none">
                      SUR SÉLECTION
                    </span>
                  </div>
                  <p className="text-neutral-300 text-sm mb-6 leading-relaxed">{path2.desc}</p>
                  <div className="flex-1 space-y-2.5">
                    {path2.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="text-academy flex-shrink-0 mt-0.5" size={14} />
                        <span className="text-white text-sm font-medium">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-black/30 border border-academy/20">
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      <span className="text-academy font-semibold">Les missions :</span> 4h de coaching/mois avec un client Empire. Tu lui apprends le système qu'on t'a enseigné. On s'occupe du closing et de la delivery.
                    </p>
                    <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                      <span className="text-white font-semibold">Critère :</span> +100 000 vues/semaine pendant le bootcamp.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.2}>
            <div className="mt-10 text-center">
              <a
                href="/candidature"
                className="inline-flex items-center gap-2 px-8 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(252, 165, 165,0.3)]"
              >
                Postuler pour rejoindre le bootcamp <ArrowRight size={18} />
              </a>
              <p className="text-xs text-neutral-400 mt-2">Les meilleurs profils accèdent directement à l'option 2</p>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
