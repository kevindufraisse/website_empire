'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import c from './LeadMagnetComparison.module.css'

export const LEAD_RESULT_POSTER='/demo/leadmagnet-result-20261104.jpg'
const CLIPS=[
 {role:'source',title:'Le Reel d’origine',detail:'Le format qui vous inspire',src:'/demo/leadmagnet-source-20261104.mp4#t=3',poster:'/demo/leadmagnet-source-20261104.jpg'},
 {role:'result',title:'La version de Kevin',detail:'Adaptée et montée avec Empire',src:'/demo/leadmagnet-result-20261104.mp4#t=3',poster:LEAD_RESULT_POSTER},
] as const

/** Both supplied edits remain visible. No scroll threshold replaces either clip.
 * Playback is muted, pausable, limited to visible media, and disabled in reduced motion.
 * These are excerpts with different durations, not a frame-synchronised recreation.
 */
export default function LeadMagnetComparison({staticMode=false}:{staticMode?:boolean}){
 const root=useRef<HTMLDivElement>(null)
 const reduced=useReducedMotion()
 const still=staticMode||Boolean(reduced)
 const [paused,setPaused]=useState(false)
 useEffect(()=>{
  const el=root.current
  if(!el||still)return
  const videos=Array.from(el.querySelectorAll('video'))
  let visible=false
  const sync=()=>videos.forEach(video=>{
   if(visible&&!paused&&!document.hidden)void video.play().catch(()=>{})
   else video.pause()
  })
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.15})
  observer.observe(el)
  document.addEventListener('visibilitychange',sync)
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);videos.forEach(v=>v.pause())}
 },[paused,still])
 function replay(){
  root.current?.querySelectorAll('video').forEach(video=>{
   if(video.readyState>=1)video.currentTime=Math.min(3,Math.max(0,video.duration-.1))
   void video.play().catch(()=>{})
  })
  setPaused(false)
 }
 return <div ref={root} className={c.comparison} data-lead-reel data-lead-comparison data-comparison-paused={paused}>
  <div className={c.pair}>
   {CLIPS.map((clip,index)=><figure key={clip.role} className={c.clip} data-lead-clip={clip.role}>
    <figcaption><b>{clip.title}</b><span>{clip.detail}</span></figcaption>
    <div className={`${c.phone} ${index===1?c.result:''}`}>
     <div className={c.phoneTop} aria-hidden="true"><i/></div>
     {still?<img src={clip.poster} alt={clip.title+' : extrait réel fourni pour la comparaison'}/>:<video src={clip.src} poster={clip.poster} muted loop playsInline preload="metadata" aria-label={clip.title+' — montage réel'} onLoadedMetadata={event=>{event.currentTarget.currentTime=Math.min(3,Math.max(0,event.currentTarget.duration-.1))}}/>}
     <div className={c.phoneBottom}>{index===0?'REEL SOURCE':'VOTRE VERSION'}</div>
    </div>
   </figure>)}
   <span className={c.arrow} aria-hidden="true"><ArrowRight size={26}/></span>
  </div>
  <p className={c.connection}>Le même format, repris en français avec Kevin.</p>
  {!still&&<div className={c.controls}>
   <button type="button" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={15}/>:<Pause size={15}/>}<span>{paused?'Lire les vidéos':'Mettre en pause'}</span></button>
   <button type="button" onClick={replay}><RotateCcw size={15}/><span>Revoir les montages</span></button>
  </div>}
  <a className={c.reelLink} href="https://www.instagram.com/reel/De1ncaACJuN/" target="_blank" rel="noreferrer">Voir le Reel de Kevin <ArrowRight size={13}/></a>
 </div>
}
