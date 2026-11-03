'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowRight, BatteryFull, CalendarDays, Check, ChevronLeft, ChevronRight, Copy, Link2, Library, PlusSquare, Signal, UserRound, Volume2, Wifi, Sparkles, Mic, Video, MessageSquare, LayoutGrid, Search, Bell, MoreHorizontal, MousePointer2 } from 'lucide-react'
import s from './CloneAppStory.module.css'
import PreviewVideo from './PreviewVideo'

const SOURCE = '/formats/clone-avant-apres.jpg'
const VIDEO = '/formats/clone-avant-apres.mp4'
const FACE = '/founders/kevin.jpg'
const URL = 'instagram.com/reel/exemple'
const STEPS = ['Votre application', 'Collez un lien', 'Empire le clone', 'Votre vidéo']
const clamp = (v: number) => Math.max(0, Math.min(1, v))
type Progress = MotionValue<number>

function Clip({ after = false, video = false, p }: { after?: boolean; video?: boolean; p?: Progress }) {
 return <div className={`${s.clip} ${after ? s.after : ''}`}>
  {video?<PreviewVideo src={VIDEO} poster={SOURCE} label={after?'Exemple existant : le Reel cloné avec Kevin':'Reel original de la démonstration'}/>:<img src={SOURCE} alt={after?'Kevin dans la version clonée':'Reel original : un entrepreneur au balcon'}/>}
 </div>
}
function ImportScreen({ p }: { p: Progress }) {
  const typed = useTransform(p, v => URL.slice(0, Math.ceil(clamp((v - .015) / .09) * URL.length)))
  const preview = useTransform(p, [.13, .17], [0, 1])
  const tap = useTransform(p, [.22, .235, .255], [0, 1, 0])
  return <div className={s.importScreen}>
    <div className={s.inputLabel}><Link2/>Lien de la vidéo</div>
    <div className={s.urlField}><motion.span>{typed}</motion.span><Copy size={15}/></div>
    <p className={s.supported}>Instagram · TikTok · YouTube Shorts</p>
    <motion.div className={s.imported} style={{ opacity: preview }}>
      <div className={s.sourcePreview}><Clip/><span>REEL ORIGINAL</span><b>00:03</b></div>
      <div className={s.sourceMeta}><span>Se dire CEO quand on travaille seul.</span><Check size={14}/></div>
    </motion.div>
    <div className={s.identity}><img src={FACE} alt="Kevin"/><div><b>Kevin Dufraisse</b><small>Mon visage et ma voix</small></div><span><Check size={12}/></span></div>
    <div className={s.primary}>Préparer le montage <ArrowRight size={16}/><motion.i style={{ opacity: tap }}/></div>
  </div>
}
function ProcessingScreen({ p }: { p: Progress }) {
  const percentage = useTransform(p, v => `${Math.round(clamp((v - .32) / .31) * 100)} %`)
  const scaleX = useTransform(p, [.32, .63], [0, 1])
  return <div className={s.processing}>
    <div className={s.transfer}><div><Clip/></div><span><Sparkles size={22}/></span><img src={FACE} alt="Votre visage"/></div>
    <h3>Votre clone prend vie.</h3><p>Le même Reel.<br/>Votre visage. Votre voix.</p>
    <div className={s.progressLabel}><span>Création de la vidéo</span><motion.b>{percentage}</motion.b></div><div className={s.progressTrack}><motion.i style={{ scaleX }}/></div>
    <div className={s.taskList}>{['Vidéo récupérée', 'Voix appliquée', 'Visage intégré', 'Montage assemblé'].map((label, i) => <Task p={p} key={label} index={i} label={label}/>)}</div>
    <small>Vous pouvez quitter cet écran.<br/>On vous prévient quand c’est prêt.</small>
  </div>
}
function Task({ p, index, label }: { p: Progress; index: number; label: string }) {
  const opacity = useTransform(p, [.33 + index * .075, .35 + index * .075], [.22, 1])
  return <motion.div style={{ opacity }}><span><Check size={12}/></span>{label}</motion.div>
}
function ResultScreen({ p }: { p: Progress }) {
  const reveal = useTransform(p, [.69, .85], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])
  const left = useTransform(p, [.69, .85], ['0%', '100%'])
  const line = useTransform(p, [.685, .70, .845, .86], [0, 1, 1, 0])
  const ready = useTransform(p, [.85, .89], [0, 1])
  return <div className={s.resultScreen}>
    <div className={s.resultHeader}><span><Check size={12}/>Vidéo prête</span><small>Mes vidéos</small></div>
    <div className={s.resultVideo}><Clip/><motion.div className={s.resultAfter} style={{ clipPath: reveal }}><Clip after video p={p}/></motion.div><motion.i className={s.wipe} style={{ left, opacity: line }}/><motion.span className={s.resultBadge} style={{ opacity: ready }}><img src={FACE} alt=""/>Votre version</motion.span><span className={s.audio}><Volume2 size={13}/>Voix de Kevin</span></div>
    <div className={s.resultTitle}><b>Votre Reel, avec vous.</b><span>9:16 · Extrait en boucle · Contenu IA</span></div>
    <div className={s.primary}>Vérifier et publier <ArrowRight size={16}/></div>
  </div>
}
function HomeScreen({ onClone, p }: { onClone: () => void; p: Progress }) {
 const tap=useTransform(p,[.04,.08,.12,.15],[0,1,1,0])
 const tapX=useTransform(p,[.04,.10],[24,0])
 const tapY=useTransform(p,[.04,.10],[30,0])
 const pressed=useTransform(p,[.10,.12,.14],[1,.92,1])
 return <div className={s.homeScreen}><div className={s.homeWelcome}><span>VOTRE STUDIO, PARTOUT.</span><h3>Bonjour Kevin.</h3><p>Une idée ? Prenez la parole.</p></div><div className={s.dictation}><span><img src="/app-illustrations/bd-dictee.webp" alt=""/></span><div><b>Dicter une idée</b><small>Vos idées deviennent du contenu.</small></div><ArrowRight/></div><div className={s.homeSectionTitle}><b>Créer un contenu</b><span>4 formats</span></div><div className={s.homeFormats}>{[['Réaction','/app-illustrations/bd-reaction.webp'],['Tier list','/app-illustrations/bd-tierlist.webp'],['FAQ','/app-illustrations/bd-faq.webp'],['Cloner','/app-illustrations/bd-clone.webp']].map(([label,img],i)=>{const content=<><img src={img} alt=""/><span>{label}<ArrowRight/></span>{i===3&&<i>Essayer</i>}</>;return i===3?<motion.button key={label} onClick={onClone} className={s.cloneTile} style={{scale:pressed}} aria-label="Ouvrir le clonage">{content}<motion.span className={s.cloneTap} style={{opacity:tap,x:tapX,y:tapY}}><MousePointer2 fill="white"/><i/></motion.span></motion.button>:<a key={label} href={['#formula-reaction','#formula-tierlist','#formula-faq'][i]} aria-label={`Voir le format ${label}`}>{content}</a>})}</div><div className={s.homeSectionTitle}><b>Prêts à filmer</b><span>3 idées</span></div><div className={s.readyIdea}><MessageSquare/><div><b>Quels créateurs business suivre ?</b><small>Depuis vos messages · Tier list</small></div><ChevronRight/></div></div>
}
function Workspace({ phase }: { phase: number }) {
 return <div className={s.workspace}><div className={s.windowTop}><span><i/><i/><i/></span><div>app.empire-internet.com</div><MoreHorizontal size={15}/></div><div className={s.workspaceBody}><aside><h3><span className={s.appIcon}>E</span>Empire</h3><small>VOTRE ESPACE</small>{[[LayoutGrid,'Accueil'],[Video,'Studio'],[MessageSquare,'Mes idées'],[CalendarDays,'Calendrier'],[Library,'Mes vidéos']].map(([Icon,label],i)=>{const I=Icon as typeof Video;return <div className={(phase===0?i===0:i===1)?s.workspaceActive:''} key={String(label)}><I/>{String(label)}</div>})}<span className={s.workspaceAccount}><img src={FACE} alt=""/><b>Kevin Dufraisse<small>Espace personnel</small></b></span></aside><div className={s.workspaceMain}><header><span>{phase===0?'Accueil':'Studio de création'}</span><div><Search/><Bell/><img src={FACE} alt="Kevin Dufraisse"/></div></header><div className={s.workspaceGreeting}><small>VOTRE ESPACE DE CRÉATION</small><h3>Vos idées ont de l’avenir.</h3><p>Le studio, les contenus et la diffusion. Au même endroit.</p></div><div className={s.workspaceStats}><span><b>12</b>Idées à développer</span><span><b>8</b>Contenus prêts</span><span><b>7</b>Réseaux connectés</span></div><div className={s.workspaceSection}><b>Reprendre votre création</b><span>Tout voir →</span></div><div className={s.workspaceCards}><article><img src="/app-illustrations/bd-reaction.webp" alt="Illustration du format réaction dans Empire"/><span>Réaction<small>Les conseils business d’Alex Hormozi</small></span></article><article><img src="/app-illustrations/bd-faq.webp" alt="Illustration du format FAQ dans Empire"/><span>FAQ<small>Qui suivre pour progresser ?</small></span></article><article><img src="/app-illustrations/bd-blur.webp" alt="Illustration du format Devine dans Empire"/><span>Devine<small>Les créateurs business</small></span></article></div><div className={s.workspaceActivity}><Check size={13}/><span>{phase===0?'Votre dernière idée a été ajoutée au studio.':phase===1?'Un lien ajouté à votre espace de création.':phase===2?'Votre vidéo se prépare. Vos contenus restent au même endroit.':'Votre nouvelle vidéo vous attend dans Mes vidéos.'}</span></div></div></div><span className={s.workspaceCaption}>Aperçu illustré de l’espace Empire</span></div>
}
function IPhone({ p, homeP, phase, onHome, onClone }: { p: Progress; homeP: Progress; phase: number; onHome: () => void; onClone: () => void }) {
  return <div className={s.device} aria-label="Application Empire dans un cadre inspiré de l’iPhone 18 Pro">
    <i className={s.silent}/><i className={s.volumeUp}/><i className={s.volumeDown}/><i className={s.power}/><i className={s.cameraButton}/>
    <div className={s.screen}>
      <div className={s.status}><b>9:41</b><span className={s.island}><i/></span><span><Signal/><Wifi/><BatteryFull/></span></div>
      <header className={s.appHeader}><button onClick={onHome} aria-label="Retour à l’accueil Empire"><ChevronLeft/></button><div><span className={s.appIcon}>E</span><b>Empire</b></div><img src={FACE} alt="Votre compte"/></header>
      {phase>0&&<div className={s.screenTitle}><span>STUDIO · CLONAGE</span><h3>{phase === 3 ? 'Votre vidéo' : 'Refaire une vidéo'}</h3></div>}
      <div className={s.screenBody}>{phase === 0 ? <HomeScreen onClone={onClone} p={homeP}/> : phase === 1 ? <ImportScreen p={p}/> : phase === 2 ? <ProcessingScreen p={p}/> : <ResultScreen p={p}/>}</div>
      <nav className={s.tabBar} aria-label="Navigation illustrée de l’application">{[[PlusSquare, 'Créer'], [CalendarDays, 'Calendrier'], [Library, 'Mes vidéos'], [UserRound, 'Compte']].map(([Icon, label], i) => { const I = Icon as typeof PlusSquare; return <span key={String(label)} className={(phase === 3 ? i === 2 : i === 0) ? s.activeTab : ''}><I/><small>{String(label)}</small></span> })}</nav><div className={s.home}/>
    </div>
  </div>
}
export default function CloneAppStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rawP = useMotionValue(0)
  const p = useTransform(rawP, [0,.14,.30,.56,.73,1], [0,0,.30,.65,1,1])
  const [phase, setPhase] = useState(0)
  const [manual, setManual] = useState<number | null>(null)
  const reduced = useReducedMotion()
  useEffect(() => { rawP.set(manual !== null ? [.07, .29, .55, .90][manual] : reduced ? .99 : scrollYProgress.get()) }, [manual, reduced, rawP, scrollYProgress])
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!reduced) { setManual(null); rawP.set(v) } })
  useMotionValueEvent(rawP, 'change', v => setPhase(v < .14 ? 0 : v < .30 ? 1 : v < .56 ? 2 : 3))
  const sourceOpacity = useTransform(p, [0, .07, .65, .75], [0, 1, 1, .32])
  const afterOpacity = useTransform(p, [.7, .86], [0, 1])
  const afterY = useTransform(p, [.7, .86], [45, 0])
  return <section id="formula-time" ref={ref} className={`${s.section} ${reduced ? s.reduced : ''}`} aria-label="L’application Empire et son studio de clonage"><div data-viewport-stage className={s.sticky}>
    <div className={s.heading}><small>04 · TEMPS / L’APPLICATION</small><h2>Créez du contenu partout.<br/><em>Tout le temps. Quand vous voulez.</em></h2></div>
    <div className={s.stage}>
      <Workspace phase={phase}/>
      <IPhone p={p} homeP={rawP} phase={phase} onHome={()=>setManual(0)} onClone={()=>setManual(1)}/>

    </div>
    <div className={s.footer}><nav aria-label="Étapes de la simulation">{STEPS.map((label, i) => <button type="button" key={label} onClick={() => setManual(i)} aria-pressed={phase === i}><span>{i < phase ? <Check size={11}/> : `0${i+1}`}</span>{label}</button>)}</nav><span className={s.cue}><ArrowDown size={12}/>Continuez à scroller</span><small>Simulation mobile · déroulé illustratif</small><a href="#empire-claude">Depuis Claude aussi <ChevronRight size={13}/></a></div>
  </div></section>
}
