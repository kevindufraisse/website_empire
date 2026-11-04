'use client'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { Check, CheckCheck, FileText, Send } from 'lucide-react'
import { SocialIcons } from './ui/social-icons'
import PreviewVideo from './PreviewVideo'
import s from './HomeStoryRefinement.module.css'

/** Illustrates a configured keyword-to-resource flow. It never sends a real message. */
export default function LeadMagnetScene({p,staticMode=false}:{p:MotionValue<number>;staticMode?:boolean}){
 const opacity=useTransform(p,[.628,.638,.689,.698],[0,1,1,0])
 const y=useTransform(p,[.628,.638],[18,0])
 const keyword=useTransform(p,v=>'GUIDE'.slice(0,Math.ceil(Math.max(0,Math.min(1,(v-.638)/.009))*5)))
 const configured=useTransform(p,[.648,.655],[0,1])
 const commented=useTransform(p,[.656,.663],[0,1])
 const delivered=useTransform(p,[.668,.679],[0,1])
 const deliveryY=useTransform(p,[.668,.679],[18,0])
 return <motion.section className={`${s.leadScene} ${staticMode?s.staticScene:''}`} data-scene="lead-magnet" aria-label="Du mot-clé à la ressource envoyée" style={staticMode?{}:{opacity,y}}>
  <div className={s.leadPhone}>
   <header><SocialIcons.instagram/><b>Votre Reel</b></header>
   <div className={s.leadVideo}><PreviewVideo src="/demo/kevin-speaking-v11.mp4" poster="/demo/kevin-speaking-v11.jpg" label="Vidéo de Kevin utilisée pour illustrer l’envoi d’une ressource" still={staticMode}/><div className={s.leadCaption}>Commentez <strong>GUIDE</strong> pour recevoir mon classement.</div></div>
   <motion.div className={s.leadComment} style={{opacity:staticMode?1:commented}}><span>A</span><div><small>Alex</small><b>GUIDE</b></div><CheckCheck size={16}/></motion.div>
  </div>
  <div className={s.leadSetup}>
   <h3>Choisissez un mot-clé.<br/>Associez votre ressource.</h3>
   <div className={s.leadConfig}>
    <div><span>Mot-clé en commentaire</span><motion.b className={s.keyword}>{staticMode?'GUIDE':keyword}</motion.b></div>
    <div><span>Ressource à envoyer</span><b className={s.leadResource}><FileText size={19}/>Mon classement.pdf</b></div>
   </div>
   <motion.p className={s.leadActive} style={{opacity:staticMode?1:configured}}><Check size={15}/>Envoi automatique configuré</motion.p>
   <motion.div className={s.delivery} style={staticMode?{}:{opacity:delivered,y:deliveryY}}>
    <header><Send size={14}/>La ressource arrive en message privé.</header>
    <p>Voici le guide promis dans la vidéo.</p>
    <div className={s.resourceCard}><FileText size={29}/><div><b>Les créateurs business à suivre</b><small>Le classement et les critères · PDF</small></div></div>
   </motion.div>
  </div>
  <small className={s.leadNote}>Exemple illustré après configuration de l’automatisation. Aucun message réel n’est envoyé.</small>
 </motion.section>
}
