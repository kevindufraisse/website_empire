'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import styles from './legende-form.module.css'

// Sommets dans l'ordre de lecture : Offre en haut, Visibilité en bas à droite, Confiance en bas à gauche.
const POINTS: [number, number][] = [[200, 40], [360, 316], [40, 316]]
const SIDE = Math.hypot(160, 276)

/** Le triangle reste collé à l'écran : chaque côté se trace quand on arrive sur son sommet, puis « Ventes » s'allume au centre. */
export default function LegendeTriangleScroll({ steps, center, caption }: { steps: [string, string][]; center: string; caption: string }) {
  const still = usePrefersReducedMotion()
  const [active, setActive] = useState(still ? steps.length - 1 : 0)
  const items = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (still || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
    }, { rootMargin: '-45% 0px -45% 0px' })
    items.current.forEach(item => item && observer.observe(item))
    return () => observer.disconnect()
  }, [still, steps.length])

  const complete = active >= steps.length - 1
  const transition = { duration: still ? 0 : .7, ease: [.22, 1, .36, 1] as const }

  const triangle = <figure className="mx-auto w-full max-w-[420px]">
    <svg viewBox="-20 0 440 370" className="w-full overflow-visible" aria-hidden>
      <motion.polygon points={POINTS.map(p => p.join(',')).join(' ')} fill="#d4a574" stroke="none"
        initial={false} animate={{ opacity: complete ? .07 : 0 }} transition={transition} />
      {POINTS.map(([x, y], i) => {
        const [nx, ny] = POINTS[(i + 1) % 3]
        return <g key={i}>
          <line x1={x} y1={y} x2={nx} y2={ny} stroke="rgb(255 255 255 / .12)" strokeWidth="1.5" />
          <motion.line x1={x} y1={y} x2={nx} y2={ny} stroke="#d4a574" strokeWidth="2" strokeLinecap="round"
            strokeDasharray={SIDE} initial={false} animate={{ strokeDashoffset: active > i || complete && i === 2 ? 0 : SIDE }} transition={transition} />
        </g>
      })}
      {POINTS.map(([x, y], i) => <g key={'v' + i}>
        <motion.circle cx={x} cy={y} fill="#d4a574" initial={false}
          animate={{ r: active === i ? 11 : 7, opacity: active >= i ? 1 : .35 }} transition={transition} />
        {!still && active === i && <motion.circle cx={x} cy={y} r={11} fill="none" stroke="#d4a574" strokeWidth="1.5"
          initial={{ opacity: .7, scale: 1 }} animate={{ opacity: 0, scale: 2.4 }} style={{ transformOrigin: `${x}px ${y}px` }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }} />}
        <motion.text x={x} y={i === 0 ? y - 22 : y + 38} textAnchor={i === 1 ? 'end' : i === 2 ? 'start' : 'middle'} dx={i === 1 ? 16 : i === 2 ? -16 : 0}
          className={styles.triangleLabel} initial={false} animate={{ opacity: active >= i ? 1 : .35 }} transition={transition}>{steps[i][0]}</motion.text>
      </g>)}
      <motion.text x="200" y="222" textAnchor="middle" className={styles.triangleCenter} initial={false}
        animate={{ opacity: complete ? 1 : 0, y: complete ? 0 : 8 }} transition={transition}>{center}</motion.text>
    </svg>
    <figcaption className="mt-4 text-center text-[13px] uppercase tracking-[0.14em] text-neutral-500">{caption}</figcaption>
  </figure>

  return <div className="mt-12 md:grid md:grid-cols-2 md:gap-14">
    <div className="hidden md:block">
      <div className="sticky top-[18vh] flex h-[64vh] items-center">{triangle}</div>
    </div>
    <div className="mb-6 md:hidden">{triangle}</div>
    <ol>
      {steps.map(([name, body], i) => <li key={name} data-step={i} ref={node => { items.current[i] = node }}
        className={`flex gap-5 border-t border-white/10 py-8 transition-opacity duration-500 md:min-h-[52vh] md:items-center md:border-t-0 md:py-0 ${active === i || still ? 'opacity-100' : 'opacity-35'}`}>
        <span className={styles.number}>0{i + 1}</span>
        <div>
          <h3 className={styles.methodName}>{name}</h3>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-neutral-400">{body}</p>
        </div>
      </li>)}
    </ol>
  </div>
}
