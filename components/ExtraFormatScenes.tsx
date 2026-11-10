'use client'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, ArrowDown, Check, Link2, LockKeyhole, Sparkles, MousePointer2 } from 'lucide-react'
import { startFreeTrial } from '@/lib/startTrial'
import PreviewVideo from './PreviewVideo'
import s from './ExtraFormatScenes.module.css'
export function CloneVideo({p,still=false}:{p:MotionValue<number>;still?:boolean}){
 const result=useTransform(p,[.572,.577],[0,1]),wipe=useTransform(p,[.558,.572],['inset(0 100% 0 0)','inset(0 0% 0 0)'])
 const percentage=useTransform(p,v=>`${Math.round(Math.max(0,Math.min(1,(v-.552)/.02))*100)} %`)
 return <div className={s.clonePreview}><img src="/formats/clone-avant-apres.jpg" alt="Reel source de la démonstration"/><motion.div style={{clipPath:still?'inset(0)':wipe}}><PreviewVideo src="/formats/clone-avant-apres.mp4" poster="/formats/clone-avant-apres.jpg" label="La version clonée de Kevin" still={still}/></motion.div><span className={s.sourceTag}>REEL IMPORTÉ</span><motion.span className={s.resultTag} style={{opacity:still?1:result}}><Check size={11}/>TA VERSION</motion.span><div className={s.cloneFooter}><span>Ton visage. Ta voix.<small>Extrait de démonstration · contenu IA</small></span><motion.b>{still?'100 %':percentage}</motion.b></div></div>
}
export function CloneDetails({p}:{p:MotionValue<number>}){
 const typed=useTransform(p,v=>'instagram.com/reel/exemple'.slice(0,Math.ceil(Math.max(0,Math.min(1,(v-.537)/.009))*26)))
 const result=useTransform(p,[.572,.577],[0,1]),tap=useTransform(p,[.549,.552,.556],[0,1,0])
 return <div className={s.cloneDetails}><div className={s.url}><Link2/><motion.span>{typed}</motion.span></div><div className={s.action}><span>Cloner cette vidéo <Sparkles size={15}/></span><motion.i style={{opacity:tap}}><MousePointer2 fill="white"/></motion.i></div><motion.div className={s.receipt} style={{opacity:result}}><Check size={15}/><span>Ta version est prête<small>Retrouve-la dans tes contenus.</small></span></motion.div></div>
}
export function SecretFormats({p,staticMode=false}:{p:MotionValue<number>;staticMode?:boolean}){
 const opacity=useTransform(p,[.628,.638,.69,.698],[0,1,1,0]),y=useTransform(p,[.628,.638],[20,0])
 return <motion.div className={s.secrets} style={staticMode?{}:{opacity,y}}><div className={s.lockedGallery} aria-hidden="true">{[0,1,2].map(i=><div key={i}><div><span/><span/><span/></div><LockKeyhole/></div>)}</div><span className={s.lockBadge}><LockKeyhole size={15}/>RÉSERVÉ À L’APPLICATION</span><h3>Les autres formats ?<br/><em>Ils restent secrets.</em></h3><p>On ne dévoile pas tout ici.<br/>Découvre les autres formats directement dans Empire.</p><div className={s.ctas}><button onClick={()=>startFreeTrial()}>Tester gratuitement <ArrowRight size={16}/></button><a href="/demo">Demander une démo <ArrowRight size={15}/></a></div><a href="#formula-diffusion" className={s.continue}>Continuer la découverte <ArrowDown size={16}/></a><small>Ou continue à scroller pour voir la diffusion.</small></motion.div>
}
