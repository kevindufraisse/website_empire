'use client'
import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, CheckCheck, Circle, CreditCard, Layers, Lightbulb, Link2, Mic, Package, Play, Repeat2, Send, Share2, ShoppingBag, Video } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { SocialIcons } from '@/components/ui/social-icons'
import s from './FormulaScrollStory.module.css'

const STEPS = [
  { fr:'Tout part d’une idée.',en:'It starts with an idea.',accentFr:'La vôtre. Ou une inspiration.',accentEn:'Yours. Or an inspiration.',descFr:'Une idée, un vocal, une question client, un lien… et la veille de votre marché. Vos sujets sont déjà là.',descEn:'An idea, a voice note, a client question, a link… and research from your market. Your topics are already there.',labelFr:'Trouver un sujet',labelEn:'Find a topic',icon:Lightbulb },
  { fr:'Votre idée.',en:'Your idea.',accentFr:'Les formats qui marchent.',accentEn:'Formats that work.',descFr:'Repérez aussi les idées et les formats de vos concurrents. Adaptez-les à votre sujet, votre expérience et votre voix.',descEn:'Discover ideas and formats from your competitors too. Adapt them to your topic, your experience and your voice.',labelFr:'Choisir un format',labelEn:'Pick a format',icon:Layers },
  { fr:'Le cadre est prêt.',en:'The structure is ready.',accentFr:'À vous de parler.',accentEn:'Your turn to speak.',descFr:'Vous enregistrez votre point de vue. Empire prépare le montage et les déclinaisons.',descEn:'Record your point of view. Empire prepares the edit and adaptations.',labelFr:'Enregistrer',labelEn:'Record',icon:Video },
  { fr:'Une prise.',en:'One take.',accentFr:'Chaque réseau a sa version.',accentEn:'Every channel gets its version.',descFr:'La même réponse devient une vidéo courte, un post LinkedIn et une série de messages sur X ou Threads. Vous validez avant diffusion.',descEn:'The same answer becomes a short video, a LinkedIn post and a series of messages on X or Threads. You approve before publishing.',labelFr:'Diffuser',labelEn:'Publish',icon:Share2 },
]
const NETWORKS = ['instagram','tiktok','youtube','linkedin','threads','twitter','facebook'] as const
const NETWORK_NAMES = ['Instagram','TikTok','YouTube','LinkedIn','Threads','X','Facebook']
type SceneProps = { progress:MotionValue<number>;fr:boolean }

function Panel({progress,index,children,className=''}:{progress:MotionValue<number>;index:number;children:ReactNode;className?:string}) {
  const start=index*.25
  const opacity=useTransform(progress,index===0?[0,.18,.24]:index===3?[.745,.79,1]:[start-.005,start+.04,start+.18,start+.245],index===0?[1,1,0]:index===3?[0,1,1]:[0,1,1,0])
  const y=useTransform(progress,[start-.06,start+.03,start+.18,start+.26],[24,0,0,-24])
  return <motion.div className={`${s.panel} ${className}`} style={{opacity,y}} aria-hidden>{children}</motion.div>
}
function ImportPanel({progress,fr}:SceneProps) {
  const idea=fr?'Quels outils pour lancer une boutique en ligne ?':'Which tools do I need to launch an online store?'
  const typedIdea=useTransform(progress,v=>idea.slice(0,Math.round(Math.min(v/.055,1)*idea.length)))
  const sent=useTransform(progress,[.045,.07],[0,1])
  const inspiration=useTransform(progress,[.075,.135],[0,1])
  const rise=useTransform(progress,[.075,.135],[12,0])
  return <Panel progress={progress} index={0}><div className={s.chat}>
    <div className={s.chatHeader}><span>E</span><div><b>Empire</b><small>{fr?'Votre espace de discussion':'Your conversation'}</small></div><i/></div>
    <div className={s.chatBody}>
      <div className={s.sentMessage}><motion.p>{typedIdea}</motion.p><motion.small style={{opacity:sent}}>10:42 <CheckCheck size={12}/></motion.small></div>
      <motion.div className={s.chatReply} style={{opacity:inspiration,y:rise}}><span>{fr?'Idée enregistrée. Voici deux inspirations sur ce sujet.':'Idea saved. Here are two inspirations on this topic.'}</span><div className={s.sourcePost}><div><SocialIcons.linkedin/><b>{fr?'Post de votre marché':'Post from your market'}</b></div><p>{fr?'Lancer sa boutique : le site, le paiement, puis les premières commandes.':'Launch your store: the website, payments, then your first orders.'}</p><small>{fr?'Exemple de veille · LinkedIn':'Research example · LinkedIn'}</small></div></motion.div>
    </div>
    <div className={s.chatComposer}><Link2 size={13}/><span>{fr?'Une idée, un lien, un vocal…':'An idea, a link, a voice note…'}</span><Mic size={13}/><Send size={13}/></div>
  </div></Panel>
}
function FormatOption({progress,index,fr}:SceneProps&{index:number}) {
  const x=useTransform(progress,[.22+index*.025,.38+index*.025],[-100-index*55,0]);const opacity=useTransform(progress,[.23+index*.035,.33+index*.035],[0,1]);const scale=useTransform(progress,[.23,.4],[.8,1])
  return <motion.div className={s.formatOption} style={{left:index===0?'42%':'67%',x,opacity,scale}}>
    {index===0?<><div className={s.portraitCrop}><img src="/formats/reaction.webp" width={230} height={408} alt=""/></div><div className={s.faqQuestion}>{fr?'Comment encaisser mes premières ventes ?':'How do I accept my first payments?'}</div></>:<div className={s.illustrationFlow}><small>{fr?'VOTRE EXEMPLE À L’ÉCRAN':'YOUR EXAMPLE ON SCREEN'}</small>{[[ShoppingBag,fr?'Créer la boutique':'Build the store'],[CreditCard,fr?'Accepter les paiements':'Accept payments'],[Package,fr?'Suivre les commandes':'Track orders']].map(([Icon,label],i)=>{const I=Icon as typeof ShoppingBag;return <div key={i}><I size={22}/><b>{label as string}</b>{i<2&&<ArrowDown size={14}/>}</div>})}</div>}
    <span><b>{index===0?'FAQ':'Illustration'}</b><small>{index===0?(fr?'Vous répondez à une question':'You answer a question'):(fr?'Vous montrez les étapes':'You show the steps')}</small></span></motion.div>
}
function FormatPanel({progress,fr}:SceneProps) {
  const opacity=useTransform(progress,[.35,.43],[0,1])
  return <Panel progress={progress} index={1}><div className={s.panelTitle}><span className={s.sourcePill}><SocialIcons.instagram/>{fr?'Lancer sa boutique':'Launch your store'}<Check size={11}/></span><span>{fr?'Le même sujet, plusieurs façons de l’expliquer':'One topic, several ways to explain it'}</span></div><FormatOption progress={progress} index={0} fr={fr}/><FormatOption progress={progress} index={1} fr={fr}/><motion.div className={s.moreFormats} style={{opacity}}>{[fr?'Classement':'Ranking',fr?'Interview':'Interview',fr?'Conseil':'Tip',fr?'Actualité':'News',fr?'Récit':'Story'].map(f=><span key={f}>{f}</span>)}<b>{fr?'… et bien d’autres':'… and more'}</b></motion.div></Panel>
}
function RecordPanel({progress,fr}:SceneProps) {
  const words=useTransform(progress,[.52,.67],[0,1])
  return <Panel progress={progress} index={2}><div className={s.recordCopy}><span className={s.eyebrow}>{fr?'FORMAT RÉACTION · VOTRE ANGLE':'REACTION FORMAT · YOUR ANGLE'}</span><h3>{fr?'Voici les outils que je recommande pour démarrer.':'Here are the tools I recommend to get started.'}</h3><p>{fr?'Vous commentez le Reel repéré, avec votre propre expérience.':'Comment on the Reel you found, using your own experience.'}</p><div className={s.recordLines}><motion.i style={{scaleX:words}}/><motion.i style={{scaleX:words}}/><motion.i style={{scaleX:words}}/></div><span className={s.recordHint}><Mic size={16}/>{fr?'Parlez comme vous êtes.':'Speak in your own voice.'}</span></div></Panel>
}
function Publication({progress,side,fr}:SceneProps&{side:'left'|'right'}) {
  const compact=useTransform(progress,[.88,.96],[1,.78]);const rise=useTransform(progress,[.88,.96],[0,-24]);
  const opacity=useTransform(progress,[.73,.85],[0,1]);const x=useTransform(progress,[.73,.87],[side==='left'?120:-120,0]);const rotate=useTransform(progress,[.73,.87],[0,side==='left'?-3:3])
  return <motion.div className={`${s.publication} ${side==='left'?s.linkedIn:s.thread}`} style={{opacity,x,rotate,scale:compact,y:rise}}>
    <div className={s.postProfile}><img src="/founders/kevin.jpg" width={28} height={28} alt=""/><div><b>Kevin Dufraisse</b><small>{side==='left'?'LinkedIn':'Threads · X'}</small></div>{side==='left'?<SocialIcons.linkedin/>:<SocialIcons.threads/>}</div>
    <h4>{fr?'Votre boutique, en 3 étapes.':'Your store, in 3 steps.'}</h4>
    {side==='left'?<><p>{fr?'Commencez par une boutique simple et un moyen de paiement.':'Start with a simple store and a way to accept payments.'}</p><p>{fr?'Puis organisez le suivi de vos premières commandes. Voici mon expérience…':'Then organize your first orders. Here is my experience…'}</p><span className={s.postFoot}>{fr?'Votre réponse → un post écrit':'Your answer → a written post'}</span></>:<div className={s.threadLines}>{[fr?'1/ Créez votre boutique.':'1/ Build your store.',fr?'2/ Activez les paiements.':'2/ Enable payments.',fr?'3/ Suivez vos commandes.':'3/ Track your orders.'].map(t=><p key={t}>{t}</p>)}<span className={s.postFoot}>{fr?'3 messages à lire à la suite':'3 messages to read in order'}</span></div>}
  </motion.div>
}
function PublishPanel({progress,fr}:SceneProps) {
  const opacity=useTransform(progress,[.8,.87],[0,1]);const y=useTransform(progress,[.8,.88,.96],[20,0,-68]);const repeatOpacity=useTransform(progress,[.9,.97],[0,1]);const repeatY=useTransform(progress,[.9,.97],[18,0])
  return <Panel progress={progress} index={3}><div className={s.panelTitle}><span><Check size={14}/>{fr?'Votre réponse, adaptée aux réseaux':'Your answer, adapted for each channel'}</span><b>{fr?'Un contenu adapté par réseau':'Adapted for each channel'}</b></div><Publication progress={progress} side="left" fr={fr}/><Publication progress={progress} side="right" fr={fr}/><motion.div className={s.networks} style={{opacity,y}}>{NETWORKS.map((n,i)=>{const Icon=SocialIcons[n];return <span key={n}><Icon/><small>{NETWORK_NAMES[i]}</small></span>})}</motion.div><motion.div className={s.republish} style={{opacity:repeatOpacity,y:repeatY}}><Repeat2 size={21}/><div><b>{fr?'Vos meilleurs contenus repartent.':'Your best content goes out again.'}</b><span>{fr?'Republication automatique, avec votre accord.':'Automatic republishing, with your approval.'}</span></div><span className={s.repeatTimeline}>{fr?'Publié':'Published'}<ArrowRight size={12}/>{fr?'Reprogrammé':'Rescheduled'}<Repeat2 size={12}/></span></motion.div></Panel>
}
// One persistent video connects the four stages; it is never replaced by a new scene.
function SharedVideo({progress,phase,fr}:SceneProps&{phase:number}) {
  const left=useTransform(progress,[0,.18,.29,.44,.55,.69,.8,1],['74%','74%','27%','27%','72%','72%','50%','50%'])
  const width=useTransform(progress,[0,.18,.29,.44,.55,.69,.8],['24%','24%','20%','20%','24%','24%','20%'])
  const top=useTransform(progress,[0,.18,.29,.44,.55,.69,.8],['50%','50%','49%','49%','50%','50%','49%'])
  const compact=useTransform(progress,[.88,.96],[1,.82]);const rise=useTransform(progress,[.88,.96],[0,-50]);const videoY=useTransform(rise,v=>`calc(-50% + ${v}px)`)
  const rotate=useTransform(progress,[0,.18,.29,.44,.55,.69,.8],[2,2,0,0,0,0,0]);const reveal=useTransform(progress,[0,.08,.14],[.3,.3,1]);const recording=useTransform(progress,[.46,.54,.7,.8],[0,1,1,0]);const saved=useTransform(progress,[.64,.68,.71,.76],[0,1,1,0]);const timer=useTransform(progress,v=>`00:${String(Math.round(Math.max(0,Math.min((v-.5)/.15,1))*42)).padStart(2,'0')}`);const meter=useTransform(progress,[.5,.65],[0,1])
  return <motion.div className={s.sharedVideo} style={{left,width,top,rotate,scale:compact,opacity:reveal,x:'-50%',y:videoY}} aria-hidden>
    <img src="/formats/reaction.webp" width={230} height={408} alt=""/><motion.img className={s.recordImage} src="/formats/reaction.webp" width={230} height={408} alt="" style={{opacity:recording}}/>
    <div className={s.clipTop}>{phase===2?<><span className={s.recDot}/> REC <motion.b>{timer}</motion.b></>:<><Play size={11} fill="currentColor"/><span>{phase===0?(fr?'Reel repéré':'Reel found'):phase===1?(fr?'Réaction':'Reaction'):'Reel · Short'}</span>{phase===1&&<Check size={13}/>}</>}</div>
    <div className={s.clipBottom}>{phase===0?(fr?'Les outils pour lancer sa boutique':'Tools to launch your store'):phase===1?<><b>{fr?'Le Reel + votre réaction':'The Reel + your reaction'}</b><small>{fr?'La source en haut. Votre avis en bas.':'Source on top. Your take below.'}</small></>:phase===2?<><div className={s.meter}><motion.i style={{scaleX:meter}}/></div><span className={s.recButton}><i/></span></>:<><b>{fr?'Lancer sa boutique':'Launch your store'}</b><small>{fr?'Votre réponse → une vidéo courte':'Your answer → a short video'}</small></>}</div>
    <motion.span className={s.saved} style={{opacity:saved}}><Check size={17}/>{fr?'Enregistré':'Recorded'}</motion.span>
  </motion.div>
}
export function SourcesStory() {
  const {lang}=useLanguage();const fr=lang==='fr';const {autopilot}=useAutopilot();const ref=useRef<HTMLElement>(null)
  const {scrollYProgress:progress}=useScroll({target:ref,offset:['start start','end end']});const [phase,setPhase]=useState(0)
  useMotionValueEvent(progress,'change',v=>setPhase(Math.min(3,Math.floor((v+.015)*4))))
  const reduced=useReducedMotion()
  if(autopilot)return null
  if(reduced)return <section className={s.reduced} aria-label={fr?'Empire, de l’idée à la republication':'Empire, from idea to republishing'}><span id="formula-format"/><span id="formula-diffusion"/>{STEPS.map((step,i)=><article key={step.en}><span>0{i+1}</span><h2>{fr?step.fr:step.en} {fr?step.accentFr:step.accentEn}</h2><p>{fr?step.descFr:step.descEn}</p><img src={`/formats/${['reaction','reaction','reaction','reaction'][i]}.webp`} alt="" width={160} height={284}/></article>)}</section>
  return <section ref={ref} className={s.story} data-story="studio" data-step={['message','formats','recording','diffusion'][phase]} aria-label={fr?'Empire, de l’idée à la republication':'Empire, from idea to republishing'}>
    <span id="formula-format" className={s.chapterAnchor} style={{top:'23%'}}/><span id="formula-recording" className={s.chapterAnchor} style={{top:'44%'}}/><span id="formula-diffusion" className={s.chapterAnchor} style={{top:'67%'}}/>
    <div className={s.sticky}><div className={s.storyTop}><span>EMPIRE, {fr?'EN ACTION':'IN ACTION'}</span><span>0{phase+1} <i>/ 04</i></span></div>
      <div className={s.headings}>{STEPS.map((step,i)=><Panel key={step.en} progress={progress} index={i}><h2>{fr?step.fr:step.en}<br/><em>{fr?step.accentFr:step.accentEn}</em></h2><p>{fr?step.descFr:step.descEn}</p></Panel>)}</div>
      <div className={s.appFrame}><div className={s.appChrome}><b><span>E</span> Empire</b><span>{fr?'Mon studio':'My studio'} <span className={s.chromeSlash}>/</span> {fr?'Nouveau contenu':'New content'}</span><small><Circle size={6} fill="currentColor"/>{fr?'Démo au scroll':'Scroll demo'}</small></div>
        <div className={s.appBody}><aside className={s.sidebar}><span className={s.sidebarLabel}>{fr?'MON CONTENU':'MY CONTENT'}</span>{STEPS.map((step,i)=><a key={step.en} href={`#${['formula-message','formula-format','formula-recording','formula-diffusion'][i]}`} aria-current={phase===i?'step':undefined} className={phase===i?s.selected:''}><step.icon size={16}/><span>{fr?step.labelFr:step.labelEn}</span>{phase>i&&<Check size={12}/>}</a>)}<div className={s.sidebarBottom}><img src="/founders/kevin.jpg" width={24} height={24} alt=""/><span>Kevin<small>{fr?'Mon espace':'My workspace'}</small></span></div></aside>
        <div className={s.canvas}><ImportPanel progress={progress} fr={fr}/><FormatPanel progress={progress} fr={fr}/><RecordPanel progress={progress} fr={fr}/><PublishPanel progress={progress} fr={fr}/><SharedVideo progress={progress} phase={phase} fr={fr}/></div></div>
        <div className={s.appFooter}><span><Check size={12}/>{fr?'Votre expertise, de l’idée à la republication.':'Your expertise, from idea to republishing.'}</span><span>{fr?'Vous gardez la validation':'You keep approval'} <ArrowRight size={12}/></span></div>
      </div><div className={s.storyBottom}><span>{fr?'Le scroll fait avancer la démo':'Scroll to move through the demo'} <ArrowDown size={13}/></span><div><motion.i style={{scaleX:progress}}/></div><small>{fr?'Exemple illustré':'Illustrated example'}</small></div>
    </div><ol className="sr-only">{STEPS.map(step=><li key={step.en}>{fr?step.descFr:step.descEn}</li>)}</ol>
  </section>
}
