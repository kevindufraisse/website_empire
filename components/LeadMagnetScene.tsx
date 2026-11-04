'use client'

import type { MotionValue } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, Heart, Image as ImageIcon, MessageCircle, Phone, Send, Smile, Video } from 'lucide-react'
import LeadMagnetComparison, { LEAD_RESULT_POSTER } from './LeadMagnetComparison'
import s from './LeadMagnetJourney.module.css'

const AVATAR = '/founders/kevin.jpg'

/** Native document sections: the comparison, comment and private reply never
 * depend on a scroll interval. p remains optional for old callers only. */
export default function LeadMagnetScene({ staticMode = false }: { p?: MotionValue<number>; staticMode?: boolean }) {
  return <section id="formula-lead-magnet" className={s.journey} data-scene="lead-magnet" data-static={staticMode} aria-labelledby="lead-comparison-title">
    <div className={s.inner}>
      <header className={s.heading}>
        <h2 id="lead-comparison-title">Ce Reel vous inspire ?<br/><em>Recréez-le à votre façon.</em></h2>
        <p>L’original à gauche. Sa version adaptée avec Empire à droite.<br className={s.desktopBreak}/> Même idée, votre vidéo, vos illustrations et vos sous-titres.</p>
      </header>
      <LeadMagnetComparison staticMode={staticMode}/>
      <section id="formula-lead-messages" className={s.messageStory} data-lead-message-story aria-labelledby="lead-messages-title">
        <header className={s.heading}>
          <h2 id="lead-messages-title">Ils commentent.<br/><em>Vous répondez automatiquement.</em></h2>
          <p>Associez un mot-clé à votre ressource.<br/>Le commentaire déclenche l’envoi du lien en privé.</p>
        </header>
        <div className={s.messagePair}>
          <article className={s.commentCard} data-lead-comment>
            <div className={s.commentHeader}><MessageCircle size={18}/><b>Sous votre Reel</b></div>
            <div className={s.reelContext}><img src={LEAD_RESULT_POSTER} alt="Aperçu du Reel de Kevin"/><div><b>kevin.dufraisse</b><p>Commente « <strong>CLAUDE</strong> »</p></div></div>
            <div className={s.comment}><span className={s.alexAvatar} aria-hidden="true">A</span><div><b>alex</b><p>CLAUDE 🙌</p><small>À l’instant · Répondre</small></div><Heart size={15} aria-hidden="true"/></div>
            <div className={s.reply}><img src={AVATAR} alt=""/><div><b>kevin.dufraisse</b><p>Je te l’ai envoyé en privé 👋</p><small>Réponse automatique · exemple</small></div></div>
            <div className={s.trigger}><Check size={16}/><span>Mot-clé <b>CLAUDE</b> détecté</span><ArrowRight size={17}/></div>
          </article>
          <article className={s.dmPhone} data-lead-dm aria-label="Exemple de message privé Instagram automatique">
            <header className={s.dmHeader}><ArrowLeft size={19} aria-hidden="true"/><img src={AVATAR} alt=""/><div><b>kevin.dufraisse <ChevronDown size={12} aria-hidden="true"/></b><small>Kevin Dufraisse</small></div><Phone size={17} aria-hidden="true"/><Video size={18} aria-hidden="true"/></header>
            <div className={s.dmBody}>
              <small className={s.today}>Aujourd’hui</small>
              <div className={s.commentContext}><img src={LEAD_RESULT_POSTER} alt=""/><span>Vous avez commenté ce Reel.<b>CLAUDE 🙌</b></span></div>
              <div className={s.incomingRow}><img src={AVATAR} alt=""/><div className={s.incoming}><p>Merci pour ton commentaire ! 👋</p><p>Voici la ressource sur Claude dont je parle dans la vidéo.</p></div></div>
              <div className={s.resource} data-lead-resource><div><FileText size={29} aria-hidden="true"/><b>La ressource de la vidéo<small>Pour aller plus loin avec Claude</small></b></div><span>Ouvrir la ressource <ArrowRight size={14} aria-hidden="true"/></span></div>
              <p className={s.sent}><Check size={14}/>Réponse envoyée automatiquement</p>
            </div>
            <div className={s.composer} aria-hidden="true"><span><Send size={15}/></span><i>Message…</i><ImageIcon size={18}/><Smile size={18}/></div>
          </article>
        </div>
        <p className={s.note}>Extraits réels · commentaire, message et ressource illustrés. Aucun message envoyé depuis cette page.</p>
      </section>
    </div>
  </section>
}
