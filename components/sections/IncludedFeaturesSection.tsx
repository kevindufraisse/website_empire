'use client'

/**
 * IncludedFeaturesSection - ce qui est dans l'abonnement au-delà des formats,
 * en bento. La page ne parlait ni du tracking des conversions, ni des
 * miniatures, ni de la communauté : autant de raisons de vouloir l'outil qui
 * restaient dans l'app.
 *
 * Tout ici existe dans le produit : liens trackés `graab.me/<slug>` avec
 * attribution Tally / Cal.com jusqu'au lead (page Leads), miniatures et titres
 * YouTube générés depuis la vidéo, brief de veille quotidien, republication
 * automatique des meilleurs posts, boîte de réception commentaires + DM
 * (webhooks Postproxy), relecture humaine des écrits, lives et communauté à
 * partir du palier Intermédiaire.
 *
 * Chaque carte porte une illustration : du HTML/Tailwind et du SVG inline,
 * visibles sans JS (aucune n'attend une animation pour apparaître - seul le
 * conteneur de la carte glisse à l'entrée dans le viewport). Ce sont des
 * maquettes de l'interface avec des chiffres d'exemple, pas des statistiques :
 * on n'affiche aucun résultat client qu'on ne pourrait pas sourcer.
 */

import { motion } from 'framer-motion'
import { Link2, Image as ImageIcon, Newspaper, Repeat2, Inbox, Users, BarChart3, UserCheck, CalendarCheck, Sparkles, TrendingUp, MessageCircle, Send, Radio, Code2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'
import { SocialIcons } from '@/components/ui/social-icons'

/** Cadre commun des maquettes : même langage que RepurposingSection / MobileAppSection. */
const MOCK = 'rounded-2xl border border-white/10 bg-black/50'

/**
 * Logos des intégrations, dans `public/integrations/`. Les `.svg` viennent de
 * Simple Icons (tracé blanc) et sont posés sur un carré à la couleur de la
 * marque ; les `.png` sont les favicons officiels, déjà en couleur.
 */
const INTEGRATIONS: { name: string; src: string; bg?: string }[] = [
  { name: 'Cal.com', src: '/integrations/calcom.png' },
  { name: 'Calendly', src: '/integrations/calendly.svg', bg: '#006BFF' },
  { name: 'Tally', src: '/integrations/tally.png' },
  { name: 'ManyChat', src: '/integrations/manychat.png' },
  { name: 'Substack', src: '/integrations/substack.svg', bg: '#FF6719' },
  { name: 'Skool', src: '/integrations/skool.png' },
  { name: 'Systeme.io', src: '/integrations/systeme.png' },
  { name: 'Stripe', src: '/integrations/stripe.svg', bg: '#635BFF' },
]

/** Telegram : une note vocale envoyée au bot, la réponse avec ce qui en sort. */
function TelegramArt({ fr }: { fr: boolean }) {
  const bars = [4, 9, 14, 8, 16, 11, 6, 13, 9, 15, 7, 12, 5, 10, 14, 8, 4, 11, 7, 3]
  return (
    <div className={`${MOCK} mt-4 p-3.5`}>
      <div className="flex items-center gap-2 border-b border-white/8 pb-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: '#26A5E4' }}>
          <img src="/integrations/telegram.svg" alt="" aria-hidden className="h-3.5 w-3.5" loading="lazy" draggable={false} />
        </span>
        <div>
          <p className="text-[11px] font-bold text-white">Empire</p>
          <p className="text-[9px] text-neutral-500">bot</p>
        </div>
      </div>
      {/* La note vocale, alignée à droite comme un message envoyé */}
      <div className="mt-3 flex justify-end">
        <div className="flex w-[78%] items-center gap-2 rounded-2xl rounded-br-md bg-empire/15 px-3 py-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-empire text-black">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-3 w-3" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="flex h-5 flex-1 items-center gap-[2px]">
            {bars.map((h, i) => <span key={i} className="w-[2px] rounded-full bg-empire/80" style={{ height: `${h}px` }} />)}
          </span>
          <span className="text-[10px] tabular-nums text-neutral-300">1:42</span>
        </div>
      </div>
      {/* La réponse du bot */}
      <div className="mt-2 flex justify-start">
        <div className="w-[82%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-3 py-2">
          <p className="text-[11px] leading-snug text-neutral-200">
            {fr ? 'Reçu. J\'en fais :' : 'Got it. Turning it into:'}
          </p>
          <ul className="mt-1 space-y-0.5 text-[10.5px] text-neutral-400">
            <li>· {fr ? '1 post LinkedIn + image' : '1 LinkedIn post + image'}</li>
            <li>· {fr ? '1 carrousel Instagram' : '1 Instagram carousel'}</li>
            <li>· {fr ? '1 newsletter' : '1 newsletter'}</li>
          </ul>
          <p className="mt-1.5 text-[10px] font-semibold text-empire">{fr ? 'Relu et programmé jeudi 9h.' : 'Proofread and scheduled Thursday 9am.'}</p>
        </div>
      </div>
    </div>
  )
}

/** API : un contenu à gauche, trois comptes à droite, chacun sur ses réseaux. */
function BroadcastArt({ fr }: { fr: boolean }) {
  const accounts = [
    { handle: '@kevin', label: fr ? 'Perso' : 'Personal' },
    { handle: '@empire', label: fr ? 'Marque' : 'Brand' },
    { handle: '@client-a', label: fr ? 'Client' : 'Client' },
  ]
  return (
    <div className={`${MOCK} mt-4 p-3.5`}>
      <div className="flex items-center gap-3">
        {/* Le contenu source */}
        <div className="flex w-[92px] shrink-0 flex-col items-center rounded-xl border border-empire/40 bg-empire/10 px-2 py-2.5 text-center">
          <Radio className="h-4 w-4 text-empire" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-empire">{fr ? '1 contenu' : '1 piece'}</p>
          <p className="text-[10px] text-neutral-400">{fr ? 'créé une fois' : 'made once'}</p>
        </div>
        {/* Les branches */}
        <svg className="h-[104px] w-6 shrink-0 text-neutral-600" viewBox="0 0 24 104" fill="none" aria-hidden>
          <path d="M0 52 H8 M8 52 C16 52 16 14 24 14 M8 52 H24 M8 52 C16 52 16 90 24 90" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {/* Les comptes */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {accounts.map((a) => (
            <div key={a.handle} className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-white">{a.handle}</p>
                <p className="text-[9px] text-neutral-500">{a.label}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-neutral-300">
                <span className="h-3.5 w-3.5 [&>svg]:h-full [&>svg]:w-full"><SocialIcons.linkedin /></span>
                <span className="h-3.5 w-3.5 [&>svg]:h-full [&>svg]:w-full"><SocialIcons.instagram /></span>
                <span className="h-3.5 w-3.5 [&>svg]:h-full [&>svg]:w-full"><SocialIcons.youtube /></span>
                <span className="text-[9px] text-neutral-500">+4</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-[10px] text-neutral-500">
        {fr ? '1 contenu × 3 comptes × 7 réseaux = 21 publications, un seul envoi.' : '1 piece × 3 accounts × 7 networks = 21 posts, one send.'}
      </p>
    </div>
  )
}

/* ─────────────────────────── Illustrations ─────────────────────────── */

function TrackingArt({ fr }: { fr: boolean }) {
  const steps = [
    { Icon: Link2, label: fr ? 'Lien' : 'Link', count: fr ? '128 clics' : '128 clicks' },
    { Icon: UserCheck, label: fr ? 'Formulaire' : 'Form', count: '11 leads' },
    { Icon: CalendarCheck, label: 'RDV', count: fr ? '3 RDV' : '3 calls', hot: true },
  ]
  return (
    <div className={`${MOCK} p-4`}>
      {/* La source : le reel, avec son badge de rendez-vous */}
      <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 [&_svg]:h-3.5 [&_svg]:w-3.5"><SocialIcons.instagram /></span>
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-white">{fr ? 'Reel « Tier list agences »' : 'Reel "Agency tier list"'}</span>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-empire px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black">{fr ? '3 RDV' : '3 calls'}</span>
      </div>
      {/* Le lien tracké que le reel porte */}
      <div className="mt-2 flex items-center gap-2 px-1 text-[11px] text-neutral-500">
        <Link2 className="h-3 w-3 shrink-0 text-empire" />
        <span className="truncate font-mono text-neutral-300">graab.me/audit</span>
        <span className="ml-auto shrink-0 whitespace-nowrap">{fr ? 'lien tracké' : 'tracked link'}</span>
      </div>
      {/* La chaîne : lien → formulaire → rendez-vous */}
      <div className="mt-3 flex items-stretch gap-1">
        {steps.map((s, i) => (
          <div key={s.label} className="flex min-w-0 flex-1 items-center gap-1">
            <div className={`min-w-0 flex-1 rounded-xl border px-1.5 py-2 text-center ${s.hot ? 'border-empire/50 bg-empire/10' : 'border-white/10 bg-white/[0.03]'}`}>
              <s.Icon className={`mx-auto h-3.5 w-3.5 ${s.hot ? 'text-empire' : 'text-neutral-400'}`} />
              <p className="mt-1 truncate text-[10px] text-neutral-400">{s.label}</p>
              <p className={`whitespace-nowrap text-[11px] font-bold tabular-nums ${s.hot ? 'text-empire' : 'text-white'}`}>{s.count}</p>
            </div>
            {i < steps.length - 1 && <span className="shrink-0 text-[11px] text-neutral-600">→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ThumbnailArt({ fr }: { fr: boolean }) {
  return (
    <div className={`${MOCK} mt-4 overflow-hidden`}>
      <div className="flex gap-2.5">
        {/* YouTube 16:9 */}
        <div className="relative flex-1 min-w-0">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img src="/formats/long-thumb-2.webp" alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
            <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-semibold text-white">35:44</span>
            <span className="absolute left-1 top-1 rounded-full bg-empire px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wider text-black">YouTube</span>
          </div>
          <p className="mt-1.5 truncate text-[10px] font-semibold text-white">{fr ? 'ÉPUISÉ POUR RIEN' : 'EXHAUSTED FOR NOTHING'}</p>
        </div>
        {/* Instagram 9:16 */}
        <div className="relative w-[72px] shrink-0">
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg">
            <img src="/formats/insta-thumb-1.webp" alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
            <span className="absolute left-1 top-1 rounded-full bg-empire px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wider text-black">Reel</span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-start gap-2 px-1">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-empire" />
        <p className="text-[10px] text-neutral-400">{fr ? 'Miniatures YouTube + Instagram générées depuis la vidéo' : 'YouTube + Instagram thumbnails generated from the video'}</p>
      </div>
    </div>
  )
}

function BriefArt({ fr }: { fr: boolean }) {
  const topics = fr
    ? [
        { t: 'Le rachat de Doctolib par Google', up: '+340 %', w: 92 },
        { t: 'Fin du statut auto-entrepreneur ?', up: '+180 %', w: 64 },
        { t: 'Les agences qui facturent au résultat', up: '+95 %', w: 41 },
      ]
    : [
        { t: 'Google buying Doctolib', up: '+340%', w: 92 },
        { t: 'End of the freelancer status?', up: '+180%', w: 64 },
        { t: 'Agencies billing on results', up: '+95%', w: 41 },
      ]
  return (
    <div className={`${MOCK} mt-4 p-3.5`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{fr ? 'Brief du matin · 07:30' : 'Morning brief · 07:30'}</p>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-empire"><TrendingUp className="h-3 w-3" />{fr ? 'Ça monte' : 'Rising'}</span>
      </div>
      <ul className="mt-2.5 space-y-2">
        {topics.map((x, i) => (
          <li key={x.t} className="relative">
            <div className="flex items-center gap-2">
              <span className="w-3 shrink-0 text-[10px] font-bold text-neutral-600">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-[12px] text-neutral-200">{x.t}</span>
              <span className={`shrink-0 text-[11px] font-bold tabular-nums ${i === 0 ? 'text-empire' : 'text-neutral-400'}`}>↗ {x.up}</span>
            </div>
            <div className="ml-5 mt-1 h-0.5 rounded-full bg-white/[0.06]">
              <div className={`h-full rounded-full ${i === 0 ? 'bg-empire' : 'bg-neutral-600'}`} style={{ width: `${x.w}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RepostArt({ fr }: { fr: boolean }) {
  const days = fr ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const published = new Set([2, 4, 9, 11, 16, 18, 23, 25])
  const reposts = new Set([13, 27])
  return (
    <div className={`${MOCK} mt-4 p-3.5`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{fr ? 'Octobre' : 'October'}</p>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-empire"><Repeat2 className="h-3 w-3" />{fr ? 'Republié' : 'Reposted'}</span>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => <span key={`${d}${i}`} className="text-[9px] font-bold text-neutral-600">{d}</span>)}
        {Array.from({ length: 28 }).map((_, i) => {
          const d = i + 1
          const rp = reposts.has(d)
          const pb = published.has(d)
          return (
            <span
              key={d}
              className={`flex aspect-square items-center justify-center rounded-md text-[9px] tabular-nums ${
                rp ? 'bg-empire font-extrabold text-black ring-2 ring-empire/40' : pb ? 'bg-white/10 text-neutral-200' : 'bg-white/[0.03] text-neutral-600'
              }`}
            >
              {rp ? <Repeat2 className="h-3 w-3" /> : d}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function InboxArt({ fr }: { fr: boolean }) {
  return (
    <div className={`${MOCK} mt-4 space-y-2.5 p-3.5`}>
      <div className="flex items-start gap-2.5">
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-[10px] font-bold text-white">ML
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0b0b0b] ring-1 ring-white/10 [&_svg]:h-2.5 [&_svg]:w-2.5"><SocialIcons.instagram /></span>
        </span>
        <div className="min-w-0">
          <div className="rounded-2xl rounded-tl-md bg-white/[0.07] px-3 py-2 text-[12px] leading-snug text-neutral-100">
            {fr ? 'Le classement des agences 😂 tu mets qui en S ?' : 'The agency ranking 😂 who goes in S tier?'}
          </div>
          <p className="mt-1 flex items-center gap-1 pl-1 text-[10px] text-neutral-500"><MessageCircle className="h-3 w-3" />{fr ? 'Commentaire · il y a 4 min' : 'Comment · 4 min ago'}</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-[10px] font-bold text-white">TR
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0b0b0b] ring-1 ring-white/10 [&_svg]:h-2.5 [&_svg]:w-2.5"><SocialIcons.facebook /></span>
        </span>
        <div className="min-w-0">
          <div className="rounded-2xl rounded-tl-md bg-white/[0.07] px-3 py-2 text-[12px] leading-snug text-neutral-100">
            {fr ? 'Vous prenez encore des clients ce mois-ci ?' : 'Are you still taking clients this month?'}
          </div>
          <p className="mt-1 flex items-center gap-1 pl-1 text-[10px] text-neutral-500"><Send className="h-3 w-3" />{fr ? 'Message privé · il y a 12 min' : 'DM · 12 min ago'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5">
        <span className="flex-1 text-[11px] text-neutral-500">{fr ? 'Répondre…' : 'Reply…'}</span>
        <span className="rounded-full bg-empire px-2 py-0.5 text-[10px] font-bold text-black">{fr ? 'Envoyer' : 'Send'}</span>
      </div>
    </div>
  )
}

function ReportArt({ fr }: { fr: boolean }) {
  const bars = fr
    ? [
        { f: 'Tier list', v: 100, label: '48 k' },
        { f: 'Réaction', v: 72, label: '34 k' },
        { f: 'Flou → net', v: 58, label: '28 k' },
        { f: 'Citation', v: 31, label: '15 k' },
        { f: 'Podcast', v: 22, label: '10 k' },
      ]
    : [
        { f: 'Tier list', v: 100, label: '48k' },
        { f: 'Reaction', v: 72, label: '34k' },
        { f: 'Blur → reveal', v: 58, label: '28k' },
        { f: 'Quote', v: 31, label: '15k' },
        { f: 'Podcast', v: 22, label: '10k' },
      ]
  return (
    <div className={`${MOCK} mt-5 p-4`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{fr ? 'Semaine 41 · vues par format' : 'Week 41 · views per format'}</p>
        <span className="rounded-full bg-empire/15 px-2 py-0.5 text-[10px] font-bold text-empire">{fr ? 'On garde la tier list' : 'Keep the tier list'}</span>
      </div>
      <div className="mt-3 flex h-28 items-end gap-2 sm:gap-3">
        {bars.map((b, i) => (
          <div key={b.f} className="flex min-w-0 flex-1 flex-col items-center justify-end self-stretch">
            <span className={`mb-1 text-[10px] font-bold tabular-nums ${i === 0 ? 'text-empire' : 'text-neutral-400'}`}>{b.label}</span>
            <div className="flex w-full flex-1 items-end">
              <div className={`w-full rounded-t-md ${i === 0 ? 'bg-empire' : 'bg-white/15'}`} style={{ height: `${b.v}%` }} />
            </div>
            <span className="mt-1.5 w-full truncate text-center text-[9.5px] text-neutral-500">{b.f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CommunityArt({ fr }: { fr: boolean }) {
  const people = [
    { i: 'SL', c: 'from-emerald-500 to-teal-400' },
    { i: 'JM', c: 'from-violet-500 to-fuchsia-400' },
    { i: 'AR', c: 'from-amber-500 to-orange-400' },
    { i: 'CD', c: 'from-sky-500 to-cyan-400' },
    { i: 'NB', c: 'from-rose-500 to-pink-400' },
  ]
  return (
    <div className={`${MOCK} mt-5 flex flex-wrap items-center justify-between gap-4 p-4`}>
      <div className="flex items-center">
        <img src="/founders/kevin.jpg" alt="" className="relative z-10 h-10 w-10 rounded-full object-cover ring-2 ring-[#0b0b0b]" loading="lazy" />
        {people.map((p, i) => (
          <span
            key={p.i}
            className={`-ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${p.c} text-[11px] font-bold text-white ring-2 ring-[#0b0b0b]`}
            style={{ zIndex: 9 - i }}
          >
            {p.i}
          </span>
        ))}
        {/* Au-dessus de la pile, sinon le « + » passe sous l'avatar précédent
            et on lit « 120 ». */}
        <span className="relative -ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-empire text-[10px] font-extrabold tracking-tight text-black ring-2 ring-[#0b0b0b]" style={{ zIndex: 20 }}>+120</span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <Radio className="h-3.5 w-3.5 text-neutral-300" />
        <span className="text-[11px] font-semibold text-white">{fr ? 'Live jeudi 12 h · relecture de vos contenus' : 'Live Thursday 12pm · your content reviewed'}</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────── Section ─────────────────────────────── */

export default function IncludedFeaturesSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')

  if (autopilot) return null

  // Fond et bordure plus clairs que le noir de la section : sans ça les
  // cartes se fondent dans la page (retour Kevin, 9 septembre).
  const card = 'relative overflow-hidden rounded-3xl border border-white/[0.14] bg-[#141414] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
  const kicker = 'text-xs font-bold uppercase tracking-wider text-empire'
  const title = 'mt-2 text-lg font-bold text-white'
  const desc = 'mt-1.5 text-sm leading-relaxed text-neutral-400'
  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.5, delay },
  })

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#050505] py-20 md:py-28">
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">{fr ? 'La formule · 5. La visibilité' : 'The formula · 5. Visibility'}</p>
          <h2 className="text-3xl font-extrabold leading-[1.1] text-white md:text-5xl">
            {fr ? 'Le contenu, c\'est la moitié. L\'autre moitié, c\'est savoir ce qu\'il rapporte.' : 'Content is half of it. The other half is knowing what it brings in.'}
          </h2>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-6">
          {/* Tracking des conversions - la grande carte */}
          {/* `flex items-center` : la rangée prend la hauteur de la carte
              miniature, sans ça le contenu reste collé en haut avec un tiers
              de carte vide dessous. */}
          <motion.div {...appear(0.1)} className={`${card} flex items-center md:col-span-4 border-empire/30`}>
            <div className="grid w-full gap-6 sm:grid-cols-2 sm:items-center">
              <div>
                <p className={kicker}><Link2 className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Tracking des clients' : 'Client tracking'}</p>
                <p className={title}>{fr ? 'Vous savez quel contenu a amené quel client.' : 'You know which content brought which client.'}</p>
                <p className={desc}>
                  {fr
                    ? 'Chaque lien que vous partagez est tracké jusqu\'au formulaire et au rendez-vous. Pas « j\'ai fait des vues » : « ce reel a pris trois rendez-vous ».'
                    : 'Every link you share is tracked down to the form and the booked call. Not "I got views": "this reel booked three calls".'}
                </p>
              </div>
              <TrackingArt fr={fr} />
            </div>
          </motion.div>

          {/* Miniatures */}
          <motion.div {...appear(0.2)} className={`${card} md:col-span-2`}>
            <p className={kicker}><ImageIcon className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Miniatures automatiques' : 'Automatic thumbnails'}</p>
            <p className={title}>{fr ? 'Miniatures YouTube et Instagram, générées depuis la vidéo.' : 'YouTube and Instagram thumbnails, generated from the video.'}</p>
            <ThumbnailArt fr={fr} />
          </motion.div>

          {/* Veille */}
          <motion.div {...appear(0.25)} className={`${card} md:col-span-2`}>
            <p className={kicker}><Newspaper className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Veille quotidienne' : 'Daily brief'}</p>
            <p className={title}>{fr ? 'Chaque matin, les sujets qui montent dans votre niche.' : 'Every morning, the topics rising in your niche.'}</p>
            <p className={desc}>{fr ? 'Avec l\'angle et l\'accroche déjà écrits. Vous n\'avez plus qu\'à prendre position.' : 'With the angle and the hook already written. You just take a stance.'}</p>
            <BriefArt fr={fr} />
          </motion.div>

          {/* Republication */}
          <motion.div {...appear(0.3)} className={`${card} md:col-span-2`}>
            <p className={kicker}><Repeat2 className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Republication automatique' : 'Automatic republishing'}</p>
            <p className={title}>{fr ? 'Vos meilleurs posts repartent tout seuls.' : 'Your best posts go out again on their own.'}</p>
            <p className={desc}>{fr ? 'Un contenu qui a marché est reprogrammé quelques semaines plus tard. Rien de ce qui a pris ne dort.' : 'A piece that worked is rescheduled a few weeks later. Nothing that took off sits idle.'}</p>
            <RepostArt fr={fr} />
          </motion.div>

          {/* Boîte de réception */}
          <motion.div {...appear(0.35)} className={`${card} md:col-span-2`}>
            <p className={kicker}><Inbox className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Une seule boîte de réception' : 'One inbox'}</p>
            <p className={title}>{fr ? 'Commentaires et DM de tous vos réseaux, au même endroit.' : 'Comments and DMs from all your networks, in one place.'}</p>
            <p className={desc}>{fr ? 'Instagram, Facebook, Threads, YouTube… Vous répondez d\'ici, en public ou en privé.' : 'Instagram, Facebook, Threads, YouTube… You reply from here, publicly or privately.'}</p>
            <InboxArt fr={fr} />
          </motion.div>

          {/* Intégrations */}
          <motion.div {...appear(0.38)} className={`${card} md:col-span-6`}>
            <p className={kicker}><Link2 className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Intégrations' : 'Integrations'}</p>
            <p className={title}>{fr ? 'Connecté à vos outils. Les leads arrivent directement.' : 'Connected to your tools. Leads arrive directly.'}</p>
            <p className={desc}>
              {fr
                ? 'Agendas, formulaires, paiements, communauté : tout est relié au tracking. Un lead qui clique depuis un post arrive chez vous avec le nom du post.'
                : 'Calendars, forms, payments, community: everything is wired into the tracking. A lead clicking from a post reaches you with the name of the post.'}
            </p>
            {/* 8 logos, deux rangées de quatre : `grid` plutôt que `flex-wrap`,
                sinon la dernière rangée se retrouve orpheline avec un ou deux logos. */}
            <div className="mx-auto mt-5 grid max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {INTEGRATIONS.map((svc) => (
                <span key={svc.name} className="flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-[13px] font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden ${svc.bg ? 'rounded-md' : ''}`}
                    style={svc.bg ? { background: svc.bg } : undefined}
                  >
                    <img
                      src={svc.src}
                      alt=""
                      aria-hidden
                      className={svc.bg ? 'h-3.5 w-3.5' : 'h-6 w-6 rounded-md'}
                      loading="lazy"
                      draggable={false}
                    />
                  </span>
                  {svc.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* API : multi-diffusion */}
          <motion.div {...appear(0.4)} className={`${card} md:col-span-3`}>
            <p className={kicker}><Code2 className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'API · multi-comptes' : 'API · multi-account'}</p>
            <p className={title}>{fr ? 'Plusieurs comptes ? Vous créez une fois, ça part partout.' : 'Several accounts? Create once, it goes out everywhere.'}</p>
            <p className={desc}>{fr ? 'Deux marques, une équipe, des clients : reliez tous les comptes, chaque contenu est publié sur chacun d\'eux, sur les 7 réseaux, sans rien refaire.' : 'Two brands, a team, clients: connect every account and each piece of content is published on all of them, across the 7 networks, without redoing anything.'}</p>
            <BroadcastArt fr={fr} />
          </motion.div>

          {/* Notes vocales Telegram */}
          <motion.div {...appear(0.42)} className={`${card} md:col-span-3`}>
            <p className={kicker}><Send className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Notes vocales Telegram' : 'Telegram voice notes'}</p>
            <p className={title}>{fr ? 'Une idée dans la rue ? Une note vocale, et c\'est un post.' : 'An idea on the street? One voice note, and it\'s a post.'}</p>
            <p className={desc}>
              {fr
                ? 'Pas besoin d\'ouvrir l\'app ni de filmer. Vous dictez dans Telegram comme à un ami, l\'équipe en fait un post, un carrousel ou une newsletter dans votre ton.'
                : 'No need to open the app or film. You dictate in Telegram like to a friend, the team turns it into a post, a carousel or a newsletter in your tone.'}
            </p>
            <TelegramArt fr={fr} />
          </motion.div>

          {/* Rapport hebdo + relecture humaine */}
          <motion.div {...appear(0.45)} className={`${card} md:col-span-3`}>
            <p className={kicker}><BarChart3 className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Rapport hebdo' : 'Weekly report'}</p>
            <p className={title}>{fr ? 'Vues, abonnés, leads - format par format.' : 'Views, followers, leads - format by format.'}</p>
            <p className={desc}>{fr ? 'Chaque semaine, ce qui a marché chez vous et ce qu\'on arrête. Une équipe relit chaque écrit avant qu\'il sorte.' : 'Every week, what worked for you and what we stop. A team proofreads every written piece before it goes out.'}</p>
            <ReportArt fr={fr} />
          </motion.div>

          {/* Communauté */}
          <motion.div {...appear(0.45)} className={`${card} md:col-span-3`}>
            <p className={kicker}><Users className="mr-1.5 inline h-3.5 w-3.5" />{fr ? 'Communauté & lives' : 'Community & lives'}</p>
            <p className={title}>{fr ? 'Un live par semaine avec Kevin, et les autres membres à côté.' : 'A live session every week with Kevin, and the other members next to you.'}</p>
            <p className={desc}>{fr ? 'Vos contenus relus en direct, les replays, et des gens qui publient autant que vous. Dès le palier Intermédiaire.' : 'Your content reviewed live, the replays, and people who publish as much as you do. From the Intermediate tier.'}</p>
            <CommunityArt fr={fr} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
