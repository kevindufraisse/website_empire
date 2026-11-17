'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Mail, Mic } from 'lucide-react'
import { SocialIcons } from '@/components/ui/social-icons'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useReveal } from '@/hooks/useReveal'
import styles from './legende-form.module.css'

type Lang = 'fr' | 'en'
const SCENE = {
  fr: {
    topics: 'Sujets de la semaine', topicList: ['Ce que tes clients n’osent pas te demander', 'L’erreur qui coûte le plus cher dans ton métier', 'Ton avis sur l’actu de ton marché'],
    live: 'En live', you: 'Toi', published: 'Publié aujourd’hui',
    lead: 'Nouveau contact', leadFrom: ['via ton post LinkedIn', 'via ton reel Instagram', 'via ta vidéo YouTube'],
    offer: 'Ton offre', offerList: ['Positionnement de l’offre', 'Grille de tarifs', 'Page de paiement'],
  },
  en: {
    topics: 'This week’s topics', topicList: ['What your clients don’t dare ask you', 'The most expensive mistake in your field', 'Your take on your market’s news'],
    live: 'Live', you: 'You', published: 'Published today',
    lead: 'New contact', leadFrom: ['from your LinkedIn post', 'from your Instagram reel', 'from your YouTube video'],
    offer: 'Your offer', offerList: ['Offer positioning', 'Pricing grid', 'Checkout page'],
  },
}
const NETWORKS = ['linkedin', 'instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'threads'] as const

function Scene({ index, lang, still }: { index: number; lang: Lang; still: boolean }) {
  const l = SCENE[lang]
  if (index === 0) return <div className={styles.sceneCard}>
    <p className={styles.sceneTitle}>{l.topics}</p>
    <ul className="mt-4 space-y-2.5">{l.topicList.map(topic => <li key={topic} className={styles.sceneRow}><Check aria-hidden size={15} className="shrink-0 text-autopilot" />{topic}</li>)}</ul>
  </div>
  if (index === 1) return <div className={styles.sceneCard}>
    <p className={styles.sceneTitle}><span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" />{l.live} · 42:10</p>
    <div className="mt-5 flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/founders/kevin.jpg" alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-autopilot/60" />
      <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-sm font-semibold">{l.you}</span>
      <Mic aria-hidden size={18} className="ml-auto text-autopilot" />
    </div>
    <div className="mt-5 flex h-12 items-center gap-1" aria-hidden>
      {Array.from({ length: 28 }, (_, i) => <span key={i} className={`${styles.wave} ${still ? '' : styles.waveLive}`} style={{ height: `${25 + (i * 37) % 70}%`, animationDelay: `${(i % 7) * 90}ms` }} />)}
    </div>
  </div>
  if (index === 2) return <div className={styles.sceneCard}>
    <p className={styles.sceneTitle}>{l.published}</p>
    <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-7 md:grid-cols-4">
      {NETWORKS.map((network, i) => {
        const Icon = SocialIcons[network]
        return <span key={network} className={styles.networkTile} style={{ animationDelay: still ? undefined : `${i * 80}ms` }}>
          <Icon /><Check aria-hidden size={12} className={styles.networkCheck} />
        </span>
      })}
    </div>
  </div>
  if (index === 3) return <div className={styles.sceneCard}>
    <ul className="space-y-2.5">{l.leadFrom.map((from, i) => <li key={from} className={styles.leadRow} style={{ animationDelay: still ? undefined : `${i * 140}ms` }}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-autopilot/15 text-autopilot"><Mail aria-hidden size={16} /></span>
      <span className="min-w-0"><b className="block text-sm font-semibold">{l.lead}</b><span className="text-[13px] text-neutral-400">{['c•••@gmail.com', 'm•••@cabinet.fr', 'j•••@outlook.com'][i]} · {from}</span></span>
    </li>)}</ul>
  </div>
  return <div className={styles.sceneCard}>
    <p className={styles.sceneTitle}>{l.offer}</p>
    <ul className="mt-4 space-y-2.5">{l.offerList.map(item => <li key={item} className={styles.sceneRow}><Check aria-hidden size={15} className="shrink-0 text-autopilot" />{item}</li>)}</ul>
  </div>
}

/** « Ta semaine avec nous » : le visuel reste collé à l'écran et change à chaque étape, comme les scènes de l'accueil. */
export default function LegendeWeekScroll({ lang, steps }: { lang: Lang; steps: [string, string][] }) {
  const still = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const items = useRef<(HTMLLIElement | null)[]>([])
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
    }, { rootMargin: '-45% 0px -45% 0px' })
    items.current.forEach(item => item && observer.observe(item))
    return () => observer.disconnect()
  }, [steps.length])

  return <div className="mt-10 md:grid md:grid-cols-2 md:gap-14">
    <div className="hidden md:block">
      <div className="sticky top-[20vh] flex h-[60vh] items-center">
        <div className="w-full">
          <p className={styles.bigNumber} aria-hidden>0{active + 1}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={still ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={still ? undefined : { opacity: 0, y: -12 }} transition={{ duration: .35, ease: [.22, 1, .36, 1] }}>
              <Scene index={active} lang={lang} still={still} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    <ol>
      {steps.map(([title, body], i) => <li key={title} data-step={i} ref={node => { items.current[i] = node }}
        className={`flex flex-col justify-center gap-5 border-t border-white/10 py-10 transition-opacity duration-300 md:min-h-[60vh] md:border-t-0 md:py-0 ${active === i ? 'md:opacity-100' : 'md:opacity-30'}`}>
        <div className="md:hidden"><Scene index={i} lang={lang} still /></div>
        <div>
          <span className={styles.number}>0{i + 1}</span>
          <h3 className={`mt-2 ${styles.serviceName}`}>{title}</h3>
          <p className="mt-2 max-w-md text-[16px] leading-relaxed text-neutral-400">{body}</p>
        </div>
      </li>)}
    </ol>
  </div>
}

/** Apparition au défilement, comme les sections de l'accueil. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, inView] = useReveal('-80px')
  const still = usePrefersReducedMotion()
  if (still) return <div className={className}>{children}</div>
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: .6, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}
