'use client'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { BatteryFull, Check, CheckCheck, ChevronLeft, Mic, Plus, Send, Signal, Video, Camera, Play, Radar } from 'lucide-react'
import s from './LeadMagnetJourney.module.css'
import scroll from './ScrollDiscovery.module.css'
import v from './IdeaSourcePreview.module.css'
import { SocialIcons } from './ui/social-icons'

const EXAMPLES = [
  { name: 'Un vocal', kind: 'voice', text: 'Comment choisir les bons créateurs business à suivre ? Ça dépend de ce qu’on veut apprendre.', reply: 'Vocal transcrit. Ton idée est enregistrée dans Empire.', format: 'Réponse en vidéo' },
  { name: 'Une idée', kind: 'note', text: 'Faisons une tier list des créateurs business français. Je veux expliquer qui suivre selon son objectif.', reply: 'Idée enregistrée. On prépare ton classement.', format: 'Tier list' },
  { name: 'Une capture d’écran', kind: 'capture', text: 'J’aimerais parler de la réalité de l’entrepreneuriat.', reply: 'Capture reçue. Sujet enregistré : persévérer quand on entreprend.', format: 'Point de vue' },
  { name: 'Un Reel Instagram', kind: 'reel', text: 'Je veux réagir avec mon expérience.', reply: 'Reel reçu. L’extrait accompagnera ta réaction.', format: 'Réaction' },
  { name: 'Un lien YouTube', kind: 'youtube', text: 'Je veux répondre aux questions que cette vidéo soulève.', reply: 'Vidéo enregistrée. Ses idées sont prêtes à développer.', format: 'Réponse en vidéo' },
  { name: 'Un post LinkedIn', kind: 'linkedin', text: 'Je veux donner mon avis sur ce post.', reply: 'Post reçu. Ton sujet et ton angle sont enregistrés.', format: 'Point de vue' },
  { name: 'Vos concurrents', kind: 'watch', text: 'Les idées des comptes que vous suivez arrivent aussi ici.', reply: 'Retrouvez les sujets à adapter à votre activité dans Empire.', format: 'À développer avec votre angle' },
] as const

const SOURCE_LINKS = {
  reel: { Icon: SocialIcons.instagram, label: 'Reel Instagram', url: 'instagram.com/reel/…', image: '/demo/hormozi-reaction-v10.jpg', title: 'Un conseil business à commenter' },
  youtube: { Icon: SocialIcons.youtube, label: 'YouTube Shorts', url: 'youtube.com/shorts/…', image: '/creators/abdaal.webp', title: 'Des conseils pour commencer' },
  linkedin: { Icon: SocialIcons.linkedin, label: 'Post LinkedIn', url: 'linkedin.com/posts/…', image: '', title: 'Qui suivre en business ?' },
} as const
function SourcePreview({kind}:{kind:string}) {
  if(kind==='capture')return <div className={v.attachment} data-idea-source="capture"><div className={v.fileLabel}><Camera size={14}/><b>Capture d’écran</b><span>PNG</span></div><img src="/demo/capture-entrepreneur-v18.webp" alt="Capture d’écran : citation sur la persévérance des entrepreneurs"/><small>capture-écran.png · Image jointe</small></div>
  if(kind==='reel'||kind==='youtube'||kind==='linkedin'){
    const link=SOURCE_LINKS[kind]
    return <div className={v.sourceLink} data-idea-source={kind}>
      <div className={v.linkHeading}><link.Icon/><b>{link.label}</b></div>
      <span className={v.url}>{link.url}</span>
      <div className={v.linkBody}>{link.image&&<span className={v.thumbnail}><img src={link.image} alt=""/><Play size={13} fill="currentColor"/></span>}<b>{link.title}</b></div>
    </div>
  }
  if(kind==='watch')return <div className={v.watch} data-idea-source="watch"><b><Radar size={16}/>La veille de vos concurrents</b><span><SocialIcons.instagram/><div><b>Reel Instagram</b><small>instagram.com/reel/…</small></div></span><span><SocialIcons.tiktok/><div><b>Vidéo TikTok</b><small>tiktok.com/@…/video/…</small></div></span><span><SocialIcons.linkedin/><div><b>Post LinkedIn</b><small>linkedin.com/posts/…</small></div></span></div>
  return null
}

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
    {still && item.kind==='watch' && <h3 className={v.staticHeading}><Radar size={18}/>Ou inspirez-vous de ce que publient vos concurrents.</h3>}
    <small className={s.chatDay}>Aujourd’hui</small>
    <motion.div className={s.outgoing} data-idea-outgoing style={still ? {} : { opacity: outgoing, y: outgoingY }}>
      {item.kind === 'voice' && <div className={s.voice}><Mic size={17}/><span aria-hidden="true">{[12,22,30,16,25,36,17,27,13,34,20,28,16,35,23,13,28,18].map((height,i)=><i key={i} style={{height}}/>)}</span><b>0:18</b></div>}
      <SourcePreview kind={item.kind}/>
      {item.kind!='watch'&&<p>{item.text}</p>}<small>9:41 <CheckCheck size={12}/></small>
    </motion.div>
    <motion.div className={s.incomingIdea} data-idea-reply style={still ? {} : { opacity: incoming, y: incomingY }}><span><Check size={13}/>Ajouté à Empire</span><p>{item.reply}</p><small>Format proposé : {item.format}</small></motion.div>
  </div>
}

/** Seven scroll-driven examples, with 120svh per example and long reading holds.
 * Scrolling back restores the corresponding exchange; no click is required. */
export default function IdeaMessagesStory() {
  const root = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const still = !!reduced
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const [index, setIndex] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', value => setIndex(Math.min(EXAMPLES.length - 1, Math.max(0, Math.floor(value * EXAMPLES.length)))))
  return <section ref={root} id="formula-ideas" className={`${s.ideas} ${scroll.ideas} ${v.ideas}`} data-story="messages" data-scroll-discovery="ideas" data-static={still} aria-labelledby="ideas-title">
    <div className={scroll.sticky} data-scroll-stage>
      <header className={`${s.heading} ${scroll.heading} ${v.heading}`} data-ideas-heading={index===6&&!still?'competitors':'idea'}><h2 id="ideas-title">{index===6&&!still?<><Radar className={v.headingIcon} aria-hidden="true"/>Ou inspirez-vous de ce que<br/><em>publient vos concurrents.</em></>:<>Dès que vous avez une idée,<br/><em>partagez-la.</em></>}</h2></header>
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
