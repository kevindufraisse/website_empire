'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { startFreeTrial } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
export const FORMULA_TERMS=[
 {id:'message',anchor:'formula-message',fr:'Message',en:'Message'},
 {id:'format',anchor:'formula-format',fr:'Format',en:'Format'},
 {id:'diffusion',anchor:'formula-diffusion',fr:'Diffusion',en:'Distribution'},
 {id:'time',anchor:'formula-time',fr:'Temps',en:'Time'},
 {id:'cost',anchor:'formula-cost',fr:'Coût',en:'Cost'},
]
function Formula({fr,active=''}:{fr:boolean;active?:string}){
 const term=(i:number)=><a href={`#${FORMULA_TERMS[i].anchor}`} data-active={active===FORMULA_TERMS[i].id||undefined}>{FORMULA_TERMS[i][fr?'fr':'en']}</a>
 return <div className="home-formula-fraction"><div>{term(0)}<span>×</span>{term(1)}<span>×</span>{term(2)}</div><div>{term(3)}<span>+</span>{term(4)}</div></div>
}
export function FormulaHeroStatic({fr}:{fr:boolean}){return <Formula fr={fr}/>}
export default function HomeFormula(){
 const {lang}=useLanguage();const fr=lang==='fr';const [visible,setVisible]=useState(false);const [active,setActive]=useState('');const [loading,setLoading]=useState(false)
 useEffect(()=>{let frame=0;const measure=()=>{frame=0;const story=document.getElementById('formula-message');const end=document.getElementById('formula-apply');setVisible(!!story&&story.getBoundingClientRect().top<150&&(!end||end.getBoundingClientRect().top>200));let term='';for(const t of FORMULA_TERMS){const node=document.getElementById(t.anchor);if(node&&node.getBoundingClientRect().top<innerHeight*.4)term=t.id}setActive(term)};const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure)};measure();document.addEventListener('scroll',schedule,{passive:true,capture:true});window.addEventListener('resize',schedule);return()=>{if(frame)cancelAnimationFrame(frame);document.removeEventListener('scroll',schedule,{capture:true});window.removeEventListener('resize',schedule)}},[])
 if(!visible)return null
 return <div className="home-formula-floating"><Formula fr={fr} active={active}/><button disabled={loading} onClick={async()=>{if(loading)return;setLoading(true);trackAmplitude('formula_bar_trial_clicked');await startFreeTrial();setLoading(false)}}>{loading?(fr?'Ouverture…':'Opening…'):(fr?'Tester gratuitement':'Try it free')}<span>↗</span></button></div>
}
