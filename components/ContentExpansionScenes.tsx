'use client'
import type { ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { Check, Play, Eye } from 'lucide-react'
import { SocialIcons } from '@/components/ui/social-icons'
import FlowConnection from './FlowConnection'
import { ACCOUNT_VIEWS } from './DistributionCounter'
import s from './ContentExpansionScenes.module.css'
type Progress=MotionValue<number>
const clamp=(v:number)=>Math.min(1,Math.max(0,v))
const fmt=(n:number)=>Math.round(n).toLocaleString('fr-FR')
export function PhotoThumbnail(){
 return <div className={s.thumbnail}><img src="/demo/kevin-thumbnail-v13.webp" alt="Miniature créée par Empire : Qui suivre en business ? Mon classement"/></div>
}
const ACCOUNTS=[
 {handle:'@kevindufraisse',network:'instagram',views:ACCOUNT_VIEWS[0]},
 {handle:'@kevin.clip',network:'tiktok',views:ACCOUNT_VIEWS[1]},
 {handle:'@kevindufraisse.viral',network:'instagram',views:ACCOUNT_VIEWS[2]},
 {handle:'@kevin.business',network:'youtube',views:ACCOUNT_VIEWS[3]},
 {handle:'@kevin.extraits',network:'tiktok',views:ACCOUNT_VIEWS[4]},
 {handle:'@kevin.insights',network:'instagram',views:ACCOUNT_VIEWS[5]},
 {handle:'@kevin.shorts',network:'youtube',views:ACCOUNT_VIEWS[6]},
 {handle:'@kevin.daily',network:'tiktok',views:ACCOUNT_VIEWS[7]},
] as const
function Account({p,index}:{p:Progress;index:number}){
 const account=ACCOUNTS[index],Icon=SocialIcons[account.network]
 const start=.832+index*.006
 const opacity=useTransform(p,[start,start+.012],[.35,1])
 const checked=useTransform(p,[start+.012,start+.015],[0,1])
 const count=useTransform(p,v=>fmt(index===0?account.views:account.views*clamp((v-start-.012)/.012)))
 return <motion.article className={s.account} data-side={index<4?'left':'right'} style={{opacity,top:`${14+(index%4)*22}%`}}>
  <div className={s.avatar}><img src="/founders/kevin.jpg" alt=""/><span><Icon/></span><motion.i style={{opacity:checked}}><Check size={10}/></motion.i></div>
  <div className={s.identity}><b>{account.handle}</b><small>{index===0?'Compte principal':'Compte secondaire'}</small><span data-account-views><Eye size={11}/><motion.b>{count}</motion.b> vues</span></div>
 </motion.article>
}
function Routes({p,mobile=false}:{p:Progress;mobile?:boolean}){
 return <svg className={mobile?s.mobileRoutes:s.desktopRoutes} viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">{ACCOUNTS.map((a,i)=>{
  const right=i>=4,y=70+(i%4)*110
  return <FlowConnection key={a.handle} p={p} start={.832+i*.006} duration={.012} from={right?[580,250]:[420,250]} c1={right?[650,250]:[350,250]} c2={right?[650,y]:[350,y]} to={mobile?(right?[850,y-20]:[150,y-20]):(right?[705,y]:[295,y])}/>
 })}</svg>
}
export function MultiAccountBroadcast({p,reel}:{p:Progress;reel:ReactNode}){
 const opacity=useTransform(p,[.82,.83,.91,.92],[0,1,1,0])
 const total=useTransform(p,v=>fmt(ACCOUNTS.reduce((sum,a,i)=>sum+a.views*clamp((v-(.832+i*.006)-.012)/.012),0)))
 return <motion.div className={s.broadcastScene} style={{opacity}}>
  <div className={s.constellation}><Routes p={p}/><Routes p={p} mobile/>
   <div className={s.broadcastSource}><div className={s.sourceReel}>{reel}<span><Play size={11} fill="currentColor"/>Ton Reel</span></div><small>UNE VIDÉO DANS EMPIRE</small></div>
   {ACCOUNTS.map((a,i)=><Account key={a.handle} p={p} index={i}/>)}
  </div>
 </motion.div>
}
