'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Search, Brain, Code2, Mic, ArrowRight } from 'lucide-react'
import { getCalApi } from "@calcom/embed-react"
import CallbackButton from '@/components/CallbackButton'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import { useCalLink } from '@/hooks/useCalLink'

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

const creators = [
  { name: 'Grant Cardone', img: '/creators/cardone.webp' },
  { name: 'Alex Hormozi', img: '/creators/hormozi.jpg' },
  { name: 'Ali Abdaal', img: '/creators/abdaal.webp' },
  { name: 'Matt Gray', img: '/creators/gray.jpg' },
  { name: 'Chris Williamson', img: '/creators/williamson.webp' },
]

const steps = {
  fr: [
    { icon: Search, title: '1. On étudie votre marché', desc: 'On analyse votre niche, vos concurrents, et les contenus qui performent dans votre domaine. Pas de copier-coller : une stratégie adaptée.' },
    { icon: Brain, title: '2. 7 sujets viraux / semaine', desc: 'Des experts formés à nos méthodes trouvent chaque semaine les sujets qui vont performer dans votre niche.' },
    { icon: Mic, title: '3. 15 min d\'interview', desc: 'Vous parlez de votre expertise. On transforme ça en 30+ posts LinkedIn, newsletters, vidéos courtes, carrousels.' },
    { icon: Code2, title: '4. Tout est livré, planifié', desc: 'Votre contenu du mois est prêt. Vérifié par une assistante humaine et un expert en viralité.' },
  ],
  en: [
    { icon: Search, title: '1. We study your market', desc: 'We analyze your niche, competitors, and top-performing content in your space. No copy-paste: a tailored strategy.' },
    { icon: Brain, title: '2. 7 viral topics / week', desc: 'Experts trained on our methods find the topics that will perform in your niche every week.' },
    { icon: Mic, title: '3. 15-min interview', desc: 'You talk about your expertise. We turn it into 30+ LinkedIn posts, newsletters, short videos, carousels.' },
    { icon: Code2, title: '4. Everything delivered, scheduled', desc: 'Your monthly content is ready. Reviewed by a human assistant and a virality expert.' },
  ],
}

export default function RolesReplacedSection() {
  const { lang, t } = useLanguage()
  const fr = lang === 'fr'

  const namespace = 'audit-empire'
  const calLink = useCalLink()

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
    })()
  }, [namespace])

  const currentSteps = steps[fr ? 'fr' : 'en']

  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <FadeInBlock>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
              <p className="text-sm font-bold text-empire">
                {fr ? 'COMMENT ÇA MARCHE' : 'HOW IT WORKS'}
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              {fr
                ? <>On a étudié ce qui rend<br className="hidden sm:block" /><span className="text-empire"> les meilleurs créateurs viraux</span></>
                : <>We studied what makes<br className="hidden sm:block" /><span className="text-empire"> top creators go viral</span></>}
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              {fr
                ? 'Puis on a transformé ces méthodes en un système que vous pouvez utiliser en 15 min par semaine.'
                : 'Then we turned those methods into a system you can use in 15 min per week.'}
            </p>
          </div>
        </FadeInBlock>

        {/* Creator avatars - subtle social proof */}
        <FadeInBlock delay={0.1}>
          <div className="flex items-center justify-center gap-3 mb-12 md:mb-16">
            <span className="text-xs text-neutral-500">{fr ? 'Inspiré par' : 'Inspired by'}</span>
            <div className="flex -space-x-2">
              {creators.map((c) => (
                <div
                  key={c.name}
                  className="w-7 h-7 rounded-full bg-neutral-800 overflow-hidden border-2 border-black"
                  title={c.name}
                >
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <span className="text-xs text-neutral-500">{fr ? '& les meilleurs créateurs' : '& top creators'}</span>
          </div>
        </FadeInBlock>

        {/* 4-step process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-12 md:mb-16">
          {currentSteps.map((s, i) => {
            const Icon = s.icon
            return (
              <FadeInBlock key={i} delay={0.15 + i * 0.08}>
                <div className={`p-5 md:p-6 rounded-xl border transition-all h-full ${
                  i === 2
                    ? 'bg-empire/5 border-empire/20'
                    : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      i === 2 ? 'bg-empire/20' : 'bg-white/5'
                    }`}>
                      <Icon className={i === 2 ? 'text-empire' : 'text-neutral-300'} size={20} />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white">{s.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
                </div>
              </FadeInBlock>
            )
          })}
        </div>

        {/* CTA */}
        <FadeInBlock delay={0.5}>
          <div className="text-center px-4 md:px-0">
            <button
              data-cal-namespace={namespace}
              data-cal-link={calLink}
              data-cal-config='{"layout":"month_view","theme":"dark"}'
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-empire text-black font-bold text-base md:text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(218,252,104,0.3)]"
            >
              {t.common.startNow}
              <ArrowRight size={18} />
            </button>
            <div className="mt-3">
              <CallbackButton variant="subtle" />
            </div>
            <CtaReassurance className="mt-4 px-2" />
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
