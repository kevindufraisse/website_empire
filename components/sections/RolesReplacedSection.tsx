'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Check, X } from 'lucide-react'

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

const roles = [
  { en: 'LinkedIn Ghostwriter', fr: 'Ghostwriter LinkedIn' },
  { en: 'Community Manager', fr: 'Community Manager' },
  { en: 'LinkedIn Setter', fr: 'Setter LinkedIn' },
  { en: 'Copywriter', fr: 'Copywriter' },
  { en: 'Viral Writer', fr: 'Viral Writer' },
  { en: 'YouTube Writer', fr: 'YouTube Writer' },
  { en: 'Video Editor', fr: 'Monteur Vidéo' },
  { en: 'Social Media Manager', fr: 'Social Media Manager' },
  { en: 'Content Strategist', fr: 'Content Strategist' },
  { en: 'Graphic Designer', fr: 'Graphic Designer' },
  { en: 'SEO Writer', fr: 'SEO Writer' },
  { en: 'Script Writer', fr: 'Script Writer' },
  { en: 'Podcast Producer', fr: 'Podcast Producer' },
  { en: 'Brand Strategist', fr: 'Brand Strategist' },
  { en: 'Email Copywriter', fr: 'Email Copywriter' },
]

export default function RolesReplacedSection() {
  const { lang } = useLanguage()

  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
              <p className="text-sm font-bold text-empire">
                {lang === 'fr' ? 'UNE ÉQUIPE COMPLÈTE' : 'A COMPLETE TEAM'}
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {lang === 'fr' 
                ? 'Empire remplace 15+ rôles' 
                : 'Empire replaces 15+ roles'}
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
              {lang === 'fr'
                ? 'Pourquoi embaucher une équipe entière quand Empire fait tout ?'
                : 'Why hire an entire team when Empire does it all?'}
            </p>
          </div>
        </FadeInBlock>

        {/* Comparaison Before/After */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Sans Empire */}
          <FadeInBlock delay={0.2}>
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="text-red-400" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {lang === 'fr' ? 'Sans Empire' : 'Without Empire'}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-neutral-300 text-sm">
                    {lang === 'fr' ? '15+ employés à gérer' : '15+ employees to manage'}
                  </span>
                  <span className="text-red-400 font-bold">~€180K/an</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-neutral-300 text-sm">
                    {lang === 'fr' ? 'Recrutement & formation' : 'Recruitment & training'}
                  </span>
                  <span className="text-red-400 font-bold">
                    {lang === 'fr' ? '6+ mois' : '6+ months'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-neutral-300 text-sm">
                    {lang === 'fr' ? 'Coordination complexe' : 'Complex coordination'}
                  </span>
                  <span className="text-red-400 font-bold">
                    {lang === 'fr' ? 'Épuisant' : 'Exhausting'}
                  </span>
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* Avec Empire */}
          <FadeInBlock delay={0.3}>
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-empire/20 to-empire/5 border-2 border-empire shadow-[0_0_30px_rgba(218,252,104,0.2)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-empire/30 flex items-center justify-center">
                  <Check className="text-empire" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {lang === 'fr' ? 'Avec Empire' : 'With Empire'}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-neutral-300 text-sm">
                    {lang === 'fr' ? 'Tout en un' : 'All-in-one'}
                  </span>
                  <span className="text-empire font-bold">€1000/mois</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-neutral-300 text-sm">
                    {lang === 'fr' ? 'Contenu en' : 'Content in'}
                  </span>
                  <span className="text-empire font-bold">24-48h</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-neutral-300 text-sm">
                    {lang === 'fr' ? 'Zéro gestion' : 'Zero management'}
                  </span>
                  <span className="text-empire font-bold">
                    {lang === 'fr' ? 'Automatique' : 'Automatic'}
                  </span>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>

        {/* Liste des rôles */}
        <FadeInBlock delay={0.4}>
          <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {lang === 'fr' ? 'Tous ces rôles inclus' : 'All these roles included'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {roles.map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-empire/30 transition-colors"
                >
                  <Check className="text-empire flex-shrink-0" size={16} />
                  <span className="text-neutral-300 text-sm font-medium">
                    {lang === 'fr' ? role.fr : role.en}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-neutral-400 text-sm">
                {lang === 'fr'
                  ? '+ tous les outils et logiciels nécessaires'
                  : '+ all necessary tools and software'}
              </p>
            </div>
          </div>
        </FadeInBlock>

        {/* CTA */}
        <FadeInBlock delay={0.5}>
          <div className="mt-12 text-center">
            <a
              href="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-empire text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(218,252,104,0.3)]"
            >
              {lang === 'fr' ? 'Réserver une démo' : 'Book a demo'}
              <span>→</span>
            </a>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}
