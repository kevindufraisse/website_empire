'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { BatteryFull, Check, CheckCheck, ChevronLeft, Mic, Plus, Send, Signal, Video } from 'lucide-react'
import s from './LeadMagnetJourney.module.css'
import scroll from './ScrollDiscovery.module.css'

const EXAMPLES = [
  { name: 'Un vocal', kind: 'voice', text: 'Comment choisir les bons créateurs business à suivre ? Ça dépend de ce qu’on veut apprendre.', reply: 'Vocal transcrit. Ton idée est enregistrée dans Empire.', format: 'Réponse en vidéo' },
  { name: 'Une idée', kind: 'note', text: 'Faisons une tier list des créateurs business français. Je veux expliquer qui suivre selon son objectif.', reply: 'Idée enregistrée. On prépare ton classement.', format: 'Tier list' },
  { name: 'Une capture', kind: 'capture', text: 'J’aimerais parler de la réalité de l’entrepreneuriat.', reply: 'Capture reçue. Sujet enregistré : persévérer quand on entreprend.', format: 'Point de vue' },
  { name: 'Un Reel', kind: 'reel', text: 'Je veux réagir à ces conseils, avec ce que j’applique dans mon activité.', reply: 'Reel reçu. L’extrait accompagnera ta réaction.', format: 'Réaction' },
  { name: 'Un lien YouTube', kind: 'youtube', text: 'Je veux répondre aux questions que cette vidéo soulève.', reply: 'Vidéo enregistrée. Ses idées sont prêtes à développer.', format: 'Réponse en vidéo' },
  { name: 'Un post LinkedIn', kind: 'linkedin', text: 'Qui suivre en business ? Je veux donner mon avis sur ce sujet.', reply: 'Post reçu. Ton sujet et ton angle sont enregistrés.', format: 'Point de vue' },
  { name: 'Votre veille', kind: 'watch', text: 'Les idées des comptes que vous suivez arrivent aussi ici.', reply: 'Retrouvez les sujets à adapter à votre activité dans Empire.', format: 'À développer avec votre angle' },
] as const

function Exchange({ index, progress, active, still }: { index: number; progress: MotionValue<number>; active: boolean; still: boolean }) {
  const item = EXAMPLES[index]
  const local = useTransform(progress, value => value * EXAMPLES.length - index)
  const outgoing = useTransform(local, [0, .10], [index === 0 ? 1 : .25, 1])
  const outgoingY = useTransform(local, [0, .10], [index === 0 ? 0 : 12, 0])
  const incoming = useTransform(local, [.12, .28], [0, 1])
  const incomingY = useTransform(local, [.12, .28], [12, 0])
  // The remaining 72% of each segment is a full reading hold. No timers and
  // no wheel/touch handlers: only the page's native scroll controls the story.
  return <div className={scroll.exchange} data-idea-layer={index} aria-hidden={!still && !active}>
    <small className={s.chatDay}>Aujourd’hui</small>
    <motion.div className={s.outgoing} data-idea-outgoing style={still ? {} : { opacity: outgoing, y: outgoingY }}>
      {item.kind === 'voice' && <div className={s.voice}><Mic size={17}/><span aria-hidden="true">{[12,22,30,16,25,36,17,27,13,34,20,28,16,35,23,13,28,18].map((height,i)=><i key={i} style={{height}}/>)}</span><b>0:18</b></div>}
      {item.kind === 'capture' && <img className={s.ideaAttachment} src="/demo/capture-entrepreneur-v18.webp" alt="Capture d’écran partagée dans Empire"/>}
      {item.kind === 'reel' && <div className={s.linkPreview}><img src="/demo/hormozi-reaction-v10.jpg" alt="Aperçu du Reel partagé"/><span>instagram.com/reel/…<b>Un conseil business à commenter</b></span></div>}
      {item.kind === 'youtube' && <div className={s.linkPreview}><img src="/creators/abdaal.webp" alt="Aperçu de la vidéo YouTube"/><span>youtube.com/shorts/…<b>Des conseils pour commencer</b></span></div>}
      {item.kind === 'linkedin' && <div className={s.linkPreview}><span>linkedin.com/posts/…<b>Qui suivre en business ?</b></span></div>}
      {item.kind === 'watch' && <div className={s.watchPreview}><b>Empire vous propose</b><span>Un Reel de votre niche</span><span>Un post d’un compte suivi</span><span>Une actualité à commenter</span></div>}
      <p>{item.text}</p><small>9:41 <CheckCheck size={12}/></small>
    </motion.div>
    <motion.div className={s.incomingIdea} data-idea-reply style={still ? {} : { opacity: incoming, y: incomingY }}><span><Check size={13}/>Ajouté à Empire</span><p>{item.reply}</p><small>Format proposé : {item.format}</small></motion.div>
  </div>
}

/** Seven scroll-driven examples, with 120svh per example and long reading holds.
 * Scrolling back restores the corresponding exchange; no click is required. */
export default function IdeaMessagesStory() {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const still = !!reduced
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const [index, setIndex] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', value => setIndex(Math.min(EXAMPLES.length - 1, Math.max(0, Math.floor(value * EXAMPLES.length)))))
  return <section ref={root} id="formula-ideas" className={`${s.ideas} ${scroll.ideas}`} data-story="messages" data-scroll-discovery="ideas" data-static={still} aria-labelledby="ideas-title">
    <div className={scroll.sticky} data-scroll-stage>
      <header className={`${s.heading} ${scroll.heading}`}><h2 id="ideas-title">Dès que vous avez une idée,<br/><em>partagez-la.</em></h2></header>
      <div className={`${s.ideaPhone} ${scroll.ideaPhone}`}>
        <div className={s.phoneStatus} aria-hidden="true"><b>9:41</b><i/><span><Signal size={12}/><BatteryFull size={18}/></span></div>
        <header className={s.chatHeader}><ChevronLeft size={20} aria-hidden="true"/><span className={s.empireAvatar}>E</span><div><b>Empire</b><small>Votre assistant contenu</small></div><Video size={19} aria-hidden="true"/></header>
        <div className={`${s.chatBody} ${scroll.chatBody}`} data-idea-example={index}>
          {EXAMPLES.map((item, i) => <Exchange key={item.kind} index={i} progress={scrollYProgress} active={index === i} still={still}/>)}
        </div>
        <div className={s.chatComposer} aria-hidden="true"><Plus size={18}/><span>Partagez votre prochaine idée…</span><Send size={17}/></div>
      </div>
      {!still && <div className={scroll.progress} aria-hidden="true"><span>Continuez à scroller</span><div><motion.i style={{ scaleX: scrollYProgress }}/></div></div>}
    </div>
  </section>
}
