'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, ArrowLeftRight } from 'lucide-react'
import { useAutopilot } from '@/contexts/AutopilotContext'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import s from './QuickWinsSection.module.css'
const PEOPLE=[['Lucas','Analyste de veille','1 000'],['Emma','Stratège de contenu','1 500'],['Thomas','Scénariste','1 500'],['Léa','Monteur vidéo','2 000'],['Hugo','Copywriter','1 000'],['Inès','Responsable diffusion','1 000'],['Camille','Graphiste','1 500'],['Nicolas','Community manager','1 000']]
const COLUMNS=['Empire','Freelance','Agence','ChatGPT','CapCut + Buffer']
const ROWS=[
 ['Idées & veille','Inclus','Selon mission','Selon contrat','À guider','À votre charge'],
 ['Création','Formats + montage','Sa spécialité','Selon contrat','Textes & scripts','Votre montage'],
 ['Diffusion','7 réseaux + republication','Selon mission','Selon contrat','Outils à ajouter','Via Buffer'],
 ['Conversions','Reliées au post','Selon mission','Selon contrat','Données à fournir','Selon les offres'],
 ['Budget','Abonnement + crédits','Honoraires','Devis','Abonnement + outils','Offres distinctes'],
]
export default function QuickWinsSection(){
 const {autopilot}=useAutopilot(),reduced=useReducedMotion()
 if(autopilot)return null
 return <section className={s.section} aria-labelledby="comparison-title"><div className={s.wrap}>
  <header className={s.heading}><small>05 · COÛT</small><h2 id="comparison-title">Le travail de toute une équipe.<br/><em>Réuni dans Empire.</em></h2></header>
  <div className={s.team}>{PEOPLE.map(([name,role,cost],i)=><motion.article key={name} initial={reduced?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:.45,delay:(i%4)*.06}}><div role="img" aria-label={`Portrait illustratif : ${name}`} className={s.portrait} style={{backgroundImage:i<6?'url(/demo/content-team.webp)':'url(/demo/content-team-extra.webp)',backgroundSize:i<6?'300% 200%':'200% 100%',backgroundPosition:i<6?`${(i%3)*50}% ${Math.floor(i/3)*100}%`:`${(i-6)*100}% 50%`}}/><h3>{role}</h3><p>{name}</p><div className={s.price}>{cost} €<small>/ mois</small></div><motion.span initial={reduced?false:{opacity:0,y:5}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.2}}><Check size={12}/>Inclus dans Empire</motion.span></motion.article>)}</div>
  <div className={s.teamTotal}><span>Le budget de cette équipe</span><strong>10 500 €<small>/ mois</small></strong><span><Check size={14}/>Ces missions sont réunies dans Empire.</span></div>
  <p className={s.illustration}>Équipe illustrée · exemple de budget mensuel, variable selon les missions.</p>
  <div className={s.cta}><EmpireSalesCta source="home-comparison"/></div>
 </div></section>
}
