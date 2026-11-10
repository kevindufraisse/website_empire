'use client'
import { useState } from 'react'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { Camera, FileText, Mic, Plus, Newspaper, Check } from 'lucide-react'
import { SocialIcons } from './ui/social-icons'
import { IDEA_TIMELINE } from './IdeaTimeline'
import s from './IdeaSources.module.css'
const ICONS={voice:Mic,note:FileText,capture:Camera,instagram:SocialIcons.instagram,youtube:SocialIcons.youtube,linkedin:SocialIcons.linkedin,news:Newspaper}
function Source({p,index,active}:{p:MotionValue<number>;index:number;active:number}){
 const item=IDEA_TIMELINE[index],Icon=ICONS[item.kind]
 const opacity=useTransform(p,[item.at,item.at+.006],[0,1])
 const y=useTransform(p,[item.at,item.at+.006],[8,0])
 return <motion.div style={{opacity,y}} className={s.item} data-active={index===active} aria-hidden={active<index}><Icon size={17}/><span>{item.name}</span><Check size={12}/></motion.div>
}
export default function IdeaSources({p}:{p:MotionValue<number>}){
 const [active,setActive]=useState(-1)
 useMotionValueEvent(p,'change',v=>setActive(IDEA_TIMELINE.filter(item=>v>=item.at).length-1))
 const marketOpacity=useTransform(p,[.164,.172],[0,1])
 return <aside className={s.sources} data-market={active>=6}>
  <div className={s.share}><small>TA BOÎTE À IDÉES</small><h3>Partage ce qui <br/><em>t'inspire.</em></h3><div className={s.inputs}>{IDEA_TIMELINE.slice(0,6).map((item,i)=><Source p={p} index={i} active={active} key={item.name}/>)}</div><p>Envoyé dans le chat.<br/>Retrouvé dans Empire.</p></div>
  <motion.div className={s.market} style={{opacity:marketOpacity}}><Plus size={20}/><div><h4>Nous analysons aussi <br/>tes concurrents.</h4><div className={s.signals}>{IDEA_TIMELINE.slice(6).map((item,i)=><Source p={p} index={i+6} active={active} key={item.name}/>)}</div></div></motion.div>
 </aside>
}
