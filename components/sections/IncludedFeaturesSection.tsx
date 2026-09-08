'use client'

/**
 * IncludedFeaturesSection — ce qui est dans l'abonnement au-delà des formats,
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
import { Link2, Image as ImageIcon, Newspaper, Repeat2, Inbox, Users, BarChart3, UserCheck, CalendarCheck, Sparkles, TrendingUp, MessageCircle, Send, Radio } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'
import { SocialIcons } from '@/components/ui/social-icons'

/** Cadre commun des maquettes : même langage que RepurposingSection / MobileAppSection. */
const MOCK = 'rounded-2xl border border-white/10 bg-black/50'

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
      <div className="relative aspect-video w-full">
        {/* La miniature porte déjà son texte (c'est la vraie sortie du
            générateur) : on ne pose rien dessus, sinon deux titres se
            superposent. */}
        <img src="/formats/long-thumb.webp" alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">38:12</span>
        <span className="absolute left-2 top-2 rounded-full bg-empire px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-black">{fr ? 'Miniature générée' : 'Generated thumbnail'}</span>
      </div>
      <div className="flex items-start gap-2 px-3 py-2.5">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-empire" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-empire">{fr ? 'Titre généré' : 'Generated title'}</p>
          <p className="truncate text-[12px] font-semibold text-white">0€ VS 1M€ : le pire piège des créateurs</p>
        </div>
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

  const card = 'relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0b] p-6'
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
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">{fr ? 'Inclus' : 'Included'}</p>
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
            <p className={title}>{fr ? 'Titre et miniature YouTube, générés depuis la vidéo.' : 'YouTube title and thumbnail, generated from the video.'}</p>
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

          {/* Rapport hebdo + relecture humaine */}
          <motion.div {...appear(0.4)} className={`${card} md:col-span-3`}>
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
