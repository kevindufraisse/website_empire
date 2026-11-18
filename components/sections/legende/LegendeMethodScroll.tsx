'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import styles from './legende-form.module.css'

type Props = { label: string; title: [string, string]; text: string; items: [string, string][]; center: string }

/** Sommets : Offre en haut, Visibilité en bas à droite, Confiance en bas à gauche. Le trait suit cet ordre. */
const PTS: [number, number][] = [[200, 40], [360, 316], [40, 316]]
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 0]]
/** Fenêtres de la séquence sur la progression 0 → 1 de la section épinglée. */
const PHASE = [[.22, .42], [.44, .64], [.66, .86]] as const
const FINALE: [number, number] = [.88, .98]

const range = (p: MotionValue<number>, from: number, to: number, out: [number, number]) => useTransform(p, [from, to], out)

function Slide({ p, phase, name, body, last }: { p: MotionValue<number>; phase: readonly [number, number]; name: string; body: string; last: boolean }) {
  const [a, b] = phase
  const enter = a + .04, leave = last ? FINALE[0] : b + .02
  const opacity = useTransform(p, [a, enter, leave, leave + .04], [0, 1, 1, 0])
  const y = useTransform(p, [a, enter, leave, leave + .04], [28, 0, 0, -22])
  const filter = useTransform(p, [a, enter, leave, leave + .04], ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(8px)'])
  return <motion.div className={styles.methodSlide} style={{ opacity, y, filter }}>
    <p className={styles.methodName}>{name}</p>
    <p className={styles.methodBody}>{body}</p>
  </motion.div>
}

function Edge({ p, phase, from, to }: { p: MotionValue<number>; phase: readonly [number, number]; from: [number, number]; to: [number, number] }) {
  const pathLength = range(p, phase[0], phase[1], [0, 1])
  return <motion.line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke="#d4a574" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength }} />
}

function Vertex({ p, at, point, label, index }: { p: MotionValue<number>; at: number; point: [number, number]; label: string; index: number }) {
  const [x, y] = point
  const scale = range(p, at - .02, at + .02, [0, 1])
  const halo = useTransform(p, [at - .02, at + .02, at + .18, at + .22], [0, 1, 1, 0])
  const haloScale = useTransform(p, [at - .02, at + .2], [1, 3.2])
  return <g>
    <motion.circle cx={x} cy={y} r="8" fill="none" stroke="#d4a574" strokeWidth="1" style={{ scale: haloScale, opacity: halo, transformOrigin: `${x}px ${y}px` }} />
    <motion.circle cx={x} cy={y} r="8" fill="#d4a574" style={{ scale, transformOrigin: `${x}px ${y}px` }} />
    <motion.text x={x} y={index === 0 ? y - 24 : y + 42} textAnchor={index === 1 ? 'end' : index === 2 ? 'start' : 'middle'} dx={index === 1 ? 18 : index === 2 ? -18 : 0}
      className={styles.triangleLabel} style={{ opacity: scale }}>{label}</motion.text>
  </g>
}

/**
 * La méthode Empire, racontée au défilement comme les scènes de l'accueil : la section reste collée à l'écran le temps
 * de quatre écrans, le titre arrive flou puis se range en haut, chaque côté du triangle se trace avec son texte,
 * et « Ventes » s'allume au centre pour finir. Sans animation (réglage système), tout est affiché d'un bloc.
 */
export default function LegendeMethodScroll({ label, title, text, items, center }: Props) {
  const ref = useRef<HTMLElement>(null)
  const still = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: .35 })

  const titleIn = useTransform(p, [0, .035], [0, 1])
  const titleBlur = useTransform(p, [0, .05], ['blur(14px)', 'blur(0px)'])
  const titleScale = useTransform(p, [.13, .22], [1, .58])
  const titleY = useTransform(p, [.13, .22], ['24vh', '0vh'])
  const stageIn = useTransform(p, [.17, .25], [0, 1])
  const fill = range(p, FINALE[0], FINALE[1], [0, 1])
  const glow = useTransform(p, [FINALE[0], FINALE[1]], [0, .9])
  const glowScale = range(p, FINALE[0], FINALE[1], [.4, 1])
  const word = useTransform(p, [FINALE[0] + .03, FINALE[1]], [0, 1])
  const wordBlur = useTransform(p, [FINALE[0] + .03, FINALE[1]], ['blur(12px)', 'blur(0px)'])
  const finaleText = useTransform(p, [FINALE[0] + .04, FINALE[1] + .02], [0, 1])
  const finaleY = useTransform(p, [FINALE[0] + .04, FINALE[1] + .02], [24, 0])
  const marks = [...PHASE.map(([a]) => a), FINALE[0]].map(at => useTransform(p, [at - .01, at + .03], [.3, 1]))

  if (still) return <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8 md:mt-20" aria-labelledby="legende-method">
    <p className={styles.label}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{label}</p>
    <h2 id="legende-method" className={styles.sectionTitle}>{title[0]} <em className="italic text-autopilot">{title[1]}</em></h2>
    <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-neutral-300">{text}</p>
    <div className="mt-8 grid items-center gap-8 md:grid-cols-[300px_1fr] md:gap-14">
      <svg viewBox="-30 0 460 370" className="mx-auto w-full max-w-[300px] overflow-visible" aria-hidden>
        <polygon points={PTS.map(pt => pt.join(',')).join(' ')} fill="rgba(212,165,116,.07)" stroke="#d4a574" strokeWidth="2" strokeLinejoin="round" />
        {PTS.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="8" fill="#d4a574" />
          <text x={x} y={i === 0 ? y - 24 : y + 42} textAnchor={i === 1 ? 'end' : i === 2 ? 'start' : 'middle'} dx={i === 1 ? 18 : i === 2 ? -18 : 0} className={styles.triangleLabel}>{items[i][0]}</text></g>)}
        <text x="200" y="222" textAnchor="middle" className={styles.triangleCenter}>{center}</text>
      </svg>
      <ol className="divide-y divide-white/10 border-y border-white/10">
        {items.map(([name, body]) => <li key={name} className="py-5"><h3 className={styles.methodName}>{name}</h3><p className={styles.methodBody}>{body}</p></li>)}
      </ol>
    </div>
  </section>

  return <section ref={ref} className={styles.methodStory} aria-labelledby="legende-method">
    <div className={styles.methodPin}>
      <motion.div className={styles.methodHead} style={{ opacity: titleIn, filter: titleBlur, scale: titleScale, y: titleY }}>
        <p className={styles.label + ' justify-center'}><span className="h-1.5 w-1.5 rounded-full bg-autopilot" aria-hidden />{label}</p>
        <h2 id="legende-method" className={styles.methodTitle}>{title[0]} <em>{title[1]}</em></h2>
      </motion.div>

      <motion.div className={styles.methodStage} style={{ opacity: stageIn }}>
        <svg viewBox="-30 0 460 370" className={styles.methodSvg} aria-hidden>
          <defs>
            <radialGradient id="legende-glow"><stop offset="0%" stopColor="#d4a574" stopOpacity=".55" /><stop offset="100%" stopColor="#d4a574" stopOpacity="0" /></radialGradient>
          </defs>
          <motion.polygon points={PTS.map(pt => pt.join(',')).join(' ')} fill="#d4a574" style={{ fillOpacity: useTransform(fill, v => v * .09) }} />
          <motion.circle cx="200" cy="222" r="120" fill="url(#legende-glow)" style={{ opacity: glow, scale: glowScale, transformOrigin: '200px 222px' }} />
          {EDGES.map(([a, b], i) => <Edge key={i} p={p} phase={PHASE[i]} from={PTS[a]} to={PTS[b]} />)}
          {PTS.map((pt, i) => <Vertex key={i} p={p} at={PHASE[i][0]} point={pt} label={items[i][0]} index={i} />)}
          <motion.text x="200" y="232" textAnchor="middle" className={styles.triangleCenterBig} style={{ opacity: word, filter: wordBlur }}>{center}</motion.text>
        </svg>

        <div className={styles.methodPanel}>
          {items.map(([name, body], i) => <Slide key={name} p={p} phase={PHASE[i]} name={name} body={body} last={i === items.length - 1} />)}
          <motion.div className={styles.methodSlide} style={{ opacity: finaleText, y: finaleY }}>
            <p className={styles.methodName}>{center}</p>
            <p className={styles.methodBody}>{text}</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.ol className={styles.methodMarks} style={{ opacity: stageIn }} aria-hidden>
        {[...items.map(([name]) => name), center].map((name, i) => <motion.li key={name} style={{ opacity: marks[i] }}>{name}</motion.li>)}
      </motion.ol>
    </div>
  </section>
}
