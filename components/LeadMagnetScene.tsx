'use client'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionStyle, type MotionValue } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, Heart, Image as ImageIcon, MessageCircle, Phone, Send, Smile, Video } from 'lucide-react'
import LeadMagnetComparison, { LEAD_RESULT_POSTER } from './LeadMagnetComparison'
import s from './LeadMagnetJourney.module.css'
import scroll from './ScrollDiscovery.module.css'
import FormatRail from './FormatRail'
import formats from './FormatJourney.module.css'

const AVATAR = '/founders/kevin.jpg'

/** Native page scroll drives the reveal; each result then holds on screen.
 * No next/previous buttons, forced scroll, scroll snapping or timed navigation.
 * Reduced-motion visitors get every element in ordinary document flow. */
export default function LeadMagnetScene({ staticMode = false }: { p?: MotionValue<number>; staticMode?: boolean }) {
  const comparison = useRef<HTMLDivElement>(null)
  const messages = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const still = staticMode || !!reduced
  const { scrollYProgress: compareP } = useScroll({ target: comparison, offset: ['start start', 'end end'] })
  const { scrollYProgress: messageP } = useScroll({ target: messages, offset: ['start start', 'end end'] })
  const commentOpacity = useTransform(messageP, [.02, .12], [0, 1])
  const commentY = useTransform(messageP, [.02, .12], [14, 0])
  const replyOpacity = useTransform(messageP, [.20, .29], [0, 1])
  const triggerOpacity = useTransform(messageP, [.25, .33], [0, 1])
  const commentMobile = useTransform(messageP, [.42, .50], [1, 0])
  const phoneOpacity = useTransform(messageP, [.46, .54], [0, 1])
  const phoneY = useTransform(messageP, [.46, .54], [18, 0])
  const incomingOpacity = useTransform(messageP, [.56, .65], [0, 1])
  const resourceOpacity = useTransform(messageP, [.70, .78], [0, 1])
  const sentOpacity = useTransform(messageP, [.76, .82], [0, 1])
  return <section id="formula-lead-magnet" className={scroll.journey} data-scene="lead-magnet" data-static={still} aria-labelledby="lead-comparison-title">
    <div ref={comparison} className={scroll.comparisonStory} data-scroll-discovery="comparison" data-static={still}>
      <div className={`${scroll.sticky} ${scroll.compareSticky} ${formats.withRail}`} data-scroll-stage>
        <FormatRail active={5} floating/>
        <header className={`${s.heading} ${scroll.heading}`}>
          <h2 id="lead-comparison-title">Le même script.<br/><em>De l’anglais au français.</em></h2>
          <p>L’original à gauche. Le clone de Kevin à droite.<br className={s.desktopBreak}/> Le script traduit, avec ses propres visuels et sous-titres.</p>
        </header>
        <div className={scroll.comparisonReveal}><LeadMagnetComparison staticMode={still}/></div>
        {!still && <div className={scroll.progress} aria-hidden="true"><span>Continuez à scroller</span><div><motion.i style={{ scaleX: compareP }}/></div></div>}
      </div>
    </div>
    <section ref={messages} id="formula-lead-messages" className={scroll.messages} data-scroll-discovery="instagram" data-static={still} data-lead-message-story aria-labelledby="lead-messages-title">
      <div className={`${scroll.sticky} ${scroll.messageSticky} ${formats.withRail}`} data-scroll-stage>
        <FormatRail active={5} floating/>
        <header className={`${s.heading} ${scroll.heading}`}>
          <h2 id="lead-messages-title">Ils commentent.<br/><em>Vous répondez automatiquement.</em></h2>
          <p>Associez un mot-clé à votre ressource.<br/>Le commentaire déclenche l’envoi du lien en privé.</p>
        </header>
        <div className={`${s.messagePair} ${scroll.messagePair}`}>
          <motion.article className={`${s.commentCard} ${scroll.commentCard}`} data-lead-comment style={{ '--comment-opacity': still ? 1 : commentMobile } as MotionStyle}>
            <div className={s.commentHeader}><MessageCircle size={18}/><b>Sous votre Reel</b></div>
            <div className={s.reelContext}><img src={LEAD_RESULT_POSTER} alt="Aperçu du Reel de Kevin"/><div><b>kevin.dufraisse</b><p>Commente « <strong>CLAUDE</strong> »</p></div></div>
            <motion.div className={s.comment} data-scroll-reveal="comment" style={still ? {} : { opacity: commentOpacity, y: commentY }}><span className={s.alexAvatar} aria-hidden="true">A</span><div><b>alex</b><p>CLAUDE 🙌</p><small>À l’instant · Répondre</small></div><Heart size={15} aria-hidden="true"/></motion.div>
            <motion.div className={s.reply} data-scroll-reveal="reply" style={{ opacity: still ? 1 : replyOpacity }}><img src={AVATAR} alt=""/><div><b>kevin.dufraisse</b><p>Je te l’ai envoyé en privé 👋</p><small>Réponse automatique · exemple</small></div></motion.div>
            <motion.div className={s.trigger} style={{ opacity: still ? 1 : triggerOpacity }}><Check size={16}/><span>Mot-clé <b>CLAUDE</b> détecté</span><ArrowRight size={17}/></motion.div>
          </motion.article>
          <motion.article className={`${s.dmPhone} ${scroll.dmPhone}`} data-lead-dm aria-label="Exemple de message privé Instagram automatique" style={still ? {} : { opacity: phoneOpacity, y: phoneY }}>
            <header className={s.dmHeader}><ArrowLeft size={19} aria-hidden="true"/><img src={AVATAR} alt=""/><div><b>kevin.dufraisse <ChevronDown size={12} aria-hidden="true"/></b><small>Kevin Dufraisse</small></div><Phone size={17} aria-hidden="true"/><Video size={18} aria-hidden="true"/></header>
            <div className={s.dmBody}>
              <small className={s.today}>Aujourd’hui</small>
              <div className={s.commentContext}><img src={LEAD_RESULT_POSTER} alt=""/><span>Vous avez commenté ce Reel.<b>CLAUDE 🙌</b></span></div>
              <motion.div className={s.incomingRow} data-scroll-reveal="dm" style={{ opacity: still ? 1 : incomingOpacity }}><img src={AVATAR} alt=""/><div className={s.incoming}><p>Merci pour ton commentaire ! 👋</p><p>Voici la ressource sur Claude dont je parle dans la vidéo.</p></div></motion.div>
              <motion.div className={s.resource} data-lead-resource style={{ opacity: still ? 1 : resourceOpacity }}><div><FileText size={29} aria-hidden="true"/><b>La ressource de la vidéo<small>Pour aller plus loin avec Claude</small></b></div><span>Ouvrir la ressource <ArrowRight size={14} aria-hidden="true"/></span></motion.div>
              <motion.p className={s.sent} style={{ opacity: still ? 1 : sentOpacity }}><Check size={14}/>Réponse envoyée automatiquement</motion.p>
            </div>
            <div className={s.composer} aria-hidden="true"><span><Send size={15}/></span><i>Message…</i><ImageIcon size={18}/><Smile size={18}/></div>
          </motion.article>
        </div>
        <p className={`${s.note} ${scroll.note}`}>Extraits réels · commentaire, message et ressource illustrés. Aucun message envoyé depuis cette page.</p>
        {!still && <div className={scroll.progress} aria-hidden="true"><span>Continuez à scroller</span><div><motion.i style={{ scaleX: messageP }}/></div></div>}
      </div>
    </section>
  </section>
}
