'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import OnboardingLink from '@/components/OnboardingLink'
import { X, Check, ArrowRight } from 'lucide-react'

export default function WhyEmpireSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const without = fr
    ? [
        '1h pour un post. 3h pour un Reel. 200 vues.',
        'Vous abandonnez après 3 semaines, vos concurrents non.',
        'Vous testez seul pendant des mois sans savoir ce qui marche.',
        'ChatGPT écrit le texte, mais personne ne monte, sous-titre ou publie.',
        'Vous gérez clients, produit, admin... et en plus 7 réseaux ?',
        'Pas d\'équipe, pas de données, pas de système.',
      ]
    : [
        '1h for a post. 3h for a Reel. 200 views.',
        'You give up after 3 weeks, your competitors don\'t.',
        'You test alone for months without knowing what works.',
        'ChatGPT writes the text, but nobody edits, subtitles or publishes.',
        'You manage clients, product, admin... and 7 platforms on top?',
        'No team, no data, no system.',
      ]

  const withEmpire = fr
    ? [
        'Vous parlez 1h par mois. On fait le reste.',
        '700M+ de vues générées. On sait ce qui marche.',
        '1 an de tests, des centaines de formats optimisés dans le système.',
        'Montage pro, sous-titrage, publication sur 7 réseaux.',
        'Pas besoin de recruter ou former une équipe.',
        'Vous restez focus sur votre business.',
      ]
    : [
        'You talk 1h per month. We do the rest.',
        '700M+ views generated. We know what works.',
        '1 year of testing, hundreds of formats optimized in the system.',
        'Pro editing, subtitling, publishing on 7 platforms.',
        'No need to hire or train a team.',
        'You stay focused on your business.',
      ]

  return (
    <section className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />

      <div ref={ref} className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl mx-auto mb-3">
            {fr ? (
              <>
                Vous déléguez votre compta, votre juridique, votre recrutement.{' '}
                <span className="text-empire">Pourquoi pas votre contenu ?</span>
              </>
            ) : (
              <>
                You delegate your accounting, legal, hiring.{' '}
                <span className="text-empire">Why not your content?</span>
              </>
            )}
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            {fr
              ? '"Je vais le faire moi-même avec ChatGPT." On nous le dit toutes les semaines.'
              : '"I\'ll do it myself with ChatGPT." We hear this every week.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4 mb-10"
        >
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5 md:p-6">
            <p className="text-sm font-bold text-red-400 mb-4">
              {fr ? 'Sans système' : 'Without a system'}
            </p>
            <ul className="space-y-3">
              {without.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-neutral-400 leading-relaxed">
                  <X size={15} className="shrink-0 mt-0.5 text-red-400/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-empire/30 bg-empire/[0.03] p-5 md:p-6">
            <p className="text-sm font-bold text-empire mb-4">
              {fr ? 'Avec Empire' : 'With Empire'}
            </p>
            <ul className="space-y-3">
              {withEmpire.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-neutral-300 leading-relaxed">
                  <Check size={15} className="shrink-0 mt-0.5 text-empire" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-[13px] text-neutral-500 italic max-w-2xl mx-auto mb-8">
            {fr
              ? 'Si vous n\'avez jamais fait 1M de vues sur une vidéo, ne demandez pas à ChatGPT de le faire pour vous. Il faut des mois de tests, des centaines de contenus analysés et un savoir-faire que l\'IA seule ne remplace pas. C\'est exactement ce qu\'Empire intègre dans son système.'
              : 'If you\'ve never hit 1M views on a video, don\'t ask ChatGPT to do it for you. It takes months of testing, hundreds of analyzed contents, and expertise that AI alone can\'t replace. That\'s exactly what Empire builds into its system.'}
          </p>

          <OnboardingLink className="inline-flex flex-col items-center px-8 py-4 rounded-2xl bg-empire text-black font-bold text-base md:text-lg hover:scale-[1.03] active:scale-100 transition-all shadow-[0_0_40px_rgb(var(--empire-rgb)_/_0.4)]">
            <span className="flex items-center gap-2">
              {fr ? 'Commencer gratuitement' : 'Start for free'}
              <ArrowRight size={20} />
            </span>
            <span className="text-[11px] font-semibold opacity-70">{fr ? 'Sans engagement · Annulez en 1 clic' : 'No commitment · Cancel in 1 click'}</span>
          </OnboardingLink>
        </motion.div>

      </div>
    </section>
  )
}
