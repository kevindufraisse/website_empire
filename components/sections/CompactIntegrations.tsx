'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from 'framer-motion'
import { Link2, Check, MousePointer2, ArrowDown, ArrowUpRight } from 'lucide-react'
import { SocialIcons } from '../ui/social-icons'
import PreviewVideo from '../PreviewVideo'
import s from './CompactIntegrations.module.css'
const clamp=(n:number)=>Math.max(0,Math.min(1,n))
export default function CompactIntegrations(){
 const ref=useRef<HTMLElement>(null),reduced=!!useReducedMotion(),settled=useMotionValue(1)
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});const p=reduced?settled:scrollYProgress
 const clicks=useTransform(p,v=>Math.round(clamp((v-.08)/.20)*1240).toLocaleString('fr-FR'))
 const leads=useTransform(p,v=>Math.round(clamp((v-.32)/.20)*18).toString())
 const clients=useTransform(p,v=>Math.round(clamp((v-.60)/.18)*2).toString())
 const cursor=useTransform(p,[.01,.06,.15,.21],[0,1,1,0]),cursorY=useTransform(p,[.03,.13],[17,0])
 const fill=useTransform(p,[.14,.78],['inset(0 100% 0 0)','inset(0 0% 0 0)'])
 const leadOpacity=useTransform(p,[.29,.39],[.3,1]),clientOpacity=useTransform(p,[.58,.69],[.3,1])
 const matched=useTransform(p,[.77,.87],[0,1]),matchedY=useTransform(p,[.77,.87],[10,0])
 return <section ref={ref} id="empire-integrations" className={s.section} data-reduced={reduced} aria-label="Du post au client, grâce aux liens trackés"><div data-viewport-stage className={s.sticky}>
  <header className={s.copy}><small>LIENS TRACKÉS · CONVERSIONS</small><h3>Ce post vous a apporté<em> des clients.</em></h3><p>Un lien Empire dans votre post. Chaque clic, chaque contact, chaque client retrouve sa source.</p></header>
  <div className={s.panel}>
   <div className={s.linkSource}><div className={s.reel}><PreviewVideo src="https://empire-apercu-kevin-novembre-2026.austra1.chatgpt.site/demo/kevin-speaking-v11.mp4" poster="https://empire-apercu-kevin-novembre-2026.austra1.chatgpt.site/demo/kevin-speaking-v11.jpg" label="Le Reel tier list à l’origine des conversions" still={reduced}/><div className={s.ranking}>{['S','A','B'].map((r,i)=><span key={r}><b>{r}</b><img src={['/webinar/anthony-bourbon.jpg','/webinar/yomi-denzel.jpg','/webinar/oussama-ammar.jpg'][i]} alt=""/></span>)}</div></div><div className={s.sourceCopy}><span><SocialIcons.instagram/>Votre Reel « Tier list »</span><b>Recevoir le guide <ArrowUpRight size={14}/></b><small><Link2 size={11}/>Lien tracké par Empire</small></div><motion.span className={s.cursor} style={{opacity:cursor,y:cursorY}}><MousePointer2 size={25} fill="#171717" stroke="white"/></motion.span><span className={s.sourceCheck}><Check size={15}/></span></div>
   <span className={s.downArrow}><ArrowDown size={22}/></span>
   <div className={s.funnel}>
    <div className={s.metrics}><div><span><i/>Clics</span><motion.b>{clicks}</motion.b><small>sur votre lien</small></div><motion.div style={{opacity:leadOpacity}}><span><i/>Contacts</span><motion.b>{leads}</motion.b><small>demandes reçues</small></motion.div><motion.div style={{opacity:clientOpacity}}><span><i/>Clients</span><motion.b>{clients}</motion.b><small>achats confirmés</small></motion.div></div>
    <div className={s.chart} aria-hidden="true"><svg viewBox="0 0 840 175" preserveAspectRatio="none"><path d="M0 12 H80 C165 12 195 62 280 62 H330 C410 62 460 75 560 75 H840 V100 H560 C460 100 410 113 330 113 H280 C195 113 165 163 80 163 H0 Z" fill="#f0f1ed"/></svg><motion.svg viewBox="0 0 840 175" preserveAspectRatio="none" style={{clipPath:fill}}><path d="M0 12 H80 C165 12 195 62 280 62 V113 C195 113 165 163 80 163 H0 Z" fill="#edf3d8" stroke="#b9ca80"/><path d="M280 62 H330 C410 62 460 75 560 75 V100 C460 100 410 113 330 113 H280 Z" fill="#e5f0b8" stroke="#a9c85d"/><path d="M560 75 H840 V100 H560 Z" fill="#dafc68" stroke="#87b12b"/></motion.svg><div className={s.rates}><span>100 %</span><motion.span style={{opacity:leadOpacity}}>1,45 %</motion.span><motion.span style={{opacity:clientOpacity}}>11,1 %</motion.span></div></div>
    <motion.div className={s.attributed} style={{opacity:matched,y:matchedY}}><span className={s.customer}>C</span><div><b>Camille est devenue cliente.</b><span>Elle vient de votre Reel « Tier list ».</span></div><SocialIcons.instagram/><Check size={17}/></motion.div>
   </div>
   <footer className={s.toolConnections} aria-label="Vos outils reliés au contenu d’origine">
    <div><strong>Contacts</strong><span><img src="/integrations/tally.png" alt=""/>Tally</span><span><img src="/integrations/manychat.png" alt=""/>ManyChat</span></div>
    <div><strong>Rendez-vous</strong><span><img src="/integrations/calcom.png" alt=""/>Cal.com</span><span><img src="/integrations/calendly.svg" alt=""/>Calendly</span></div>
    <div><strong>Paiements</strong><span><img src="/integrations/stripe.svg" alt="" className={s.stripeLogo}/>Stripe</span><span><img src="/integrations/systeme.png" alt=""/>Systeme.io</span></div>
    <p><Link2 size={11}/>Empire relie chaque conversion à votre post.</p>
   </footer>
  </div><div className={s.caption}><span><ArrowDown size={12}/>Suivez le parcours au scroll.</span><small>Parcours et chiffres d’illustration.</small></div>
 </div></section>
}
