'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, Check, CheckCheck, Clock3, Headphones, Mic, Pause, Play, Repeat2, Scissors, ShieldCheck, Video } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { SocialIcons } from '@/components/ui/social-icons'
import s from './MobileAppSection.module.css'

type Copy = [string, string]
const STEPS: { label: Copy; title: Copy; description: Copy }[] = [
  { label: ['Vous parlez', 'You speak'], title: ['Votre studio tient dans votre poche.', 'Your studio fits in your pocket.'], description: ['Une question à l’écran. Votre réponse, en vidéo ou en vocal. Même entre deux rendez-vous.', 'A question on screen. Your answer, on video or as a voice note. Even between meetings.'] },
  { label: ['Empire prépare', 'Empire prepares'], title: ['Vous posez le téléphone. La production continue.', 'Put your phone down. Production keeps going.'], description: ['Montage, sous-titres, textes adaptés aux réseaux. Puis une relecture humaine avant votre validation.', 'Editing, captions and text adapted to each channel. Then a human review before your approval.'] },
  { label: ['Vous validez', 'You approve'], title: ['Vous rouvrez l’app. Tout est prêt à valider.', 'Open the app. Everything is ready to approve.'], description: ['Vous gardez le dernier mot. Les contenus validés rejoignent le calendrier, puis vos réseaux.', 'You have the final say. Approved content moves to your calendar, then your channels.'] },
]
const OUTPUTS = [
  { image: 'reaction', label: ['Reel · Réaction', 'Reel · Reaction'], channel: 'instagram', day: ['LUN', 'MON'] },
  { image: 'reaction', label: ['Post · Votre point de vue', 'Post · Your perspective'], channel: 'linkedin', day: ['MER', 'WED'] },
  { image: 'reaction', label: ['3 messages · Vos conseils', '3 messages · Your advice'], channel: 'threads', day: ['VEN', 'FRI'] },
] as const

function Layer({ progress, index, children, className = '' }: { progress: MotionValue<number>; index: number; children: React.ReactNode; className?: string }) {
  const opacity = useTransform(progress, index === 0 ? [0, .24, .30] : index === 1 ? [.31, .37, .58, .64] : [.65, .72, 1], index === 0 ? [1, 1, 0] : index === 1 ? [0, 1, 1, 0] : [0, 1, 1])
  const y = useTransform(progress, index === 0 ? [0, .24, .30] : index === 1 ? [.31, .37, .58, .64] : [.65, .72, 1], index === 0 ? [0, 0, -16] : index === 1 ? [16, 0, 0, -16] : [16, 0, 0])
  return <motion.div className={`${s.layer} ${className}`} style={{ opacity, y }} aria-hidden>{children}</motion.div>
}

function CalendarItem({ progress, index, fr }: { progress: MotionValue<number>; index: number; fr: boolean }) {
  const x = useTransform(progress, [.68 + index * .045, .80 + index * .045], [-65, 0])
  const opacity = useTransform(progress, [.68 + index * .045, .76 + index * .045], [0, 1])
  const entry = OUTPUTS[index]; const Icon = SocialIcons[entry.channel]
  return <motion.div className={s.calendarItem} style={{ x, opacity }}><span>{entry.day[fr ? 0 : 1]}</span><img src={`/formats/${entry.image}.webp`} alt="" width={42} height={54}/><div><b>{entry.label[fr ? 0 : 1]}</b><small><Icon/>{fr ? 'Programmé' : 'Scheduled'}<Check size={11}/></small></div></motion.div>
}

function Phone({ progress, fr }: { progress: MotionValue<number>; fr: boolean }) {
  const timer = useTransform(progress, p => `00:${String(Math.round(Math.min(p / .24, 1) * 42)).padStart(2, '0')}`)
  const playback = useTransform(progress, [.34, .55], [0, 1])
  const reviewed = useTransform(progress, [.48, .58], [0, 1])
  const approved = useTransform(progress, [.87, .93], [0, 1])
  return <div className={s.phone} aria-hidden><div className={s.island}/><div className={s.phoneStatus}><span>9:41</span><span>● ▰</span></div>
    <Layer progress={progress} index={0} className={s.recordScreen}>
      <img className={s.recordPhoto} src="/formats/reaction.webp" width={300} height={534} alt=""/>
      <div className={s.phoneTop}><span className={s.appWordmark}>E</span><b>Empire</b><Headphones size={16}/></div>
      <div className={s.formatTabs}><b>{fr ? 'Réaction' : 'Reaction'}</b><span>FAQ</span><span>Interview</span><span>{fr ? 'Dictée' : 'Voice'}</span></div>
      <div className={s.question}><small>{fr ? 'VOTRE ANGLE' : 'YOUR ANGLE'}</small><b>{fr ? '« Quels outils pour lancer une boutique en ligne ? »' : '“Which tools do I need to launch an online store?”'}</b></div>
      <div className={s.recordControls}><div className={s.wave}>{[4,8,5,12,17,9,20,13,7,16,10,6,12,5,9].map((h,i)=><motion.i key={i} style={{height:h}} animate={{scaleY:[.5,1,.5]}} transition={{duration:.7+i*.04,repeat:Infinity}}/>)}</div><div className={s.recordRow}><Mic size={16}/><span className={s.recordButton}><Pause size={18} fill="currentColor"/></span><motion.b>{timer}</motion.b></div></div>
    </Layer>
    <Layer progress={progress} index={1} className={s.workScreen}>
      <div className={s.screenHeading}><span className={s.appWordmark}>E</span><b>{fr ? 'En préparation' : 'In production'}</b></div>
      <div className={s.editPreview}><img src="/formats/reaction.webp" width={230} height={408} alt=""/><span>{fr ? 'LANCER SA BOUTIQUE' : 'LAUNCH YOUR STORE'}</span><Play size={18} fill="currentColor"/></div>
      <div className={s.editTimeline}><div>{Array.from({length:7},(_,i)=><img key={i} src="/formats/reaction.webp" alt="" width={30} height={35}/>)}</div><motion.i style={{scaleX:playback}}/></div>
      <div className={s.phoneCheck}><Scissors size={14}/>{fr ? 'Montage & sous-titres' : 'Editing & captions'}<Check size={14}/></div>
      <motion.div className={s.humanCheck} style={{opacity:reviewed}}><ShieldCheck size={20}/><div><b>{fr ? 'Relu par un humain' : 'Human-reviewed'}</b><small>{fr ? 'Prêt pour votre validation' : 'Ready for your approval'}</small></div></motion.div>
    </Layer>
    <Layer progress={progress} index={2} className={s.approveScreen}>
      <div className={s.screenHeading}><span className={s.appWordmark}>E</span><b>{fr ? 'À valider' : 'For approval'}</b></div>
      <h3>{fr ? 'Votre voix. Plusieurs contenus.' : 'Your voice. Multiple posts.'}</h3>
      {OUTPUTS.map(item=><div className={s.approvalItem} key={item.channel}><img src={`/formats/${item.image}.webp`} alt="" width={42} height={62}/><div><b>{item.label[fr ? 0 : 1]}</b><small><ShieldCheck size={10}/>{fr ? 'Relu par l’équipe' : 'Team-reviewed'}</small></div><Check size={12}/></div>)}
      <span className={s.approveButton}><CheckCheck size={15}/>{fr ? 'Valider et programmer' : 'Approve & schedule'}</span>
      <motion.div className={s.approved} style={{opacity:approved}}><Check size={14}/>{fr ? 'Ajoutés au calendrier' : 'Added to calendar'}</motion.div>
    </Layer>
    <div className={s.homeIndicator}/>
  </div>
}

function AppWalkthrough({ fr }: { fr: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: progress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [phase, setPhase] = useState(0)
  useMotionValueEvent(progress, 'change', p => setPhase(p < .31 ? 0 : p < .65 ? 1 : 2))
  const recycling = useTransform(progress, [.88, .97], [0, 1])
  const t = (copy: Copy) => copy[fr ? 0 : 1]
  return <section ref={ref} className={s.story} data-story="mobile-app" aria-label={fr ? 'L’application Empire et le temps gagné' : 'The Empire app and time saved'}>
    <span id="app-production" className={s.anchor} style={{top:'29%'}}/><span id="app-validation" className={s.anchor} style={{top:'54%'}}/>
    <div className={s.sticky}>
      <div className={s.topline}><span><Clock3 size={13}/>{fr ? 'TEMPS · L’APPLICATION EMPIRE' : 'TIME · THE EMPIRE APP'}</span><span>0{phase+1} / 03</span></div>
      <div className={s.headings}>{STEPS.map((step,i)=><Layer key={i} progress={progress} index={i}><h2>{t(step.title)}</h2><p>{t(step.description)}</p></Layer>)}</div>
      <div className={s.stage}>
        <div className={s.timeCopy}><p>{fr ? 'VOTRE TEMPS, CHAQUE SEMAINE' : 'YOUR TIME, EACH WEEK'}</p><div className={s.timeNumber}>20 <span>min</span><em>→</em>1 <span>h</span></div><span className={s.timeQualifier}>{fr ? 'Par semaine, selon votre volume.' : 'Per week, depending on your volume.'}</span><div className={s.yourPart}><span>{fr ? 'VOUS' : 'YOU'}</span><b>{fr ? 'Les idées. La voix. Le dernier mot.' : 'The ideas. The voice. The final say.'}</b></div><div className={s.empirePart}><span>EMPIRE</span><b>{fr ? 'La préparation. La production. La diffusion.' : 'Preparation. Production. Publishing.'}</b></div></div>
        <Phone progress={progress} fr={fr}/>
        <div className={s.sideStage}>
          <Layer progress={progress} index={0}><div className={s.panelKicker}>{fr ? 'QUELQUES MINUTES POUR CRÉER' : 'A FEW MINUTES TO CREATE'}</div><div className={s.recordOption}><Video size={23}/><div><b>{fr ? 'Tous vos formats' : 'All your formats'}</b><p>{fr ? 'Réaction, FAQ, tier list, citation… Le cadre vous guide.' : 'Reaction, Q&A, tier list, quote… The format guides you.'}</p></div></div><div className={s.voiceCard}><Mic size={22}/><b>{fr ? 'Pas envie de vous filmer ?' : 'Don’t feel like filming?'}</b><p>{fr ? 'Dictez votre idée. Sans caméra. Un vocal Telegram fonctionne aussi.' : 'Dictate your idea. No camera. A Telegram voice note works too.'}</p><div className={s.voiceMessage}><Play size={12} fill="currentColor"/><span>{Array.from({length:22},(_,i)=><i key={i} style={{height:5+(i*7%16)}}/>)}</span><small>0:42</small></div></div></Layer>
          <Layer progress={progress} index={1}><div className={s.panelKicker}>{fr ? 'EMPIRE PREND LE RELAIS' : 'EMPIRE TAKES OVER'}</div><div className={s.productionList}>{[[Scissors,fr?'Montage & sous-titres':'Editing & captions',fr?'Votre prise devient un contenu.':'Your recording becomes content.'],[Mic,fr?'Textes à votre voix':'Copy in your voice',fr?'Un texte adapté à chaque réseau.':'Copy adapted to each channel.'],[ShieldCheck,fr?'Relecture humaine':'Human review',fr?'Une équipe vérifie avant vous.':'A team checks it before you.']].map(([Icon,title,desc],i)=>{const I=Icon as typeof Scissors;return <div key={i}><I size={22}/><span><b>{title as string}</b><small>{desc as string}</small></span><Check size={16}/></div>})}</div><p className={s.productionNote}>{fr ? 'Vous n’avez pas à relancer un outil pour chaque étape.' : 'You don’t have to open another tool for every step.'}</p></Layer>
          <Layer progress={progress} index={2}><div className={s.calendarHeader}><span>{fr ? 'VOTRE CALENDRIER' : 'YOUR CALENDAR'}</span><b>{fr ? 'Après votre validation' : 'After your approval'}</b></div><div className={s.weekDays}>{(fr?['L','M','M','J','V','S','D']:['M','T','W','T','F','S','S']).map((d,i)=><span key={i} className={i===0||i===2||i===4?s.dayActive:''}>{d}</span>)}</div>{OUTPUTS.map((_,i)=><CalendarItem key={i} index={i} progress={progress} fr={fr}/>)}<motion.div className={s.recycle} style={{opacity:recycling}}><Repeat2 size={20}/><div><b>{fr ? 'Les meilleurs repartent.' : 'The best go out again.'}</b><small>{fr ? 'Republication, avec votre accord.' : 'Republishing, with your approval.'}</small></div></motion.div></Layer>
        </div>
      </div>
      <div className={s.bottom}><nav aria-label={fr ? 'Étapes dans l’application' : 'App workflow'}>{STEPS.map((step,i)=><a key={i} href={`#${['formula-time','app-production','app-validation'][i]}`} aria-current={phase===i?'step':undefined}><span>0{i+1}</span>{t(step.label)}</a>)}</nav><span className={s.scrollCue}><ArrowDown size={12}/>{fr ? 'Déroulez la suite' : 'Scroll to continue'}</span><small>{fr ? 'Parcours illustré' : 'Illustrated workflow'}</small></div>
    </div>
    <ol className="sr-only">{STEPS.map((step,i)=><li key={i}>{t(step.title)} {t(step.description)}</li>)}</ol>
  </section>
}

export default function MobileAppSection() {
  const { lang } = useLanguage(); const { autopilot } = useAutopilot(); const reduced = useReducedMotion(); const fr = lang === 'fr'
  if (autopilot) return null
  if (reduced) return <section className={s.reduced}><p>{fr ? 'L’APPLICATION EMPIRE · 20 MIN À 1 H / SEMAINE' : 'THE EMPIRE APP · 20 MIN TO 1 H / WEEK'}</p><div>{STEPS.map((step,i)=><article key={i}><img src={`/formats/${['earphones','captions','faq'][i]}.webp`} alt="" width={110} height={196}/><h2>{step.title[fr?0:1]}</h2><p>{step.description[fr?0:1]}</p></article>)}</div><p>{fr ? 'Selon votre volume. Réaction, FAQ, tier list, citation, interview ou dictée sans caméra. Republication avec votre accord.' : 'Depending on volume. Reaction, Q&A, tier list, quote, interview or voice-only. Republishing with your approval.'}</p></section>
  return <AppWalkthrough fr={fr}/>
}
