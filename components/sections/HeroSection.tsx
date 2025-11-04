'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import RetroGrid from '@/components/magicui/retro-grid'
import { Meteors } from '@/components/magicui/meteors'
import { StarRating } from '@/components/ui/star-rating'
import { RainbowButton } from '@/components/magicui/rainbow-button'
import { HeroVideoDialog, openVideoDialog } from '@/components/magicui/hero-video-dialog'
import { CheckCircle2 } from 'lucide-react'

export default function HeroSection() {
  const { t } = useLanguage()
  return (
    <>
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f]">
        <div className="container">
        <RetroGrid />
        <Meteors number={15} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.15),transparent)]" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
            dangerouslySetInnerHTML={{ __html: t.hero.title }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-4"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex flex-col items-center justify-center gap-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/pricing"
                className="px-8 py-4 bg-empire text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(218,252,104,0.3)]"
              >
                {t.hero.cta1}
              </a>
              <button
                onClick={() => openVideoDialog()}
                className="px-8 py-4 border-2 border-empire/50 text-white font-semibold rounded-xl hover:border-empire hover:bg-empire/10 transition-all"
              >
                {t.hero.cta2}
              </button>
            </div>
            
            {/* Star Rating */}
            <StarRating className="mt-2" />
          </motion.div>

          {/* Top Creators Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12"
          >
            <div className="text-center mb-6">
              <p className="text-sm text-neutral-400 mb-3">
                {t.hero?.creatorsTitle || 'Finally access to the systems of the world\'s top creators'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {/* Grant Cardone */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4295dabe20aff6b9885_Cardone.webp"
                    alt="Grant Cardone"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc429d393fce8535a5023_Tiktok.webp"
                      alt="TikTok"
                      className="w-4 h-4"
                    />
                    <p className="text-sm font-bold text-white group-hover:text-empire transition-colors">Grant Cardone</p>
                  </div>
                </div>

                {/* Ali Abdaal */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d436f96370e8ccb7c4_Abdaal.webp"
                    alt="Ali Abdaal"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d3ced50075f19fe516_Ytb.webp"
                      alt="YouTube"
                      className="w-4 h-4"
                    />
                    <p className="text-sm font-bold text-white group-hover:text-empire transition-colors">Ali Abdaal</p>
                  </div>
                </div>

                {/* Chris Williamson */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-empire/30 transition-all group">
                  <img 
                    src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d4f950bcf495c7dfb2_Williamson.webp"
                    alt="Chris Williamson"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/677fc4d203d064fc4e0bfedc_Instagram.webp"
                      alt="Instagram"
                      className="w-4 h-4"
                    />
                    <p className="text-sm font-bold text-white group-hover:text-empire transition-colors">Chris Williamson</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Video Thumbnail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 hero-video"
          >
            <HeroVideoDialog
              animationStyle="from-center"
              thumbnailSrc="https://d1yei2z3i6k35z.cloudfront.net/3647172/6908ab447a777_Capturedecran2025-11-03a14.16.47.png"
              thumbnailAlt="Empire Internet Demo - Configuration Interface"
            />
          </motion.div>
        </div>
        </div>
      </section>
    </>
  )
}
