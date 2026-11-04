'use client'
import { useId, useState } from 'react'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bookmark, Check, CheckCheck, ChevronDown, FileText, Heart, Image as ImageIcon, Info, MessageCircle, MoreHorizontal, Phone, Send, Smile, Sparkles, Video } from 'lucide-react'
import { SocialIcons } from './ui/social-icons'
import PreviewVideo from './PreviewVideo'
import s from './LeadMagnetScene.module.css'

// Owned, already published Reel, retrieved through the connected Instagram account.
// See the adjacent media provenance file. This is not an invented/AI-recreated example.
const VIDEO='/demo/kevin-leadmagnet-claude-20261023.mp4'
const POSTER='/demo/kevin-leadmagnet-claude-20261023.jpg'
const REEL='https://www.instagram.com/reel/De1ncaACJuN/'
const AVATAR='/founders/kevin.jpg'
const STEPS=['Montage IA','Commentaire','Message privé'] as const
const stepAt=(v:number)=>v<.650?0:v<.666?1:2

function KeywordComment({reply=false}:{reply?:boolean}){
 return <div className={s.commentThread} data-lead-comment>
  <div className={s.comment}><span className={s.alexAvatar} aria-hidden="true">A</span><div><b>alex</b><p>CLAUDE 🙌</p><small>À l’instant · Répondre</small></div><Heart size={15} aria-hidden="true"/></div>
  {reply&&<div className={s.publicReply}><img src={AVATAR} alt=""/><div><b>kevin.dufraisse</b><p>Je te l’ai envoyé en privé 👋</p><small>Réponse automatique · exemple</small></div></div>}
 </div>
}

/** A real edited video followed by an explicitly illustrative Instagram conversation.
 * Selecting a step never scrolls the page or contacts Instagram. No real recipients,
 * messages, engagement counts or download links are invented as observed results.
 */
export default function LeadMagnetScene({p,staticMode=false}:{p:MotionValue<number>;staticMode?:boolean}){
 const uid=useId()
 const [autoStep,setAutoStep]=useState(()=>stepAt(p.get()))
 const [selected,setSelected]=useState<number|null>(null)
 useMotionValueEvent(p,'change',v=>setAutoStep(stepAt(v)))
 const step=staticMode?2:selected??autoStep
 const opacity=useTransform(p,[.628,.638,.689,.698],[0,1,1,0])
 const y=useTransform(p,[.628,.638],[18,0])
 const messageOpacity=useTransform(p,[.666,.671],[0,1])
 const resourceOpacity=useTransform(p,[.671,.678],[0,1])
 const showImmediately=staticMode||selected===2
 return <motion.section className={s.scene} data-scene="lead-magnet" data-lead-step={step} data-static={staticMode} aria-label="Un vrai montage de Kevin, puis le parcours de réponse automatique illustré" style={staticMode?{}:{opacity,y}}>
  {!staticMode&&<div className={s.steps} aria-label="Revoir une étape de la démonstration">{STEPS.map((label,i)=><button type="button" key={label} aria-pressed={step===i} aria-controls={`${uid}-panels`} onClick={()=>setSelected(i)}><span aria-hidden="true">{i+1}</span>{label}{i<2&&<ArrowRight size={12} aria-hidden="true"/>}</button>)}</div>}
  <div id={`${uid}-panels`} className={s.panels}>
   <figure className={s.reelPanel} data-lead-reel>
    <div className={s.reelPhone}>
     <div className={s.reelHeader}><ArrowLeft size={19} aria-hidden="true"/><b>Reels</b><SocialIcons.instagram/></div>
     <div className={s.reelViewport}>
      <PreviewVideo src={VIDEO} poster={POSTER} label="Extrait réel du Reel Commente CLAUDE de Kevin, publié le 23 octobre 2026 : illustrations, écran partagé et sous-titres" still={staticMode}/>
      <div className={s.reelActions} aria-hidden="true"><Heart/><MessageCircle/><Send/><MoreHorizontal/></div>
      {!staticMode&&step===1&&<div className={s.commentSheet}><div className={s.sheetHandle}/><b>Commentaires</b><KeywordComment reply/></div>}
     </div>
     <div className={s.reelCaption}><img src={AVATAR} alt=""/><div><b>kevin.dufraisse</b><p>Commente « <strong>CLAUDE</strong> »</p></div><Bookmark size={16} aria-hidden="true"/></div>
    </div>
    <figcaption><a href={REEL} target="_blank" rel="noreferrer">Voir le Reel original <ArrowRight size={12} aria-hidden="true"/></a></figcaption>
   </figure>
   <div className={s.explanation} data-lead-explanation aria-hidden={step===2}>
    <span className={s.montageBadge}><Sparkles size={14} aria-hidden="true"/>Le montage que vous voyez est réel.</span>
    <h3>{step===0?<>Votre vidéo,<br/>illustrée et montée.</>:<>Un commentaire.<br/>L’envoi se déclenche.</>}</h3>
    <p>{step===0?'Des illustrations animées, votre prise de parole et les sous-titres dans le même montage.':'Associez un mot-clé à votre ressource. La personne qui le commente reçoit le lien en privé.'}</p>
    <div className={s.rule}><span>Mot-clé <b>CLAUDE</b></span><ArrowRight size={17} aria-hidden="true"/><span>À envoyer <b><FileText size={14} aria-hidden="true"/>Votre ressource</b></span></div>
    {step===1&&<div className={s.desktopComment}><KeywordComment reply/></div>}
    {!staticMode&&<button type="button" className={s.nextStep} onClick={()=>setSelected(step===0?1:2)}>{step===0?'Voir le commentaire':'Voir le message privé'}<ArrowRight size={16} aria-hidden="true"/></button>}
   </div>
   <div className={s.dmPanel} data-lead-dm aria-hidden={!staticMode&&step!==2}>
    <div className={s.dmPhone}>
     <header className={s.dmHeader}><ArrowLeft size={20} aria-hidden="true"/><img src={AVATAR} alt=""/><div><b>kevin.dufraisse <ChevronDown size={12} aria-hidden="true"/></b><small>Kevin Dufraisse</small></div><Phone size={17} aria-hidden="true"/><Video size={19} aria-hidden="true"/></header>
     <div className={s.dmBody}>
      <small className={s.today}>Aujourd’hui</small>
      <div className={s.commentContext}><img src={POSTER} alt="Miniature du Reel sur lequel le mot-clé est commenté"/><span>Vous avez commenté ce Reel.<b>CLAUDE 🙌</b></span></div>
      <motion.div className={s.incomingRow} style={{opacity:showImmediately?1:messageOpacity}}><img src={AVATAR} alt=""/><div className={s.incoming}><p>Merci pour ton commentaire ! 👋</p><p>Voici la ressource promise dans la vidéo.</p></div></motion.div>
      <motion.div className={s.resource} data-lead-resource style={{opacity:showImmediately?1:resourceOpacity}}><div><span className={s.resourceIcon}><FileText size={25} aria-hidden="true"/></span><b>La ressource de la vidéo<small>Pour aller plus loin avec Claude</small></b></div><span className={s.resourceButton}>Ouvrir la ressource <ArrowRight size={14} aria-hidden="true"/></span></motion.div>
      <motion.div className={s.sent} style={{opacity:showImmediately?1:resourceOpacity}}><CheckCheck size={14} aria-hidden="true"/>Réponse envoyée automatiquement</motion.div>
     </div>
     <div className={s.composer} aria-hidden="true"><span><SocialIcons.instagram/></span><i>Message…</i><ImageIcon size={18}/><Smile size={18}/></div>
    </div>
    <p className={s.dmCaption}><Check size={14} aria-hidden="true"/>Depuis votre compte Instagram, sans répondre à la main.</p>
   </div>
  </div>
  <p className={s.note}><Info size={12} aria-hidden="true"/>Vidéo réelle · commentaire, message et ressource illustrés. Aucun message envoyé depuis cette page.</p>
 </motion.section>
}
