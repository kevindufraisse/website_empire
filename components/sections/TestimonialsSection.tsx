'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { DotPattern } from '@/components/magicui/dot-pattern'

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

export default function TestimonialsSection() {
  const { t } = useLanguage()
  
  useEffect(() => {
    // Load Senja script
    const script = document.createElement('script')
    script.src = 'https://widget.senja.io/widget/a7bf7e4a-0f3b-4751-8190-849f83d16306/platform.js'
    script.type = 'text/javascript'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black via-[#0f0f0f] to-black">
      <DotPattern className="opacity-60" width={20} height={20} cr={1.5} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(123,224,255,0.08),transparent)]" />
      <div className="container">
        <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              {t.testimonials.subtitle}
            </p>
          </div>
        </FadeInBlock>

        {/* Senja Widget */}
        <FadeInBlock delay={0.1}>
          <div
            className="senja-embed"
            data-id="a7bf7e4a-0f3b-4751-8190-849f83d16306"
            data-mode="shadow"
            data-lazyload="false"
            style={{ display: 'block', width: '100%' }}
          />
        </FadeInBlock>
      </div>
      </div>
    </section>
  )
}

