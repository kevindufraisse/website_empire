'use client'
import { useState } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, ArrowRight, LockKeyhole } from 'lucide-react'
import { startFreeTrial } from '@/lib/startTrial'
import { MasterclassForm, MasterclassThumbnail, useMasterclassRequested } from './sections/HomeMasterclassGate'
import s from './HomeStoryRefinement.module.css'

export default function SecretFormatsGate({p,staticMode=false}:{p:MotionValue<number>;staticMode?:boolean}){
 const requested=useMasterclassRequested()
 const [justRequested,setJustRequested]=useState(false)
 const opacity=useTransform(p,[.698,.708,.758,.768],[0,1,1,0])
 const y=useTransform(p,[.698,.708],[18,0])
 return <motion.section className={`${s.secret} ${staticMode?s.staticScene:''}`} data-scene="secret" data-requested={requested===null?'loading':String(requested)} aria-labelledby="secret-formats-title" style={staticMode?{}:{opacity,y}}>
  <div className={s.secretLayout}>
   <div className={s.secretCopy}><span className={s.reserved}><LockKeyhole size={14}/>Réservé à l’application</span><h2 id="secret-formats-title">Les autres formats restent secrets.</h2><p>{requested?'Retrouvez tous les formats directement dans Empire.':'Découvrez les mécaniques qui font fonctionner ces formats dans la masterclass gratuite.'}</p></div>
   <div className={s.secretAction}>
    {requested===null?<div className={s.placeholder} aria-busy="true"/>:requested?<>{justRequested&&<p className={s.success} role="status">Votre demande de masterclass est enregistrée.</p>}<button className={s.trial} onClick={()=>startFreeTrial()}>Tester gratuitement <ArrowRight size={18}/></button></>:<><div className={s.secretThumbnail}><MasterclassThumbnail/></div><MasterclassForm idPrefix="secret" onReady={()=>setJustRequested(true)}/></>}
   </div>
  </div>
  <a href="#formula-diffusion" className={s.secretContinue}>Continuer la découverte <ArrowDown size={17}/></a>
 </motion.section>
}
