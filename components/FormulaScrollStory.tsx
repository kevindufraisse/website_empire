'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Check, Link2, Mic, Play, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { SocialIcons } from '@/components/ui/social-icons'
import s from './FormulaScrollStory.module.css'

const FORMATS = [
  { image: 'reaction.webp', fr: 'Réaction', en: 'Reaction' },
  { image: 'faq.webp', fr: 'Question / réponse', en: 'Q&A' },
  { image: 'tierlist.webp', fr: 'Tier list', en: 'Tier list' },
]
const NETWORKS = ['linkedin', 'instagram', 'youtube', 'tiktok', 'threads', 'facebook', 'twitter'] as const
const NETWORK_NAMES = ['LinkedIn', 'Instagram', 'YouTube', 'TikTok', 'Threads', 'Facebook', 'X']

function useStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: progress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [second, setSecond] = useState(false)
  useMotionValueEvent(progress, 'change', v => setSecond(v >= 0.48))
  return { ref, progress, second }
}

function Chat({ progress, fr }: { progress: MotionValue<number>; fr: boolean }) {
  const opacity = useTransform(progress, [0, 0.33, 0.46], [1, 1, 0])
  const scale = useTransform(progress, [0.3, 0.47], [1, 0.82])
  const y = useTransform(progress, [0, 0.15, 0.45], [24, 0, -35])
  const replyOpacity = useTransform(progress, [0.13, 0.25], [0, 1])
  const replyY = useTransform(progress, [0.13, 0.25], [25, 0])
  return <motion.div className={`${s.scene} ${s.chatScene}`} style={{ opacity, scale }} aria-hidden>
    <motion.div className={s.sourceNote} style={{ y }}>
      <span className={s.sourceIcon}><SocialIcons.linkedin /></span>
      <small>{fr ? 'VU DANS VOTRE VEILLE' : 'FROM YOUR FEED'}</small>
      <strong>{fr ? '« Publier tous les jours ne suffit pas. »' : '“Posting every day isn’t enough.”'}</strong>
      <span className={s.noteLines}><i /><i /><i /></span>
      <span className={s.sourceFoot}>{fr ? 'Un point de vue à challenger.' : 'A point of view to challenge.'} <ArrowUpRight size={14}/></span>
    </motion.div>
    <div className={s.chat}>
      <div className={s.chatHeader}><img src="/integrations/telegram.svg" width={32} height={32} alt=""/><div><b>Empire · {fr ? 'mes idées' : 'my ideas'}</b><span>{fr ? 'Votre conversation créative' : 'Your creative conversation'}</span></div><span className={s.online}/></div>
      <div className={s.chatBody}>
        <div className={s.sent}>{fr ? 'Mon concurrent a partagé ça sur LinkedIn 👀' : 'My competitor shared this on LinkedIn 👀'}<div className={s.link}><Link2 size={13}/> linkedin.com/posts/…</div><small>09:41 ✓✓</small></div>
        <div className={`${s.sent} ${s.voice}`}><Play size={15} fill="currentColor"/><span className={s.wave}>{[8,15,22,12,26,19,10,23,16,28,12,20,15,9,21,14].map((h,i)=><i key={i} style={{height:h}}/>)}</span><span>0:18</span></div>
        <motion.div className={s.reply} style={{opacity:replyOpacity,y:replyY}}><span className={s.spark}>✦</span><div><b>{fr ? 'Une idée à creuser' : 'An idea to explore'}</b><p>{fr ? 'Comment trouver des clients sans faire de pub ?' : 'How do you find clients without ads?'}</p><small><Check size={12}/>{fr ? 'Ajoutée à vos sujets' : 'Added to your topics'}</small></div></motion.div>
      </div>
      <div className={s.chatInput}>{fr ? 'Une idée, un lien, un vocal…' : 'An idea, a link, a voice note…'}<Send size={16}/></div>
    </div>
    <motion.div className={s.screenshot} style={{ y:replyY }}><img src="/formats/reaction.webp" alt="" width={128} height={225}/><span><Check size={13}/>{fr ? 'Capture ajoutée' : 'Screenshot added'}</span></motion.div>
  </motion.div>
}

function FormatCard({ index, progress, fr }: { index:number; progress:MotionValue<number>;fr:boolean }) {
  const x = useTransform(progress, [0.44, 0.76], [0, (index-1)*210])
  const y = useTransform(progress, [0.44, 0.76], [-45, index===1 ? 0:24])
  const rotate = useTransform(progress, [0.44, 0.76], [0, (index-1)*9])
  const opacity = useTransform(progress, [0.44+index*0.025, 0.58+index*0.025], [0, 1])
  const scale = useTransform(progress,[0.44,0.76],[0.45,1])
  const f=FORMATS[index]
  return <motion.div className={s.formatCard} style={{translateX:x,y,rotate,opacity,scale,zIndex:index===1?3:2}}>
    <img src={`/formats/${f.image}`} width={230} height={408} alt="" loading="lazy"/>
    <div className={s.formatName}><span>0{index+1}</span>{fr?f.fr:f.en}</div>
  </motion.div>
}

function Formats({ progress, fr }: {progress:MotionValue<number>;fr:boolean}) {
  const opacity=useTransform(progress,[0.37,0.46],[0,1])
  const ideaY=useTransform(progress,[0.4,0.68],[70,0])
  const ideaScale=useTransform(progress,[0.4,0.68],[1.15,1])
  return <motion.div className={`${s.scene} ${s.formatsScene}`} style={{opacity}} aria-hidden>
    <motion.div className={s.idea} style={{x:"-50%",y:ideaY,scale:ideaScale}}><span>✦</span>{fr?'Trouver des clients sans pub':'Finding clients without ads'}<ArrowDown size={15}/></motion.div>
    <div className={s.formatFan}>{FORMATS.map((_,i)=><FormatCard key={i} index={i} progress={progress} fr={fr}/>)}</div>
    <div className={s.formatsFoot}><span className={s.online}/>{fr?'Le même sujet. Plusieurs façons de le raconter.':'One topic. More than one way to tell it.'}</div>
  </motion.div>
}

export function SourcesStory() {
  const {lang}=useLanguage();const fr=lang==='fr';const {autopilot}=useAutopilot()
  const {ref,progress,second}=useStory();const reduced=useReducedMotion()
  if(autopilot)return null
  return <section ref={ref} className={`${s.story} ${reduced?s.reduced:''}`} aria-label={fr?'Du message au format':'From message to format'} data-story="sources" data-step={second?'formats':'message'}>
    <span id="formula-format" className={s.chapterAnchor} aria-hidden/>
    <div className={s.sticky}>
      <div className={s.storyTop}><span>EMPIRE, {fr?'EN ACTION':'IN ACTION'}</span><span>01 — 02 <span className={s.dim}>/ 04</span></span></div>
      <div className={s.headings}>
        <div className={`${s.heading} ${!second?s.active:''}`}><p>01 · MESSAGE</p><h2>{fr?<>Tout commence par<br/><em>ce qui vous fait réagir.</em></>:<>It starts with<br/><em>what makes you react.</em></>}</h2><span>{fr?'Un lien, une capture, un vocal. Envoyez. Vos prochains sujets prennent forme.':'A link, a screenshot, a voice note. Send it. Your next topics take shape.'}</span></div>
        <div className={`${s.heading} ${second?s.active:''}`}><p>02 · FORMAT</p><h2>{fr?<>Votre idée trouve<br/><em>le bon format.</em></>:<>Your idea finds<br/><em>the right format.</em></>}</h2><span>{fr?'Réaction, FAQ, tier list… Le fond vient de vous. Le cadre est déjà prêt.':'Reaction, Q&A, tier list… Your point of view. A proven structure.'}</span></div>
      </div>
      <div className={s.stage}><Chat progress={progress} fr={fr}/><Formats progress={progress} fr={fr}/></div>
      <StoryProgress progress={progress} fr={fr}/>
    </div>
    <p className="sr-only">{fr?'Envoyez vos liens, captures et vocaux sur Telegram. Empire en tire des sujets, puis les adapte à des formats comme la réaction, la FAQ et la tier list. Les exemples de formats sont présentés ci-dessous.':'Send links, screenshots and voice notes on Telegram. Empire turns them into topics and adapts them to reaction, Q&A and tier list formats. Explore the examples below.'}</p>
  </section>
}

function StoryProgress({progress,fr}:{progress:MotionValue<number>;fr:boolean}) {
  return <div className={s.storyBottom}><span>{fr?'Continuez à scroller':'Keep scrolling'} <ArrowDown size={13}/></span><div><motion.i style={{scaleX:progress}}/></div><small>{fr?'Démonstration illustrée':'Illustrated walkthrough'}</small></div>
}

function Recording({progress,fr}:{progress:MotionValue<number>;fr:boolean}) {
  const opacity=useTransform(progress,[0,0.46,0.58],[1,1,0]);const scale=useTransform(progress,[0.4,0.58],[1,0.75])
  const timer=useTransform(progress,v=>`00:${String(Math.round(Math.min(v/0.4,1)*42)).padStart(2,'0')}`)
  const saved=useTransform(progress,[0.35,0.42],[0,1])
  const meter=useTransform(progress,[0,0.4],[0.03,1])
  return <motion.div className={`${s.scene} ${s.recordScene}`} style={{opacity,scale}} aria-hidden>
    <div className={s.recordPrompt}><span>{fr?'VOTRE SUJET EST PRÊT':'YOUR TOPIC IS READY'}</span><h3>{fr?'Comment trouver des clients sans faire de pub ?':'How do you find clients without ads?'}</h3><p>{fr?'Votre expérience. Votre avis. Votre voix.':'Your experience. Your opinion. Your voice.'}</p><div><Mic size={15}/>{fr?'À vous de parler.':'Over to you.'}</div></div>
    <div className={s.camera}><img src="/formats/earphones.webp" width={260} height={462} alt="" loading="lazy"/><div className={s.cameraTop}><span><i/> REC</span><motion.b>{timer}</motion.b></div><span className={s.focus}/><div className={s.recordControl}><div><motion.i style={{scaleX:meter}}/></div><span><i/></span></div><motion.div className={s.saved} style={{opacity:saved}}><Check size={19}/>{fr?'Enregistré':'Recorded'}</motion.div></div>
  </motion.div>
}

function PublishCard({progress,index,fr}:{progress:MotionValue<number>;index:number;fr:boolean}) {
  const x=useTransform(progress,[0.52,0.82],[0,(index-1)*210]);const y=useTransform(progress,[0.52,0.82],[40,index===1?0:28]);const rotate=useTransform(progress,[0.52,0.82],[0,(index-1)*6]);const opacity=useTransform(progress,[0.52+index*0.035,0.66+index*0.035],[0,1])
  return <motion.div className={s.publishCard} style={{translateX:x,y,rotate,opacity,zIndex:index===1?3:2}}>
    {index===0?<><div className={s.postProfile}><img src="/founders/kevin.jpg" width={28} height={28} alt=""/><div><b>Kevin Dufraisse</b><span>LinkedIn</span></div><SocialIcons.linkedin/></div><h3>{fr?'Trouver des clients sans pub.':'Finding clients without ads.'}</h3><p>{fr?'Ce n’est pas en publiant plus que tout change. C’est en ayant quelque chose à dire.':'Posting more isn’t what changes everything. Having something to say does.'}</p><div className={s.postLines}><i/><i/><i/><i/></div><span className={s.postTag}>{fr?'Post écrit':'Written post'}</span></>:<><img className={s.publishPhoto} src={`/formats/${index===1?'faq.webp':'captions.webp'}`} width={230} height={408} alt="" loading="lazy"/><span className={s.videoTag}>{index===1?'Reel':'Short'}</span></>}
  </motion.div>
}

function Publishing({progress,fr}:{progress:MotionValue<number>;fr:boolean}) {
  const opacity=useTransform(progress,[0.48,0.57],[0,1]);const netY=useTransform(progress,[0.64,0.88],[25,0]);const netOpacity=useTransform(progress,[0.64,0.88],[0,1])
  return <motion.div className={`${s.scene} ${s.publishScene}`} style={{opacity}} aria-hidden>
    <div className={s.validation}><Check size={14}/>{fr?'Montage → relecture → votre validation':'Editing → review → your approval'}</div>
    <div className={s.publishFan}>{[0,1,2].map(i=><PublishCard key={i} progress={progress} index={i} fr={fr}/>)}</div>
    <motion.div className={s.networks} style={{y:netY,opacity:netOpacity}}>{NETWORKS.map((n,i)=>{const Icon=SocialIcons[n];return <span key={n} title={NETWORK_NAMES[i]}><Icon/><small>{NETWORK_NAMES[i]}</small></span>})}</motion.div>
  </motion.div>
}

export function RecordingStory() {
  const {lang}=useLanguage();const fr=lang==='fr';const {autopilot}=useAutopilot()
  const {ref,progress,second}=useStory();const reduced=useReducedMotion()
  if(autopilot)return null
  return <section ref={ref} className={`${s.story} ${s.recordStory} ${reduced?s.reduced:''}`} aria-label={fr?'De l’enregistrement à la diffusion':'From recording to distribution'} data-story="recording" data-step={second?'diffusion':'recording'}>
    <span id="formula-diffusion" className={s.chapterAnchor} aria-hidden/>
    <div className={s.sticky}>
      <div className={s.storyTop}><span>EMPIRE, {fr?'EN ACTION':'IN ACTION'}</span><span>03 — 04 <span className={s.dim}>/ 04</span></span></div>
      <div className={s.headings}>
        <div className={`${s.heading} ${!second?s.active:''}`}><p>03 · {fr?'ENREGISTREMENT':'RECORDING'}</p><h2>{fr?<>Vous appuyez sur REC.<br/><em>Vous restez vous.</em></>:<>You press REC.<br/><em>You stay you.</em></>}</h2><span>{fr?'Le sujet et le format sont prêts. Vous apportez ce qu’aucune IA ne peut inventer : votre vécu.':'Your topic and format are ready. You bring what AI cannot invent: your experience.'}</span></div>
        <div className={`${s.heading} ${second?s.active:''}`}><p>04 · {fr?'DIFFUSION':'DISTRIBUTION'}</p><h2>{fr?<>Une prise.<br/><em>De quoi remplir vos réseaux.</em></>:<>One recording.<br/><em>Content for your channels.</em></>}</h2><span>{fr?'Empire monte, décline et prépare les publications. Vous validez. Le contenu circule.':'Empire edits, adapts and prepares your posts. You approve. Your content travels.'}</span></div>
      </div>
      <div className={s.stage}><Recording progress={progress} fr={fr}/><Publishing progress={progress} fr={fr}/></div>
      <StoryProgress progress={progress} fr={fr}/>
    </div>
    <p className="sr-only">{fr?'Enregistrez votre point de vue. Empire prépare le montage et les déclinaisons. Après relecture et validation, publiez sur vos réseaux connectés.':'Record your point of view. Empire prepares the edit and adaptations. After review and approval, publish on your connected channels.'}</p>
  </section>
}
