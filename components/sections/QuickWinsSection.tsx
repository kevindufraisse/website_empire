'use client'
import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useAutopilot } from '@/contexts/AutopilotContext'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import s from './TeamConvergence.module.css'

const PEOPLE = [
  ['Lucas', 'Veille', 12, 22], ['Emma', 'Stratégie', 37, 18],
  ['Thomas', 'Scripts', 63, 18], ['Léa', 'Montage vidéo', 88, 22],
  ['Hugo', 'Copywriting', 12, 78], ['Inès', 'Diffusion', 37, 82],
  ['Camille', 'Graphisme', 63, 82], ['Nicolas', 'Community management', 88, 78],
] as const

function RoleCard({index,p,still}:{index:number;p:MotionValue<number>;still:boolean}) {
  const [name,role,x,y] = PEOPLE[index]
  const left = useTransform(p,[.18,.68],[`${x}%`,'50%'])
  const top = useTransform(p,[.18,.68],[`${y}%`,'50%'])
  const scale = useTransform(p,[.18,.62],[1,.32])
  const opacity = useTransform(p,[.50,.69],[1,0])
  return <motion.article className={s.role} data-team-role={role} style={still?{}:{left,top,scale,opacity}}>
    <span className={s.portrait} role="img" aria-label={`Portrait illustratif : ${name}`} style={{backgroundImage:index<6?'url(/demo/content-team.webp)':'url(/demo/content-team-extra.webp)',backgroundSize:index<6?'300% 200%':'200% 100%',backgroundPosition:index<6?`${(index%3)*50}% ${Math.floor(index/3)*100}%`:`${(index-6)*100}% 50%`}}/>
    <b>{role}</b>
  </motion.article>
}

export default function QuickWinsSection() {
  const {autopilot}=useAutopilot()
  const ref=useRef<HTMLElement>(null)
  const reduced=!!useReducedMotion(),settled=useMotionValue(1)
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']})
  const p=reduced?settled:scrollYProgress
  const coreScale=useTransform(p,[.18,.72],[.66,1])
  const coreOpacity=useTransform(p,[.18,.68],[.28,1])
  const glow=useTransform(p,[.52,.76],[0,1])
  const rings=useTransform(p,[.58,.95],[.55,1.12])
  const summary=useTransform(p,[.69,.80],[0,1])
  if(autopilot)return null
  return <section ref={ref} className={s.section} data-story="team" data-static={reduced} aria-labelledby="team-convergence-title">
    <div data-viewport-stage className={s.sticky}>
      <header className={s.heading}><h2 id="team-convergence-title">Le travail de toute une équipe.<br/><em>Réuni dans Empire.</em></h2></header>
      <div className={s.canvas}>
        <motion.div className={s.radiance} aria-hidden="true" style={{opacity:glow,scale:rings}}><i/><i/><i/></motion.div>
        <motion.div className={s.core} data-team-core style={reduced?{}:{opacity:coreOpacity,scale:coreScale}}><span>E</span><b>Empire</b></motion.div>
        <div className={s.roles}>{PEOPLE.map((_,index)=><RoleCard key={index} index={index} p={p} still={reduced}/>)}</div>
      </div>
      <motion.p className={s.summary} data-team-summary style={{opacity:reduced?1:summary}}>Vous partagez vos idées et validez.<br/><strong>La création, la diffusion et le suivi sont réunis au même endroit.</strong></motion.p>
      <div className={s.cta}><EmpireSalesCta source="home-team"/></div>
      <p className={s.note}>Métiers et portraits illustratifs · les fonctionnalités dépendent de l’offre choisie.</p>
      {!reduced&&<span className={s.cue}>Continuez à scroller</span>}
    </div>
  </section>
}
