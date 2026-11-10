'use client'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { Asterisk, ArrowUp, ArrowDown, Check, FileText, CalendarDays, RefreshCw, BookOpen, Paperclip, Plus, ArrowRight } from 'lucide-react'
import { SocialIcons } from '@/components/ui/social-icons'
import s from './ClaudeMcpDemo.module.css'

const REQUESTS = [
  { label: 'Écrire', detail: 'Un Reel devient un post.', prompt: 'À partir de ce Reel, écris un post LinkedIn.', tool: 'Créer une publication', answer: 'Je reprends le sujet du Reel avec ton angle. Voici le brouillon.' },
  { label: 'Programmer', detail: 'Une phrase fixe la date.', prompt: 'Publie ce post mardi à 9 h.', tool: 'Programmer la publication', answer: 'C’est programmé pour mardi à 9 h sur LinkedIn.' },
  { label: 'Republier', detail: 'Tes meilleurs posts reviennent.', prompt: 'Reprogramme le post de la semaine dernière pour vendredi.', tool: 'Retrouver et reprogrammer', answer: 'J’ai retrouvé ton TikTok à 150 000 vues. Il repart vendredi à 12 h.' },
  { label: 'Créer un guide', detail: 'Du Reel au lead magnet.', prompt: 'Crée un lead magnet pour ce Reel et publie le post qui le propose.', tool: 'Créer le guide et sa publication', answer: 'La checklist et sa page sont prêtes. Le post qui la propose est publié.' },
]
const ICONS = [FileText, CalendarDays, RefreshCw, BookOpen]
const clamp = (n: number) => Math.max(0, Math.min(1, n))

function ReelThumb() {
  return <div className={s.reelThumb}><img src="/formats/clone-avant-apres.jpg" alt="Reel partagé sur les entrepreneurs qui travaillent seuls"/></div>
}
function Result({ index }: { index: number }) {
  if (index === 0) return <article className={s.draft}><header><SocialIcons.linkedin/><span>Kevin Dufraisse</span><small>Brouillon</small></header><b>CEO sur LinkedIn. Tout seul dans la boîte.</b><p>Le titre est facile à changer. La réalité prend un peu plus de temps.</p><p>Quand tu te lances seul, tu fais aussi les ventes, les contenus et le service client. Le premier objectif : trouver un client, puis construire une activité qui tient.</p><footer><FileText size={12}/>Post LinkedIn créé dans Empire</footer></article>
  if (index === 1) return <div className={s.week}><header><CalendarDays size={15}/><b>Ton calendrier Empire</b><span>Cette semaine</span></header><div className={s.days}>{['Lundi', 'Mardi', 'Mercredi'].map((day, i) => <div key={day} className={i === 1 ? s.scheduled : ''}><small>{day}</small>{i === 1 && <div><b>09:00</b><SocialIcons.linkedin/><p>CEO sur LinkedIn…</p><span><Check size={11}/>Programmé</span></div>}</div>)}</div></div>
  if (index === 2) return <div className={s.republish}><div className={s.oldPost}><img src="/formats/tierlist.webp" alt="Ta vidéo tier list"/><span><SocialIcons.tiktok/><b>150 000 vues</b><small>Semaine dernière</small></span></div><ArrowRight className={s.republishArrow}/><div className={s.newDate}><small>VENDREDI</small><b>12:00</b><span><Check size={13}/>Reprogrammé</span></div></div>
  return <div className={s.leadmagnet}><div className={s.book}><span>EMPIRE / GUIDE PRATIQUE</span><b>Se lancer<br/>en solo.</b><p>La checklist<br/>avant de se lancer.</p><small>7 ÉTAPES · PDF</small><i/></div><div className={s.guideResults}><span><Check/>Guide créé</span><span><Check/>Page de téléchargement prête</span><div><SocialIcons.instagram/><b>Le post est publié</b><p>« Tu veux la checklist ? Retrouve-la dans le lien de mon profil. »</p></div></div></div>
}
function Conversation({ p, index, active, complete }: { p: MotionValue<number>; index: number; active: boolean; complete: boolean }) {
  const at = index * .25
  const opacity = useTransform(p, [at, at + .012, at + .238, at + .25], [0, 1, 1, index === 3 ? 1 : 0])
  const typed = useTransform(p, value => REQUESTS[index].prompt.slice(0, Math.ceil(clamp((value - at) / .055) * REQUESTS[index].prompt.length)))
  const response = useTransform(p, [at + .065, at + .105], [0, 1])
  const responseY = useTransform(p, [at + .065, at + .105], [14, 0])
  return <motion.div className={s.conversation} style={{ opacity: complete ? (active ? 1 : 0) : opacity }} aria-hidden={!active}>
    <div className={s.userMessage}>{(index === 0 || index === 3) && <span className={s.attachment}><ReelThumb/><span>Reel partagé<small>Se dire CEO quand on travaille seul</small></span><Paperclip size={12}/></span>}<motion.p>{complete ? REQUESTS[index].prompt : typed}</motion.p></div>
    <motion.div className={s.assistant} style={{ opacity: complete ? 1 : response, y: complete ? 0 : responseY }}><span className={s.toolAction}><span className={s.empire}>E</span>Empire <span>· {REQUESTS[index].tool}</span><Check size={13}/></span><p>{REQUESTS[index].answer}</p><Result index={index}/></motion.div>
  </motion.div>
}
export default function ClaudeMcpDemo() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [phase, setPhase] = useState(0)
  const lastPhase = useRef(0)
  const [manual, setManual] = useState<number | null>(null)
  const reduced = usePrefersReducedMotion()
  useMotionValueEvent(p, 'change', value => {
    const next = Math.min(3, Math.floor(value * 4))
    if (next !== lastPhase.current) { lastPhase.current = next; setPhase(next); setManual(null) }
  })
  const selected = manual ?? phase
  const complete = manual !== null || !!reduced
  return <section id="empire-claude" ref={ref} className={`${s.section} ${reduced ? s.reduced : ''}`} aria-label="Piloter Empire depuis Claude"><div data-viewport-stage className={s.sticky}>
    <div className={s.intro}><small>04 · TEMPS / DEPUIS CLAUDE</small><h2>Dis-le à Claude.<br/><em>Empire s’en occupe.</em></h2><p>Écrire, programmer, republier, créer un lead magnet. Tes contenus avancent depuis une conversation.</p><div className={s.actions}>{REQUESTS.map((item, i) => { const Icon = ICONS[i]; return <button type="button" key={item.label} onClick={() => setManual(i)} aria-pressed={selected === i} className={selected === i ? s.current : ''}><Icon size={19}/><span><b>{item.label}</b><small>{item.detail}</small></span><span className={s.step}>{i + 1}</span></button> })}</div></div>
    <div className={s.chatShell}><header><Asterisk className={s.claudeMark} size={25}/><b>Claude</b><span><span className={s.empire}>E</span>MCP · Empire connecté<Check size={12}/></span></header><div className={s.viewport}>{complete ? <Conversation key={`selected-${selected}`} p={p} index={selected} active complete/> : REQUESTS.map((_, i) => <Conversation key={`scroll-${i}`} p={p} index={i} active={selected === i} complete={false}/>)}</div><div className={s.composer}><span>Demande à Claude…</span><div><Plus size={16}/><span>Empire</span><i><ArrowUp size={17}/></i></div></div></div>
    <div className={s.caption}><span><ArrowDown size={12}/>Continue à scroller ou choisis une demande</span><small>Démonstration illustrée · aucune publication réelle</small></div>
  </div></section>
}
