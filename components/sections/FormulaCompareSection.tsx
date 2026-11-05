'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, Brain, Coins, Workflow } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import { CONTENT_CREDITS, PLANS } from '@/lib/plans'
import s from './FormulaCompareClear.module.css'

const OPTIONS = [
 {key:'tools',name:'Seul + outils',detail:'Vous assemblez.'},
 {key:'freelance',name:'Un freelance',detail:'Vous confiez une mission.'},
 {key:'agency',name:'Une agence',detail:'Vous déléguez un dispositif.'},
 {key:'empire',name:'Empire',detail:'Le système est déjà construit.'},
] as const
const AXES = [
 {key:'money',name:'Coût en argent',question:'Ce que vous payez.',Icon:Coins},
 {key:'sophistication',name:'Sophistication',question:'Ce qui fonctionne ensemble.',Icon:Workflow},
 {key:'mental-load',name:'Charge mentale',question:'Ce que vous faites.',Icon:Brain},
] as const
const EXAMPLE = {reels:6,posts:6}
const credits = EXAMPLE.reels*CONTENT_CREDITS.reel+EXAMPLE.posts*CONTENT_CREDITS.post
const plan = [...PLANS].sort((a,b)=>a.price-b.price).find(p=>p.credits>=credits)
const fmt=(n:number)=>n.toLocaleString('fr-FR')
const planName=plan?plan.id.charAt(0).toUpperCase()+plan.id.slice(1):''

function Cell({row,col}:{row:number;col:number}){
 if(row===0){
  if(col===3)return <><strong className={s.price} data-comparison-price={plan?.price}>{plan?<>{fmt(plan.price)} €<small>/ mois</small></>:'Selon votre volume'}</strong><p>{plan?`${planName} mensuel · ${fmt(plan.credits)} crédits.`:'Une formule adaptée à votre volume.'}</p><small>Pour l’exemple ci-dessus.</small></>
  return <><strong>{['Vos abonnements','Un devis de mission','Un forfait sur devis'][col]}</strong><p>{['Rédaction + montage + publication + suivi.','Création et diffusion à préciser dans la mission.','Livrables et niveau de délégation à définir.'][col]}</p><small>{col===0?'Votre travail s’ajoute aux outils.':'À chiffrer pour ce même volume.'}</small></>
 }
 if(row===1){
  const labels=[['Outil texte','Outil vidéo','Planning'],['Expertise','Livrables'],['Stratégie','Équipe','Pilotage'],['Idée','Création','Diffusion','Suivi']]
  return <><strong>{['À connecter vous-même.','Selon sa mission.','Sur mesure.','Déjà relié.'][col]}</strong><div className={s.pipeline} data-connected={col===3}>{labels[col].map((label,i)=><span key={label}>{i>0&&<ArrowRight size={9} aria-hidden="true"/>}<b>{label}</b></span>)}</div><p>{['Vous construisez les liens entre les étapes.','Une expertise ciblée ou une prise en charge plus large.','Un dispositif défini par le contrat.','Vos contenus et leurs résultats au même endroit.'][col]}</p></>
 }
 const tasks=[['Produire','Transférer','Programmer','Coordonner'],['Briefer','Faire vos retours','Gérer le hors-mission'],['Transmettre votre expertise','Valider'],['Partager vos idées','Enregistrer','Valider']]
 return <><strong>{['Vous orchestrez tout.','Vous gérez la mission.','Vous suivez le projet.','Vous apportez votre expertise.'][col]}</strong><div className={s.tasks}>{tasks[col].map(task=><span key={task}>{task}</span>)}</div></>
}
function ComparisonRow({index,p,animated}:{index:number;p:MotionValue<number>;animated:boolean}){
 const opacity=useTransform(p,[index*.19,index*.19+.08],[0,1])
 const y=useTransform(p,[index*.19,index*.19+.08],[18,0])
 const axis=AXES[index],Icon=axis.Icon
 return <motion.div className={s.row} role="row" data-comparison-axis={axis.key} style={animated?{opacity,y}:{}}>
  <div className={s.axis} role="rowheader"><Icon size={18}/><strong>{axis.name}</strong><span>{axis.question}</span></div>
  {OPTIONS.map((option,col)=><div className={`${s.cell} ${col===3?s.empire:''}`} role="cell" key={option.key} data-comparison-cell={option.key}><span className={s.mobileLabel}>{option.name}</span><Cell row={index} col={col}/></div>)}
 </motion.div>
}
export default function FormulaCompareSection(){
 const ref=useRef<HTMLElement>(null),reduced=!!useReducedMotion()
 const {scrollYProgress:p}=useScroll({target:ref,offset:['start start','end end']})
 const [desktop,setDesktop]=useState(false)
 useEffect(()=>{const media=matchMedia('(min-width: 901px) and (min-height: 650px)');const sync=()=>setDesktop(media.matches);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync)},[])
 const animated=desktop&&!reduced
 return <section id="home-comparison" ref={ref} className={s.section} data-comparison-criteria data-animated={animated} aria-labelledby="formula-compare-title">
  <div className={s.sticky}>
   <header className={s.heading}><h2 id="formula-compare-title">Votre expertise.<br/><em>Pas un deuxième métier.</em></h2><p>Ce que vous payez. Ce que le système fait. Ce qu’il vous reste à gérer.</p><span className={s.example}>Un même exemple : <b>6 Reels standard + 6 posts texte / mois.</b></span></header>
   <div className={s.matrix} role="table" aria-label="Coût en argent, sophistication et charge mentale de quatre solutions">
    <div className={s.columnHeads} role="row"><div role="columnheader">Comparez.</div>{OPTIONS.map(option=><div key={option.key} role="columnheader" className={option.key==='empire'?s.empire:''} data-comparison-option={option.key}><b>{option.name}</b><small>{option.detail}</small></div>)}</div>
    <div role="rowgroup">{AXES.map((axis,index)=><ComparisonRow key={axis.key} index={index} p={p} animated={animated}/>)}</div>
   </div>
   <div className={s.bottom}><p><strong>Gardez votre point de vue.</strong> Empire réunit la production, la diffusion et le suivi.</p><EmpireSalesCta source="home-formula-compare" showDemo={false}/></div>
   <p className={s.note}>Un prestataire peut aussi tout prendre en charge. Le périmètre dépend du contrat. Comptes et intégrations à connecter dans Empire. Aucun gain financier ni résultat garanti.</p>
   {animated&&<span className={s.cue}>Continuez à scroller · les lignes restent visibles.</span>}
  </div>
  <div className={s.method}><details><summary>Base de calcul et périmètre de la comparaison</summary><p>L’exemple représente {EXAMPLE.reels} Reels standard à {CONTENT_CREDITS.reel} crédits et {EXAMPLE.posts} posts texte à {CONTENT_CREDITS.post} crédits, soit {fmt(credits)} crédits selon le barème du site. {plan?`${planName} inclut ${fmt(plan.credits)} crédits pour ${fmt(plan.price)} € en facturation mensuelle.`:''} Les formats IA spécifiques et les vidéos longues peuvent consommer un nombre de crédits différent.</p><p>Les budgets outils, freelance et agence ne sont pas chiffrés faute de devis portant sur ce même périmètre. Ce comparatif n’établit donc pas une économie mesurée. Le temps de travail n’est pas converti en euros.</p><a href="/tarifs">Consulter les offres et les conditions Empire <ArrowRight size={14}/></a></details></div>
 </section>
}
