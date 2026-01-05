'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mic, ArrowRight } from 'lucide-react'
import { getCalApi } from "@calcom/embed-react"

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

// Voice Animation Component
function VoiceAnimation() {
  const [bars, setBars] = useState<number[]>([])
  
  useEffect(() => {
    const generateBars = () => {
      const newBars = Array.from({ length: 30 }, () => 20 + Math.random() * 80)
      setBars(newBars)
    }
    generateBars()
    const interval = setInterval(generateBars, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center gap-[2px] w-full max-w-xs h-20">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-gradient-to-t from-empire/80 to-empire/40 rounded-full transition-all duration-150"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  )
}

// Content List Items
const contentItems = [
  { icon: 'linkedin', label: '30 LinkedIn posts', time: 'Écrit & planifié' },
  { icon: 'newsletter', label: '30 newsletters', time: 'Contenu quotidien' },
  { icon: 'reels', label: '30 reels/shorts', time: 'Édité & optimisé' },
  { icon: 'instagram', label: '30 Instagram posts', time: 'Designé & légendé' },
  { icon: 'twitter', label: '10 Twitter posts', time: 'Idées décortiquées' },
  { icon: 'threads', label: '10 Threads posts', time: 'Contenu engageant' },
]

const contentItemsEn = [
  { icon: 'linkedin', label: '30 LinkedIn posts', time: 'Written & scheduled' },
  { icon: 'newsletter', label: '30 newsletters', time: 'Daily content' },
  { icon: 'reels', label: '30 reels/shorts', time: 'Edited & optimized' },
  { icon: 'instagram', label: '30 Instagram posts', time: 'Designed & captioned' },
  { icon: 'twitter', label: '10 Twitter posts', time: 'Ideas unpacked' },
  { icon: 'threads', label: '10 Threads posts', time: 'Engaging content' },
]

// Social Icons
const SocialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'linkedin':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    case 'newsletter':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#DAFC68">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      )
    case 'reels':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'instagram':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FED373"/>
              <stop offset="30%" stopColor="#D92E7F"/>
              <stop offset="100%" stopColor="#515BD4"/>
            </linearGradient>
          </defs>
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" fill="url(#ig-grad)"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    case 'threads':
      return (
        <svg width="18" height="18" viewBox="0 0 192 192" fill="white">
          <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
        </svg>
      )
    default:
      return null
  }
}

export default function HowItWorksAccordion() {
  const { t, lang } = useLanguage()
  const items = lang === 'fr' ? contentItems : contentItemsEn

  const namespace = lang === 'fr' ? 'empire-request-fr' : 'empire-request'
  const calLink = lang === 'fr' ? 'kevin-dufraisse-private/empire-request-fr' : 'kevin-dufraisse-private/empire-request'

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", { 
        hideEventTypeDetails: false, 
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
    })()
  }, [namespace])

  return (
    <section id="how-it-works" className="relative w-full py-16 md:py-28 overflow-hidden bg-[#0a0a0a]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(218,252,104,0.08),transparent)]" />
      
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <FadeInBlock>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-3">{t.howItWorks.title}</h2>
              <p className="text-base md:text-xl text-neutral-400">
                {t.howItWorks.subtitle}
              </p>
            </div>
          </FadeInBlock>

          {/* 3 Visual Blocks */}
          <FadeInBlock delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              
              {/* BLOCK 1 - Voice Recording */}
              <div className="group relative flex flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all min-h-[320px]">
                <div className="absolute inset-0">
                  <div className="flex flex-col items-center justify-center h-full w-full p-8 gap-6">
                    {/* Mic Icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-empire/30 to-empire/10 border-2 border-empire flex items-center justify-center">
                      <Mic className="text-empire" size={28} />
                    </div>
                    
                    {/* Voice Waveform */}
                    <VoiceAnimation />
                    
                    <p className="text-xs text-empire font-semibold tracking-wider uppercase">
                      {lang === 'fr' ? 'Enregistrement...' : 'Recording...'}
                    </p>
                  </div>
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                
                {/* Text */}
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-md bg-empire flex items-center justify-center text-black font-bold text-sm">1</span>
                    <h3 className="text-xl font-semibold text-white">
                      {lang === 'fr' ? 'Parlez 15 min' : 'Speak 15 min'}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {lang === 'fr' ? 'On transforme votre voix en contenu qui convertit.' : 'We transform your voice into content that converts.'}
                  </p>
                </div>
              </div>

              {/* BLOCK 2 - Content Ready */}
              <div className="group relative flex flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all min-h-[320px]">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 pt-6 px-3 [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)]">
                    <div className="flex flex-col gap-2 overflow-hidden w-full">
                      {items.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-empire/20"
                        >
                          <div className="flex-shrink-0">
                            <SocialIcon type={item.icon} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.label}</p>
                            <p className="text-[10px] text-neutral-500">{item.time}</p>
                          </div>
                          <div className="text-xs text-empire font-bold">✓</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                
                {/* Text */}
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-md bg-empire flex items-center justify-center text-black font-bold text-sm">2</span>
                    <h3 className="text-xl font-semibold text-white">
                      {lang === 'fr' ? 'Contenu Créé' : 'Content Created'}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {lang === 'fr' ? 'IA + humain créent 30+ contenus par semaine.' : 'AI + human create 30+ pieces per week.'}
                  </p>
                </div>
              </div>

              {/* BLOCK 3 - Calendar Ready */}
              <div className="group relative flex flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-empire/30 transition-all min-h-[320px]">
                <div className="absolute inset-0">
                  <div className="flex flex-col items-center justify-center h-full w-full p-8 gap-4">
                    {/* Mini Calendar Preview */}
                    <div className="grid grid-cols-7 gap-1 p-3 rounded-xl bg-white/5 border border-white/10">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${
                            [2, 5, 9, 12, 16, 19, 23, 26].includes(i)
                              ? 'bg-empire/30 text-empire font-bold'
                              : 'bg-white/5 text-neutral-500'
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-xs text-empire font-semibold tracking-wider uppercase">
                      {lang === 'fr' ? '1 clic pour publier' : '1 click to publish'}
                    </p>
                  </div>
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                
                {/* Text */}
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-md bg-empire flex items-center justify-center text-black font-bold text-sm">3</span>
                    <h3 className="text-xl font-semibold text-white">
                      {lang === 'fr' ? 'Publiez' : 'Publish'}
                    </h3>
                  </div>
                  <p className="text-neutral-400 text-sm">
                    {lang === 'fr' ? 'Tout est dans votre calendrier. Relisez et publiez.' : 'Everything in your calendar. Review and publish.'}
                  </p>
                </div>
              </div>

            </div>
          </FadeInBlock>

          {/* CTA Button */}
          <FadeInBlock delay={0.2}>
            <div className="mt-10 md:mt-14 text-center">
              <button
                data-cal-namespace={namespace}
                data-cal-link={calLink}
                data-cal-config='{"layout":"month_view","theme":"dark"}'
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-empire text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(218,252,104,0.3)]"
              >
                {lang === 'fr' ? 'Audit gratuit' : 'Free Audit'}
                <ArrowRight size={20} />
              </button>
              <p className="mt-3 text-sm text-neutral-500">
                {lang === 'fr' ? '15 min · Sans engagement' : '15 min · No commitment'}
              </p>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
