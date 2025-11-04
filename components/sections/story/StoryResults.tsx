'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Award, Newspaper } from 'lucide-react'

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

export default function StoryResults() {
  return (
    <section className="container py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        <FadeInBlock>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              The <span className="text-empire">Results</span>
            </h2>
            <p className="text-xl text-neutral-300">
              Real traction. Real recognition.
            </p>
          </div>
        </FadeInBlock>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Top 50 LinkedIn France */}
          <FadeInBlock delay={0.1}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-empire to-green-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-empire/20 border-2 border-empire flex items-center justify-center">
                    <Award className="text-empire" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Top 50 LinkedIn France</h3>
                    <p className="text-sm text-neutral-400">Influencer Ranking</p>
                  </div>
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src="https://d1yei2z3i6k35z.cloudfront.net/3647172/68c9e9f667659_1.png"
                    alt="Kevin Dufraisse - Top 50 LinkedIn France"
                    width={600}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeInBlock>

          {/* Media Coverage */}
          <FadeInBlock delay={0.2}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-empire to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-empire/20 border-2 border-empire flex items-center justify-center">
                    <Newspaper className="text-empire" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Media Coverage</h3>
                    <p className="text-sm text-neutral-400">Featured in press</p>
                  </div>
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src="https://d1yei2z3i6k35z.cloudfront.net/3647172/67406b1e63374_KEVINDUFRAISSE1.png"
                    alt="Kevin Dufraisse - Media Coverage"
                    width={600}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>

        {/* Final Message */}
        <FadeInBlock delay={0.3}>
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-empire/10 to-transparent border border-empire/30">
              <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                This isn't luck. It's a system.
              </p>
              <p className="text-lg text-neutral-300 mb-6">
                And now, I want to share it with you.
              </p>
              <p className="text-empire font-semibold text-xl">
                Welcome to Empire Internet.
              </p>
            </div>
          </div>
        </FadeInBlock>
      </div>
    </section>
  )
}

