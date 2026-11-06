'use client'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useAutopilot } from '@/contexts/AutopilotContext'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import s from './TeamConvergence.module.css'
import cost from './TeamRoleCosts.module.css'

// Reuse the previous illustrative mission budgets, NOT full-time employee
// salaries or verified savings. The note is shown beside the animation.
const ROLES=[
 ['Analyste de veille',1000,12,22],['Stratège de contenu',1500,37,18],
 ['Scénariste',1500,63,18],['Monteur vidéo',2000,88,22],
 ['Copywriter',1000,12,78],['Responsable diffusion',1000,37,82],
 ['Graphiste',1500,63,82],['Community manager',1000,88,78],
] as const
const clamp=(n:number)=>Math.min(1,Math.max(0,n))
const amountAt=(p:number,index:number)=>Math.round(ROLES[index][1]*(1-clamp((p-(.18+index*.035))/.22)))
function RoleCard({index,p,still}:{index:number;p:MotionValue<number>;still:boolean}){
 const [role,amount,x,y]=ROLES[index],start=.18+index*.035
 const left=useTransform(p,[start,start+.31],[`${x}%`,'50%'])
 const top=useTransform(p,[start,start+.31],[`${y}%`,'50%'])
 const scale=useTransform(p,[start,start+.22,start+.32],[1,.78,.25])
 const opacity=useTransform(p,[start+.26,start+.33],[1,0])
 const price=useTransform(p,v=>`${amountAt(v,index).toLocaleString('fr-FR')} €`)
 return <motion.article className={`${s.role} ${cost.role}`} data-team-role={role} style={still?{}:{left,top,scale,opacity}}>
  <span className={s.portrait} role="img" aria-label={`Métier illustré : ${role}`} style={{backgroundImage:index<6?'url(/demo/content-team.webp)':'url(/demo/content-team-extra.webp)',backgroundSize:index<6?'300% 200%':'200% 100%',backgroundPosition:index<6?`${(index%3)*50}% ${Math.floor(index/3)*100}%`:`${(index-6)*100}% 50%`}}/>
  <b>{role}</b><motion.strong data-team-role-cost>{still?`${amount.toLocaleString('fr-FR')} €`:price}</motion.strong><small>budget / mois · exemple</small>
 </motion.article>
}
export default function QuickWinsSection(){
 const {autopilot}=useAutopilot(),ref=useRef<HTMLElement>(null)
 const reduced=!!usePrefersReducedMotion(),settled=useMotionValue(1)
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']})
 const p=reduced?settled:scrollYProgress
 const coreScale=useTransform(p,[.18,.78],[.66,1]),coreOpacity=useTransform(p,[.18,.74],[.28,1])
 const glow=useTransform(p,[.62,.80],[0,1]),rings=useTransform(p,[.65,.95],[.55,1.12])
 const summary=useTransform(p,[.76,.84],[0,1])
 const total=useTransform(p,v=>`${ROLES.reduce((sum,_,i)=>sum+amountAt(v,i),0).toLocaleString('fr-FR')} €`)
 if(autopilot)return null
 return <section ref={ref} className={`${s.section} ${cost.section}`} data-story="team" data-static={reduced} aria-labelledby="team-convergence-title">
  <div data-viewport-stage className={`${s.sticky} ${cost.sticky}`}>
   <header className={s.heading}><h2 id="team-convergence-title">Tous ces métiers.<br/><em>Réunis dans Empire.</em></h2></header>
   <div className={s.canvas}><motion.div className={s.radiance} aria-hidden="true" style={{opacity:glow,scale:rings}}><i/><i/><i/></motion.div><motion.div className={s.core} data-team-core style={reduced?{}:{opacity:coreOpacity,scale:coreScale}}><span>E</span><b>Empire</b></motion.div><div className={s.roles}>{ROLES.map((_,index)=><RoleCard key={index} index={index} p={p} still={reduced}/>)}</div></div>
   <div className={cost.total}><span>Budgets séparés · exemple mensuel</span><motion.b data-team-cost-total>{total}</motion.b><small>Le zéro désigne les postes séparés, pas le prix d’Empire.</small></div>
   <motion.p className={s.summary} data-team-summary style={{opacity:reduced?1:summary}}><strong>Ces missions sont réunies dans votre formule Empire.</strong><br/>Vous partagez vos idées, enregistrez et validez.</motion.p>
   <div className={s.cta}><EmpireSalesCta source="home-team" showDemo={false}/></div>
   <p className={s.note}>Budgets de missions illustratifs, pas des salaires ni une économie garantie. Abonnement Empire et volume de crédits à prévoir.</p>
  </div>
 </section>
}
