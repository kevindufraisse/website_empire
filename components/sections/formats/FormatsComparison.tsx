'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Clock, FileText, Zap } from 'lucide-react'

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

export default function FormatsComparison() {
  const { lang } = useLanguage()

  const formats = [
    {
      name: lang === 'fr' ? 'Interview Libre' : 'Free Interview',
      prep: lang === 'fr' ? 'Aucune' : 'None',
      duration: '15 min',
      outputs: '30+',
      badge: lang === 'fr' ? 'Plus populaire' : 'Most popular',
    },
    {
      name: lang === 'fr' ? 'Interview Thème' : 'Themed Interview',
      prep: lang === 'fr' ? 'Questions' : 'Questions',
      duration: '20 min',
      outputs: '30+',
    },
    {
      name: lang === 'fr' ? 'Bulletpoint' : 'Bulletpoint',
      prep: lang === 'fr' ? 'Vos notes' : 'Your notes',
      duration: '20 min',
      outputs: '30+',
      badge: lang === 'fr' ? 'Meilleur ROI' : 'Best ROI',
    },
    {
      name: lang === 'fr' ? 'Screenrecording' : 'Screenrecording',
      prep: lang === 'fr' ? 'Écran prêt' : 'Screen ready',
      duration: '30 min',
      outputs: '30+',
    },
    {
      name: lang === 'fr' ? 'Scripts Viraux' : 'Viral Scripts',
      prep: lang === 'fr' ? 'Lien vidéo' : 'Video link',
      duration: '5 min',
      outputs: '3',
      badge: lang === 'fr' ? 'Plus rapide' : 'Fastest',
    },
    {
      name: lang === 'fr' ? 'Inspirations' : 'Inspirations',
      prep: lang === 'fr' ? 'Lien vidéo' : 'Video link',
      duration: '5 min',
      outputs: '3',
    },
  ]

  return (
    <section className="container py-16">
      <div className="max-w-5xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {lang === 'fr' ? 'Comparaison Rapide' : 'Quick Comparison'}
            </h2>
            <p className="text-neutral-400">
              {lang === 'fr' 
                ? 'Choisissez selon votre style et le temps disponible'
                : 'Choose based on your style and available time'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 text-sm font-semibold text-neutral-400">
                    {lang === 'fr' ? 'Format' : 'Format'}
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-neutral-400">
                    <div className="flex items-center justify-center gap-2">
                      <FileText size={16} />
                      {lang === 'fr' ? 'Préparation' : 'Prep'}
                    </div>
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-neutral-400">
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={16} />
                      {lang === 'fr' ? 'Durée' : 'Duration'}
                    </div>
                  </th>
                  <th className="text-center p-4 text-sm font-semibold text-neutral-400">
                    <div className="flex items-center justify-center gap-2">
                      <Zap size={16} />
                      {lang === 'fr' ? 'Contenus' : 'Outputs'}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {formats.map((format, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{format.name}</p>
                        {format.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-empire/20 border border-empire/30 text-empire text-xs font-bold">
                            {format.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center text-neutral-300 text-sm">{format.prep}</td>
                    <td className="p-4 text-center text-neutral-300 text-sm font-semibold">{format.duration}</td>
                    <td className="p-4 text-center">
                      <span className="text-empire font-bold text-lg">{format.outputs}</span>
                      <span className="text-neutral-500 text-xs ml-1">
                        {lang === 'fr' ? 'contenus' : 'pieces'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            {lang === 'fr' 
              ? '👇 Scrollez pour voir chaque format en détail'
              : '👇 Scroll to see each format in detail'}
          </p>
        </FadeInBlock>
      </div>
    </section>
  )
}

