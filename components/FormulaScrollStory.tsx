'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion'
import { Mic, Send, CheckCheck, Check, Play, ArrowDown, ArrowRight, Plus, MoreHorizontal, ChevronLeft, Video, Signal, BatteryFull, CalendarDays, Camera, RotateCw, MessageCircle, Heart, Bookmark, Sparkles, Share2, Music2 } from 'lucide-react'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { SocialIcons } from '@/components/ui/social-icons'
import s from './FormulaScrollStory.module.css'
import r from './HomeStoryRefinement.module.css'
import stable from './StableHomeJourney.module.css'
import journey from './LeadMagnetJourney.module.css'
import IdeaMessagesStory from './IdeaMessagesStory'
import ClaudeMcpDemo from './ClaudeMcpDemo'
import CloneAppStory from './CloneAppStory'
import { PhotoThumbnail, MultiAccountBroadcast } from './ContentExpansionScenes'
import { IDEA_TIMELINE } from './IdeaTimeline'
import PlatformMetrics from './PlatformMetrics'
import PreviewVideo from './PreviewVideo'
import { LongVideoFormat, LongVideoArtwork } from './LongVideoFormat'
import { CloneVideo, CloneDetails } from './ExtraFormatScenes'
import LeadMagnetScene from './LeadMagnetScene'
import SecretFormatsGate from './SecretFormatsGate'

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
// Demonstration figures, never presented as observed customer results.
const VIEWS = [10000, 50000, 53000, 150000, 3000, 6000, 8000]
const LABELS = ['Réaction', 'Tier list', 'FAQ', 'Devine', 'Clonage', 'YouTube long']
// Creation and distribution now have separate native scroll regions. The form
// between them is ordinary document content, never a timed animation frame.
const rawAt = (t: number) => Math.max(0, Math.min(1, (t - .305) / .285)) * 100
const anchorAt = (n: number) => rawAt(n / 100 + (n >= 53.5 ? .06 : 0))
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
    const observer = new IntersectionObserver(entries => { intersecting = !!entries[0]?.isIntersecting; sync() }, { threshold: .15 })
    const sceneObserver = new MutationObserver(sync)
    const scene = video.closest('[aria-hidden]')
    if (scene) sceneObserver.observe(scene, { attributes: true, attributeFilter: ['aria-hidden'] })
    observer.observe(video)
    return () => { observer.disconnect(); sceneObserver.disconnect(); video.pause() }
  }, [reduced])
  return <div className={`${s.sourceReel} ${small ? s.sourceReelSmall : ''}`}><video ref={ref} src="/demo/hormozi-reaction-v10.mp4" poster="/demo/hormozi-reaction-v10.jpg" autoPlay={!reduced} muted loop playsInline preload="metadata" aria-label="Extrait vidéo de six secondes d’Alex Hormozi"/><span><Play size={11} fill="currentColor"/>Alex Hormozi · extrait vidéo</span></div>
}

const SENDS = IDEA_TIMELINE.slice(0, 6).map(item => item.at)
const STEPS = [...SENDS, IDEA_TIMELINE[6].at]
const FORMATS = ['FAQ', 'Tier list', 'FAQ', 'Réaction', 'FAQ', 'Devine']
function ChatExchange({ p, index }: { p: Progress; index: number }) {
  const at = SENDS[index]
  return <div className={s.exchange}>
    <Reveal p={p} start={at} className={s.outgoing}>
      {index === 0 ? <div className={s.voice}><Play size={14} fill="currentColor"/><VoiceWave/><b>0:18</b></div>
      : index === 1 ? <p>Faisons une tier list des créateurs business français. Je veux expliquer qui suivre selon son objectif.</p>
      : index === 2 ? <><div className={s.captureAttachment}><img src="/demo/capture-entrepreneur-v18.webp" alt="Capture partagée : une citation de davissalestraining sur la persévérance des entrepreneurs"/><span><Camera size={10}/>Capture d’écran.png</span></div><p>J’aimerais parler de la réalité de l’entrepreneuriat.</p></>
      : index === 3 ? <><span className={s.messageLink}>instagram.com/reel/extrait-hormozi</span><div className={s.reelLink}><ReelArtwork small/><span><SocialIcons.instagram/><b>Les conseils business d’Alex Hormozi</b></span></div></>
      : index === 4 ? <><span className={s.messageLink}>youtube.com/shorts/KFYfMgU82ZA</span><a className={s.youtubeLink} href="https://www.youtube.com/shorts/KFYfMgU82ZA" target="_blank" rel="noreferrer" aria-label="Voir le Short d’Ali Abdaal"><img src="/creators/abdaal.webp" alt="Ali Abdaal"/><SocialIcons.youtube/><b>3 conseils aux créateurs qui débutent<small>Ali Abdaal · YouTube Shorts</small></b></a><p>Je veux répondre aux questions que ça soulève.</p></>
      : <><span className={s.messageLink}>linkedin.com/posts/exemple-createurs</span><div className={s.linkedinLink}><SocialIcons.linkedin/><b>{TOPIC}</b><p>Voici les critères que je regarde avant de suivre un conseil business.</p></div><p>Je veux donner mon avis sur ce sujet.</p></>}
      <small>9:{41 + index} <CheckCheck size={12}/></small>
    </Reveal>
    <Reveal p={p} start={at + .010} className={s.incoming}><span className={s.added}><Check size={12}/>Ajouté à Empire</span>
      <p>{['Vocal transcrit. Ton idée est prête dans Empire.', 'C’est enregistré. On peut en faire une tier list.', 'Capture reçue. Sujet extrait : persévérer quand on entreprend.', 'Reel récupéré. Tu peux réagir à cet extrait.', 'Vidéo récupérée. Ses idées sont prêtes à développer.', 'Ton post et ton angle sont enregistrés.'][index]}</p>
      {(index === 0 || index === 3) && <div className={s.transcript}><small>{index === 0 ? 'TRANSCRIPTION' : 'VOTRE ANGLE'}</small>{index === 0 ? '« Comment choisir les bons créateurs business à suivre ? Ça dépend de ce qu’on veut apprendre. »' : 'Les conseils que j’applique à mon activité, et ceux que je nuancerais.'}</div>}
      <span className={s.formatSuggestion}>Format proposé : {FORMATS[index]} <ArrowRight size={11}/></span>
    </Reveal>
  </div>
}
const WATCHED = [
  { img: '/webinar/yomi-denzel.jpg', name: 'Yomi Denzel', net: 'Reel Instagram', Icon: SocialIcons.instagram, title: 'Les conseils business à remettre en question' },
  { img: '/creators/welsh.webp', name: 'Justin Welsh', net: 'Post LinkedIn', Icon: SocialIcons.linkedin, title: 'Qui écouter quand on entreprend ?' },
  { img: '/creators/abdaal.webp', name: 'Ali Abdaal', net: 'Vidéo YouTube', Icon: SocialIcons.youtube, title: 'Les erreurs des entrepreneurs qui démarrent' },
  { img: '', name: 'BFM Business', net: 'Actualité', Icon: null, title: 'PME : l’heure de l’IA agentique a-t-elle sonné ?' },
]
function CompetitorsMessage({ p }: { p: Progress }) {
  const at = IDEA_TIMELINE[6].at
  return <div className={s.marketExchange}><Reveal p={p} start={at} className={s.incoming}>
    <span className={s.marketSender}><span>E</span>Empire vous propose</span>
    <p>Ce qui marche cette semaine chez les comptes que vous suivez :</p>
    <div className={s.watchList}>{WATCHED.map((w, i) => <Reveal key={w.name} p={p} start={IDEA_TIMELINE[6 + i].at + (i === 0 ? .004 : 0)} className={s.watchRow}>
      {w.img ? <img src={w.img} alt={w.name}/> : <span className={s.watchNews}>BFM</span>}
      <div><small>{w.Icon && <w.Icon/>}{w.name} · {w.net}</small><b>{w.title}</b></div><Check size={12}/>
    </Reveal>)}</div>
    <Reveal p={p} start={IDEA_TIMELINE[9].at + .010} className={s.marketSaved}><Check size={12}/>4 idées ajoutées à Empire, avec votre angle</Reveal>
  </Reveal></div>
}
function Chat({ p, active }: { p: Progress; active: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null), trackRef = useRef<HTMLDivElement>(null), messageOverflow = useRef<number[]>([])
  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current) return
      const available = viewportRef.current.clientHeight - 20
      messageOverflow.current = Array.from(trackRef.current.children).map(exchange => Math.max(0, Array.from(exchange.children).reduce((height, bubble) => height + (bubble as HTMLElement).offsetHeight, 0) + (exchange.children.length > 1 ? 8 : 0) + 5 - available))
    }
    const observer = new ResizeObserver(measure)
    if (viewportRef.current) observer.observe(viewportRef.current)
    if (trackRef.current) Array.from(trackRef.current.children).forEach(exchange => Array.from(exchange.children).forEach(bubble => observer.observe(bubble)))
    measure(); return () => observer.disconnect()
  }, [])
  const opacity = useTransform(p, [.269, .29], [1, 0]), y = useTransform(p, [.269, .29], [0, -55])
  const trackY = useTransform(p, v => {
    let offset = 0
    for (let i = 1; i < STEPS.length; i++) offset -= 320 * clamp((v - (STEPS[i] - .006)) / .006)
    let lift = 0
    STEPS.forEach((at, i) => { const next = STEPS[i + 1] ?? .29; lift += (messageOverflow.current[i] || 0) * clamp((v - (at + .010)) / .007) * (1 - clamp((v - (next - .006)) / .006)) })
    return offset - lift
  })
  const tap = useTransform(p, v => Math.max(...SENDS.map(at => Math.max(0, 1 - Math.abs(v - at) / .003))))
  const tapScale = useTransform(tap, [0, 1], [1.7, .8])
  const typed = useTransform(p, v => {
    const i = SENDS.findIndex(at => v <= at); if (i < 0) return ''
    const draft = ['Enregistrement du vocal…', 'Faisons une tier list…', 'Capture d’écran.png', 'instagram.com/reel/extrait-hormozi', 'youtube.com/shorts/KFYfMgU82ZA', 'linkedin.com/posts/exemple-createurs'][i]
    return draft.slice(0, Math.floor(clamp((v - (SENDS[i] - .012)) / .011) * draft.length))
  })
  return <motion.div className={s.chatScene} data-scene="chat" style={{ opacity, y }} aria-hidden={!active}>
    <div className={`${s.phone} ${s.chatPhone}`}><PhoneTop/>
      <div className={s.chatHeader}><ChevronLeft size={19}/><span className={s.empireBadge}>E</span><div><b>Empire</b><small>Votre assistant contenu</small></div><Video size={18}/></div>
      <div ref={viewportRef} className={s.chatViewport}><span className={s.dayStamp}>Aujourd’hui</span><motion.div ref={trackRef} className={s.chatTrack} style={{ y: trackY }}>{SENDS.map((_, i) => <ChatExchange key={i} p={p} index={i}/>)}<CompetitorsMessage p={p}/></motion.div></div>
      <div className={s.composer}><Plus size={18}/><div><motion.span>{typed}</motion.span><span className={s.composePlaceholder}>Message</span></div><span className={s.sendIcon}><Send size={16}/><motion.i style={{ opacity: tap, scale: tapScale }}/></span></div><div className={s.phoneHome}/>
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
  const start = .486 + index * .013
  const filter = useTransform(p, [start, start + .009], ['blur(14px)', 'blur(0px)'])
  const nameOpacity = useTransform(p, [start + .004, start + .011], [0, 1])
  const hiddenOpacity = useTransform(nameOpacity, [0, 1], [1, 0])
  const scale = useTransform(p, [start, start + .009], [1.12, 1])
  const tap = useTransform(p, [start - .003, start + .001, start + .007], [0, 1, 0])
  return <div className={s.revealCreator}><div><motion.span style={still ? { filter: 'none' } : { filter, scale }}><CreatorPhoto index={index}/></motion.span><motion.i style={{ opacity: still ? 0 : tap }}/></div><motion.b style={{ opacity: still ? 1 : nameOpacity }}>{CREATORS[index].name}</motion.b><motion.small style={{ opacity: still ? 0 : hiddenOpacity }}>???</motion.small></div>
}
function GuessCreators({ p, still }: { p: Progress; still?: boolean }) {
  return <div className={s.guessOverlay}><h4>Les entrepreneurs les plus viraux</h4><div>{CREATORS.map((_, i) => <RevealCreator p={p} index={i} still={still} key={i}/>)}</div><span>Un indice. Un visage. Votre explication.</span></div>
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
  const start = [.28, .35, .415, .475][index], end = [.35, .415, .475, .535][index]
  const opacity = useTransform(p, [start, start + .01, end - .006, end + .005], [0, 1, 1, 0])
  const y = useTransform(p, [start, start + .012, end - .006, end + .005], [32, 0, 0, -32])
  const [visible, setVisible] = useState(() => p.get() >= start && p.get() < end)
  useMotionValueEvent(p, 'change', v => setVisible(v >= start && v < end))
  return <motion.div className={s.formatFrame} style={{ opacity, y }} aria-hidden={!visible}><Composition kind={index} p={p}/></motion.div>
}
function Recording({ p, kind, cloneP }: { p: Progress; kind: number; cloneP: Progress }) {
  const time = useTransform(p, v => `00:${String(Math.floor(clamp((v - .29) / .28) * 48)).padStart(2, '0')}`)
  const tap = useTransform(p, [.294, .299, .304], [0, 1, 0])
  return <div className={`${s.phone} ${s.recordPhone}`}>
    <PhoneTop dark/>
    <div className={s.cameraTop}><span><span className={s.empireBadge}>E</span>Empire · {LABELS[kind]}</span><span className={s.rec}><i/>{kind === 4 ? 'IA' : 'REC'} <motion.b>{time}</motion.b></span></div>
    <div className={s.recordViewport}>{kind === 4 ? <CloneVideo p={cloneP}/> : LABELS.slice(0, 4).map((_, i) => <FormatFrame key={i} p={p} index={i}/>)}</div>
    <div className={s.recordControls}><span>9:16</span><div className={s.recordButton}><i/><motion.span style={{ opacity: tap }}/></div><RotateCw size={21}/></div><div className={s.darkHome}/>
  </div>
}
function Formats({ p, cloneP, active, kind }: { p: Progress; cloneP: Progress; active: boolean; kind: number }) {
  const opacity = useTransform(cloneP, [.275, .292, .620, .628], [0, 1, 1, 0])
  const scale = useTransform(cloneP, [.275, .295, .620, .628], [.96, 1, 1, .98])
  const titles = ['Un lien vous fait réagir ?\nDonnez votre point de vue.', 'Un classement en tête ?\nExpliquez vos choix.', 'Une question d’un client ?\nRépondez-lui en vidéo.', 'Une opinion à partager ?\nRévélez vos choix.', 'Un Reel vous inspire ?\nCréez votre version.', 'Un sujet mérite plus ?\nDéveloppez-le en format long.']
  const descriptions = ['Le lien partagé s’affiche à l’écran. Vous réagissez face caméra.', 'Empire prépare votre tier list. Vous classez et commentez.', 'Empire affiche la question. Vous apportez la réponse.', 'Faites deviner les créateurs, puis révélez votre avis et vos critères.', 'Empire reprend le format avec votre visage et votre voix. Vous validez avant publication.', 'Réaction, classement ou réponse client : gardez le même sujet, avec plus de place pour l’expliquer.']
  return <motion.div className={`${s.formatScene} ${r.formats}`} data-scene="formats" data-format={kind} data-long={kind === 5} style={{ opacity, scale }} aria-hidden={!active}>
    <div className={`${r.preview} ${kind === 5 ? r.longPreview : ''}`} data-format-preview={kind === 5 ? 'long' : 'short'}>{kind === 5 ? <LongVideoFormat p={p}/> : <Recording p={p} cloneP={cloneP} kind={kind}/>}</div>
    <div className={`${s.formatExplanation} ${r.formatCopy}`}><h3>{titles[kind].split('\n').map((line, i) => <span key={line}>{i > 0 && <br/>}{line}</span>)}</h3><p>{descriptions[kind]}</p>{kind === 4 && <CloneDetails p={cloneP}/>}</div>
    <div className={`${s.formatShelf} ${r.shelf}`} aria-label="Formats présentés">{LABELS.map((name, i) => <div key={name} className={`${s.formatMini} ${kind === i ? s.chosen : ''}`}><div>{i === 5 ? <LongVideoArtwork still/> : i === 4 ? <CloneVideo p={cloneP} still/> : <Composition kind={i} p={p} still preview/>}</div><span>{name}{kind > i ? <Check size={12}/> : kind === i ? <span className={s.liveDot}/> : null}</span></div>)}</div>
  </motion.div>
}
function NetworkPost({ p, index }: { p: Progress; index: number }) {
  const Icon = SocialIcons[CHANNELS[index]], video = [0, 2, 3].includes(index)
  const count = useTransform(p, v => fmt(countFor(v, index)))
  const opacity = useTransform(p, [.572 + index * .002, .593 + index * .002], [0, 1])
  const y = useTransform(p, [.572 + index * .002, .593 + index * .002], [35, 0])
  const assetStart = [.602, .642, .642, .66, .699, .723, .745][index]
  const assetOpacity = useTransform(p, [assetStart, assetStart + .012], [0, 1])
  const assetY = useTransform(p, [assetStart, assetStart + .012], [30, 0])
  return <motion.article className={`${s.post} ${index === 3 ? s.winningPost : ''}`} data-network={CHANNELS[index]} style={{ opacity, y }}>
    <header className={s.platformChrome}><Icon/><b>{NETWORKS[index]}</b><span>{['Reels', 'Fil professionnel', 'Vidéo longue', 'Pour toi', 'Fil de discussion', 'Pour vous', 'Fil d’actualité'][index]}</span></header>
    {index !== 2 && index !== 3 && <div className={s.postAuthor}><img src={AVATAR} alt=""/><span><b>{index === 4 ? 'kevindufraisse' : 'Kevin Dufraisse'}</b><small>{index === 1 ? 'Conseils business · 2 h' : index === 5 ? '@kevindufraisse · 2 h' : index === 6 ? 'Publication publique · 2 h' : '@kevindufraisse'}</small></span><MoreHorizontal size={14}/></div>}
    {index === 2 ? <div className={s.youtubePublication}><div className={s.youtubePlayer}><LongVideoArtwork/><motion.div className={s.youtubeGeneratedCover} style={{ opacity: assetOpacity, y: assetY }}><div className={s.youtubeThumbnail}><img className={s.youtubeThumbnailImage} src="/demo/youtube-tierlist-v18.webp" alt="Miniature générée par Empire : Je les classe, Kevin et la tier list des créateurs business"/></div><span className={s.youtubeGeneratedLabel}><Sparkles size={11}/><span>Miniature créée par Empire</span><Check size={11}/></span></motion.div><span>12:48</span><div><Play size={14} fill="currentColor"/><span/><span>HD</span></div></div><div className={s.youtubeTitle}><b>Ma tier list des créateurs business français.</b><span>Vidéo longue · 3 chapitres</span></div><div className={s.youtubeChannel}><img src={AVATAR} alt=""/><span>Kevin Dufraisse<small>Votre chaîne YouTube</small></span><b>S’abonner</b></div></div>
    : video ? <div className={s.postVideo}><Composition kind={index === 0 ? 2 : 1} p={p} still/>{index === 3 ? <><div className={s.tiktokActions}><img src={AVATAR} alt=""/><Heart/><MessageCircle/><Bookmark/><Share2/></div><div className={s.tiktokCaption}><b>@kevindufraisse</b><span>Mon classement des créateurs business.</span><small><Music2 size={10}/>son original · Kevin</small></div></> : <span className={s.formatPostTag}>FAQ · votre Reel</span>}{index === 0 && <motion.div className={s.generatedCover} style={{ opacity: assetOpacity, y: assetY }}><PhotoThumbnail/><span className={s.empireGenerated}><Sparkles size={12}/><span><b>Miniature créée par Empire</b></span><Check size={12}/></span></motion.div>}</div>
    : <div className={s.postText}><b>{index === 5 ? '1/3 · Qui suivre pour progresser ?' : index === 4 ? 'Le nombre d’abonnés ne fait pas le bon conseil.' : 'Qui suivre en business ?'}</b><p>{index === 4 ? 'Le bon créateur, c’est celui dont tu peux appliquer les conseils à ton activité. Voici mon classement.' : index === 5 ? 'Un créateur. Une expertise. Voici les critères que je regarde. ↓' : 'Un créateur, une expertise. Voici les critères que je regarde avant de suivre ses conseils.'}</p><motion.div className={s.generatedLinkedin} style={{ opacity: assetOpacity, y: assetY }}><img src="/demo/kevin-portrait-v13.webp" alt={`Portrait studio généré par Empire pour ${NETWORKS[index]}`}/><span className={s.empireGenerated}><Sparkles size={12}/><span><b>Portrait créé par Empire</b></span><Check size={12}/></span></motion.div><small>{index === 5 ? 'Afficher ce fil' : index === 4 ? 'Afficher les réponses' : 'Adapté depuis votre vidéo · Tier list'}</small></div>}
    <PlatformMetrics index={index} count={count}/>
  </motion.article>
}
function Reach({ p, active }: { p: Progress; active: boolean }) {
  const viewport = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null), travel = useMotionValue(0)
  useEffect(() => { const measure = () => travel.set(Math.max(0, (track.current?.scrollWidth || 0) - (viewport.current?.clientWidth || 0))); const ro = new ResizeObserver(measure); if (viewport.current) ro.observe(viewport.current); if (track.current) ro.observe(track.current); measure(); return () => ro.disconnect() }, [travel])
  const x = useTransform([p, travel], values => -clamp(((values[0] as number) - .626) / .139) * (values[1] as number))
  const opacity = useTransform(p, [.568, .59, .807, .827], [0, 1, 1, 0])
  const cardsOpacity = useTransform(p, [.807, .827], [1, 0])
  const total = useTransform(p, v => fmt(VIEWS.reduce((sum, _, i) => sum + countFor(v, i), 0)))
  return <motion.div className={s.reachScene} data-scene="diffusion" style={{ opacity }} aria-hidden={!active}>
    <motion.div className={s.networkLegend} style={{ opacity: cardsOpacity }}>{CHANNELS.map((name, i) => { const Icon = SocialIcons[name]; return <span key={name}><Icon/>{NETWORKS[i]}</span> })}</motion.div>
    <motion.div ref={viewport} className={s.postsViewport} style={{ opacity: cardsOpacity }}><motion.div ref={track} className={s.posts} style={{ x }}>{CHANNELS.map((name, i) => <NetworkPost key={name} p={p} index={i}/>)}</motion.div></motion.div>
    <motion.div className={s.reachTotal} style={{ opacity: cardsOpacity }}><span>Chaque publication compte.</span><div><motion.b>{total}</motion.b><span>vues + impressions cumulées</span></div></motion.div>
    <small className={s.simulation}>Simulation de vues et d’impressions, pas une promesse de résultats ni une audience unique.</small>
  </motion.div>
}
function Calendar({ p, active }: { p: Progress; active: boolean }) {
  const opacity = useTransform(p, [.815, .835], [0, 1])
  const left = useTransform(p, [.875, .94], ['4%', '28.57%']), top = useTransform(p, [.875, .94], ['8%', '66.6667%'])
  const width = useTransform(p, [.875, .94], ['34%', '14.28%']), height = useTransform(p, [.875, .94], ['72%', '16.6667%'])
  const picked = useTransform(p, [.83, .85], [0, 1]), confirmed = useTransform(p, [.942, .96], [0, 1])
  const [done, setDone] = useState(false)
  useMotionValueEvent(p, 'change', v => setDone(v >= .942))
  return <motion.div className={s.calendarScene} data-scene="republication" style={{ opacity }} aria-hidden={!active}>
    <div className={s.calendarIntro}><h3>150 000 vues.<br/><em>Une nouvelle date.</em></h3><p>Le contenu qui fonctionne revient dans votre calendrier pour une nouvelle diffusion.</p><motion.div className={s.scheduleConfirmed} style={{ opacity: confirmed }}><Check size={18}/><span><b>Republication programmée</b><small>Mercredi 25 · 12:00</small></span></motion.div></div>
    <div className={s.calendarApp}><header><span className={s.empireBadge}>E</span><div><b>Calendrier</b><small>Vos publications</small></div><CalendarDays size={20}/></header><div className={s.month}><b>Novembre</b><span>{done ? '1 republication ajoutée' : 'Sélection du meilleur contenu'}</span></div><div className={s.weekdays}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((v, i) => <span key={i}>{v}</span>)}</div><div className={s.calendarGrid}>{Array.from({ length: 42 }, (_, i) => { const day = i - 5; return <div key={i} className={day === 25 ? s.targetDay : ''}><span>{day > 0 && day <= 30 ? day : ''}</span>{day === 4 && <small className={s.publishedMark}><Check size={10}/>Publié</small>}{day === 25 && <small className={s.targetTime}>12:00</small>}</div> })}<motion.div className={s.movingWinner} style={{ left, top, width, height, opacity: picked }}><div className={s.winnerVisual}><Composition kind={1} p={p} still/></div><div className={s.winnerMeta}><SocialIcons.tiktok/><b>150 000 vues</b><span>{TOPIC}</span></div><motion.span className={s.scheduledCheck} style={{ opacity: confirmed }}><Check size={11}/></motion.span></motion.div></div><footer><span><Check size={13}/>Le contenu qui a déjà trouvé son public.</span><motion.b style={{ opacity: confirmed }}>Reprogrammé</motion.b></footer></div>
  </motion.div>
}
function LongFormatStory() {
  const settled = useMotionValue(.558)
  return <section id="formula-youtube" className={journey.longSection} data-story="long-format" aria-labelledby="long-format-title">
    <header className={journey.heading}><h2 id="long-format-title">Votre sujet mérite plus ?<br/><em>Passez au format long.</em></h2></header>
    <div className={journey.longGrid} data-scene="formats" data-format="5" aria-hidden="false">
      <div className={journey.longPreview} data-format-preview="long"><LongVideoFormat p={settled}/></div>
      <div className={journey.longCopy}><h3>Le même sujet.<br/>Plus de place pour l’expliquer.</h3><p>Réaction, classement ou réponse client : développez votre point de vue dans une vidéo YouTube.</p></div>
    </div>
  </section>
}

function AccessibleStory() {
  return <><div data-story="accessible">
    <IdeaMessagesStory/>
    <section className={s.accessible}><h2 id="formula-format">Nous mettons votre idée dans le bon format.</h2><p>Un lien devient une réaction. Un classement devient une tier list. Une question client devient une réponse en vidéo.</p></section>
    <LeadMagnetScene staticMode/>
    <LongFormatStory/>
    <SecretFormatsGate staticMode/>
    <section className={s.accessible}>
      <h2 id="formula-diffusion">Nous adaptons et diffusons vos vidéos et vos textes sur tous vos réseaux.</h2><p>{NETWORKS.join(' · ')}. Les miniatures et les visuels accompagnent les publications.</p>
      <h3>Publiez la même vidéo sur plusieurs comptes, instantanément.</h3><p>Connectez vos comptes principaux et secondaires.</p>
      <h3>Nous republions automatiquement vos meilleurs contenus.</h3><p>Les contenus qui fonctionnent reviennent dans votre calendrier. Les scènes et les chiffres de la démonstration sont illustratifs.</p>
    </section>
  </div><CloneAppStory/><ClaudeMcpDemo/></>
}

function CreationStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawP } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const timeline = useTransform(rawP, [0, 1], [.305, .590])
  const p = useTransform(timeline, v => Math.min(v, .535))
  const [kind, setKind] = useState(0)
  useMotionValueEvent(timeline, 'change', v => setKind(v < .35 ? 0 : v < .415 ? 1 : v < .475 ? 2 : v < .535 ? 3 : 4))
  return <section ref={ref} className={`${s.story} ${r.story} ${journey.shortStory}`} data-story="formula" data-story-part="creation" data-step="format" aria-label="Les formats courts">
    {([['reaction', .32], ['tierlist', .385], ['faq', .445], ['clone', .565]] as const).map(([name, t]) => <span key={name} id={`formula-${name}`} className={s.anchor} style={{ top: `calc(${rawAt(t)}% - ${rawAt(t)}svh)` }}/>)}
    <span id="formula-format" className={s.anchor}/>
    <div data-viewport-stage className={s.sticky}>
      <div className={`${s.headline} ${r.headline}`} data-story-title><h2>Nous mettons votre idée dans le bon format.</h2></div>
      <div className={`${s.stage} ${r.stage}`}><Formats p={p} cloneP={timeline} active kind={kind}/></div>
      <div className={s.progress}><span><ArrowDown size={12}/>Continuez la découverte</span><div><motion.i style={{ scaleX: rawP }}/></div><small>Démonstration illustrée</small></div>
    </div>
  </section>
}

function DistributionStory() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawP } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const sequenceP = useTransform(rawP, [0, 1], [.568, 1])
  const p = useTransform(sequenceP, [0, .82, .92, 1], [0, .82, .82, 1])
  const [multi, setMulti] = useState(false), [calendar, setCalendar] = useState(false)
  useMotionValueEvent(sequenceP, 'change', v => { setMulti(v >= .82 && v < .92); setCalendar(v >= .92) })
  const title = multi ? 'Publiez la même vidéo sur plusieurs comptes, instantanément.' : calendar ? 'Nous republions automatiquement vos meilleurs contenus.' : 'Nous adaptons et diffusons vos vidéos et vos textes sur tous vos réseaux.'
  return <section ref={ref} className={`${s.story} ${r.story} ${stable.distribution}`} data-story="distribution" data-step={multi ? 'multi-accounts' : calendar ? 'republication' : 'diffusion'} aria-label="La diffusion de vos contenus">
    <span id="formula-diffusion" className={s.anchor} style={{ top: 'calc(7.407407% - 7.407407svh)' }}/>
    <div data-viewport-stage className={s.sticky}>
      <div className={`${s.headline} ${r.headline}`} data-story-title><h2>{title}</h2></div>
      <div className={`${s.stage} ${r.stage}`}>
        <Reach p={p} active={!multi && !calendar}/>
        <Calendar p={p} active={calendar}/>
        {multi && <MultiAccountBroadcast p={sequenceP} reel={<Composition kind={1} p={p} still/>}/>}
      </div>
      <div className={s.progress}><span><ArrowDown size={12}/>Continuez la découverte</span><div><motion.i style={{ scaleX: rawP }}/></div><small>Démonstration illustrée</small></div>
    </div>
  </section>
}

export function SourcesStory() {
  const { autopilot } = useAutopilot()
  const reduced = useReducedMotion()
  if (autopilot) return null
  if (reduced) return <AccessibleStory/>
  return <><IdeaMessagesStory/><CreationStory/><LeadMagnetScene/><LongFormatStory/><SecretFormatsGate/><DistributionStory/><CloneAppStory/><ClaudeMcpDemo/></>
}
