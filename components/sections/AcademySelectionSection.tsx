'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, X } from 'lucide-react'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const criteria = [
  { ok: true,  text: 'Tu veux créer un revenu en ligne sans dépendre d\'un patron ou d\'un algorithme existant' },
  { ok: true,  text: 'Tu es prêt à créer du contenu chaque jour pendant 21 jours, même si c\'est inconfortable' },
  { ok: true,  text: 'Tu pars de zéro - pas d\'audience, pas d\'expérience, c\'est exactement le profil qu\'on veut' },
  { ok: false, text: 'Tu as déjà une grosse audience et un système de contenu qui tourne' },
  { ok: false, text: 'Tu cherches une formation à regarder sans rien appliquer' },
]

const steps = [
  { num: '01', title: 'Tu passes le test', desc: '2 minutes. On vérifie que le profil et les objectifs sont alignés. Plus tu candidates tôt, plus tu as de chances.' },
  { num: '02', title: 'On te répond le 2 avril', desc: 'Admis ou pas - pour les 20 profils retenus. Si c\'est non, on te dit pourquoi et ce qu\'on conseille.' },
  { num: '03', title: 'Tu rejoins la promotion', desc: 'Accès immédiat au programme. Démarrage le 25 avril.' },
]

export default function AcademySelectionSection() {
  return (
    <section className="relative w-full py-16 md:py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_0%,rgba(218,252,104,0.04),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-empire tracking-widest uppercase mb-3">Sur sélection</p>
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
                On ne sélectionne que 20 personnes.{' '}
                <span className="text-neutral-400">Voici comment.</span>
              </h2>
              <p className="text-neutral-400 text-base max-w-xl mx-auto">
                La qualité du groupe fait partie du programme. Chaque candidature est lue. On prend les 20 profils les plus motivés - pas les premiers arrivés.
              </p>
            </div>
          </FadeInBlock>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Critères */}
            <FadeInBlock delay={0.1}>
              <div className="h-full p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-5">Ce qu'on évalue</p>
                <div className="space-y-3">
                  {criteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {c.ok
                        ? <Check className="text-empire flex-shrink-0 mt-0.5" size={15} />
                        : <X className="text-neutral-600 flex-shrink-0 mt-0.5" size={15} />
                      }
                      <span className={`text-sm leading-snug ${c.ok ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        {c.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInBlock>

            {/* Timeline après candidature */}
            <FadeInBlock delay={0.2}>
              <div className="h-full p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-5">Ce qui se passe après le clic</p>
                <div className="space-y-5">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black border ${
                        i === 0
                          ? 'bg-empire text-black border-empire'
                          : 'bg-white/5 text-empire border-empire/30'
                      }`}>
                        {s.num}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{s.title}</p>
                        <p className="text-neutral-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInBlock>
          </div>

          {/* CTA inline */}
          <FadeInBlock delay={0.3}>
            <div className="text-center">
              <a
                href="/candidature"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-empire text-black font-bold text-base rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.25)]"
              >
                Postuler - sur sélection →
              </a>
              <p className="text-xs text-neutral-600 mt-2">Formulaire de 2 min · Réponse le 2 avril · Aucun engagement</p>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
