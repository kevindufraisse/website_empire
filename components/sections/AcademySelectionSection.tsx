'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, X } from 'lucide-react'

import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import { ACADEMY_ENTRY_PRICE } from '@/lib/cohort-config'
import { useLanguage } from '@/contexts/LanguageContext'

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

export default function AcademySelectionSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const criteria = [
    { ok: true,  text: fr ? "Vous voulez créer un revenu en ligne sans dépendre d'un patron ou d'un algorithme existant" : 'You want to build online income without depending on a boss or an existing algorithm' },
    { ok: true,  text: fr ? "Vous êtes prêt à créer du contenu chaque jour pendant 21 jours, même si c'est inconfortable" : "You're ready to create content every day for 21 days, even if it's uncomfortable" },
    { ok: true,  text: fr ? "Vous partez de zéro - pas d'audience, pas d'expérience, c'est exactement le profil qu'on veut" : "You're starting from scratch - no audience, no experience, that's exactly the profile we want" },
    { ok: false, text: fr ? 'Vous avez déjà une grosse audience et un système de contenu qui tourne' : 'You already have a large audience and a running content system' },
    { ok: false, text: fr ? 'Vous cherchez une formation à regarder sans rien appliquer' : "You're looking for a course to watch without applying anything" },
  ]

  const steps = [
    { num: '01', title: fr ? 'Vous candidatez' : 'You apply', desc: fr ? '1 minute. Prénom, email, tel, LinkedIn + 2 questions. Vous prenez votre place dans la file.' : '1 minute. Name, email, phone, LinkedIn + 2 questions. You take your spot in the queue.' },
    { num: '02', title: fr ? 'On lit chaque candidature' : 'We read every application', desc: fr ? 'Kevin et Marc gardent les 20 profils les plus motivés pour la prochaine promo.' : 'Kevin and Marc keep the 20 most motivated profiles for the next cohort.' },
    { num: '03', title: fr ? 'Vous rejoignez la promotion' : 'You join the cohort', desc: fr ? "Admis ou pas, on vous répond. Si c'est non, on vous dit pourquoi et ce qu'on conseille à la place." : "Accepted or not, we answer you. If it's a no, we tell you why and what we recommend instead." },
  ]

  return (
    <section className="relative w-full py-16 md:py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_0%,rgba(252,165,165,0.06),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-academy tracking-widest uppercase mb-3">{fr ? 'Sur sélection' : 'By selection'}</p>
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
                {fr ? 'On ne sélectionne que 20 personnes.' : 'We only select 20 people.'}{' '}
                <span className="text-neutral-400">{fr ? 'Voici comment.' : "Here's how."}</span>
              </h2>
              <p className="text-neutral-400 text-base max-w-xl mx-auto">
                {fr
                  ? 'La qualité du groupe fait partie du programme. Chaque candidature est lue. On prend les 20 profils les plus motivés - pas les premiers arrivés.'
                  : 'Group quality is part of the program. Every application is read. We take the 20 most motivated profiles - not first come, first served.'}
              </p>
            </div>
          </FadeInBlock>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Critères */}
            <FadeInBlock delay={0.1}>
              <div className="h-full p-6 rounded-2xl bg-white/[0.08] border border-white/15">
                <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-5">{fr ? "Ce qu'on évalue" : 'What we evaluate'}</p>
                <div className="space-y-3">
                  {criteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {c.ok
                        ? <Check className="text-academy flex-shrink-0 mt-0.5" size={15} />
                        : <X className="text-neutral-400 flex-shrink-0 mt-0.5" size={15} />
                      }
                      <span className={`text-sm leading-snug ${c.ok ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        {c.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInBlock>

            {/* Timeline après candidature */}
            <FadeInBlock delay={0.2}>
              <div className="h-full p-6 rounded-2xl bg-white/[0.08] border border-white/15">
                <p className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-5">{fr ? 'Ce qui se passe après le clic' : 'What happens after you click'}</p>
                <div className="space-y-5">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black border ${
                        i === 0
                          ? 'bg-academy text-black border-academy'
                          : 'bg-white/5 text-academy border-academy/30'
                      }`}>
                        {s.num}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{s.title}</p>
                        <p className="text-neutral-400 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
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
              <AcademyWaitlistCta
                source="selection"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-academy text-black font-bold text-base rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(252,165,165,0.25)]"
              >
                {fr ? 'Candidater à la prochaine promotion →' : 'Apply to the next cohort →'}
              </AcademyWaitlistCta>
              <p className="text-xs text-neutral-400 mt-2">{fr ? `1 minute · 20 places · Sur sélection · ${ACADEMY_ENTRY_PRICE}€` : `1 minute · 20 spots · By selection · €${ACADEMY_ENTRY_PRICE}`}</p>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
