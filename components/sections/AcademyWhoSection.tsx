'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { COHORT_START_TEXT } from '@/lib/cohort-config'
import { useAcademyPricing } from '@/hooks/useAcademyPricing'
import { useLanguage } from '@/contexts/LanguageContext'

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

const founders = [
  { name: 'Kevin Dufraisse', img: '/founders/kevin.jpg' },
  { name: 'Marc Dufraisse', img: '/founders/marc.jpg' },
]

export default function AcademyWhoSection() {
  const pricing = useAcademyPricing()
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-12">
            <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">{fr ? 'Qui on est' : 'Who we are'}</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {fr ? 'Le bootcamp créé par' : 'The bootcamp built by'}{' '}
              <span className="text-academy">{fr ? 'ceux qui le font pour vrai.' : 'people who actually do it.'}</span>
            </h2>
          </div>
        </FadeInBlock>

        <FadeInBlock delay={0.15}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-academy/5 rounded-full blur-3xl pointer-events-none" />

            {/* EI + founders inline */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-11 h-11 rounded-xl bg-academy/20 border border-academy/30 flex items-center justify-center">
                  <span className="text-academy font-black text-sm">EI</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Empire Internet</p>
                  <p className="text-neutral-400 text-xs">{fr ? '10M+ vues/mois' : '10M+ views/month'}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/10 flex-shrink-0" />
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-academy/40 shadow-[0_0_10px_rgba(252,165,165,0.2)]">
                    <img src="/founders/kevin.jpg" alt="Kevin Dufraisse" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-academy/40 shadow-[0_0_10px_rgba(252,165,165,0.2)]">
                    <img src="/founders/marc.jpg" alt="Marc Dufraisse" className="w-full h-full object-cover" />
                  </div>
                </div>
                <p className="text-neutral-400 text-sm">
                  Kevin &amp; Marc Dufraisse <span className="text-neutral-400">{fr ? '- fondateurs' : '- founders'}</span>
                </p>
              </div>
            </div>

            <div className="space-y-5 text-neutral-300 leading-relaxed">
              <p className="text-base md:text-lg">
                {fr
                  ? <>On a commencé en créant du contenu pour nos propres projets. On a testé tout : hooks, formats, rythmes. Beaucoup de ratés. Puis certains contenus ont explosé.{' '}<span className="text-white font-semibold">On a compris pourquoi. Et on a rendu ça systématique.</span></>
                  : <>We started by creating content for our own projects. We tested everything: hooks, formats, rhythms. A lot of failures. Then some content blew up.{' '}<span className="text-white font-semibold">We understood why. And we made it systematic.</span></>
                }
              </p>
              <p className="text-base md:text-lg">
                {fr
                  ? <>Aujourd&#39;hui on produit du contenu viral pour des entrepreneurs et des marques - 10M+ vues par mois. Ce bootcamp, c&#39;est notre méthode exacte. Pas une théorie.{' '}<span className="text-academy font-semibold">Tu apprends ce qu&#39;on fait nous, cette semaine, pour nos clients.</span></>
                  : <>Today we produce viral content for entrepreneurs and brands - 10M+ views per month. This bootcamp is our exact method. Not theory.{' '}<span className="text-academy font-semibold">You learn what we do ourselves, this week, for our clients.</span></>
                }
              </p>
              <p className="text-base md:text-lg text-neutral-400">
                {fr
                  ? "Et pendant que tu apprends, on te crée ton contenu chaque jour. Tu n'as qu'à publier."
                  : 'And while you learn, we create your content every day. All you have to do is publish.'}
              </p>
            </div>
          </div>
        </FadeInBlock>

        {/* CTA enrollment block */}
        <FadeInBlock delay={0.3}>
          <div className="mt-10 relative p-8 md:p-10 rounded-2xl bg-gradient-to-br from-academy/[0.08] to-transparent border border-academy/20 overflow-hidden text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(252,165,165,0.06),transparent)] pointer-events-none" />

            <div className="relative z-10">
              <p className="text-sm text-academy font-bold tracking-widest uppercase mb-3">{fr ? 'Vous rejoignez la promo' : 'Join the cohort'}</p>
              <p className="text-2xl md:text-3xl font-extrabold text-white mb-6">{COHORT_START_TEXT}</p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex -space-x-3">
                  {founders.map(f => (
                    <img
                      key={f.name}
                      src={f.img}
                      alt={f.name}
                      className="w-11 h-11 rounded-full border-2 border-academy/40 object-cover shadow-[0_0_15px_rgba(252,165,165,0.15)]"
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-400 text-left leading-snug">
                  {fr ? <>Kevin & Marc accompagnent chaque membre{' '}<span className="text-white font-semibold">personnellement.</span></> : <>Kevin & Marc support every member{' '}<span className="text-white font-semibold">personally.</span></>}
                </p>
              </div>

              <a
                href={pricing.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-academy text-black font-bold text-base rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(252,165,165,0.25)]"
              >
                {fr ? 'Rejoindre' : 'Join'} - {pricing.price}€
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
