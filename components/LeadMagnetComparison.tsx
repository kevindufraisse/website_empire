'use client'

import { useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bookmark, Heart, MessageCircle, MoreHorizontal, Send, Video } from 'lucide-react'
import { SocialIcons } from './ui/social-icons'
import PreviewVideo from './PreviewVideo'
import s from './LeadMagnetScene.module.css'
import c from './LeadMagnetComparison.module.css'

const SOURCE='/demo/leadmagnet-source-20261104.mp4'
const SOURCE_POSTER='/demo/leadmagnet-source-20261104.jpg'
const RESULT='/demo/leadmagnet-result-20261104.mp4'
export const LEAD_RESULT_POSTER='/demo/leadmagnet-result-20261104.jpg'
const REEL='https://www.instagram.com/reel/De1ncaACJuN/'
type Clip='source'|'result'

/** The actual source and Kevin's actual adaptation, not a recreated montage.
 * Only one video is mounted. The native controls below select a clip without
 * scrolling, sending a message, or starting any generation/paid operation.
 */
export default function LeadMagnetComparison({p,step,staticMode=false,children}:{p:MotionValue<number>;step:number;staticMode?:boolean;children?:ReactNode}){
 const reduced=useReducedMotion()
 const [automatic,setAutomatic]=useState<Clip>(()=>p.get()<.641?'source':'result')
 const [selected,setSelected]=useState<Clip|null>(null)
 useMotionValueEvent(p,'change',v=>setAutomatic(v<.641?'source':'result'))
 const clip=staticMode?(selected??'result'):step===0?(selected??automatic):'result'
 const result=clip==='result'
 const compare=step===0||staticMode
 return <figure className={s.reelPanel} data-lead-reel data-lead-clip={clip}>
  <div className={s.reelPhone}>
   <div className={`${s.reelHeader} ${compare?c.compareHeader:''}`}>
    {compare?<div className={c.switcher} aria-label="Comparer la vidéo source et la version de Kevin"><button type="button" aria-pressed={!result} onClick={()=>setSelected('source')}>Original</button><ArrowRight size={12} aria-hidden="true"/><button type="button" aria-pressed={result} onClick={()=>setSelected('result')}>Version de Kevin</button></div>:<><ArrowLeft size={19} aria-hidden="true"/><b>Reels</b><SocialIcons.instagram/></>}
   </div>
   <div className={s.reelViewport}>
    <div className={c.media} data-lead-comparison>
     <img className={c.backdrop} src={SOURCE_POSTER} alt="" aria-hidden="true"/>
     <motion.div key={clip} className={c.activeMedia} initial={result&&!reduced&&!staticMode?{clipPath:'inset(0 100% 0 0)'}:false} animate={{clipPath:'inset(0 0% 0 0)'}} transition={{duration:reduced||staticMode?0:.4,ease:'easeOut'}}>
      <PreviewVideo src={result?RESULT:SOURCE} poster={result?LEAD_RESULT_POSTER:SOURCE_POSTER} label={result?'Version réelle de Kevin : le format adapté en français avec ses illustrations et ses sous-titres':'Bref extrait de la vidéo source fournie par Kevin : illustrations au-dessus du présentateur'} still={staticMode}/>
     </motion.div>
    </div>
    {result&&<div className={s.reelActions} aria-hidden="true"><Heart/><MessageCircle/><Send/><MoreHorizontal/></div>}
    {children}
   </div>
   <div className={s.reelCaption}>
    {result?<img src="/founders/kevin.jpg" alt=""/>:<span className={c.sourceIcon}><Video size={16} aria-hidden="true"/></span>}
    <div><b>{result?'kevin.dufraisse':'Vidéo source'}</b><p>{result?<>Commente « <strong>CLAUDE</strong> »</>:'Extrait du Reel d’origine'}</p></div>
    {result&&<Bookmark size={16} aria-hidden="true"/>}
   </div>
  </div>
  <figcaption><a href={REEL} target="_blank" rel="noreferrer">Voir le Reel de Kevin <ArrowRight size={12} aria-hidden="true"/></a></figcaption>
 </figure>
}
