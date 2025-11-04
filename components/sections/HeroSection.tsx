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
            className="mt-6 text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-6"
          >
            {t.hero.description}
          </motion.p>

          {/* Platform Logos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 mb-8"
          >
            <p className="text-sm text-neutral-400 mb-4">
              {t.hero.publishedOn || 'Published on'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {/* LinkedIn */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-empire/30 transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-semibold text-white">LinkedIn</span>
              </div>

              {/* YouTube */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-empire/30 transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm font-semibold text-white">YouTube</span>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-empire/30 transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm font-semibold text-white">Instagram</span>
              </div>

              {/* Twitter/X */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-empire/30 transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm font-semibold text-white">Twitter/X</span>
              </div>

              {/* Threads */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-empire/30 transition-all">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.5c-4.142 0-7.5-3.358-7.5-7.5S7.858 4.5 12 4.5s7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5z"/>
                </svg>
                <span className="text-sm font-semibold text-white">Threads</span>
              </div>

              {/* Email/Newsletter */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-empire/30 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold text-white">Newsletter</span>
              </div>
            </div>
          </motion.div>

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
              <p className="text-sm text-neutral-400 mb-2">
                {t.hero?.creatorsTitle || 'Finally access to the systems of the world\'s top creators'}
              </p>
              <p className="text-xs text-empire/70 mb-3">
                {t.hero?.creatorsSubtitle || 'Using Empire\'s system'}
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
