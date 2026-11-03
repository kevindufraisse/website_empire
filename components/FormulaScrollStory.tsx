'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion'
import { Mic, Send, CheckCheck, Check, Play, ArrowDown, ArrowRight, Plus, MoreHorizontal, ChevronLeft, Video, Signal, BatteryFull, Eye, CalendarDays, Smartphone, Camera, RotateCw, MessageCircle, Heart, Bookmark, TrendingUp, Newspaper, Sparkles, LockKeyhole, ThumbsUp, Share2, Music2 } from 'lucide-react'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { SocialIcons } from '@/components/ui/social-icons'
import s from './FormulaScrollStory.module.css'
import ClaudeMcpDemo from './ClaudeMcpDemo'
import CloneAppStory from './CloneAppStory'
import { PhotoThumbnail, MultiAccountBroadcast } from './ContentExpansionScenes'
import IdeaSources from './IdeaSources'
import { IDEA_TIMELINE } from './IdeaTimeline'
import PlatformMetrics from './PlatformMetrics'
import PreviewVideo from './PreviewVideo'
import { LongVideoFormat, LongVideoArtwork } from './LongVideoFormat'
import { CloneVideo, CloneDetails, SecretFormats } from './ExtraFormatScenes'

type Progress = MotionValue<number>
const TOPIC = 'Quels créateurs business français suivre ?'
const FACE = '/demo/kevin-speaking-v11.jpg'
const AVATAR = '/founders/kevin.jpg'
const CREATORS = [
  { name: 'Anthony Bourbon', photo: '/webinar/anthony-bourbon.jpg', position: '50% 30%', zoom: 1.15 },
  { name: 'Yomi Denzel', photo: '/webinar/yomi-denzel.jpg', position: '50% 24%', zoom: 1.15 },
  { name: 'Oussama Ammar', photo: '/webinar/oussama-ammar.jpg', position: '60% 27%', zoom: 2.1 },
]
const RANKS = ['S', 'A', 'B', 'C', 'D', 'F']
const RANK_COLORS = ['#ff7f7f', '#ffbf7f', '#ffdf7f', '#bfff7f', '#7fbfff', '#d6d6d6']
function CreatorPhoto({ index, className = '' }: { index: number; className?: string }) {
  const creator = CREATORS[index]
  return <span className={`${s.creatorPhoto} ${className}`}><img src={creator.photo} alt={creator.name} style={{ objectPosition: creator.position, transform: `scale(${creator.zoom})`, transformOrigin: index === 2 ? '53% 0%' : '50% 30%' }}/></span>
}
const CHANNELS = ['instagram', 'linkedin', 'youtube', 'tiktok', 'threads', 'twitter', 'facebook'] as const
const NETWORKS = ['Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'Threads', 'X', 'Facebook']
// Illustrative scenario requested for this demo. These are not observed client results.
const VIEWS = [10000, 50000, 53000, 150000, 3000, 6000, 8000]
const TOTAL = VIEWS.reduce((a, b) => a + b, 0)
const LABELS = ['Réaction', 'Tier list', 'FAQ', 'Devine', 'Clonage', 'YouTube long']
const CHAPTERS = [['message', 'Message'], ['format', 'Format'], ['diffusion', 'Diffusion'], ['time', 'Temps'], ['cost', 'Coût']]
const rawAt = (t: number) => t <= .28 ? t / .28 * 34 : 34 + (t - .28) / .85 * 66
const anchorAt = (n: number) => rawAt(n/100 + (n>=56.8?.13:n>=53.5?.06:0))
const fmt = (v: number) => Math.round(v).toLocaleString('fr-FR')
const clamp = (v: number) => Math.max(0, Math.min(1, v))
const countFor = (p: number, i: number) => Math.round(VIEWS[i] * clamp((p - (.597 + i * .023)) / .010))

function Reveal({ p, start, children, className = '' }: { p: Progress; start: number; children: ReactNode; className?: string }) {
  const opacity = useTransform(p, [start, start + .008], [0, 1])
  const y = useTransform(p, [start, start + .008], [14, 0])
  return <motion.div className={className} style={{ opacity, y }}>{children}</motion.div>
}
function PhoneTop({ dark = false }: { dark?: boolean }) {
  return <div className={`${s.phoneTop} ${dark ? s.darkTop : ''}`}><b>9:41</b><i/><span><Signal size={12}/><BatteryFull size={17}/></span></div>
}
function VoiceWave() {
  return <div className={s.voiceWave}>{Array.from({ length: 29 }, (_, i) => <i key={i} style={{ height: `${20 + (i * 31) % 80}%` }}/>)}</div>
}
function ReelArtwork({ small = false }: { small?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const video = ref.current
    if (!video || reduced) return
    let intersecting = false
    const sync = () => {
      if (intersecting && !video.closest('[aria-hidden="true"]')) video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(entries => {
      intersecting = !!entries[0]?.isIntersecting
      sync()
    }, { threshold: .15 })
    const sceneObserver = new MutationObserver(sync)
    const scene = video.closest('[aria-hidden]')
    if (scene) sceneObserver.observe(scene, { attributes: true, attributeFilter: ['aria-hidden'] })
    observer.observe(video)
    return () => { observer.disconnect(); sceneObserver.disconnect(); video.pause() }
  }, [reduced])
  return <div className={`${s.sourceReel} ${small ? s.sourceReelSmall : ''}`}><video ref={ref} src="/demo/hormozi-reaction-v10.mp4" poster="/demo/hormozi-reaction-v10.jpg" autoPlay={!reduced} muted loop playsInline preload="metadata" aria-label="Extrait vidéo de six secondes d’Alex Hormozi"/><span><Play size={11} fill="currentColor"/>Alex Hormozi · extrait vidéo</span></div>
}

const SENDS = IDEA_TIMELINE.slice(0,6).map(item=>item.at)
const FORMATS = ['FAQ','Tier list','FAQ','Réaction','FAQ','Devine']
function ChatExchange({ p, index }: { p: Progress; index: number }) {
 const at=SENDS[index]
 return <div className={s.exchange}>
  <Reveal p={p} start={at} className={s.outgoing}>
   {index===0?<div className={s.voice}><Play size={14} fill="currentColor"/><VoiceWave/><b>0:18</b></div>
   :index===1?<p>Faisons une tier list des créateurs business français. Je veux expliquer qui suivre selon son objectif.</p>
   :index===2?<><div className={s.captureAttachment}><img src="/demo/capture-entrepreneur-v18.webp" alt="Capture partagée : une citation de davissalestraining sur la persévérance des entrepreneurs"/><span><Camera size={10}/>Capture d’écran.png</span></div><p>J’aimerais parler de la réalité de l’entrepreneuriat.</p></>
   :index===3?<><span className={s.messageLink}>instagram.com/reel/extrait-hormozi</span><div className={s.reelLink}><ReelArtwork small/><span><SocialIcons.instagram/><b>Les conseils business d’Alex Hormozi</b></span></div></>
   :index===4?<><span className={s.messageLink}>youtube.com/shorts/KFYfMgU82ZA</span><a className={s.youtubeLink} href="https://www.youtube.com/shorts/KFYfMgU82ZA" target="_blank" rel="noreferrer" aria-label="Voir le Short d’Ali Abdaal"><img src="/creators/abdaal.webp" alt="Ali Abdaal"/><SocialIcons.youtube/><b>3 conseils aux créateurs qui débutent<small>Ali Abdaal · YouTube Shorts</small></b></a><p>Je veux répondre aux questions que ça soulève.</p></>
   :<><span className={s.messageLink}>linkedin.com/posts/exemple-createurs</span><div className={s.linkedinLink}><SocialIcons.linkedin/><b>{TOPIC}</b><p>Voici les critères que je regarde avant de suivre un conseil business.</p></div><p>Je veux donner mon avis sur ce sujet.</p></>}
   <small>9:{41+index} <CheckCheck size={12}/></small>
  </Reveal>
  <Reveal p={p} start={at+.010} className={s.incoming}><span className={s.added}><Check size={12}/>Ajouté à Empire</span>
   <p>{['Vocal transcrit. Ton idée est prête dans Empire.','C’est enregistré. On peut en faire une tier list.','Capture reçue. Sujet extrait : persévérer quand on entreprend.','Reel récupéré. Tu peux réagir à cet extrait.','Vidéo récupérée. Ses idées sont prêtes à développer.','Ton post et ton angle sont enregistrés.'][index]}</p>
   {(index===0||index===3)&&<div className={s.transcript}><small>{index===0?'TRANSCRIPTION':'VOTRE ANGLE'}</small>{index===0?'« Comment choisir les bons créateurs business à suivre ? Ça dépend de ce qu’on veut apprendre. »':'Les conseils que j’applique à mon activité, et ceux que je nuancerais.'}</div>}
   <span className={s.formatSuggestion}>Format proposé : {FORMATS[index]} <ArrowRight size={11}/></span>
  </Reveal>
 </div>
}
function MarketMessage({p,index}:{p:Progress;index:number}){
 const at=IDEA_TIMELINE[index+6].at
 const Icon=index===0?SocialIcons.instagram:index===1?SocialIcons.linkedin:SocialIcons.youtube
 return <div className={s.marketExchange}><Reveal p={p} start={at} className={s.incoming}>
  <span className={s.marketSender}><span>E</span>Empire vous propose</span>
  <p>{['Un concurrent suivi a partagé ce Reel.','Ce post LinkedIn décolle chez un concurrent.','Une vidéo repérée chez un créateur suivi.','Un sujet repéré dans BFM Business.'][index]}</p>
  {index===3?<a className={s.newsPreview} href="https://www.bfmtv.com/economie/replay-emissions/tech-and-co/video-pme-l-heure-de-l-ia-agentique-a-t-elle-sonne-13-10_VN-202610130909.html" target="_blank" rel="noreferrer"><span><b>BFM<small>BUSINESS</small></b><span>Tech & Co<br/><small>13 octobre 2026</small></span></span><strong>PME : l’heure de l’IA agentique a-t-elle sonné ?</strong><small>Lire la source sur bfmtv.com ↗</small></a>:<div className={s.marketPost}><img src={['/webinar/yomi-denzel.jpg','/creators/welsh.webp','/creators/abdaal.webp'][index]} alt={['Yomi Denzel','Justin Welsh','Ali Abdaal'][index]+' — photo réelle'}/><div><Icon/><small>{['Yomi Denzel · Reel Instagram','Justin Welsh · post LinkedIn · exemple','Ali Abdaal · vidéo YouTube'][index]}</small><b>{['Les conseils business à remettre en question','Qui écouter quand on entreprend ?','Les erreurs des entrepreneurs qui démarrent'][index]}</b></div></div>}
  <p className={s.marketAngle}>Votre angle : {['les conseils que vous appliquez vraiment.','votre classement, avec vos critères.','les erreurs à éviter dans votre activité.','ce que l’IA peut changer dans votre quotidien.'][index]}</p>
  <Reveal p={p} start={at+.010} className={s.marketSaved}><Check size={12}/>Idée ajoutée à Empire</Reveal>
 </Reveal></div>
}
function Chat({ p, active }: { p: Progress; active: boolean }) {
 const viewportRef=useRef<HTMLDivElement>(null),trackRef=useRef<HTMLDivElement>(null),messageOverflow=useRef<number[]>([])
 useEffect(()=>{
  const measure=()=>{if(!viewportRef.current||!trackRef.current)return;const available=viewportRef.current.clientHeight-20;messageOverflow.current=Array.from(trackRef.current.children).map(exchange=>Math.max(0,Array.from(exchange.children).reduce((height,bubble)=>height+(bubble as HTMLElement).offsetHeight,0)+(exchange.children.length>1?8:0)+5-available))}
  const observer=new ResizeObserver(measure)
  if(viewportRef.current)observer.observe(viewportRef.current)
  if(trackRef.current)Array.from(trackRef.current.children).forEach(exchange=>Array.from(exchange.children).forEach(bubble=>observer.observe(bubble)))
  measure();return()=>observer.disconnect()
 },[])
 const opacity=useTransform(p,[.269,.29],[1,0]),y=useTransform(p,[.269,.29],[0,-55])
 const trackY=useTransform(p,v=>{
  let offset=0
  for(let i=1;i<IDEA_TIMELINE.length;i++){
   const height=320,at=IDEA_TIMELINE[i].at
   offset-=height*clamp((v-(at-.006))/.006)
  }
  // Bring each acknowledgement into view, using the phone's actual available height.
  let lift=0
  IDEA_TIMELINE.forEach((item,i)=>{const next=IDEA_TIMELINE[i+1]?.at??.29;lift+=(messageOverflow.current[i]||0)*clamp((v-(item.at+.010))/.007)*(1-clamp((v-(next-.006))/.006))})
  return offset-lift
 })
 const tap=useTransform(p,v=>Math.max(...SENDS.map(at=>Math.max(0,1-Math.abs(v-at)/.003))))
 const tapScale=useTransform(tap,[0,1],[1.7,.8])
 const typed=useTransform(p,v=>{
  const i=SENDS.findIndex(at=>v<=at);if(i<0)return ''
  const draft=['Enregistrement du vocal…','Faisons une tier list…','Capture d’écran.png','instagram.com/reel/extrait-hormozi','youtube.com/shorts/KFYfMgU82ZA','linkedin.com/posts/exemple-createurs'][i]
  return draft.slice(0,Math.floor(clamp((v-(SENDS[i]-.012))/.011)*draft.length))
 })
 return <motion.div className={s.chatScene} style={{opacity,y}} aria-hidden={!active}>
  <IdeaSources p={p}/><div className={`${s.phone} ${s.chatPhone}`}><PhoneTop/>
   <div className={s.chatHeader}><ChevronLeft size={19}/><span className={s.empireBadge}>E</span><div><b>Empire</b><small>Votre assistant contenu</small></div><Video size={18}/></div>
   <div ref={viewportRef} className={s.chatViewport}><span className={s.dayStamp}>Aujourd’hui</span><motion.div ref={trackRef} className={s.chatTrack} style={{y:trackY}}>{SENDS.map((_,i)=><ChatExchange key={i} p={p} index={i}/>)}{[0,1,2,3].map(i=><MarketMessage key={`market-${i}`} p={p} index={i}/>)}</motion.div></div>
   <div className={s.composer}><Plus size={18}/><div><motion.span>{typed}</motion.span><span className={s.composePlaceholder}>Message</span></div><span className={s.sendIcon}><Send size={16}/><motion.i style={{opacity:tap,scale:tapScale}}/></span></div><div className={s.phoneHome}/>
  </div>
 </motion.div>
}

function RankItem({ p, index, still }: { p: Progress; index: number; still?: boolean }) {
  const start = .36 + index * .014
  const x = useTransform(p, [start, start + .014], [`${index * 112}%`, '0%'])
  const y = useTransform(p, [start, start + .014], [`${(6 - index) * 100}%`, '0%'])
  const scale = useTransform(p, [start, start + .007, start + .014], [1, 1.12, 1])
  return <motion.span className={s.tierPortrait} style={still ? {} : { x, y, scale }} title={CREATORS[index].name}><CreatorPhoto index={index}/></motion.span>
}
function TierList({ p, still }: { p: Progress; still?: boolean }) {
  return <div className={s.tierBoard}><b>Les créateurs business français</b><div className={s.tierRows}>{RANKS.map((rank, i) => <div className={s.tierRow} key={rank}><strong style={{ backgroundColor: RANK_COLORS[i] }}>{rank}</strong>{i < CREATORS.length && <RankItem p={p} index={i} still={still}/>}</div>)}</div><div className={s.tierPool}><span>À classer</span></div></div>
}
function RevealCreator({ p, index, still }: { p: Progress; index: number; still?: boolean }) {
 const start=.486+index*.013
 const filter=useTransform(p,[start,start+.009],['blur(14px)','blur(0px)'])
 const nameOpacity=useTransform(p,[start+.004,start+.011],[0,1])
 const hiddenOpacity=useTransform(nameOpacity,[0,1],[1,0])
 const scale=useTransform(p,[start,start+.009],[1.12,1])
 const tap=useTransform(p,[start-.003,start+.001,start+.007],[0,1,0])
 return <div className={s.revealCreator}><div><motion.span style={still?{filter:'none'}:{filter,scale}}><CreatorPhoto index={index}/></motion.span><motion.i style={{opacity:still?0:tap}}/></div><motion.b style={{opacity:still?1:nameOpacity}}>{CREATORS[index].name}</motion.b><motion.small style={{opacity:still?0:hiddenOpacity}}>???</motion.small></div>
}
function GuessCreators({ p, still }: { p: Progress; still?: boolean }) {
 return <div className={s.guessOverlay}><h4>Les entrepreneurs les plus viraux</h4><div>{CREATORS.map((_,i)=><RevealCreator p={p} index={i} still={still} key={i}/>)}</div><span>Un indice. Un visage. Votre explication.</span></div>
}
function Composition({ kind, p, still = false, preview = false }: { kind: number; p: Progress; still?: boolean; preview?: boolean }) {
  const question = useTransform(p, v => TOPIC.slice(0, Math.floor(clamp((v - .425) / .02) * TOPIC.length)))
  return <div className={`${s.composition} ${s[`composition${kind}`]}`}>
    <PreviewVideo src="/demo/kevin-speaking-v11.mp4" poster={FACE} label="Kevin en vidéo — illustration du format" className={s.cameraFace} still={preview}/>
    {kind === 0 && <><div className={s.reactionClip}><ReelArtwork/></div><span className={s.reactionVoice}><Mic size={11}/>Votre réaction</span></>}
    {kind === 1 && <TierList p={p} still={still}/>}
    {kind === 2 && <div className={s.questionSticker}><small>Posez-moi une question</small>{still ? <b>{TOPIC}</b> : <motion.b>{question}</motion.b>}</div>}
    {kind === 3 && <GuessCreators p={p} still={still}/>}
    <div className={s.videoCaption}>{['Ce conseil, je l’adapterais à mon activité.', 'MON CLASSEMENT, MES RAISONS', 'Le bon créateur dépend de ton objectif.', 'VOICI MON POINT DE VUE'][kind]}</div>
  </div>
}
function FormatFrame({ p, index }: { p: Progress; index: number }) {
  const start = [.28, .35, .415, .475][index]
  const end = [.35, .415, .475, .535][index]
  const opacity = useTransform(p, [start, start + .01, end - .006, end + .005], [0, 1, 1, 0])
  const y = useTransform(p, [start, start + .012, end - .006, end + .005], [32, 0, 0, -32])
  const [visible,setVisible]=useState(false)
  useMotionValueEvent(p,'change',v=>setVisible(v>=start&&v<end))
  return <motion.div className={s.formatFrame} style={{ opacity, y }} aria-hidden={!visible}><Composition kind={index} p={p}/></motion.div>
}
function Recording({ p, kind, cloneP, staticMode = false }: { p: Progress; kind: number; cloneP: Progress; staticMode?: boolean }) {
  const time = useTransform(p, v => `00:${String(Math.floor(clamp((v - .29) / .28) * 48)).padStart(2, '0')}`)
  const tap = useTransform(p, [.294, .299, .304], [0, 1, 0])
  return <div className={`${s.phone} ${s.recordPhone}`}>
    <PhoneTop dark/>
    <div className={s.cameraTop}><span><span className={s.empireBadge}>E</span>Empire · {LABELS[kind]}</span><span className={s.rec}><i/>{kind===4?'IA':'REC'} <motion.b>{staticMode ? '00:24' : time}</motion.b></span></div>
    <div className={s.recordViewport}>{kind===4 ? <CloneVideo p={cloneP}/> : staticMode ? <Composition kind={kind} p={p} still/> : LABELS.slice(0,4).map((_, i) => <FormatFrame key={i} p={p} index={i}/>)}</div>
    <div className={s.recordControls}><span>9:16</span><div className={s.recordButton}><i/><motion.span style={staticMode ? { opacity: 0 } : { opacity: tap }}/></div><RotateCw size={21}/></div>
    <div className={s.darkHome}/>
  </div>
}
function Formats({ p, cloneP, active, kind }: { p: Progress; cloneP: Progress; active: boolean; kind: number }) {
 const opacity=useTransform(p,[.275,.292,.568,.59],[0,1,1,0])
 const scale=useTransform(p,[.275,.295,.565,.59],[.92,1,1,.9])
 const titles=['Votre inspiration.<br/>Votre point de vue.','Votre idée.<br/>Votre classement.','Une question.<br/>Votre réponse.','Faites deviner.<br/>Puis révélez.','Un Reel inspirant.<br/>Votre version.']
 const descriptions=['Empire place le Reel dans le format Réaction. Vous apportez votre point de vue, face caméra.','Les créateurs se placent pendant que vous expliquez vos choix.','La question s’affiche au-dessus de vous. Vous n’avez plus qu’à répondre.','Les portraits se révèlent un à un. Vous expliquez pourquoi ces créateurs méritent d’être suivis.','Un lien, votre visage et votre voix. Empire prépare une nouvelle version, à valider avant publication.']
 return <motion.div className={s.formatScene} data-long={kind===5} style={{opacity,scale}} aria-hidden={!active}>
  {kind===5?<LongVideoFormat p={p}/>:<><div className={s.formatExplanation}><small>VOTRE MESSAGE → VOTRE FORMAT</small><h3>{titles[kind].split('<br/>').map((v,i)=><span key={v}>{i>0&&<br/>}{v}</span>)}</h3><p>{descriptions[kind]}</p>{kind===4?<CloneDetails p={cloneP}/>:<div className={s.sourceReminder}><Check size={14}/><span>À partir de vos messages<br/><b>{kind===0?'Les conseils business d’Alex Hormozi':TOPIC}</b></span></div>}</div><Recording p={p} cloneP={cloneP} kind={kind}/></>}
  <div className={s.formatShelf}><small>VOS FORMATS</small>{LABELS.map((name,i)=><div key={name} className={`${s.formatMini} ${kind===i?s.chosen:''}`}><div>{i===5?<LongVideoArtwork still/>:i===4?<CloneVideo p={cloneP} still/>:<Composition kind={i} p={p} still preview/>}</div><span>{name}{kind>i?<Check size={12}/>:kind===i?<span className={s.liveDot}/>:null}</span></div>)}<div className={s.secretFormats}><LockKeyhole size={16}/><span>Et d’autres formats<br/><b>tenus secrets.</b></span></div></div>
 </motion.div>
}
function NetworkPost({ p, index }: { p: Progress; index: number }) {
 const Icon=SocialIcons[CHANNELS[index]],video=[0,2,3].includes(index)
 const count=useTransform(p,v=>fmt(countFor(v,index)))
 const opacity=useTransform(p,[.572+index*.002,.593+index*.002],[0,1])
 const y=useTransform(p,[.572+index*.002,.593+index*.002],[35,0])
 const assetStart=[.602,.642,.642,.66,.699,.723,.745][index]
 const assetOpacity=useTransform(p,[assetStart,assetStart+.012],[0,1])
 const assetY=useTransform(p,[assetStart,assetStart+.012],[30,0])
 return <motion.article className={`${s.post} ${index===3?s.winningPost:''}`} data-network={CHANNELS[index]} style={{opacity,y}}>
  <header className={s.platformChrome}><Icon/><b>{NETWORKS[index]}</b><span>{['Reels','Fil professionnel','Vidéo longue','Pour toi','Fil de discussion','Pour vous','Fil d’actualité'][index]}</span></header>
  {index!==2&&index!==3&&<div className={s.postAuthor}><img src={AVATAR} alt=""/><span><b>{index===4?'kevindufraisse':'Kevin Dufraisse'}</b><small>{index===1?'Conseils business · 2 h':index===5?'@kevindufraisse · 2 h':index===6?'Publication publique · 2 h':'@kevindufraisse'}</small></span><MoreHorizontal size={14}/></div>}
  {index===2?<div className={s.youtubePublication}><div className={s.youtubePlayer}><LongVideoArtwork/><motion.div className={s.youtubeGeneratedCover} style={{opacity:assetOpacity,y:assetY}}><div className={s.youtubeThumbnail}><img className={s.youtubeThumbnailImage} src="/demo/youtube-tierlist-v18.webp" alt="Miniature générée par Empire : Je les classe, Kevin et la tier list des créateurs business"/></div><span className={s.youtubeGeneratedLabel}><Sparkles size={11}/><span>Miniature créée par Empire</span><Check size={11}/></span></motion.div><span>12:48</span><div><Play size={14} fill="currentColor"/><span/><span>HD</span></div></div><div className={s.youtubeTitle}><b>Ma tier list des créateurs business français.</b><span>Vidéo longue · 3 chapitres</span></div><div className={s.youtubeChannel}><img src={AVATAR} alt=""/><span>Kevin Dufraisse<small>Votre chaîne YouTube</small></span><b>S’abonner</b></div></div>
  :video?<div className={s.postVideo}><Composition kind={index===0?2:1} p={p} still/>{index===3?<><div className={s.tiktokActions}><img src={AVATAR} alt=""/><Heart/><MessageCircle/><Bookmark/><Share2/></div><div className={s.tiktokCaption}><b>@kevindufraisse</b><span>Mon classement des créateurs business.</span><small><Music2 size={10}/>son original · Kevin</small></div></>:<span className={s.formatPostTag}>FAQ · votre Reel</span>}{index===0&&<motion.div className={s.generatedCover} style={{opacity:assetOpacity,y:assetY}}><PhotoThumbnail/><span className={s.empireGenerated}><Sparkles size={12}/><span><b>Miniature créée par Empire</b></span><Check size={12}/></span></motion.div>}</div>
  :<div className={s.postText}><b>{index===5?'1/3 · Qui suivre pour progresser ?':index===4?'Le nombre d’abonnés ne fait pas le bon conseil.':'Qui suivre en business ?'}</b><p>{index===4?'Le bon créateur, c’est celui dont tu peux appliquer les conseils à ton activité. Voici mon classement.':index===5?'Un créateur. Une expertise. Voici les critères que je regarde. ↓':'Un créateur, une expertise. Voici les critères que je regarde avant de suivre ses conseils.'}</p><motion.div className={s.generatedLinkedin} style={{opacity:assetOpacity,y:assetY}}><img src="/demo/kevin-portrait-v13.webp" alt={`Portrait studio généré par Empire pour ${NETWORKS[index]}`}/><span className={s.empireGenerated}><Sparkles size={12}/><span><b>Portrait créé par Empire</b></span><Check size={12}/></span></motion.div><small>{index===5?'Afficher ce fil':index===4?'Afficher les réponses':'Adapté depuis votre vidéo · Tier list'}</small></div>}
  <PlatformMetrics index={index} count={count}/>
 </motion.article>
}
function Reach({ p, active }: { p: Progress; active: boolean }) {
 const viewport=useRef<HTMLDivElement>(null)
 const track=useRef<HTMLDivElement>(null)
 const travel=useMotionValue(0)
 useEffect(()=>{const measure=()=>travel.set(Math.max(0,(track.current?.scrollWidth||0)-(viewport.current?.clientWidth||0)));const ro=new ResizeObserver(measure);if(viewport.current)ro.observe(viewport.current);if(track.current)ro.observe(track.current);measure();return()=>ro.disconnect()},[travel])
 const x=useTransform([p,travel],values=>-clamp(((values[0] as number)-.626)/.139)*(values[1] as number))
 const opacity=useTransform(p,[.568,.59,.807,.827],[0,1,1,0])
 const cardsOpacity=useTransform(p,[.807,.827],[1,0])
 const total=useTransform(p,v=>fmt(VIEWS.reduce((sum,_,i)=>sum+countFor(v,i),0)))
 return <motion.div className={s.reachScene} style={{opacity}} aria-hidden={!active}>
  <motion.div className={s.networkLegend} style={{opacity:cardsOpacity}}>{CHANNELS.map((name,i)=>{const Icon=SocialIcons[name];return <span key={name}><Icon/>{NETWORKS[i]}</span>})}</motion.div>
  <motion.div ref={viewport} className={s.postsViewport} style={{opacity:cardsOpacity}}><motion.div ref={track} className={s.posts} style={{x}}>{CHANNELS.map((name,i)=><NetworkPost key={name} p={p} index={i}/>)}</motion.div></motion.div>
  <motion.div className={s.reachTotal} style={{opacity:cardsOpacity}}><span>Chaque publication compte.</span><div><motion.b>{total}</motion.b><span>vues + impressions cumulées</span></div></motion.div>

  <small className={s.simulation}>Simulation de vues et d’impressions, pas une promesse de résultats ni une audience unique.</small>
 </motion.div>
}
function Calendar({ p, active }: { p: Progress; active: boolean }) {
  const opacity = useTransform(p, [.815, .835], [0, 1])
  const left = useTransform(p, [.875, .94], ['4%', '28.57%'])
  const top = useTransform(p, [.875, .94], ['8%', '66.6667%'])
  const width = useTransform(p, [.875, .94], ['34%', '14.28%'])
  const height = useTransform(p, [.875, .94], ['72%', '16.6667%'])
  const picked = useTransform(p, [.83, .85], [0, 1])
  const confirmed = useTransform(p, [.942, .96], [0, 1])
  const [done, setDone] = useState(false)
  useMotionValueEvent(p, 'change', v => setDone(v >= .942))
  return <motion.div className={s.calendarScene} style={{ opacity }} aria-hidden={!active}>
    <div className={s.calendarIntro}><span><SocialIcons.tiktok/>VOTRE MEILLEURE PUBLICATION</span><h3>150 000 vues.<br/><em>Une nouvelle date.</em></h3><p>Empire repère ce qui a marché. Vous retrouvez ce contenu dans votre calendrier pour une nouvelle diffusion.</p><motion.div className={s.scheduleConfirmed} style={{ opacity: confirmed }}><Check size={18}/><span><b>Republication programmée</b><small>Mercredi 25 · 12:00</small></span></motion.div></div>
    <div className={s.calendarApp}><header><span className={s.empireBadge}>E</span><div><b>Calendrier</b><small>Vos publications</small></div><CalendarDays size={20}/></header><div className={s.month}><b>Novembre</b><span>{done ? '1 republication ajoutée' : 'Sélection du meilleur contenu'}</span></div><div className={s.weekdays}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((v, i) => <span key={i}>{v}</span>)}</div><div className={s.calendarGrid}>{Array.from({ length: 42 }, (_, i) => { const day = i - 5; return <div key={i} className={day === 25 ? s.targetDay : ''}><span>{day > 0 && day <= 30 ? day : ''}</span>{day === 4 && <small className={s.publishedMark}><Check size={10}/>Publié</small>}{day === 25 && <small className={s.targetTime}>12:00</small>}</div> })}<motion.div className={s.movingWinner} style={{ left, top, width, height, opacity: picked }}><div className={s.winnerVisual}><Composition kind={1} p={p} still/></div><div className={s.winnerMeta}><SocialIcons.tiktok/><b>150 000 vues</b><span>{TOPIC}</span></div><motion.span className={s.scheduledCheck} style={{ opacity: confirmed }}><Check size={11}/></motion.span></motion.div></div><footer><span><Check size={13}/>Le contenu qui a déjà trouvé son public.</span><motion.b style={{ opacity: confirmed }}>Reprogrammé</motion.b></footer></div>
  </motion.div>
}
function AccessibleStory() {
  return <><section className={s.accessible}><h2>Un message. Une idée ajoutée à Empire.</h2><p>Envoyez une capture d’écran, un vocal, un texte, un lien Instagram ou YouTube ou un post LinkedIn. Empire vous suggère aussi dans le chat des posts de concurrents, des actualités et des sujets qui montent. Empire confirme la réception, transcrit le contenu et propose un format.</p><h2 id="formula-format">Enregistrez vos formats</h2><p>{TOPIC} Le Reel partagé devient une réaction en haut, et votre caméra en bas. Votre idée devient une tier list, une FAQ ou un format Devine. Le clonage transforme un Reel en une version avec votre visage et votre voix. Tous vos formats s’adaptent aussi en vidéo longue sur YouTube, avec votre écran et votre caméra. Les autres formats restent secrets : découvrez-les dans l’application.</p><p><a href="https://app.empire-internet.com/onboarding?plan=growth&intent=trial&billing=monthly">Tester gratuitement</a> · <a href="/demo">Demander une démo</a></p><h2 id="formula-diffusion">Vos publications sur 7 réseaux</h2><p>{NETWORKS.join(' · ')}. Exemple illustratif : 10 000 vues sur un réseau, 280 000 vues et impressions cumulées sur sept. Les résultats varient.</p><h3>Vos miniatures et vos comptes</h3><p>Pendant la diffusion, les portraits et les visuels générés par Empire s’ajoutent aux posts LinkedIn, Threads, X et Facebook ; des miniatures se posent sur le Reel Instagram et la vidéo YouTube. Les vidéos se diffusent sur votre compte principal et vos comptes secondaires, comme @kevin.clip et @kevindufraisse.viral.</p><h3>Le meilleur contenu revient au calendrier</h3><p>Dans cette simulation, le TikTok à 150 000 vues est reprogrammé le 25 à 12 h.</p></section><CloneAppStory/><ClaudeMcpDemo/></>
}
export function SourcesStory() {
  const { autopilot } = useAutopilot()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawP } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const timeline = useTransform(rawP, [0,.34,1], [0,.28,1.13])
  const sequenceP = useTransform(timeline, [0,.535,.595,.628,.698,1.13], [0,.535,.535,.568,.568,1])
  const [formatsEnded,setFormatsEnded]=useState(false)
  const p = useTransform(sequenceP, [0, .82, .92, 1], [0, .82, .82, 1])
  const [extra, setExtra] = useState(0)
  useMotionValueEvent(timeline, 'change', t => { const v=t<.535?t:t<.595?.535:t<.628?t-.06:t<.698?.568:t-.13; setExtra(t>=.535&&t<.595?1:t>=.628&&t<.698?3:v>=.82&&v<.92?2:0);setFormatsEnded(t>=.628) })
  const [phase, setPhase] = useState(0)
  const [kind, setKind] = useState(0)
  useMotionValueEvent(p, 'change', v => {
    setPhase(v < .28 ? 0 : v < .575 ? 1 : v < .82 ? 2 : 3)
    setKind(v < .35 ? 0 : v < .415 ? 1 : v < .475 ? 2 : v < .535 ? 3 : 5)
  })
  if (autopilot) return null
  if (reduced) return <AccessibleStory/>
  return <><section ref={ref} className={s.story} data-story="formula" data-step={['message', 'format', 'diffusion', 'republication'][phase]} aria-label="La formule Empire au scroll">{[['reaction',30.5],['tierlist',38.5],['faq',44.5],['youtube',55.5]].map(([name,at])=><span key={name} id={`formula-${name}`} className={s.anchor} style={{top:`calc(${anchorAt(Number(at))}% - ${anchorAt(Number(at))}svh)`}}/>)}{[['clone',.565],['secret',.665]].map(([name,t])=><span key={name} id={`formula-${name}`} className={s.anchor} style={{top:`calc(${rawAt(Number(t))}% - ${rawAt(Number(t))}svh)`}}/>)}<span id="formula-format" className={s.anchor} style={{ top: `calc(${anchorAt(28)}% - ${anchorAt(28)}svh)` }}/><span id="formula-diffusion" className={s.anchor} style={{ top: `calc(${anchorAt(60)}% - ${anchorAt(60)}svh)` }}/><div data-viewport-stage className={s.sticky} data-gate-stage><nav>{CHAPTERS.map(([id, title], i) => <a href={`#formula-${id}`} key={id} aria-current={i === Math.min(phase, 2) ? 'step' : undefined}>{title}{i < 2 && <span>×</span>}</a>)}</nav><div className={s.headline}><small>{extra === 2 ? '03 · DIFFUSION — MULTI-COMPTES' : ['01 · MESSAGE', '02 · FORMAT', '03 · DIFFUSION', '03 · DIFFUSION — REPUBLICATION'][phase]}</small><h2>{extra === 2 ? 'La même vidéo. Sur plusieurs comptes.' : ['Une conversation. Toutes vos idées.', 'Votre message. Le bon format.', 'Un contenu. Adapté à chaque réseau.', 'Nous republions vos meilleurs contenus.'][phase]}</h2><p>{extra === 2 ? 'Connectez vos comptes principaux et secondaires. Nous y diffusons la même vidéo.' : ['Vos messages deviennent des idées prêtes à créer dans Empire.', 'Empire prépare votre sujet. Vous prenez la parole.', 'Nous adaptons et publions vos vidéos, textes et visuels sur vos réseaux.', 'Vos contenus qui fonctionnent reviennent automatiquement dans le calendrier.'][phase]}</p></div><div className={s.stage}><Chat p={p} active={phase === 0}/>{extra===3&&<SecretFormats p={timeline}/>} <Formats p={p} cloneP={timeline} active={(phase === 1 || phase === 2) && (extra === 0 || extra === 1) && !formatsEnded} kind={extra===1?4:kind}/><Reach p={p} active={(phase === 1 || phase === 2) && extra === 0}/><Calendar p={p} active={phase === 3 && extra === 0}/>{extra === 2 && <MultiAccountBroadcast p={sequenceP} reel={<Composition kind={1} p={p} still/>}/>}</div><div className={s.progress}><span><ArrowDown size={12}/>Continuez à scroller</span><div><motion.i style={{ scaleX: rawP }}/></div><small>Démonstration illustrée</small></div></div></section><CloneAppStory/><ClaudeMcpDemo/></>
}
