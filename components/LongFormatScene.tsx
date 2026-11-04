'use client'
import { useMotionValue } from 'framer-motion'
import { LongVideoFormat } from './LongVideoFormat'
import j from './LeadMagnetJourney.module.css'

/** A stable YouTube example after the short-video comparison and Instagram messages. */
export default function LongFormatScene(){
 const settled=useMotionValue(.566)
 return <section id="formula-youtube" className={j.longSection} data-story="long-format" data-scene="formats" data-format="5" aria-hidden={false} aria-labelledby="long-format-title">
  <header className={j.heading}><h2 id="long-format-title">Votre idée, aussi en format long.</h2></header>
  <div className={j.longGrid}>
   <div className={j.longMedia} data-format-preview="long"><LongVideoFormat p={settled}/></div>
   <div className={j.longCopy}><h3>Un sujet mérite plus ?<br/>Développez-le sur YouTube.</h3><p>Réaction, classement ou réponse client : gardez le même sujet, avec plus de place pour l’expliquer.</p></div>
  </div>
 </section>
}
