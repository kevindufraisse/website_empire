'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CheckCircle2, X } from 'lucide-react'

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

export default function ObjectionsSection() {
  const { t } = useLanguage()

  const concerns = t.objections?.concerns || []

  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-4xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t.objections?.title || 'Common Concerns'}
            </h2>
            <p className="text-xl text-neutral-300">
              {t.objections?.subtitle || 'We get it. Here\'s what you\'re probably thinking:'}
            </p>
          </div>
        </FadeInBlock>

        <div className="space-y-6">
          {concerns.map((concern: any, i: number) => (
            <FadeInBlock key={i} delay={0.1 + i * 0.1}>
              <div className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-empire/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <X className="text-red-400" size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {concern.concern}
                    </h3>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-empire flex-shrink-0 mt-1" size={20} />
                      <p className="text-neutral-300 leading-relaxed">
                        {concern.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInBlock>
          ))}
        </div>
      </div>
    </section>
  )
}

