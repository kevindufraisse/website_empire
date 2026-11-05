'use client'
import { motion, useTransform, type MotionValue, type MotionStyle } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, Heart, Image as ImageIcon, MessageCircle, Phone, Send, Smile, Video } from 'lucide-react'
import { LEAD_RESULT_POSTER } from './LeadMagnetComparison'
import s from './LeadMagnetJourney.module.css'
import scroll from './ScrollDiscovery.module.css'
import journey from './UnifiedFormatJourney.module.css'
const AVATAR='/founders/kevin.jpg'

/** Presentation only: progress comes from the same pinned stage as the formats. */
export default function LeadMagnetConversation({p}:{p:MotionValue<number>}){
 const comment=useTransform(p,[.02,.12],[0,1]),commentY=useTransform(p,[.02,.12],[14,0])
 const reply=useTransform(p,[.20,.29],[0,1]),trigger=useTransform(p,[.25,.33],[0,1])
 const commentMobile=useTransform(p,[.42,.50],[1,0])
 const phone=useTransform(p,[.46,.54],[0,1]),phoneY=useTransform(p,[.46,.54],[18,0])
 const incoming=useTransform(p,[.56,.65],[0,1]),resource=useTransform(p,[.70,.78],[0,1]),sent=useTransform(p,[.76,.82],[0,1])
 return <div className={`${journey.conversation} ${scroll.messageSticky}`} data-lead-message-story>
  <div className={`${s.messagePair} ${scroll.messagePair}`} data-lead-message-pair>
   <motion.article className={`${s.commentCard} ${scroll.commentCard}`} data-lead-comment style={{'--comment-opacity':commentMobile} as MotionStyle}>
    <div className={s.commentHeader}><MessageCircle size={18}/><b>Sous votre Reel</b></div>
    <div className={s.reelContext}><img src={LEAD_RESULT_POSTER} alt="Aperçu du Reel de Kevin"/><div><b>kevin.dufraisse</b><p>Commente « <strong>CLAUDE</strong> »</p></div></div>
    <motion.div className={s.comment} data-scroll-reveal="comment" style={{opacity:comment,y:commentY}}><span className={s.alexAvatar} aria-hidden="true">A</span><div><b>alex</b><p>CLAUDE 🙌</p><small>À l’instant · Répondre</small></div><Heart size={15} aria-hidden="true"/></motion.div>
    <motion.div className={s.reply} data-scroll-reveal="reply" style={{opacity:reply}}><img src={AVATAR} alt=""/><div><b>kevin.dufraisse</b><p>Je te l’ai envoyé en privé 👋</p><small>Réponse automatique · exemple</small></div></motion.div>
    <motion.div className={s.trigger} style={{opacity:trigger}}><Check size={16}/><span>Mot-clé <b>CLAUDE</b> détecté</span><ArrowRight size={17}/></motion.div>
   </motion.article>
   <motion.article className={`${s.dmPhone} ${scroll.dmPhone}`} data-lead-dm aria-label="Exemple de message privé Instagram automatique" style={{opacity:phone,y:phoneY}}>
    <header className={s.dmHeader}><ArrowLeft size={19} aria-hidden="true"/><img src={AVATAR} alt=""/><div><b>kevin.dufraisse <ChevronDown size={12} aria-hidden="true"/></b><small>Kevin Dufraisse</small></div><Phone size={17} aria-hidden="true"/><Video size={18} aria-hidden="true"/></header>
    <div className={s.dmBody}><small className={s.today}>Aujourd’hui</small>
     <div className={s.commentContext}><img src={LEAD_RESULT_POSTER} alt=""/><span>Vous avez commenté ce Reel.<b>CLAUDE 🙌</b></span></div>
     <motion.div className={s.incomingRow} data-scroll-reveal="dm" style={{opacity:incoming}}><img src={AVATAR} alt=""/><div className={s.incoming}><p>Merci pour ton commentaire ! 👋</p><p>Voici la ressource sur Claude dont je parle dans la vidéo.</p></div></motion.div>
     <motion.div className={s.resource} data-lead-resource style={{opacity:resource}}><div><FileText size={29} aria-hidden="true"/><b>La ressource de la vidéo<small>Pour aller plus loin avec Claude</small></b></div><span>Ouvrir la ressource <ArrowRight size={14} aria-hidden="true"/></span></motion.div>
     <motion.p className={s.sent} style={{opacity:sent}}><Check size={14}/>Réponse envoyée automatiquement</motion.p>
    </div>
    <div className={s.composer} aria-hidden="true"><span><Send size={15}/></span><i>Message…</i><ImageIcon size={18}/><Smile size={18}/></div>
   </motion.article>
  </div>
  <p className={s.note} data-lead-message-note>Extraits réels · conversation et ressource illustrées. Aucun message envoyé depuis cette page.</p>
 </div>
}
