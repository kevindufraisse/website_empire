'use client'
import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, Circle, Layers, Link2, Mic, MousePointer2, Play, Plus, Share2, Video } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { SocialIcons } from '@/components/ui/social-icons'
import s from './FormulaScrollStory.module.css'

const STEPS = [
  { fr:'Un lien vous inspire.',en:'A link inspires you.',accentFr:'Tout commence ici.',accentEn:'It starts here.',descFr:'Un Reel Instagram, un TikTok, une vidéo YouTube. Ajoutez le lien dans Empire.',descEn:'An Instagram Reel, a TikTok, a YouTube video. Add the link to Empire.',labelFr:'Ajouter un lien',labelEn:'Add a link',icon:Link2 },
  { fr:'Le même sujet.',en:'The same topic.',accentFr:'Plusieurs façons de le raconter.',accentEn:'More ways to tell it.',descFr:'Réagissez au Reel. Répondez en FAQ. Illustrez votre idée. Choisissez votre format.',descEn:'React to the Reel. Answer a question. Illustrate your idea. Choose your format.',labelFr:'Choisir un format',labelEn:'Pick a format',icon:Layers },
  { fr:'Le cadre est prêt.',en:'The structure is ready.',accentFr:'À vous de parler.',accentEn:'Your turn to speak.',descFr:'Vous enregistrez votre point de vue. Empire prépare le montage et les déclinaisons.',descEn:'Record your point of view. Empire prepares the edit and adaptations.',labelFr:'Enregistrer',labelEn:'Record',icon:Video },
  { fr:'Une prise.',en:'One take.',accentFr:'Chaque réseau a sa version.',accentEn:'Every channel gets its version.',descFr:'Reels, posts LinkedIn, threads, carrousels… Vous validez avant la diffusion.',descEn:'Reels, LinkedIn posts, threads, carousels… You approve before publishing.',labelFr:'Diffuser',labelEn:'Publish',icon:Share2 },
]
const NETWORKS = ['instagram','tiktok','youtube','linkedin','threads','twitter','facebook'] as const
const NETWORK_NAMES = ['Instagram','TikTok','YouTube','LinkedIn','Threads','X','Facebook']
type SceneProps = { progress:MotionValue<number>;fr:boolean }

function Panel({progress,index,children,className=''}:{progress:MotionValue<number>;index:number;children:ReactNode;className?:string}) {
  const start=index*.25
  const opacity=useTransform(progress,index===0?[0,.18,.26]:index===3?[.69,.77,1]:[start-.06,start+.02,start+.18,start+.26],index===0?[1,1,0]:index===3?[0,1,1]:[0,1,1,0])
  const y=useTransform(progress,[start-.06,start+.03,start+.18,start+.26],[24,0,0,-24])
  return <motion.div className={`${s.panel} ${className}`} style={{opacity,y}} aria-hidden>{children}</motion.div>
}
function ImportPanel({progress,fr}:SceneProps) {
  const url=useTransform(progress,v=>'instagram.com/reel/exemple'.slice(0,Math.round(Math.min(v/.09,1)*26)))
  const imported=useTransform(progress,[.08,.14],[0,1])
  const cursorX=useTransform(progress,[0,.07,.11,.18],[12,120,120,170]);const cursorY=useTransform(progress,[0,.07,.11,.18],[0,45,45,15]);const cursorOpacity=useTransform(progress,[0,.02,.13,.18],[0,1,1,0])
  return <Panel progress={progress} index={0}><div className={s.importCopy}>
    <span className={s.eyebrow}>{fr?'NOUVELLE INSPIRATION':'NEW INSPIRATION'}</span><h3>{fr?'Ce Reel mérite votre réaction.':'This Reel deserves your take.'}</h3>
    <div className={s.sourcePlatforms}><SocialIcons.instagram/><SocialIcons.youtube/><SocialIcons.tiktok/><span>{fr?'Collez un lien':'Paste a link'}</span></div>
    <div className={s.urlField}><Link2 size={15}/><motion.span>{url}</motion.span><i/></div>
    <span className={s.importButton}><Plus size={15}/>{fr?'Ajouter à mes inspirations':'Add to my inspirations'}</span>
    <motion.div className={s.imported} style={{opacity:imported}}><Check size={15}/>{fr?'Reel ajouté. Prêt à être utilisé.':'Reel added. Ready to use.'}</motion.div>
    <motion.div className={s.demoCursor} style={{x:cursorX,y:cursorY,opacity:cursorOpacity}}><MousePointer2 size={23} fill="white"/></motion.div>
  </div></Panel>
}
function FormatOption({progress,index,fr}:SceneProps&{index:number}) {
  const x=useTransform(progress,[.22+index*.025,.38+index*.025],[-100-index*55,0]);const opacity=useTransform(progress,[.23+index*.035,.33+index*.035],[0,1]);const scale=useTransform(progress,[.23,.4],[.8,1])
  return <motion.div className={s.formatOption} style={{left:index===0?'42%':'67%',x,opacity,scale}}><img src={`/formats/${index===0?'faq':'auto-edit'}.webp`} width={230} height={408} alt=""/><span><b>{index===0?'FAQ':'Illustration'}</b><small>{index===0?(fr?'Répondre à une question':'Answer a question'):(fr?'Montrer ce que vous racontez':'Show what you mean')}</small></span></motion.div>
}
function FormatPanel({progress,fr}:SceneProps) {
  const opacity=useTransform(progress,[.35,.43],[0,1])
  return <Panel progress={progress} index={1}><div className={s.panelTitle}><span className={s.sourcePill}><SocialIcons.instagram/>{fr?'Votre Reel importé':'Your imported Reel'}<Check size={11}/></span><span>{fr?'Choisir comment le raconter':'Choose how to tell it'}</span></div><FormatOption progress={progress} index={0} fr={fr}/><FormatOption progress={progress} index={1} fr={fr}/><motion.div className={s.moreFormats} style={{opacity}}>{['Tier list',fr?'Citation':'Quote','Podcast',fr?'Actualité':'News','Storytelling'].map(f=><span key={f}>{f}</span>)}<b>{fr?'… et bien d’autres':'… and more'}</b></motion.div></Panel>
}
function RecordPanel({progress,fr}:SceneProps) {
  const words=useTransform(progress,[.52,.67],[0,1])
  return <Panel progress={progress} index={2}><div className={s.recordCopy}><span className={s.eyebrow}>{fr?'FORMAT RÉACTION · VOTRE ANGLE':'REACTION FORMAT · YOUR ANGLE'}</span><h3>{fr?'Ce que ce Reel ne vous dit pas…':'What this Reel doesn’t tell you…'}</h3><p>{fr?'Votre avis. Votre expérience. Votre voix.':'Your opinion. Your experience. Your voice.'}</p><div className={s.recordLines}><motion.i style={{scaleX:words}}/><motion.i style={{scaleX:words}}/><motion.i style={{scaleX:words}}/></div><span className={s.recordHint}><Mic size={16}/>{fr?'Parlez comme vous êtes.':'Speak in your own voice.'}</span></div></Panel>
}
function Publication({progress,side,fr}:SceneProps&{side:'left'|'right'}) {
  const opacity=useTransform(progress,[.73,.85],[0,1]);const x=useTransform(progress,[.73,.87],[side==='left'?120:-120,0]);const rotate=useTransform(progress,[.73,.87],[0,side==='left'?-3:3])
  return <motion.div className={`${s.publication} ${side==='left'?s.linkedIn:s.thread}`} style={{opacity,x,rotate}}>
    <div className={s.postProfile}><img src="/founders/kevin.jpg" width={28} height={28} alt=""/><div><b>Kevin Dufraisse</b><small>{side==='left'?'LinkedIn':'Threads · X'}</small></div>{side==='left'?<SocialIcons.linkedin/>:<SocialIcons.threads/>}</div>
    <h4>{fr?'Publier plus ne suffit pas.':'Posting more isn’t enough.'}</h4>
    {side==='left'?<><p>{fr?'Ce qui change tout, c’est le point de vue que vous apportez.':'What changes everything is the point of view you bring.'}</p><p>{fr?'Voilà ce que j’aurais aimé savoir avant de commencer…':'Here’s what I wish I’d known before I started…'}</p><span className={s.postFoot}>{fr?'Un post adapté à LinkedIn':'Adapted for LinkedIn'}</span></>:<div className={s.threadLines}>{[fr?'1. Partez d’une vraie idée.':'1. Start with a real idea.',fr?'2. Apportez votre expérience.':'2. Add your experience.',fr?'3. Choisissez le bon format.':'3. Pick the right format.'].map(t=><p key={t}>{t}</p>)}<span className={s.postFoot}>{fr?'Une idée, un fil de discussion':'One idea, one thread'}</span></div>}
  </motion.div>
}
function PublishPanel({progress,fr}:SceneProps) {
  const opacity=useTransform(progress,[.84,.94],[0,1]);const y=useTransform(progress,[.83,.94],[20,0])
  return <Panel progress={progress} index={3}><div className={s.panelTitle}><span><Check size={14}/>{fr?'Déclinaisons prêtes à valider':'Adaptations ready to approve'}</span><b>{fr?'Un contenu adapté par réseau':'Adapted for each channel'}</b></div><Publication progress={progress} side="left" fr={fr}/><Publication progress={progress} side="right" fr={fr}/><motion.div className={s.networks} style={{opacity,y}}>{NETWORKS.map((n,i)=>{const Icon=SocialIcons[n];return <span key={n}><Icon/><small>{NETWORK_NAMES[i]}</small></span>})}</motion.div></Panel>
}
// One persistent video connects the four stages; it is never replaced by a new scene.
function SharedVideo({progress,phase,fr}:SceneProps&{phase:number}) {
  const left=useTransform(progress,[0,.18,.29,.44,.55,.69,.8,1],['74%','74%','27%','27%','72%','72%','50%','50%'])
  const width=useTransform(progress,[0,.18,.29,.44,.55,.69,.8],['24%','24%','20%','20%','24%','24%','20%'])
  const top=useTransform(progress,[0,.18,.29,.44,.55,.69,.8],['50%','50%','49%','49%','50%','50%','49%'])
  const rotate=useTransform(progress,[0,.18,.29,.44,.55,.69,.8],[2,2,0,0,0,0,0]);const reveal=useTransform(progress,[0,.08,.14],[.3,.3,1]);const recording=useTransform(progress,[.46,.54,.7,.8],[0,1,1,0]);const saved=useTransform(progress,[.64,.68,.71,.76],[0,1,1,0]);const timer=useTransform(progress,v=>`00:${String(Math.round(Math.max(0,Math.min((v-.5)/.15,1))*42)).padStart(2,'0')}`);const meter=useTransform(progress,[.5,.65],[0,1])
  return <motion.div className={s.sharedVideo} style={{left,width,top,rotate,opacity:reveal,x:'-50%',y:'-50%'}} aria-hidden>
    <img src="/formats/reaction.webp" width={230} height={408} alt=""/><motion.img className={s.recordImage} src="/formats/earphones.webp" width={230} height={408} alt="" style={{opacity:recording}}/>
    <div className={s.clipTop}>{phase===2?<><span className={s.recDot}/> REC <motion.b>{timer}</motion.b></>:<><Play size={11} fill="currentColor"/><span>{phase===0?(fr?'Reel importé':'Imported Reel'):phase===1?(fr?'Réaction':'Reaction'):'Reel · Short'}</span>{phase===1&&<Check size={13}/>}</>}</div>
    <div className={s.clipBottom}>{phase===0?(fr?'L’inspiration de départ':'Your starting point'):phase===1?<><b>{fr?'Réaction à ce Reel':'React to this Reel'}</b><small>{fr?'Le contenu + votre point de vue':'The content + your point of view'}</small></>:phase===2?<><div className={s.meter}><motion.i style={{scaleX:meter}}/></div><span className={s.recButton}><i/></span></>:<><b>{fr?'Votre vidéo montée':'Your edited video'}</b><small>{fr?'Sous-titres · format vertical':'Captions · vertical format'}</small></>}</div>
    <motion.span className={s.saved} style={{opacity:saved}}><Check size={17}/>{fr?'Enregistré':'Recorded'}</motion.span>
  </motion.div>
}
export function SourcesStory() {
  const {lang}=useLanguage();const fr=lang==='fr';const {autopilot}=useAutopilot();const ref=useRef<HTMLElement>(null)
  const {scrollYProgress:progress}=useScroll({target:ref,offset:['start start','end end']});const [phase,setPhase]=useState(0)
  useMotionValueEvent(progress,'change',v=>setPhase(Math.min(3,Math.floor((v+.015)*4))))
  const reduced=useReducedMotion()
  if(autopilot)return null
  if(reduced)return <section className={s.reduced} aria-label={fr?'Empire, du lien à la publication':'Empire, from link to publication'}><span id="formula-format"/><span id="formula-diffusion"/>{STEPS.map((step,i)=><article key={step.en}><span>0{i+1}</span><h2>{fr?step.fr:step.en} {fr?step.accentFr:step.accentEn}</h2><p>{fr?step.descFr:step.descEn}</p><img src={`/formats/${['reaction','faq','earphones','captions'][i]}.webp`} alt="" width={160} height={284}/></article>)}</section>
  return <section ref={ref} className={s.story} data-story="studio" data-step={['message','formats','recording','diffusion'][phase]} aria-label={fr?'Empire, du lien à la publication':'Empire, from link to publication'}>
    <span id="formula-format" className={s.chapterAnchor} style={{top:'23%'}}/><span id="formula-recording" className={s.chapterAnchor} style={{top:'44%'}}/><span id="formula-diffusion" className={s.chapterAnchor} style={{top:'67%'}}/>
    <div className={s.sticky}><div className={s.storyTop}><span>EMPIRE, {fr?'EN ACTION':'IN ACTION'}</span><span>0{phase+1} <i>/ 04</i></span></div>
      <div className={s.headings}>{STEPS.map((step,i)=><Panel key={step.en} progress={progress} index={i}><h2>{fr?step.fr:step.en}<br/><em>{fr?step.accentFr:step.accentEn}</em></h2><p>{fr?step.descFr:step.descEn}</p></Panel>)}</div>
      <div className={s.appFrame}><div className={s.appChrome}><b><span>E</span> Empire</b><span>{fr?'Mon studio':'My studio'} <span className={s.chromeSlash}>/</span> {fr?'Nouveau contenu':'New content'}</span><small><Circle size={6} fill="currentColor"/>{fr?'Démo au scroll':'Scroll demo'}</small></div>
        <div className={s.appBody}><aside className={s.sidebar}><span className={s.sidebarLabel}>{fr?'MON CONTENU':'MY CONTENT'}</span>{STEPS.map((step,i)=><a key={step.en} href={`#${['formula-message','formula-format','formula-recording','formula-diffusion'][i]}`} aria-current={phase===i?'step':undefined} className={phase===i?s.selected:''}><step.icon size={16}/><span>{fr?step.labelFr:step.labelEn}</span>{phase>i&&<Check size={12}/>}</a>)}<div className={s.sidebarBottom}><img src="/founders/kevin.jpg" width={24} height={24} alt=""/><span>Kevin<small>{fr?'Mon espace':'My workspace'}</small></span></div></aside>
        <div className={s.canvas}><ImportPanel progress={progress} fr={fr}/><FormatPanel progress={progress} fr={fr}/><RecordPanel progress={progress} fr={fr}/><PublishPanel progress={progress} fr={fr}/><SharedVideo progress={progress} phase={phase} fr={fr}/></div></div>
        <div className={s.appFooter}><span><Check size={12}/>{fr?'Votre expertise, du premier lien au dernier post.':'Your expertise, from the first link to the last post.'}</span><span>{fr?'Vous gardez la validation':'You keep approval'} <ArrowRight size={12}/></span></div>
      </div><div className={s.storyBottom}><span>{fr?'Le scroll fait avancer la démo':'Scroll to move through the demo'} <ArrowDown size={13}/></span><div><motion.i style={{scaleX:progress}}/></div><small>{fr?'Exemple illustré':'Illustrated example'}</small></div>
    </div><ol className="sr-only">{STEPS.map(step=><li key={step.en}>{fr?step.descFr:step.descEn}</li>)}</ol>
  </section>
}
