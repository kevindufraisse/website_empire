'use client'
import { motion, useTransform, useMotionValue, type MotionValue } from 'framer-motion'
import { Mic, Maximize, Play, Volume2, Settings, ThumbsUp, Share2 } from 'lucide-react'
import { SocialIcons } from './ui/social-icons'
import PreviewVideo from './PreviewVideo'
import s from './LongVideoFormat.module.css'
const PEOPLE=[['Anthony Bourbon','/webinar/anthony-bourbon.jpg'],['Yomi Denzel','/webinar/yomi-denzel.jpg'],['Oussama Ammar','/webinar/oussama-ammar.jpg']]
const RANKS=['S','A','B','C','D']
function RankedCreator({p,index,still}:{p:MotionValue<number>;index:number;still:boolean}){
 const at=.541+index*.007
 const x=useTransform(p,[at,at+.006],[160+index*25,0]),y=useTransform(p,[at,at+.006],[(4-index)*30,0])
 const opacity=useTransform(p,[at,at+.002],[.2,1])
 return <motion.span className={s.person} style={still?{}:{x,y,opacity}}><img src={PEOPLE[index][1]} alt={PEOPLE[index][0]}/><b>{PEOPLE[index][0]}</b></motion.span>
}
export function LongVideoArtwork({still=false,p}:{still?:boolean;p?:MotionValue<number>}){
 const settled=useMotionValue(1),progress=p||settled
 return <div className={s.artwork}>
  <div className={s.board}><header><span>MON CLASSEMENT</span><h4>Les créateurs business français</h4><small>Qui suivre, selon votre objectif ?</small></header><div className={s.ranks}>{RANKS.map((rank,i)=><div key={rank}><strong>{rank}</strong><span>{i<3&&<RankedCreator p={progress} index={i} still={still||!p}/>}</span></div>)}</div><footer>Mon point de vue · Mes critères · Mes raisons</footer></div>
  <div className={s.presenter}><PreviewVideo src="https://empire-apercu-kevin-novembre-2026.austra1.chatgpt.site/demo/kevin-speaking-v11.mp4" poster="https://empire-apercu-kevin-novembre-2026.austra1.chatgpt.site/demo/kevin-speaking-v11.jpg" label="Kevin commente sa tier list — aperçu du format long" still={still}/><span><Mic/>Kevin Dufraisse</span></div>
 </div>
}
export function LongVideoFormat({p}:{p:MotionValue<number>}){
 const progress=useTransform(p,[.537,.567],[.05,.9]),time=useTransform(p,v=>{const n=Math.round(Math.max(0,Math.min(1,(v-.537)/.03))*720);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`})
 const opacity=useTransform(p,[.535,.54],[0,1]),y=useTransform(p,[.535,.54],[14,0])
 return <motion.div className={s.format} style={{opacity,y}}>
  <header><span>VOS FORMATS · VERSION LONGUE</span><h3>Tous vos formats,<em> aussi en long.</em></h3></header>
  <div className={s.youtube} aria-label="Aperçu de votre vidéo longue dans un player YouTube">
   <div className={s.youtubeBar}><SocialIcons.youtube/><b>YouTube</b><span>VIDÉO LONGUE · 16:9</span></div>
   <div className={s.player}><LongVideoArtwork p={p}/><div className={s.playerControls}><div className={s.seek}><motion.i style={{scaleX:progress}}/></div><div><Play fill="currentColor"/><Volume2/><span><motion.b>{time}</motion.b> / 12:48</span><small>HD</small><Settings/><Maximize/></div></div></div>
   <div className={s.metadata}><h4>Vos idées, développées en vidéo longue.</h4><div><img src="/founders/kevin.jpg" alt="Kevin Dufraisse"/><span><b>Kevin Dufraisse</b><small>Réaction, FAQ, classement… Avec Empire.</small></span><strong>S’abonner</strong><span className={s.actions}><ThumbsUp/><Share2/></span></div></div>
  </div>
 </motion.div>
}
