'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, CheckCheck, Clock3, FileText, Heart, Lightbulb, Link2, MessageCircle, Mic, MoreHorizontal, Play, Plus, Repeat2, Send, ShieldCheck, Smartphone, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { SocialIcons } from '@/components/ui/social-icons'
import { DISTRIBUTION_RESULTS, DISTRIBUTION_TOTAL } from '@/lib/distribution-example'
import s from './FormulaScrollStory.module.css'

type Progress = MotionValue<number>
type SceneProps = { progress: Progress; fr: boolean; active: boolean }
const STARTS = [0, .24, .46, .76]
const CHAPTERS = [
  { id:'message', fr:'Message', en:'Message', titleFr:'Un vocal. Une note. Un Reel.', titleEn:'A voice note. A note. A Reel.', accentFr:'Empire en récupère l’idée.', accentEn:'Empire extracts the idea.', descFr:'Dans l’application, déposez votre idée ou une inspiration repérée chez vos concurrents.', descEn:'In the app, add your idea or something that inspired you in your market.' },
  { id:'format', fr:'Format', en:'Format', titleFr:'La même idée.', titleEn:'The same idea.', accentFr:'Plusieurs façons de la raconter.', accentEn:'More ways to tell it.', descFr:'Une question devient une FAQ. Un classement devient une tier list. Votre point de vue devient un post.', descEn:'A question becomes a Q&A. A ranking becomes a tier list. Your perspective becomes a post.' },
  { id:'diffusion', fr:'Diffusion', en:'Distribution', titleFr:'Votre idée ne s’arrête plus', titleEn:'Your idea no longer stops', accentFr:'à un seul réseau.', accentEn:'at one social network.', descFr:'Chaque réseau reçoit son contenu. Les résultats remontent. Vos meilleurs posts peuvent repartir.', descEn:'Each channel gets its content. Results come back. Your best posts can go out again.' },
  { id:'time', fr:'Temps', en:'Time', titleFr:'1 heure par jour ?', titleEn:'One hour every day?', accentFr:'Visez 1 heure par semaine.', accentEn:'Aim for one hour a week.', descFr:'Vous partagez vos idées et validez. Empire prépare, monte et publie. Selon votre volume de contenus.', descEn:'Share your ideas and approve. Empire prepares, edits and publishes. Depending on your content volume.' },
]
const TOPIC = { fr:'Pourquoi les titres des médias se ressemblent-ils ?', en:'Why do media headlines all sound alike?' }
const NETWORKS = ['linkedin','instagram','youtube','tiktok','threads','twitter','facebook'] as const
const NETWORK_LABELS = ['LinkedIn','Instagram','YouTube Shorts','TikTok','Threads','X','Facebook']

function Scene({progress,index,active,children,className=''}: {progress:Progress;index:number;active:boolean;children:ReactNode;className?:string}) {
  const start=STARTS[index];const end=STARTS[index+1]??1.1
  const opacity=useTransform(progress,index===0?[0,end-.025,end+.025]:[start-.025,start+.025,end-.025,end+.025],index===0?[1,1,0]:[0,1,1,0])
  const y=useTransform(progress,[start,start+.05,end-.05,end],[25,0,0,-25])
  return <motion.div className={`${s.scene} ${className}`} style={{opacity,y,pointerEvents:active?'auto':'none'}} aria-hidden={!active}>{children}</motion.div>
}
function Wave({small=false}:{small?:boolean}) {
  return <div className={`${s.wave} ${small?s.smallWave:''}`} aria-hidden>{Array.from({length:25},(_,i)=><i key={i} style={{height:`${20+(i*37)%80}%`}}/>)}</div>
}
function Idea({fr,compact=false}:{fr:boolean;compact?:boolean}) {
  return <div className={`${s.idea} ${compact?s.compactIdea:''}`}><span><Lightbulb size={15}/>{fr?'IDÉE RÉCUPÉRÉE':'IDEA EXTRACTED'}<Check size={14}/></span><b>{TOPIC[fr?'fr':'en']}</b>{!compact&&<p>{fr?'Votre angle : ce qui distingue un média… et ce qui finit par le faire ressembler aux autres.':'Your angle: what makes a media outlet different… and what makes it resemble the others.'}</p>}</div>
}
function MessageScene({progress,fr,active}:SceneProps) {
  const [kind,setKind]=useState(0)
  const extracted=useTransform(progress,[.065,.14],[0,1]);const extractY=useTransform(progress,[.065,.14],[28,0]);const line=useTransform(progress,[.05,.13],[0,1])
  const sourceScale=useTransform(progress,[.14,.22],[1,.94]);const sourceX=useTransform(progress,[.14,.22],[0,-15])
  const typed=useTransform(progress,v=>(fr?'Pourquoi les titres d’HugoDécrypte ressemblent-ils à ceux des médias traditionnels ?':'Why do HugoDécrypte’s headlines resemble traditional media?').slice(0,Math.round(Math.min(v/.055,1)*100)))
  const modes=[{icon:Mic,fr:'Envoyer un vocal',en:'Send a voice note'},{icon:FileText,fr:'Ajouter une note',en:'Add a note'},{icon:Link2,fr:'Partager un Reel',en:'Share a Reel'}]
  return <Scene progress={progress} index={0} active={active}><div className={s.messageLayout}>
    <motion.div className={s.inputApp} style={{scale:sourceScale,x:sourceX}}>
      <div className={s.appToolbar}><span className={s.appMark}>E</span><b>Empire</b><span>{fr?'Mes idées':'My ideas'}</span><Plus size={17}/></div>
      <div className={s.inputBody}><span className={s.kicker}>{fr?'AJOUTER UNE IDÉE':'ADD AN IDEA'}</span><h3>{fr?'Ça commence ici.':'It starts here.'}</h3>
        <div className={s.inputModes} role="tablist" aria-label={fr?'Exemples de sources':'Example sources'}>{modes.map((mode,i)=><button key={i} role="tab" aria-selected={kind===i} tabIndex={active?0:-1} onClick={()=>setKind(i)} className={kind===i?s.modeSelected:''}><mode.icon size={18}/><span>{fr?mode.fr:mode.en}</span></button>)}</div>
        <div className={s.sourceExample} role="tabpanel">
          {kind===0?<><div className={s.voiceTitle}><span><Mic size={17}/>{fr?'Vocal envoyé':'Voice note sent'}</span><small>00:18 <CheckCheck size={13}/></small></div><Wave/><p><motion.span>{typed}</motion.span></p></>:kind===1?<><div className={s.voiceTitle}><span><FileText size={17}/>{fr?'Note ajoutée':'Note added'}</span><Check size={14}/></div><p>{fr?'HugoDécrypte voulait rendre l’actualité plus claire. Pourquoi retrouve-t-on les mêmes titres que dans les médias traditionnels ?':'HugoDécrypte wanted to make news easier to understand. Why do the headlines now resemble traditional media?'}</p></>:<><div className={s.voiceTitle}><span><SocialIcons.instagram/>{fr?'Reel partagé':'Shared Reel'}</span><Check size={14}/></div><div className={s.reelSource}><img src="/webinar/hugo-decrypte.jpg" alt="" width={70} height={70}/><span><b>{fr?'Un contenu repéré dans votre veille':'A post found in your research'}</b><small>{fr?'Instagram, TikTok, YouTube ou un post LinkedIn':'Instagram, TikTok, YouTube or a LinkedIn post'}</small></span><Play size={17}/></div></>}
        </div><p className={s.inputNote}>{fr?'Une idée personnelle ou un contenu de concurrent. Empire en extrait le sujet.':'Your own idea or a competitor’s post. Empire extracts the topic.'}</p>
      </div>
    </motion.div>
    <div className={s.extraction}><motion.div className={s.connector} style={{scaleX:line}}><ArrowRight size={21}/></motion.div><motion.div style={{opacity:extracted,y:extractY}}><Idea fr={fr}/><span className={s.nextHint}>{fr?'Cette idée passe dans vos formats':'This idea moves into your formats'}<ArrowDown size={15}/></span></motion.div></div>
  </div></Scene>
}
function Face({className=''}:{className?:string}) { return <div className={`${s.face} ${className}`}><img src="/formats/tierlist.webp" width={540} height={960} alt="Kevin présentant son point de vue"/></div> }
function FormatScene({progress,fr,active}:SceneProps) {
  const spread=useTransform(progress,[.24,.30],[0,1]);const shift=useTransform(progress,[.28,.31,.35,.38,.42],['0%','0%','-33.333%','-33.333%','-66.666%'])
  return <Scene progress={progress} index={1} active={active}><div className={s.formatScene}>
    <div className={s.topicStrip}><Lightbulb size={15}/><span>{TOPIC[fr?'fr':'en']}</span><ArrowDown size={16}/></div>
    <div className={s.formatViewport}><motion.div className={s.formatTrack} style={{x:shift}}>
      {[0,1,2].map((i)=><FormatCard key={i} index={i} progress={progress} fr={fr}/>)}
    </motion.div></div>
    <motion.div className={s.formatExtras} style={{opacity:spread}}><span>{fr?'Aussi : interview, citation, podcast, réaction, flou → net…':'Also: interview, quote, podcast, reaction, blur → reveal…'}</span><a href="/formats" tabIndex={active?0:-1}>{fr?'Tous les formats':'All formats'}<ArrowRight size={12}/></a></motion.div>
  </div></Scene>
}
function FormatCard({index,progress,fr}:{index:number;progress:Progress;fr:boolean}) {
  const x=useTransform(progress,[.245,.31],[(1-index)*190,0]);const y=useTransform(progress,[.245,.31],[70,0]);const rotate=useTransform(progress,[.245,.31],[(index-1)*7,0]);const opacity=useTransform(progress,[.245+index*.008,.29+index*.008],[0,1])
  return <motion.article className={s.formatCard} style={{x,y,rotate,opacity}}>
    <div className={s.formatPreview}>
      {index===0?<><Face/><div className={s.faqSticker}><small>{fr?'UNE QUESTION À VOTRE AUDIENCE':'A QUESTION FROM YOUR AUDIENCE'}</small><b>{fr?'Pourquoi les médias finissent-ils par se ressembler ?':'Why do media outlets end up sounding alike?'}</b></div></>:index===1?<><Face/><div className={s.tierList}><b>{fr?'Les titres des médias, classés':'Media headlines, ranked'}</b>{(fr?['Ça explique','Ça intrigue','Ça fait cliquer']:['It explains','It intrigues','It gets clicks']).map((t,i)=><div key={t}><span>{['S','A','B'][i]}</span><b>{t}</b><i/></div>)}</div></>:<div className={s.writtenPreview}><SocialIcons.linkedin/><small>{fr?'VOTRE POINT DE VUE':'YOUR PERSPECTIVE'}</small><h4>{fr?'HugoDécrypte voulait créer un autre média.':'HugoDécrypte wanted to build a different media outlet.'}</h4><p>{fr?'Aujourd’hui, regarde ses titres. Ce sont les mêmes ressorts que les médias traditionnels…':'Now look at the headlines. They use the same devices as traditional media…'}</p><div><img src="/founders/kevin.jpg" alt="" width={25} height={25}/><span>Kevin Dufraisse</span></div></div>}
    </div><div className={s.formatCaption}><span>0{index+1}</span><div><h3>{index===0?'FAQ':index===1?'Tier list':fr?'Post écrit':'Written post'}</h3><p>{index===0?(fr?'Vous répondez à une question.':'Answer a question.'):index===1?(fr?'Vous classez, vous expliquez vos choix.':'Rank items and explain your choices.'):(fr?'Vous développez votre point de vue.':'Develop your point of view.')}</p></div></div>
  </motion.article>
}
function Count({progress,from,to,value,fr,base=0}:{progress:Progress;from:number;to:number;value:number;fr:boolean;base?:number}) {
  const count=useTransform(progress,p=>Math.round(base+Math.min(1,Math.max(0,(p-from)/(to-from)))*(value-base)).toLocaleString(fr?'fr-FR':'en-US'))
  return <motion.span>{count}</motion.span>
}
function SocialPost({index,progress,fr}:{index:number;progress:Progress;fr:boolean}) {
  const result=DISTRIBUTION_RESULTS[index];const Icon=SocialIcons[result.network]
  const x=useTransform(progress,[.465,.52],[(1-index)*220,0]);const y=useTransform(progress,[.465,.52,.65,.70],[45,0,0,-12]);const rotate=useTransform(progress,[.465,.52],[(index-1)*8,0])
  return <motion.article className={`${s.socialPost} ${index===2?s.instagramPost:''}`} style={{x,y,rotate}}>
    <div className={s.networkHeader}><Icon/><b>{result.label}</b><span>{index===2?'Reels':fr?'Post écrit':'Written post'}</span></div>
    <div className={s.author}><img src="/founders/kevin.jpg" width={28} height={28} alt=""/><span><b>Kevin Dufraisse</b><small>{index===2?(fr?'11 juin 2026':'June 11, 2026'):(fr?'10 juin 2026':'June 10, 2026')}</small></span><MoreHorizontal size={17}/></div>
    {index===2?<div className={s.socialReel}><img src="/webinar/hugo-decrypte.jpg" width={225} height={225} alt="HugoDécrypte, sujet du contenu"/><span><Play size={16} fill="currentColor"/>{fr?'La même idée en vidéo':'The same idea as a video'}</span><b>{fr?'Un autre média. Les mêmes titres ?':'Different media. Same headlines?'}</b></div>:<div className={s.socialText}><p>{fr?'HugoDécrypte a lancé sa chaîne YouTube pour aider les gens à comprendre l’actu.':'HugoDécrypte launched his YouTube channel to help people understand the news.'}</p><strong>{fr?'Aujourd’hui, regarde ses titres.':'Now look at the headlines.'}</strong><p>{fr?'C’est exactement les mêmes que BFM et TF1…':'They are exactly the same as BFM and TF1…'}</p></div>}
    <div className={s.socialActions}><Heart size={15}/><MessageCircle size={15}/><Repeat2 size={15}/><Send size={15}/></div>
    <div className={s.postMetric}><b><Count progress={progress} from={.53+index*.015} to={.61+index*.015} value={result.views} fr={fr}/></b><span>{fr?result.unitFr:result.unitEn}</span></div>
  </motion.article>
}
function DiffusionScene({progress,fr,active}:SceneProps) {
  const shift=useTransform(progress,[.50,.535,.56,.59,.62],['0%','0%','-33.333%','-33.333%','-66.666%'])
  const cardsScale=useTransform(progress,[.64,.69],[1,.83]);const cardsY=useTransform(progress,[.64,.69],[0,0]);const republication=useTransform(progress,[.65,.70],[0,1]);const repY=useTransform(progress,[.65,.70],[35,0]);const repX=useTransform(progress,[.69,.74],['0%','100%'])
  return <Scene progress={progress} index={2} active={active}><div className={s.distribution}>
    <div className={s.resultHeadline}><span>{fr?'CAS RÉEL · UNE SEULE IDÉE':'REAL CASE · ONE IDEA'}</span><p><span>39 546</span><ArrowRight size={24}/><b><Count progress={progress} from={.53} to={.64} value={DISTRIBUTION_TOTAL} fr={fr} base={39546}/></b><small>{fr?'vues et impressions cumulées':'combined views and impressions'}</small></p></div>
    <motion.div className={s.socialViewport} style={{scale:cardsScale,y:cardsY}}><motion.div className={s.socialTrack} style={{x:shift}}>{DISTRIBUTION_RESULTS.map((r,i)=><SocialPost key={r.network} index={i} progress={progress} fr={fr}/>)}</motion.div></motion.div>
    <div className={s.allNetworks}>{NETWORKS.map((name,i)=>{const Icon=SocialIcons[name];return <span key={name}><Icon/><small>{NETWORK_LABELS[i]}</small></span>})}</div>
    <motion.div className={s.republication} style={{opacity:republication,y:repY}}><div className={s.republishTitle}><Repeat2 size={22}/><span><b>{fr?'Republication de vos meilleurs contenus.':'Republish your best content.'}</b><small>{fr?'Vous validez. Empire les remet au calendrier.':'You approve. Empire adds them back to the calendar.'}</small></span></div><div className={s.republishRail}><span><Check size={13}/>{fr?'Déjà publié':'Published'}</span><motion.i style={{x:repX}}><FileText size={16}/></motion.i><span><Repeat2 size={13}/>{fr?'À republier':'Republish'}</span></div></motion.div>
    <small className={s.resultSource}>{fr?'Cas du compte de Kevin, relevé le 08/09/2026. Représentation des publications ; résultats historiques, non garantis.':'Kevin’s account, recorded 09/08/2026. Posts illustrated; historical results, not guaranteed.'}</small>
  </div></Scene>
}
function TimeScene({progress,fr,active}:SceneProps) {
  const phoneOpacity=useTransform(progress,[.81,.86],[0,1]);const phoneY=useTransform(progress,[.81,.87],[65,0]);const calendarScale=useTransform(progress,[.81,.86],[1,.94]);const checked=useTransform(progress,[.9,.95],[0,1]);const transcriptOpacity=useTransform(progress,[.89,.93],[1,0])
  return <Scene progress={progress} index={3} active={active}><div className={s.timeScene}>
    <motion.div className={s.timeComparison} style={{scale:calendarScale}}><span className={s.kicker}>{fr?'DU TEMPS POUR TOUS VOS CONTENUS':'TIME FOR ALL YOUR CONTENT'}</span><div className={s.timeBefore}><span>{fr?'Aujourd’hui, si vous y passez':'If today you spend'}</span><b>1 h <small>/ {fr?'jour':'day'}</small></b><div className={s.week}>{(fr?['L','M','M','J','V','S','D']:['M','T','W','T','F','S','S']).map((d,i)=><Day key={i} index={i} progress={progress} day={d}/>)}</div></div><ArrowDown className={s.timeArrow} size={25}/><div className={s.timeAfter}><span>{fr?'Avec Empire, visez':'With Empire, aim for'}</span><b>1 h <small>/ {fr?'semaine':'week'}</small></b><p>{fr?'20 min à 1 h selon votre volume. Idées et validation comprises.':'20 min to 1 hour depending on volume. Ideas and approval included.'}</p></div></motion.div>
    <motion.div className={s.phoneWithCopy} style={{opacity:phoneOpacity,y:phoneY}}><div className={s.phone}><div className={s.phoneNotch}/><div className={s.phoneHeader}><span className={s.appMark}>E</span><b>Empire</b><Mic size={17}/></div><span className={s.phoneEyebrow}>{fr?'VOTRE PROCHAINE IDÉE':'YOUR NEXT IDEA'}</span><h3>{fr?'Parlez. C’est enregistré.':'Speak. It’s recorded.'}</h3><div className={s.phoneVoice}><Wave/><span><Mic size={19}/>00:18<CheckCheck size={15}/></span></div><motion.div className={s.phoneTranscript} style={{opacity:transcriptOpacity}}><small>{fr?'IDÉE RÉCUPÉRÉE':'IDEA EXTRACTED'}</small><p>{TOPIC[fr?'fr':'en']}</p></motion.div><motion.div className={s.phoneApproved} style={{opacity:checked}}><ShieldCheck size={20}/><span><b>{fr?'Relu par l’équipe':'Team-reviewed'}</b><small>{fr?'Prêt pour votre validation':'Ready for your approval'}</small></span><Check size={16}/></motion.div><div className={s.phoneHome}/></div><span className={s.appCaption}><Smartphone size={14}/>{fr?'L’application Empire':'The Empire app'}</span></motion.div>
    <motion.div className={s.timeBenefits} style={{opacity:phoneOpacity,y:phoneY}}><h3>{fr?'Une idée en marchant.':'An idea on a walk.'}<br/><em>{fr?'Du contenu toute la semaine.':'Content all week.'}</em></h3><p>{fr?'Entre deux rendez-vous, pendant une balade ou dans votre voiture à l’arrêt. Un vocal suffit pour démarrer.':'Between meetings, on a walk, or in your parked car. A voice note is enough to get started.'}</p><div><Mic size={18}/><span>{fr?'Vous partagez votre expertise.':'You share your expertise.'}</span></div><div><Sparkles size={18}/><span>{fr?'Empire monte et adapte aux réseaux.':'Empire edits and adapts for every channel.'}</span></div><div><CheckCheck size={18}/><span>{fr?'Vous validez, Empire publie.':'You approve. Empire publishes.'}</span></div></motion.div>
  </div></Scene>
}
function Day({index,progress,day}:{index:number;progress:Progress;day:string}) { const scale=useTransform(progress,[.79+index*.004,.84+index*.004],[1,index===2?1:.25]);const opacity=useTransform(progress,[.79+index*.004,.84+index*.004],[1,index===2?1:.2]);return <motion.span style={{scale,opacity}}><b>{day}</b><i>1h</i></motion.span> }
function ReducedStory({fr}:{fr:boolean}) { const still=useMotionValue(.34); return <section className={s.reduced}>{CHAPTERS.map((chapter,i)=><article id={i===0?undefined:`formula-${chapter.id}`} key={chapter.id}><small>0{i+1} · {fr?chapter.fr:chapter.en}</small><h2>{fr?chapter.titleFr:chapter.titleEn} {fr?chapter.accentFr:chapter.accentEn}</h2><p>{fr?chapter.descFr:chapter.descEn}</p>{i===0?<Idea fr={fr}/>:i===1?<div className={s.reducedFormats}>{[0,1,2].map(index=><FormatCard key={index} index={index} progress={still} fr={fr}/>)}</div>:i===2?<div className={s.reducedMetrics}>{DISTRIBUTION_RESULTS.map(r=><p key={r.network}>{r.label}<b>{r.views.toLocaleString(fr?'fr-FR':'en-US')} {fr?r.unitFr:r.unitEn}</b></p>)}<p>{fr?'Vos meilleurs contenus peuvent être republiés, avec votre accord.':'Your best content can be republished, with your approval.'}</p></div>:<p>{fr?'Envoyez un vocal dans l’application, puis validez les contenus relus par l’équipe. 20 min à 1 h par semaine selon le volume.':'Send a voice note in the app, then approve team-reviewed content. 20 min to 1 hour a week depending on volume.'}</p>}</article>)}</section> }
export function SourcesStory() {
  const {lang}=useLanguage();const fr=lang==='fr';const {autopilot}=useAutopilot();const reduced=useReducedMotion();const ref=useRef<HTMLElement>(null)
  const {scrollYProgress:progress}=useScroll({target:ref,offset:['start start','end end']});const [phase,setPhase]=useState(0)
  useMotionValueEvent(progress,'change',value=>setPhase(value<.24?0:value<.46?1:value<.76?2:3))
  if(autopilot)return null
  if(reduced)return <ReducedStory fr={fr}/>
  return <section ref={ref} className={s.story} data-story="formula" data-step={CHAPTERS[phase].id} aria-label={fr?'La formule Empire, de l’idée au temps gagné':'The Empire formula, from idea to time saved'}>
    {CHAPTERS.slice(1).map((chapter,i)=><span key={chapter.id} id={`formula-${chapter.id}`} className={s.anchor} style={{top:`calc(${STARTS[i+1]*100}% - ${STARTS[i+1]*100}svh)`}}/>)}
    <div className={s.sticky}><nav className={s.chapters} aria-label={fr?'Les étapes de la formule':'Formula chapters'}>{[...CHAPTERS,{id:'cost',fr:'Coût',en:'Cost'}].map((c,i)=><a key={c.id} href={`#formula-${c.id}`} aria-current={i===phase?'step':undefined}><span>0{i+1}</span>{fr?c.fr:c.en}{i<4&&<ArrowRight size={12}/>}</a>)}</nav>
      <div className={s.headings}>{CHAPTERS.map((c,i)=><Scene key={c.id} progress={progress} index={i} active={phase===i}><h2>{fr?c.titleFr:c.titleEn}<br/><em>{fr?c.accentFr:c.accentEn}</em></h2><p>{fr?c.descFr:c.descEn}</p></Scene>)}</div>
      <div className={s.stage}><MessageScene progress={progress} fr={fr} active={phase===0}/><FormatScene progress={progress} fr={fr} active={phase===1}/><DiffusionScene progress={progress} fr={fr} active={phase===2}/><TimeScene progress={progress} fr={fr} active={phase===3}/></div>
      <div className={s.storyFooter}><span><ArrowDown size={13}/>{fr?'Continuez : la formule se déroule.':'Keep scrolling: the formula unfolds.'}</span><div><motion.i style={{scaleX:progress}}/></div><small>{fr?'Parcours illustré':'Illustrated workflow'}</small></div>
    </div>
  </section>
}
