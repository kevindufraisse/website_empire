'use client'

import { useId } from 'react'
import { ArrowLeft, ArrowRight, ArrowDown, CheckCheck, ChevronDown, FileText, Heart, Image as ImageIcon, Info, Phone, Smile, Video } from 'lucide-react'
import LeadMagnetComparison, { LEAD_RESULT_POSTER } from './LeadMagnetComparison'
import j from './LeadMagnetJourney.module.css'

const AVATAR='/founders/kevin.jpg'

/** The comparison, comment and DM are ordinary document content, not timed slides.
 * Both supplied videos are real. All conversation content is explicitly illustrative.
 * This component never submits a form, sends a message or starts a generation.
 */
export default function LeadMagnetScene({staticMode=false}:{staticMode?:boolean}){
 const uid=useId()
 return <section id="formula-lead-magnet" className={j.journey} data-scene="lead-magnet" data-static={staticMode} aria-labelledby={`${uid}-title`}>
  <div className={j.comparisonPart}>
   <header className={j.heading}><h2 id={`${uid}-title`}>Reprenez le format d’un Reel.<br/>Faites-en votre version.</h2><p>De la vidéo qui vous inspire à votre montage avec Empire.</p></header>
   <LeadMagnetComparison staticMode={staticMode}/>
  </div>
  <section id="formula-instagram-messages" className={j.messages} data-lead-messages aria-labelledby={`${uid}-messages`}>
   <header className={j.heading}><h2 id={`${uid}-messages`}>Ils commentent.<br/>Votre réponse part automatiquement.</h2><p>Un mot-clé configuré, une ressource associée, un message privé.</p></header>
   <div className={j.messageGrid}>
    <div className={j.commentColumn}>
     <div className={j.postContext}><img src={LEAD_RESULT_POSTER} alt="Miniature du Reel de Kevin"/><div><b>Votre Reel est publié.</b><p>« Commente CLAUDE »</p></div></div>
     <div className={j.commentCard} data-lead-comment>
      <div className={j.comment}><span className={j.alex} aria-hidden="true">A</span><div><b>alex</b><p>CLAUDE 🙌</p></div><Heart size={15} aria-hidden="true"/></div>
      <div className={j.publicReply}><img src={AVATAR} alt=""/><div><b>kevin.dufraisse</b><p>Je te l’ai envoyé en privé 👋</p><small>Réponse automatique · exemple</small></div></div>
     </div>
     <div className={j.trigger}><span>Mot-clé détecté : <strong>CLAUDE</strong></span><ArrowRight size={22} className={j.desktopArrow} aria-hidden="true"/><ArrowDown size={22} className={j.mobileArrow} aria-hidden="true"/></div>
    </div>
    <figure className={j.dmPanel} data-lead-dm>
     <div className={j.dmPhone}>
      <header className={j.dmHeader}><ArrowLeft size={20} aria-hidden="true"/><img src={AVATAR} alt=""/><div><b>kevin.dufraisse <ChevronDown size={12} aria-hidden="true"/></b><small>Kevin Dufraisse</small></div><Phone size={17} aria-hidden="true"/><Video size={19} aria-hidden="true"/></header>
      <div className={j.dmBody}>
       <small className={j.today}>Aujourd’hui</small>
       <div className={j.replyContext}><img src={LEAD_RESULT_POSTER} alt=""/><span>Vous avez commenté ce Reel.<b>CLAUDE 🙌</b></span></div>
       <div className={j.incomingRow}><img src={AVATAR} alt=""/><div className={j.incoming}><p>Merci pour ton commentaire ! 👋</p><p>Voici la ressource sur Claude dont je parle dans la vidéo.</p></div></div>
       <div className={j.resource} data-lead-resource><div><FileText size={28} aria-hidden="true"/><b>La ressource de la vidéo<small>Pour aller plus loin avec Claude</small></b></div><span>Ouvrir la ressource <ArrowRight size={14} aria-hidden="true"/></span></div>
       <div className={j.sent}><CheckCheck size={15} aria-hidden="true"/>Réponse envoyée automatiquement</div>
      </div>
      <div className={j.composer} aria-hidden="true"><i>Message…</i><ImageIcon size={19}/><Smile size={19}/></div>
     </div>
     <figcaption>Depuis votre compte Instagram, sans répondre à la main.</figcaption>
    </figure>
   </div>
   <p className={j.note}><Info size={14} aria-hidden="true"/>Extraits réels · commentaire, message et ressource illustrés. Aucun message envoyé depuis cette page.</p>
  </section>
 </section>
}
