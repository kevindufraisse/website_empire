'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Award, TrendingUp, Code2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

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

export default function FounderSection() {
  const { t } = useLanguage()

  const credentials = [
    {
      icon: Code2,
      stat: '#6',
      label: t.founder?.credential1 || 'Lead Generation Worldwide',
      color: 'from-white/10 to-white/5',
      borderColor: 'border-white/20',
      textColor: 'text-empire',
      shadow: ''
    },
    {
      icon: Award,
      stat: '#48',
      label: t.founder?.credential2 || 'LinkedIn Influencer France',
      color: 'from-white/10 to-white/5',
      borderColor: 'border-white/20',
      textColor: 'text-empire',
      shadow: ''
    },
    {
      icon: TrendingUp,
      stat: '+€3M',
      label: t.founder?.credential3 || 'Generated Online',
      color: 'from-white/10 to-white/5',
      borderColor: 'border-white/20',
      textColor: 'text-empire',
      shadow: ''
    }
  ]

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a]">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(218,252,104,0.05),transparent)]" />
      
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-12">
              <p className="text-xs text-empire uppercase tracking-widest mb-3">
                {t.founder?.badge || 'Meet the Creator'}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t.founder?.title || 'Built by Someone Who Gets It'}
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                {t.founder?.subtitle || 'The AI clones weren\'t built by random developers. They were crafted by a top content creator who spent months reverse-engineering viral content.'}
              </p>
            </div>
          </FadeInBlock>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Photo & Favikon */}
            <FadeInBlock delay={0.1}>
              <div className="relative">
                <a 
                  href="https://www.favikon.com/creators/kevin-dufraisse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-empire/40 to-empire/20 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group-hover:border-empire/30 transition-all">
                    <Image
                      src="https://www.empire-internet.com/_next/image?url=https%3A%2F%2Fd1yei2z3i6k35z.cloudfront.net%2F3647172%2F68c9e9f667659_1.png&w=1200&q=75&dpl=dpl_uBnQRaTatZbzz9Y9NR8Ln9kXSQzd"
                      alt="Kevin Dufraisse - Top 50 LinkedIn France"
                      width={600}
                      height={800}
                      className="w-full h-auto group-hover:scale-[1.01] transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                </a>
              </div>
            </FadeInBlock>

            {/* Right side - Content */}
            <FadeInBlock delay={0.2}>
              <div className="space-y-6">
                {/* Credentials */}
                <div className="grid grid-cols-3 gap-3">
                  {credentials.map((cred, idx) => (
                    <div 
                      key={idx}
                      className={`text-center p-4 rounded-xl bg-gradient-to-br ${cred.color} border ${cred.borderColor} ${cred.shadow}`}
                    >
                      <cred.icon className={`${cred.textColor} mx-auto mb-2`} size={24} />
                      <p className={`text-2xl md:text-3xl font-bold ${cred.textColor}`}>{cred.stat}</p>
                      <p className="text-[10px] md:text-xs text-neutral-400 mt-1">{cred.label}</p>
                    </div>
                  ))}
                </div>

                {/* Story text */}
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-lg text-white font-semibold mb-3">
                    {t.founder?.name || 'Kevin Dufraisse'}
                  </p>
                  <p className="text-neutral-300 leading-relaxed mb-4">
                    {t.founder?.bio || 'After generating over €3M online through content marketing and copywriting, I spent 6 months studying the world\'s top creators and reverse-engineering what makes content go viral. Then I cloned those insights into AI systems that anyone can use.'}
                  </p>
                  <p className="text-empire font-medium">
                    {t.founder?.tagline || '→ Empire is the system I wish I had when I started.'}
                  </p>
                </div>

                {/* Key message */}
                <div className="p-4 rounded-xl bg-empire/10 border border-empire/30">
                  <p className="text-sm text-neutral-300">
                    <span className="text-empire font-semibold">{t.founder?.keyPoint || 'The difference:'}</span>{' '}
                    {t.founder?.keyMessage || 'These aren\'t generic AI templates. They\'re trained on the exact frameworks that generated millions of views and euros in revenue.'}
                  </p>
                </div>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </div>
    </section>
  )
}
