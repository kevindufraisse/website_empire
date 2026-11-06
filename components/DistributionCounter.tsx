'use client'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { Check } from 'lucide-react'
import s from './DistributionCounter.module.css'

export const NETWORK_VIEWS=[10000,50000,53000,150000,3000,6000,8000]
export const ACCOUNT_VIEWS=[10000,42000,25000,53000,68000,12000,31000,18000]
export const INITIAL_REACH=NETWORK_VIEWS.reduce((sum,n)=>sum+n,0)
const clamp=(n:number)=>Math.min(1,Math.max(0,n))
export function reachBefore(p:number){return NETWORK_VIEWS.reduce((sum,n,i)=>sum+Math.round(n*clamp((p-(.597+i*.023))/.010)),0)}
// Account 0 is the original Instagram account: its 10,000 views are already in
// NETWORK_VIEWS and MUST NOT be counted a second time.
export function reachAdded(p:number){return ACCOUNT_VIEWS.reduce((sum,n,i)=>sum+(i===0?0:Math.round(n*clamp((p-(.832+i*.006)-.012)/.012))),0)}
export default function DistributionCounter({p}:{p:MotionValue<number>}){
 const reduced=!!usePrefersReducedMotion()
 const [value,setValue]=useState(()=>p.get()),[completed,setCompleted]=useState(false)
 const sync=(v:number)=>{setValue(v);setCompleted(v>=.900&&v<.920)}
 useEffect(()=>sync(p.get()),[p]);useMotionValueEvent(p,'change',sync)
 const total=useTransform(p,v=>(reachBefore(v)+reachAdded(v)).toLocaleString('fr-FR'))
 const extra=useTransform(p,v=>reachAdded(v).toLocaleString('fr-FR'))
 const multi=value>=.820
 return <div className={s.counter} data-distribution-total data-total={reachBefore(value)+reachAdded(value)} data-complete={completed} data-reduced={reduced} hidden={value>=.920}>
  <div className={s.line}><span>{multi?'Le total continue de grandir.':'Chaque publication compte.'}</span><div className={s.result}><motion.b>{total}</motion.b><small>vues + impressions cumulées</small>{completed&&<span className={s.burst} aria-hidden="true"/>}</div></div>
  <div className={s.equation}>{multi?<><b>{INITIAL_REACH.toLocaleString('fr-FR')}</b> déjà comptées <span>+</span> <motion.b>{extra}</motion.b> sur les comptes secondaires</>:<span>Les résultats de chaque réseau s’additionnent.</span>}</div>
  <div className={s.finish} data-counter-finish>{completed&&<><Check size={13}/><b>Diffusion terminée</b></>}</div>
  <small className={s.note}>Simulation, pas des résultats observés ni une audience unique. Le compte principal n’est compté qu’une fois.</small>
 </div>
}
