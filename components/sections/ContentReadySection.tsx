'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import NumberTicker from '@/components/magicui/number-ticker'
import OrbitingCircles from '@/components/magicui/orbiting-circles'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { DotPattern } from '@/components/magicui/dot-pattern'
import { InlineCTA } from '@/components/ui/inline-cta'
import { SocialIcons } from '@/components/ui/social-icons'
import { Brain, Eye, TrendingUp, Users, Sparkles } from 'lucide-react'

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
  {
    name: 'Justin Welsh',
    specialty: 'LinkedIn Expert',
    image: 'https://cdn.prod.website-files.com/6478b97e8a7a81e06c1cff93/647a571d951cf02b2826ad76_headshot%20justing.webp',
    color: 'from-blue-500/40 to-blue-500/20',
  },
  {
    name: 'Alex Hormozi',
    specialty: 'Video Content',
    image: 'https://yt3.googleusercontent.com/29XFUn3pc3cC81yUUCFiyCKKdgi856IGMJ4EZBnf53zTfrWWUGvmYnYGx86K08f4XR03UxpWyw=s900-c-k-c0x00ffffff-no-rj',
    color: 'from-red-500/40 to-red-500/20',
  },
  {
    name: 'Matt Gray',
    specialty: 'Content Strategy',
    image: 'https://yt3.googleusercontent.com/W_GKaSoEuny3REkdSVW-AD6wcB_z5Ltr3hY_Mos94yDKlFLupVnJ6Gf8w1YfjEGps2nr62fB=s160-c-k-c0x00ffffff-no-rj',
    color: 'from-green-500/40 to-green-500/20',
  },
  {
    name: 'Iman Gadzhi',
    specialty: 'Marketing',
    image: 'https://yt3.googleusercontent.com/TuT4HjFsvarFnLuoKokU5Jr2Iay3D2d3Ee5Ktqdya4Zr9hDnfK4lpYbAhRU0R0qE8pjUZK32qrE=s160-c-k-c0x00ffffff-no-rj',
    color: 'from-purple-500/40 to-purple-500/20',
  },
  {
    name: 'Dan Koe',
    specialty: 'Copywriting',
    image: 'https://m.media-amazon.com/images/S/amzn-author-media-prod/uvf39i5aot2ru33c63bgr1p0sf._SY450_CR0%2C0%2C450%2C450_.jpg',
    color: 'from-indigo-500/40 to-indigo-500/20',
  },
  {
    name: 'Ali Abdaal',
    specialty: 'Productivity',
    image: 'https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/9albp97vrnqisvn3ebc97oe237.jpg',
    color: 'from-yellow-500/40 to-yellow-500/20',
  },
  {
    name: 'Chris Williamson',
    specialty: 'Podcast Host',
    image: 'https://yt3.googleusercontent.com/ytc/AIdro_mmN30Y4ap7dtPfLw8Algolz_LGtHHpTJxa-qAw-MCQpdo=s160-c-k-c0x00ffffff-no-rj',
    color: 'from-teal-500/40 to-teal-500/20',
  },
]

export default function ContentReadySection() {
  const { t } = useLanguage()
  
  return (
    <section id="content-ready" className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black via-[#0f0f0f] to-black">
      <DotPattern className="opacity-40" width={20} height={20} cr={1.5} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(123,224,255,0.08),transparent)]" />
      <div className="container">
        <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: t.contentReady.title }} />
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-6">
              {t.contentReady.subtitle}
            </p>
            
            {/* Result stat - compact */}
            <div className="inline-flex items-baseline gap-2 px-4 py-2 rounded-lg bg-empire/10 border border-empire/30">
              <span className="text-sm text-neutral-400">{t.contentReady.average}</span>
              <span className="text-3xl font-bold text-empire">
                <NumberTicker value={1} />M+
              </span>
              <span className="text-sm text-neutral-400">{t.contentReady.viewsMonth}</span>
            </div>
          </div>
        </FadeInBlock>

        {/* Orbiting Creators */}
        <FadeInBlock delay={0.1}>
          <div className="relative flex h-[500px] md:h-[700px] w-full items-center justify-center overflow-visible mb-12 py-12">
            {/* Center - Empire */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-empire/30 to-empire/10 border-4 border-empire flex items-center justify-center shadow-[0_0_50px_rgba(218,252,104,0.3)]">
                <SparklesText className="text-2xl font-bold text-empire" sparklesCount={8}>
                  Empire
                </SparklesText>
              </div>
              <p className="mt-4 text-sm text-neutral-400">{t.contentReady.aiPrompt}</p>
            </div>

            {/* Orbiting Creators - Ring 1 */}
            <OrbitingCircles radius={150} duration={20} delay={0}>
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/40 to-blue-500/20 border-2 border-blue-500/60 overflow-hidden shadow-lg">
                  <img 
                    src={creators[0].image} 
                    alt={creators[0].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 right-1">
                    <div className="scale-50">
                      <SocialIcons.linkedin />
                    </div>
                  </div>
                </div>
              </div>
            </OrbitingCircles>

            <OrbitingCircles radius={150} duration={20} delay={10}>
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-red-500/40 to-red-500/20 border-2 border-red-500/60 overflow-hidden shadow-lg">
                  <img 
                    src={creators[1].image} 
                    alt={creators[1].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0.5 right-0.5">
                    <div className="scale-[0.35]">
                      <SocialIcons.youtube />
                    </div>
                  </div>
                </div>
              </div>
            </OrbitingCircles>

            {/* Orbiting Creators - Ring 2 (reverse) */}
            <OrbitingCircles radius={220} duration={25} delay={0} reverse>
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500/40 to-green-500/20 border-2 border-green-500/60 overflow-hidden shadow-xl">
                  <img 
                    src={creators[2].image} 
                    alt={creators[2].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 right-1">
                    <div className="scale-[0.4]">
                      <SocialIcons.youtube />
                    </div>
                  </div>
                </div>
              </div>
            </OrbitingCircles>

            <OrbitingCircles radius={220} duration={25} delay={8.3} reverse>
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/40 to-purple-500/20 border-2 border-purple-500/60 overflow-hidden shadow-lg">
                  <img 
                    src={creators[3].image} 
                    alt={creators[3].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0.5 right-0.5">
                    <div className="scale-[0.35]">
                      <SocialIcons.youtube />
                    </div>
                  </div>
                </div>
              </div>
            </OrbitingCircles>

            <OrbitingCircles radius={220} duration={25} delay={16.6} reverse>
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/40 to-indigo-500/20 border-2 border-indigo-500/60 overflow-hidden shadow-lg">
                  <img 
                    src={creators[4].image} 
                    alt={creators[4].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 right-1">
                    <div className="scale-[0.4]">
                      <SocialIcons.twitter />
                    </div>
                  </div>
                </div>
              </div>
            </OrbitingCircles>

            {/* Orbiting Creators - Ring 3 */}
            <OrbitingCircles radius={290} duration={30} delay={0}>
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500/40 to-yellow-500/20 border-2 border-yellow-500/60 overflow-hidden shadow-lg">
                  <img 
                    src={creators[5].image} 
                    alt={creators[5].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0.5 right-0.5">
                    <div className="scale-[0.35]">
                      <SocialIcons.youtube />
                    </div>
                  </div>
                </div>
              </div>
            </OrbitingCircles>

            <OrbitingCircles radius={290} duration={30} delay={15}>
              <div className="flex flex-col items-center">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/40 to-teal-500/20 border-2 border-teal-500/60 overflow-hidden shadow-lg">
                  <img 
                    src={creators[6].image} 
                    alt={creators[6].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0.5 right-0.5">
                    <div className="scale-[0.3]">
                      <SocialIcons.youtube />
                    </div>
                  </div>
                </div>
              </div>
            </OrbitingCircles>
          </div>
        </FadeInBlock>

        {/* The System */}
        <FadeInBlock delay={0.3}>
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border-2 border-empire/30 overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-empire/20 via-transparent to-empire/20 blur-3xl animate-pulse" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <Brain className="text-empire" size={40} />
                    <Sparkles className="text-empire" size={32} />
                    <Brain className="text-empire" size={40} />
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                    {t.contentReady.systemTitle}
                  </h3>
                  
                  <p className="text-lg text-neutral-300 mb-6 max-w-2xl mx-auto">
                    {t.contentReady.systemDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {t.contentReady.frameworks.map((framework: any, i: number) => {
                      const colors = [
                        'border-blue-500/20 text-blue-400',
                        'border-red-500/20 text-red-400',
                        'border-green-500/20 text-green-400',
                        'border-purple-500/20 text-purple-400',
                        'border-indigo-500/20 text-indigo-400',
                        'border-yellow-500/20 text-yellow-400',
                      ]
                      const colorClass = colors[i % colors.length]
                      return (
                        <div key={i} className={`p-4 rounded-lg bg-black/40 border ${colorClass.split(' ')[0]} text-left`}>
                          <p className={`text-xs font-semibold mb-2 ${colorClass.split(' ')[1]}`}>{framework.name}</p>
                          <p className="text-sm text-neutral-300 font-mono">
                            {framework.pattern}
                          </p>
                        </div>
                      )
                    })}
                  </div>
            </div>
          </div>
        </FadeInBlock>

        {/* CTA */}
        <FadeInBlock delay={0.6}>
          <div className="mt-12">
            <InlineCTA
              title={t.contentReady.cta}
              primaryText={t.contentReady.ctaButton}
              variant="minimal"
            />
          </div>
        </FadeInBlock>
        </div>
      </div>
      </section>
    )
  }

