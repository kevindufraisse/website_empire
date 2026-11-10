'use client'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown, Check, ChevronDown, Eye, Hash, Headphones, MessageCircle, Mic, MicOff, Monitor, Phone, Plus, Search, Send, Smile, Users, Video } from 'lucide-react'
import s from './EmpireCommunity.module.css'

// Section reprise de l'aperçu de novembre : le Slack se remplit au scroll,
// puis bascule sur le live hebdo avec Kevin.
const KEVIN = '/founders/kevin.jpg'
const MEMBERS = [
  ['Maya', 'Consultante marketing'],
  ['Karim', 'Consultant B2B'],
  ['Nina', 'Experte en viralité'],
  ['Thomas', 'Entrepreneur'],
] as const

// person 4 = Kevin
const MESSAGES = [
  { person: 0, text: 'Ce post a fait 1 M de vues. Tu devrais tester ce format 👀', detail: 'Qui a déjà essayé une tier list dans sa niche ?', reactions: '🔥 8   🙌 5' },
  { person: 1, text: 'J’ai utilisé Empire pour décliner cette vidéo. Ça m’a ramené 10 leads.', detail: 'Tu gardes la même accroche sur LinkedIn ?', reactions: '🎉 12   👏 6' },
  { person: 2, text: 'Garde le même angle, mais adapte l’accroche au réseau.', detail: 'Sur LinkedIn, pars du problème de ton client. En vidéo, montre le résultat dès la première seconde. Teste deux entrées.', reactions: '💡 9   ✅ 4' },
  { person: 3, text: 'On pourrait ajouter le clonage à partir d’un Reel ?', detail: 'J’aimerais reprendre un format avec mon visage et ma voix.', reactions: '👀 7' },
  { person: 4, text: 'Oui, je te montre le parcours dans le live.', detail: 'Partage aussi le post que tu veux retravailler : on regarde tes comptes ensemble.', reactions: '🙌 11' },
  { person: 2, text: 'Un conseil avant de republier : regarde aussi la rétention et les clics.', detail: 'Les vues attirent l’attention. Les bons sujets font venir les bonnes personnes.', reactions: '✅ 8' },
]

function Member({ index, small = false }: { index: number; small?: boolean }) {
  return (
    <span
      className={`${s.member} ${small ? s.memberSmall ?? '' : ''}`}
      role="img"
      aria-label={`Profil illustratif : ${MEMBERS[index][0]}`}
      style={{
        backgroundImage: 'url(/community/membres-demo-v9.webp)',
        backgroundSize: '200% 200%',
        backgroundPosition: `${(index % 2) * 100}% ${Math.floor(index / 2) * 100}%`,
      }}
    />
  )
}

function SlackLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-label="Slack">
      <path d="M9 1v8M3 9h6" stroke="#36c5f0" strokeWidth="4" strokeLinecap="round" />
      <path d="M23 9h-8M15 3v6" stroke="#2eb67d" strokeWidth="4" strokeLinecap="round" />
      <path d="M15 23v-8M21 15h-6" stroke="#ecb22e" strokeWidth="4" strokeLinecap="round" />
      <path d="M1 15h8M9 21v-6" stroke="#e01e5a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function ThreadMessage({ p, index, reduced }: { p: MotionValue<number>; index: number; reduced: boolean }) {
  const m = MESSAGES[index]
  const kevin = m.person === 4
  const range = [0.015 + 0.065 * index, 0.045 + 0.065 * index]
  const opacity = useTransform(p, range, [0, 1])
  const y = useTransform(p, range, [20, 0])
  return (
    <motion.article className={s.threadMessage} style={reduced ? { opacity: 1, y: 0 } : { opacity, y }}>
      <div className={s.messageAvatar}>{kevin ? <img src={KEVIN} alt="Kevin" /> : <Member index={m.person} />}</div>
      <div className={s.messageCopy}>
        <header>
          <b>{kevin ? 'Kevin Dufraisse' : MEMBERS[m.person][0]}</b>
          <small>{kevin ? 'Empire' : MEMBERS[m.person][1]}</small>
          {m.person === 2 && <span>Conseil expert</span>}
        </header>
        <p>{m.text}</p>
        <p>{m.detail}</p>
        {index === 0 && (
          <div className={s.sharedPost}>
            <img src="/formats/tierlist.webp" alt="Exemple de Reel partagé dans la communauté" />
            <span>
              <b>La tier list qui ouvre la discussion</b>
              <small>Format à tester dans ton activité</small>
              <i><Eye size={12} />1 M de vues · exemple</i>
            </span>
          </div>
        )}
        <div className={s.messageReactions}>{m.reactions}<span>Répondre dans le fil</span></div>
      </div>
    </motion.article>
  )
}

export default function EmpireCommunitySection() {
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduced = !!usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const progress = useMotionValue(0)
  const overflow = useMotionValue(0)
  const [forced, setForced] = useState<number | null>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    progress.set(forced !== null ? forced : reduced ? 0.25 : scrollYProgress.get())
  }, [forced, reduced, progress, scrollYProgress])
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return
    setForced(null)
    progress.set(v)
  })
  useMotionValueEvent(progress, 'change', (v) => setLive(v >= 0.63))
  useEffect(() => {
    const measure = () => overflow.set(Math.max(0, (track.current?.scrollHeight || 0) - (viewport.current?.clientHeight || 0) + 15))
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    if (viewport.current) ro.observe(viewport.current)
    measure()
    return () => ro.disconnect()
  }, [overflow])

  const trackY = useTransform([progress, overflow], ([p, o]) => -Math.max(0, Math.min(1, (Number(p) - 0.14) / 0.39)) * Number(o))
  const messagesOpacity = useTransform(progress, [0.57, 0.625], [1, 0])
  const liveOpacity = useTransform(progress, [0.63, 0.68], [0, 1])
  const liveScale = useTransform(progress, [0.63, 0.7], [0.96, 1])

  return (
    <section className={`${s.section} ${reduced ? s.reduced : ''}`} id="empire-community" ref={section}>
      <div data-viewport-stage className={s.communitySticky}>
        <div className={s.wrap}>
          <header className={s.heading}>
            <div>

              <h2>
                {live ? 'Tes comptes. Tes questions.' : 'Pose tes questions.'}
                <br />
                <em>{live ? 'Notre live hebdomadaire.' : 'Nos experts te répondent.'}</em>
              </h2>
              <p>{live
                ? 'Chaque semaine, pose tes questions et échange avec nos experts sur tes contenus et ta stratégie.'
                : 'Rejoins notre live hebdomadaire pour faire analyser tes contenus et préparer tes prochains tests.'}</p>
            </div>
            <a className={s.hostCredit} href="/community/kevin-favikon.webp" target="_blank" rel="noreferrer" aria-label="Voir le classement Favikon de Kevin Dufraisse">
              <img src="/community/kevin-favikon.webp" alt="Kevin Dufraisse classé numéro 1 Growth et Lead Generation France par Favikon, février 2025" />
              <span>
                <b>Avec Kevin Dufraisse</b>
                <strong>N° 1 Growth &amp; Lead Gen France</strong>
                <small>Favikon · février 2025</small>
                <em>Voir le classement ↗</em>
              </span>
            </a>
          </header>

          <div className={s.slack}>
            <div className={s.slackTop}>
              <SlackLogo />
              <b>Empire</b>
              <span><Search size={12} />Rechercher dans la communauté</span>
              <img src={KEVIN} alt="Kevin Dufraisse" />
            </div>
            <div className={s.slackBody}>
              <aside className={s.sidebar}>
                <h3>Empire Community <ChevronDown size={13} /></h3>
                <span className={s.sidebarIntro}><Users size={13} />Créateurs, consultants, entrepreneurs</span>
                <small>CANAUX</small>
                <div><Hash />bienvenue</div>
                <div className={live ? '' : s.selectedChannel}><Hash />tes-contenus <i /></div>
                <div><Hash />conseils-viralité</div>
                <div><Hash />idées-produit</div>
                <div className={live ? s.selectedChannel : ''}><Headphones />lives-hebdo</div>
                <small>LE LIVE DE LA SEMAINE</small>
                <div className={s.liveInChannel}><Headphones /><span>Analyse de tes comptes<small>Avec Kevin Dufraisse</small></span></div>
                <div className={s.memberStack}>
                  <img src={KEVIN} alt="" />
                  {[0, 1, 2, 3].map((i) => <Member key={i} index={i} small />)}
                </div>
                <p className={s.sidebarBottom}>Des idées à tester.<br />Des retours pour progresser.</p>
              </aside>

              <div className={s.channel}>
                <header>
                  <div>{live ? <Headphones size={18} /> : <Hash size={18} />}<b>{live ? 'live · analyse de tes comptes' : 'tes-contenus'}</b></div>
                  <span className={s.exampleLabel}>Illustration · échanges et live de la communauté</span>
                </header>
                <div className={s.channelStage}>
                  <motion.div className={s.messagesPane} style={{ opacity: messagesOpacity }} aria-hidden={live}>
                    <div ref={viewport} className={s.messagesViewport}>
                      <motion.div ref={track} className={s.messagesTrack} style={reduced ? { y: 0 } : { y: trackY }}>
                        <div className={s.chatDay}>Dans la communauté</div>
                        {MESSAGES.map((_, i) => <ThreadMessage key={i} p={progress} index={i} reduced={reduced} />)}
                      </motion.div>
                    </div>
                    <div className={s.composer}>
                      <span>Partage ton post, une question, une idée…</span>
                      <div><Plus size={14} /><Smile size={14} /><span><Send size={13} /></span></div>
                    </div>
                  </motion.div>

                  <motion.div className={s.livePane} style={{ opacity: liveOpacity, scale: liveScale }} aria-hidden={!live}>
                    <div className={s.channelMessage}>
                      <img src={KEVIN} alt="" />
                      <div>
                        <b>Kevin Dufraisse <span>Hôte</span></b>
                        <p>On prend tes questions et on regarde tes comptes ensemble.</p>
                      </div>
                    </div>
                    <div className={s.huddle}>
                      <div className={s.huddleTitle}><Headphones size={13} /><b>En live avec Kevin Dufraisse</b><span>CHAQUE SEMAINE</span></div>
                      <div className={s.callGrid}>
                        <div className={s.hostVideo}>
                          <img src="/community/kevin-live-v11.webp" alt="Mise en situation générée de Kevin Dufraisse animant un live" />
                          <span><Mic size={12} /><b>Kevin Dufraisse</b><small>Viralité &amp; personal branding</small></span>
                        </div>
                        <div className={s.guestVideos}>
                          {MEMBERS.map(([name, role], i) => (
                            <div key={name}>
                              <Member index={i} />
                              <span><b>{name}<small>{role}</small></b><MicOff size={10} /></span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={s.callControls}>
                        <span><Mic /></span>
                        <span><Video /></span>
                        <span><Monitor /></span>
                        <span><Smile /></span>
                        <span className={s.hangup}><Phone /></span>
                      </div>
                    </div>
                    <div className={s.liveQuestion}>
                      <MessageCircle size={14} />
                      <span><b>La question de Maya</b>« Quelle accroche vous testeriez sur mon prochain Reel ? »</span>
                    </div>
                    <div className={s.replay}><Check size={13} /><span>Le replay et les ressources restent dans le canal.</span></div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div className={s.communityFooter}>
            <div className={s.communitySteps}>
              <button type="button" onClick={() => setForced(0.45)} aria-pressed={!live}>01 · Les échanges</button>
              <button type="button" onClick={() => setForced(0.88)} aria-pressed={live}>02 · Le live</button>
            </div>
            <span><ArrowDown size={11} />Continue à scroller</span>
          </div>
          <p className={s.ambition}>Notre ambition : réunir la plus grande communauté mondiale d’experts en viralité.</p>
        </div>
      </div>
    </section>
  )
}
