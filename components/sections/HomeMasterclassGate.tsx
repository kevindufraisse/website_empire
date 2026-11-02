'use client'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionStyle } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUp, Check, LockKeyhole, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { storeVideoEmail } from '@/components/VideoEmailGate'
import { trackAmplitude } from '@/lib/amplitude'
import s from './HomeMasterclassGate.module.css'
const DONE='empire-masterclass-requested-v16'
const PASSED='empire-discovery-passed-v18'
const PREVIEW=process.env.NEXT_PUBLIC_SITE_PREVIEW==='1'
function remembered(key:string){try{return sessionStorage.getItem(key)==='1'}catch{return false}}
function remember(key:string){try{sessionStorage.setItem(key,'1')}catch{}}
function MasterclassForm({onReady,reminder=false}:{onReady?:()=>void;reminder?:boolean}){
 const {lang}=useLanguage(),fr=lang==='fr'
 const [email,setEmail]=useState(''),[company,setCompany]=useState(''),[status,setStatus]=useState<'idle'|'loading'|'success'|'preview'|'error'>('idle'),[invalid,setInvalid]=useState(false)
 const suffix=reminder?'reminder':'gate'
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(status==='loading')return
  setInvalid(false)
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())){setInvalid(true);setStatus('error');return}
  if(PREVIEW){setStatus('preview');remember(DONE);window.dispatchEvent(new Event('empire-masterclass-updated'));onReady?.();return}
  setStatus('loading')
  try{
   const res=await fetch('/api/home-masterclass',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,company,locale:lang})})
   const data=await res.json()
   if(!res.ok||!data.success){setInvalid(data.code==='invalid_fields');setStatus('error');return}
   storeVideoEmail(email.trim().toLowerCase());remember(DONE);setStatus('success');window.dispatchEvent(new Event('empire-masterclass-updated'));trackAmplitude('home_masterclass_requested');onReady?.()
  }catch{setStatus('error')}
 }
 if(status==='success'||status==='preview')return <div className={s.success} role="status"><Check size={21}/><div><b>{status==='preview'?'La suite est débloquée.':fr?'C’est enregistré. La masterclass arrive par email.':'You’re registered. Check your inbox for the masterclass.'}</b><p>{status==='preview'?'Aucun email n’est envoyé depuis cet aperçu.':fr?'Vous pouvez continuer à découvrir Empire.':'Keep exploring Empire.'}</p></div></div>
 return <form onSubmit={submit} className={s.form} aria-label={fr?'Recevoir la masterclass':'Get the masterclass'}>
  <label htmlFor={`masterclass-email-${suffix}`}>{fr?'Recevez la vidéo dans votre boîte mail':'Get the video in your inbox'}</label><div className={s.field}><Mail size={18}/><input id={`masterclass-email-${suffix}`} type="email" autoComplete="email" inputMode="email" required maxLength={254} value={email} onChange={e=>{setEmail(e.target.value);if(status==='error')setStatus('idle')}} placeholder="vous@entreprise.com" aria-invalid={status==='error'&&invalid} aria-describedby={`masterclass-note-${suffix}`} disabled={status==='loading'}/></div>
  <div className={s.honeypot} aria-hidden><label htmlFor={`masterclass-company-${suffix}`}>Company</label><input id={`masterclass-company-${suffix}`} name="company" value={company} onChange={e=>setCompany(e.target.value)} tabIndex={-1} autoComplete="off"/></div>
  <button type="submit" disabled={status==='loading'}>{status==='loading'?(fr?'Enregistrement…':'Registering…'):(fr?'Recevoir la masterclass gratuite':'Get the free masterclass')}<ArrowRight size={17}/></button>
  <small id={`masterclass-note-${suffix}`}>{PREVIEW?'Aperçu du formulaire · envoi d’email désactivé.':fr?'1 h 26 de vidéo. À regarder quand vous voulez.':'1h26 of video. Watch whenever you like.'}</small>
  {status==='error'&&<p role="alert" className={s.error}>{invalid?'Vérifiez votre adresse email.':'L’envoi n’a pas abouti. Vous pouvez réessayer ou passer pour continuer.'}</p>}
 </form>
}
function MasterclassThumbnail(){
 const [unavailable,setUnavailable]=useState(false)
 return <div className={s.thumbnail}>{unavailable?<div className={s.thumbnailFallback}><img src="/founders/kevin.jpg" alt="Kevin Dufraisse"/><div><span>LA MASTERCLASS EMPIRE</span><b>La formule<br/>pour être vu.</b><small>Avec Kevin Dufraisse</small></div></div>:<img src="https://i.ytimg.com/vi/AKfoDblGUNs/maxresdefault.jpg" alt="La masterclass de Kevin Dufraisse : comprendre la formule Empire" width={1280} height={720} onError={()=>setUnavailable(true)} ref={node=>{if(node?.complete&&!node.naturalWidth)setUnavailable(true)}} loading="lazy"/>}<span>MASTERCLASS · 1 H 26</span></div>
}
export function MasterclassReminder(){
 const [hidden,setHidden]=useState(true)
 useEffect(()=>{const sync=()=>setHidden(remembered(DONE));sync();window.addEventListener('empire-masterclass-updated',sync);return()=>window.removeEventListener('empire-masterclass-updated',sync)},[])
 if(hidden)return null
 return <section className={s.reminder} aria-labelledby="masterclass-reminder-title"><div className={s.reminderVisual}><MasterclassThumbnail/></div><div className={s.reminderCopy}><small>DERNIER RAPPEL · GRATUITE</small><h2 id="masterclass-reminder-title">Ne partez pas sans<br/>la masterclass.</h2><p>La formule, expliquée par Kevin en 1 h 26.<br/>Recevez la vidéo et regardez-la à votre rythme.</p><MasterclassForm reminder/></div></section>
}
export default function HomeMasterclassGate({children}:{children:ReactNode}){
 const {autopilot}=useAutopilot(),{lang}=useLanguage(),fr=lang==='fr'
 const [locked,setLocked]=useState(true),[releasing,setReleasing]=useState(false)
 const gated=useRef<HTMLDivElement>(null)
 const reduced=useReducedMotion()
 const pull=useMotionValue(0)
 const tension=useSpring(pull,{stiffness:320,damping:30,mass:.45})
 const opening=useMotionValue(0)
 const releaseStarted=useRef(false)
 const blur=useTransform(opening,v=>`${Math.max(0,8*(1-v))}px`)
 const scaleX=useTransform([tension,opening],([t,o])=>1-.075*Number(t)*(1-Number(o)))
 const scaleY=useTransform([tension,opening],([t,o])=>1-.19*Number(t)*(1-Number(o)))
 const lift=useTransform([tension,opening],([t,o])=>`${38*Number(t)*(1-Number(o))}px`)
 const radius=useTransform([tension,opening],([t,o])=>`${Math.max(0,28*Number(t)*(1-Number(o)))}px`)
 const veilOpacity=useTransform(opening,[0,.65,1],[1,1,0])
 const handleX=useTransform(tension,[0,1],[1,1.24])
 const handleY=useTransform(tension,[0,1],[1,.7])
 const handleLift=useTransform(tension,[0,1],[0,-30])
 useEffect(()=>{
  if(!locked||autopilot)return
  let frame=0,animation:ReturnType<typeof animate>|undefined,cancelled=false
  const measure=()=>{
   frame=0
   if(releaseStarted.current)return
   const top=gated.current?.getBoundingClientRect().top
   if(top===undefined)return
   const next=Math.max(0,Math.min(1,(window.innerHeight*.82-top)/(window.innerHeight*.69)))
   pull.set(next)
   if(next>=1){
    releaseStarted.current=true;setReleasing(true)
    if(reduced){opening.set(1);remember(PASSED);setLocked(false);return}
    animation=animate(opening,1,{type:'spring',stiffness:260,damping:17,mass:.8})
    animation.then(()=>{if(!cancelled){remember(PASSED);setLocked(false)}})
   }
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure)}
  measure();window.addEventListener('scroll',schedule,true);window.addEventListener('resize',schedule)
  return()=>{cancelled=true;cancelAnimationFrame(frame);animation?.stop();window.removeEventListener('scroll',schedule,true);window.removeEventListener('resize',schedule)}
 },[locked,autopilot,reduced,pull,opening])
 useEffect(()=>{const sync=()=>{const deepLink=/^#(formula-|empire-)/.test(window.location.hash);if(remembered(PASSED)||remembered(DONE)||deepLink){setLocked(false);if(deepLink)requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById(window.location.hash.slice(1))?.scrollIntoView({behavior:'instant'})))}};sync();window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[])
 function unlock(scroll=false){remember(PASSED);setLocked(false);if(scroll){trackAmplitude('home_masterclass_skipped');requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById('formula-message')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})))}}
 if(autopilot)return <>{children}</>
 return <><section className={s.section} aria-labelledby="masterclass-title" id="home-masterclass"><div className={s.card}>
  <div className={s.visual}><MasterclassThumbnail/><p>Comprendre la formule.<br/><em>Savoir l’appliquer à votre activité.</em></p></div>
  <div className={s.copy}><small>GRATUITE · TRÈS RECOMMANDÉE</small><h2 id="masterclass-title">Avant de découvrir la suite…</h2><p>Pourquoi certains contenus sont vus, et comment appliquer ces mécaniques à vos propres sujets. Kevin vous montre tout dans la masterclass.</p><MasterclassForm onReady={()=>unlock()}/><button className={s.skip} onClick={()=>unlock(true)}>{locked?'Passer et découvrir Empire':'Continuer la découverte'}<ArrowDown size={16}/></button></div>
 </div></section><motion.div ref={gated} className={s.discovery} data-discovery-gate="true" data-locked={locked} data-releasing={releasing} style={{"--gate-blur":reduced?'0px':blur,"--gate-y":reduced?'0px':lift,"--gate-scale-x":reduced?1:scaleX,"--gate-scale-y":reduced?1:scaleY,"--gate-radius":radius} as MotionStyle}><div className={s.content}>{children}</div>{locked&&<motion.div className={s.squeezeVeil} style={{opacity:veilOpacity,pointerEvents:releasing?'none':'auto'}} aria-hidden={releasing}><motion.div className={s.pullHandle} style={reduced?{}:{scaleX:handleX,scaleY:handleY,y:handleLift}}><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28"/><motion.circle cx="32" cy="32" r="28" style={{pathLength:tension}}/></svg>{releasing?<Check size={23}/>:<ArrowUp size={23}/>}</motion.div><b>{releasing?'C’est parti.':'Continuez à scroller.'}</b><span>{releasing?'Découvrez Empire.':'La suite se débloque juste en dessous.'}</span><button onClick={()=>unlock(true)} tabIndex={releasing?-1:0}>Passer directement <ArrowDown size={14}/></button><small>La masterclass reste facultative.</small></motion.div>}</motion.div></>
}
