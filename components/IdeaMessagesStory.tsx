'use client'

import { useId, useState } from 'react'
import { ArrowLeft, ArrowRight, BatteryFull, Check, CheckCheck, ChevronLeft, Mic, Plus, Send, Signal, Video } from 'lucide-react'
import s from './LeadMagnetJourney.module.css'

const EXAMPLES = [
  { name: 'Un vocal', kind: 'voice', text: 'Comment choisir les bons créateurs business à suivre ? Ça dépend de ce qu’on veut apprendre.', reply: 'Vocal transcrit. Ton idée est enregistrée dans Empire.', format: 'Réponse en vidéo' },
  { name: 'Une idée', kind: 'note', text: 'Faisons une tier list des créateurs business français. Je veux expliquer qui suivre selon son objectif.', reply: 'Idée enregistrée. On prépare ton classement.', format: 'Tier list' },
  { name: 'Une capture', kind: 'capture', text: 'J’aimerais parler de la réalité de l’entrepreneuriat.', reply: 'Capture reçue. Sujet enregistré : persévérer quand on entreprend.', format: 'Point de vue' },
  { name: 'Un Reel', kind: 'reel', text: 'Je veux réagir à ces conseils, avec ce que j’applique dans mon activité.', reply: 'Reel reçu. L’extrait accompagnera ta réaction.', format: 'Réaction' },
  { name: 'Un lien YouTube', kind: 'youtube', text: 'Je veux répondre aux questions que cette vidéo soulève.', reply: 'Vidéo enregistrée. Ses idées sont prêtes à développer.', format: 'Réponse en vidéo' },
  { name: 'Un post LinkedIn', kind: 'linkedin', text: 'Qui suivre en business ? Je veux donner mon avis sur ce sujet.', reply: 'Post reçu. Ton sujet et ton angle sont enregistrés.', format: 'Point de vue' },
  { name: 'Votre veille', kind: 'watch', text: 'Les idées des comptes que vous suivez arrivent aussi ici.', reply: 'Retrouvez les sujets à adapter à votre activité dans Empire.', format: 'À développer avec votre angle' },
] as const

/** The page does not advance this conversation. The visitor can inspect each
 * example without racing a scroll interval; navigating away retains selection. */
export default function IdeaMessagesStory() {
  const [index, setIndex] = useState(0)
  const id = useId()
  const item = EXAMPLES[index]
  return <section id="formula-ideas" className={s.ideas} data-story="messages" aria-labelledby="ideas-title">
    <header className={s.heading}><h2 id="ideas-title">Dès que vous avez une idée,<br/><em>partagez-la.</em></h2></header>
    <div className={s.ideaPhone}>
      <div className={s.phoneStatus} aria-hidden="true"><b>9:41</b><i/><span><Signal size={12}/><BatteryFull size={18}/></span></div>
      <header className={s.chatHeader}><ChevronLeft size={20} aria-hidden="true"/><span className={s.empireAvatar}>E</span><div><b>Empire</b><small>Votre assistant contenu</small></div><Video size={19} aria-hidden="true"/></header>
      <div id={id} className={s.chatBody} data-idea-example={index}>
        <small className={s.chatDay}>Aujourd’hui</small>
        <div className={s.outgoing}>
          {item.kind === 'voice' && <div className={s.voice}><Mic size={17}/><span aria-hidden="true">{[12,22,30,16,25,36,17,27,13,34,20,28,16,35,23,13,28,18].map((height,i)=><i key={i} style={{height}}/>)}</span><b>0:18</b></div>}
          {item.kind === 'capture' && <img className={s.ideaAttachment} src="/demo/capture-entrepreneur-v18.webp" alt="Capture d’écran partagée dans Empire"/>}
          {item.kind === 'reel' && <div className={s.linkPreview}><img src="/demo/hormozi-reaction-v10.jpg" alt="Aperçu du Reel partagé"/><span>instagram.com/reel/…<b>Un conseil business à commenter</b></span></div>}
          {item.kind === 'youtube' && <div className={s.linkPreview}><img src="/creators/abdaal.webp" alt="Aperçu de la vidéo YouTube"/><span>youtube.com/shorts/…<b>Des conseils pour commencer</b></span></div>}
          {item.kind === 'linkedin' && <div className={s.linkPreview}><span>linkedin.com/posts/…<b>Qui suivre en business ?</b></span></div>}
          {item.kind === 'watch' && <div className={s.watchPreview}><b>Empire vous propose</b><span>Un Reel de votre niche</span><span>Un post d’un compte suivi</span><span>Une actualité à commenter</span></div>}
          <p>{item.text}</p><small>9:41 <CheckCheck size={12}/></small>
        </div>
        <div className={s.incomingIdea}><span><Check size={13}/>Ajouté à Empire</span><p>{item.reply}</p><small>Format proposé : {item.format}</small></div>
      </div>
      <div className={s.chatComposer} aria-hidden="true"><Plus size={18}/><span>Partagez votre prochaine idée…</span><Send size={17}/></div>
    </div>
    <div className={s.ideaControls} aria-label="Exemples de messages">
      <button type="button" onClick={()=>setIndex(value=>(value+EXAMPLES.length-1)%EXAMPLES.length)} aria-controls={id} aria-label="Message précédent"><ArrowLeft size={17}/><span>Précédent</span></button>
      <span aria-live="polite" aria-atomic="true"><b>{item.name}</b><small>{index+1} / {EXAMPLES.length}</small></span>
      <button type="button" onClick={()=>setIndex(value=>(value+1)%EXAMPLES.length)} aria-controls={id} aria-label="Message suivant"><span>Suivant</span><ArrowRight size={17}/></button>
    </div>
  </section>
}
