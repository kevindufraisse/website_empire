'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, FileText, Mic, Pause, Play, RotateCcw, Video } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './FormulaProductDemo.module.css'

const STEP_MS = 6500
const COPY = {
  fr: [
    { name: 'Message', title: 'Un sujet qui part de votre activité.', body: 'Empire prépare des propositions. Vous choisissez celle sur laquelle vous avez quelque chose à apporter.', status: 'Sujet sélectionné', action: 'Votre avis fait la différence' },
    { name: 'Format', title: 'Un cadre pour donner votre point de vue.', body: 'Question, réaction, classement… Le format guide votre prise de parole. Vous apportez vos exemples et votre expérience.', status: 'Prise de parole guidée', action: 'Vous filmez ou vous dictez' },
    { name: 'Diffusion', title: 'Votre prise devient plusieurs contenus.', body: 'Un reel monté, un post rédigé, une newsletter à exporter. Vous validez les contenus et choisissez où les publier.', status: 'Contenus à valider', action: 'Vous gardez la main sur la publication' },
    { name: 'Temps', title: 'Vous parlez. La production avance.', body: 'Sujets, écriture, montage : tout reste dans le même parcours. Chaque reel est vérifié par l’équipe avant de vous arriver.', status: 'Votre prochain geste', action: 'Relire, valider, programmer' },
    { name: 'Coût', title: 'Un budget. Le mix qui vous convient.', body: 'Vos crédits servent aux contenus que vous choisissez : davantage de vidéos ce mois-ci, davantage de textes le suivant.', status: 'Un mix à votre mesure', action: 'Voir les formules et leurs volumes' },
  ],
  en: [
    { name: 'Message', title: 'A topic drawn from your business.', body: 'Empire prepares suggestions. You choose a topic where you have something to contribute.', status: 'Topic selected', action: 'Your perspective makes the difference' },
    { name: 'Format', title: 'A framework for your point of view.', body: 'Question, reaction, ranking… The format guides your recording. You bring your own examples and experience.', status: 'Guided recording', action: 'Record a video or a voice note' },
    { name: 'Distribution', title: 'Your recording becomes several pieces.', body: 'An edited reel, a written post, a newsletter to export. You approve the content and choose where to publish.', status: 'Content to review', action: 'You control publication' },
    { name: 'Time', title: 'You speak. Production moves forward.', body: 'Topics, writing, editing: one workflow. Our team checks each reel before you receive it.', status: 'Your next step', action: 'Review, approve, schedule' },
    { name: 'Cost', title: 'One budget. Your choice of content.', body: 'Use your credits for the content you choose: more videos this month, more written posts the next.', status: 'Your own content mix', action: 'Explore plans and volumes' },
  ],
}

/** An illustrative sequence, not a recording or a claim of instant delivery. */
export default function FormulaProductDemo() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const root = useRef<HTMLDivElement>(null)
  const inView = useInView(root, { amount: 0.25 })
  const reducedMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [replayCount, setReplayCount] = useState(0)
  const [pageVisible, setPageVisible] = useState(true)
  const steps = COPY[lang]
  const current = steps[step]
  const running = playing && inView && pageVisible && reducedMotion === false

  useEffect(() => {
    const sync = () => setPageVisible(!document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => {
      if (step < steps.length - 1) setStep(step + 1)
      else setPlaying(false)
    }, STEP_MS)
    return () => window.clearTimeout(timer)
  }, [running, step, steps.length, replayCount])

  const replay = () => { setStep(0); setPlaying(true); setReplayCount((count) => count + 1) }
  const topic = fr ? 'Pourquoi publier plus ne suffit pas' : 'Why posting more is not enough'
  const blocks = [
    { icon: Video, name: 'Reel', detail: fr ? 'Monté et vérifié par l’équipe' : 'Edited and checked by the team' },
    { icon: FileText, name: fr ? 'Post LinkedIn' : 'LinkedIn post', detail: fr ? 'Votre point de vue, rédigé' : 'Your perspective, written up' },
    { icon: FileText, name: 'Newsletter', detail: fr ? 'Prête à exporter vers votre outil' : 'Ready to export to your email tool' },
  ]

  return (
    <div ref={root} className={styles.demo} data-formula-demo data-running={running}>
      <div className={styles.toolbar}>
        <div><span className={styles.dot} /> <strong>Empire</strong><span className={styles.caption}>{fr ? 'La formule en action' : 'The formula in action'}</span></div>
        <span className={styles.example}>{fr ? 'Exemple illustratif' : 'Illustrative example'}</span>
      </div>
      <div className={styles.steps} role="group" aria-label={fr ? 'Explorer les éléments de la formule' : 'Explore the formula'}>
        {steps.map((item, index) => (
          <button key={item.name} type="button" aria-pressed={step === index} onClick={() => { setStep(index); setPlaying(false) }}>
            <span className={styles.stepNumber}>{index + 1}</span><span>{item.name}</span>
          </button>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.explanation}>
          <span className={styles.eyebrow}>0{step + 1} / {current.name}</span>
          <h3>{current.title}</h3>
          <p>{current.body}</p>
          <div className={styles.action}><ArrowRight size={15} aria-hidden />{current.action}</div>
          {step === 4 && <a className={styles.pricing} href="/tarifs">{fr ? 'Voir les tarifs' : 'View pricing'} <ArrowRight size={15} aria-hidden /></a>}
        </div>
        <div className={styles.stage} key={`${lang}-${step}`}>
          <div className={styles.status}><span className={styles.dot} />{current.status}</div>
          {step === 0 && <div className={styles.topics}>
            <div className={styles.context}>{fr ? 'Votre activité' : 'Your business'}<strong>{fr ? 'Conseil & accompagnement' : 'Consulting & coaching'}</strong></div>
            {[topic, fr ? 'Le conseil que je ne donne plus' : 'The advice I no longer give', fr ? 'Une erreur fréquente chez mes clients' : 'A common mistake my clients make'].map((text, index) => <div className={`${styles.topic} ${index === 0 ? styles.selected : ''}`} key={text} style={{ animationDelay: `${index * 140}ms` }}><span>{text}</span>{index === 0 && <Check size={17} aria-hidden />}</div>)}
          </div>}
          {step === 1 && <div className={styles.recording}>
            <span className={styles.formatTag}>{fr ? 'Format · Question' : 'Format · Question'}</span>
            <h4>{fr ? '« Qu’est-ce qui compte davantage que la fréquence de publication ? »' : '“What matters more than posting frequency?”'}</h4>
            <div className={styles.wave} aria-hidden><Mic size={23} />{Array.from({ length: 19 }, (_, i) => <span key={i} style={{ height: `${12 + ((i * 17) % 29)}px`, animationDelay: `${i * 90}ms` }} />)}</div>
            <p>{fr ? 'Votre expérience. Vos mots. Votre voix.' : 'Your experience. Your words. Your voice.'}</p>
          </div>}
          {step === 2 && <div className={styles.outputs}>
            <p className={styles.outputTopic}>{topic}</p>
            {blocks.map(({ icon: Icon, name, detail }, index) => <div className={styles.output} key={name} style={{ animationDelay: `${index * 160}ms` }}><span className={styles.fileIcon}><Icon size={19} aria-hidden /></span><div><strong>{name}</strong><small>{detail}</small></div><span className={styles.review}>{fr ? 'À valider' : 'Review'}</span></div>)}
            <div className={styles.networks}>LinkedIn <span>·</span> Instagram <span>·</span> YouTube <span>·</span> +4</div>
          </div>}
          {step === 3 && <div className={styles.tasks}>
            {(fr ? ['Sujets proposés', 'Votre prise enregistrée', 'Textes rédigés', 'Reel monté et vérifié'] : ['Topics suggested', 'Your recording captured', 'Written content prepared', 'Reel edited and checked']).map((text, index) => <div key={text} style={{ animationDelay: `${index * 150}ms` }}><Check size={17} aria-hidden /><span>{text}</span></div>)}
            <div className={styles.nextTask}><span className={styles.dot} />{fr ? 'Votre validation, puis la programmation' : 'Your approval, then scheduling'}</div>
          </div>}
          {step === 4 && <div className={styles.budget}>
            <p>{fr ? 'Votre enveloppe de crédits' : 'Your credit budget'}</p>
            <div className={styles.budgetBar} aria-hidden><span /><span /><span /></div>
            {blocks.map(({ icon: Icon, name }) => <div className={styles.budgetItem} key={name}><Icon size={17} aria-hidden /><span>{name}</span><Check size={15} aria-hidden /></div>)}
            <small>{fr ? 'Mix illustratif. Volumes selon la formule et les crédits utilisés.' : 'Illustrative mix. Volumes depend on your plan and credit usage.'}</small>
          </div>}
        </div>
      </div>
      <div className={styles.footer}>
        <span>{fr ? 'Choisissez une étape pour explorer la formule.' : 'Select a step to explore the formula.'}</span>
        <div>
          {!reducedMotion && <button type="button" onClick={() => step === 4 && !playing ? replay() : setPlaying(!playing)} aria-label={playing ? (fr ? 'Mettre l’animation en pause' : 'Pause animation') : (fr ? 'Lire l’animation' : 'Play animation')}>
            {playing ? <Pause size={15} /> : <Play size={15} />}<span>{playing ? 'Pause' : fr ? 'Lire' : 'Play'}</span>
          </button>}
          <button type="button" onClick={replay} aria-label={fr ? 'Rejouer la démonstration' : 'Replay demo'}><RotateCcw size={15} /><span>{fr ? 'Rejouer' : 'Replay'}</span></button>
        </div>
      </div>
    </div>
  )
}
