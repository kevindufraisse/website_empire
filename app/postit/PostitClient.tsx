'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CalendarPlus, Eye, Flame, Mic } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'
import { formatPostitDate, nextPostitSession, postitCalendarUrl, postitJoinUrl } from '@/lib/postit'

const NOTES = [
  { position: 'left-[4%] top-[22%]', rotate: -8, color: 'bg-[#ffe45c]', fr: 'Le sujet', en: 'The topic', delay: 0 },
  { position: 'right-[5%] top-[26%]', rotate: 6, color: 'bg-[#ff9ec4]', fr: 'L\u2019angle', en: 'The angle', delay: 1.2 },
  { position: 'left-[8%] top-[62%]', rotate: 5, color: 'bg-[#ffb35c]', fr: 'Le hook', en: 'The hook', delay: 2.4 },
  { position: 'right-[7%] top-[66%]', rotate: -5, color: 'bg-[#ffe45c]', fr: 'Le format', en: 'The format', delay: 3.6 },
] as const

const FORMULA_STEPS = [
  { fr: 'Le sujet', en: 'The topic' },
  { fr: 'L\u2019angle', en: 'The angle' },
  { fr: 'Le hook', en: 'The hook' },
  { fr: 'Le format', en: 'The format' },
  { fr: 'Le breakdown', en: 'The breakdown' },
] as const

const BUILD_STEPS = [
  { fr: 'Leur prochain gros sujet', en: 'Their next big topic' },
  { fr: 'L\u2019angle qui le rend intéressant', en: 'The angle that makes it interesting' },
  { fr: 'Les 3 à 5 vidéos à tourner cette semaine', en: 'The 3 to 5 videos to shoot this week' },
] as const

const RULES = [
  {
    fr: 'On sélectionne sur le volet.',
    en: 'We pick on the spot.',
    descFr: 'Tu t\u2019inscris, on regarde ton business et ton contenu, et on choisit les 5 qui passent. Pas besoin d\u2019audience. Juste un vrai business ou quelque chose à vendre.',
    descEn: 'You sign up, we look at your business and your content, and we choose the 5 who go on. No audience needed. Just a real business or something to sell.',
  },
  {
    fr: 'Tu fais ta promo.',
    en: 'You pitch yourself.',
    descFr: 'Pendant ton passage, tu présentes ce que tu fais et ce que tu vends. C\u2019est le but : plus de 100 000 personnes devant l\u2019écran, profites-en.',
    descEn: 'During your slot, you present what you do and what you sell. That is the point: over 100,000 people watching, make the most of it.',
  },
  {
    fr: 'Tu envoies tes résultats le lendemain.',
    en: 'You send your results the next day.',
    descFr: 'C\u2019est la seule chose qu\u2019on te demande. Tu tournes, tu postes, tu nous envoies ce que ça a donné. On les montre au live suivant.',
    descEn: 'That is the only thing we ask. You shoot, you post, you send us what happened. We show it at the next live.',
  },
] as const

function FloatingNotes({ fr }: { fr: boolean }) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block" aria-hidden>
      {NOTES.map((note) => (
        <motion.div
          key={note.en}
          className={`absolute flex h-[150px] w-[150px] items-center rounded-[3px] p-4 text-left shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)] ${note.color} ${note.position}`}
          style={{ rotate: note.rotate }}
          initial={{ opacity: 0, y: 16 }}
          animate={reduceMotion ? { opacity: 0.9, y: 0 } : { opacity: 0.9, y: [0, -8, 0] }}
          transition={
            reduceMotion
              ? { duration: 0.4, delay: note.delay * 0.2 }
              : { opacity: { duration: 0.5, delay: note.delay * 0.2 }, y: { duration: 6, delay: note.delay, repeat: Infinity, ease: 'easeInOut' } }
          }
        >
          <span className="absolute inset-x-0 top-0 h-3 bg-black/[0.06]" />
          <p className="font-[cursive] text-[17px] font-semibold leading-snug text-neutral-900">
            {fr ? note.fr : note.en}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const pad = (n: number) => String(n).padStart(2, '0')

function Countdown({ now, target, fr }: { now: Date | null; target: Date | null; fr: boolean }) {
  const diff = now && target ? Math.max(0, target.getTime() - now.getTime()) : null
  const blocks = [
    { v: diff === null ? '--' : pad(Math.floor(diff / 86_400_000)), l: fr ? 'jours' : 'days' },
    { v: diff === null ? '--' : pad(Math.floor((diff % 86_400_000) / 3_600_000)), l: fr ? 'heures' : 'hours' },
    { v: diff === null ? '--' : pad(Math.floor((diff % 3_600_000) / 60_000)), l: 'min' },
    { v: diff === null ? '--' : pad(Math.floor((diff % 60_000) / 1000)), l: 'sec' },
  ]
  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-3">
      {blocks.map((b) => (
        <div key={b.l} className="flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-2xl font-black tabular-nums text-white sm:h-16 sm:w-16 sm:text-3xl">
            {b.v}
          </span>
          <span className="mt-1.5 text-[10px] uppercase tracking-widest text-neutral-500">{b.l}</span>
        </div>
      ))}
    </div>
  )
}

function JoinButton({ source, live, fr, className = '' }: { source: string; live: boolean; fr: boolean; className?: string }) {
  return (
    <a
      href={postitJoinUrl(source)}
      onClick={() => trackAmplitude('postit_join_clicked', { source })}
      className={`group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ffb020] to-[#ff5a2b] px-8 text-base font-extrabold text-black shadow-[0_0_40px_rgba(255,106,43,0.45)] transition hover:brightness-110 ${className}`}
    >
      {live ? (fr ? 'Rejoindre le live' : 'Join the live') : fr ? 'Je prends ma place' : 'Save my spot'}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
    </a>
  )
}

export default function PostitClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const now = useNow()
  const session = useMemo(() => (now ? nextPostitSession(now) : null), [now])

  useEffect(() => {
    trackAmplitude('postit_page_viewed')
  }, [])

  const live = session?.live ?? false
  const dateLabel = session ? formatPostitDate(session.start, fr) : fr ? 'mercredi' : 'Wednesday'

  return (
    <main className="relative min-h-screen bg-black text-white">
      <section className="relative overflow-hidden pb-14 pt-28 md:pb-20 md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(255,106,43,0.22),transparent)]" />
        <FloatingNotes fr={fr} />

        <div className="container relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                live ? 'border-red-500/40 bg-red-500/15 text-red-300' : 'border-orange-400/30 bg-orange-400/10 text-orange-200'
              }`}
            >
              {live ? (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
              ) : (
                <Flame className="h-3.5 w-3.5" aria-hidden />
              )}
              {live
                ? fr ? 'En direct maintenant' : 'Live now'
                : fr ? 'Tous les mercredis · 12h · en direct' : 'Every Wednesday · noon (Paris) · live'}
            </div>

            <p className="mt-6 text-sm font-semibold text-neutral-400">
              {fr ? 'Kevin Dufraisse présente' : 'Kevin Dufraisse presents'}
            </p>
            <h1 className="mt-2 text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl md:text-7xl">
              Post it
              <br />
              <span className="bg-gradient-to-r from-[#ffd23f] via-[#ff7a2b] to-[#ff3b3b] bg-clip-text text-transparent">
                like it&apos;s hot.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-300 sm:text-xl">
              {fr
                ? 'Le live hebdo où on trouve ton prochain contenu viral. En direct, sur ton business.'
                : 'The weekly live where we find your next viral piece of content. Live, on your business.'}
            </p>

            <div className="mx-auto mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <p className="text-sm font-semibold text-neutral-300">
                {live
                  ? fr ? 'Le live a commencé.' : 'The live has started.'
                  : <>{fr ? 'Prochain live : ' : 'Next live: '}<span className="font-bold text-white">{dateLabel}</span>{fr ? ' à 12h00' : ' at 12:00 (Paris)'}</>}
              </p>
              {!live && (
                <div className="mt-4">
                  <Countdown now={now} target={session?.start ?? null} fr={fr} />
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <JoinButton source="postit_hero" live={live} fr={fr} className="w-full sm:w-auto" />
              {session && !live ? (
                <a
                  href={postitCalendarUrl(session.start, fr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAmplitude('postit_calendar_added')}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-6 text-base font-bold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  <CalendarPlus className="h-5 w-5" aria-hidden />
                  {fr ? 'Ajouter à mon agenda' : 'Add to my calendar'}
                </a>
              ) : null}
            </div>
            <p className="mt-3 text-[13px] text-neutral-500">
              {fr
                ? 'Gratuit. Pas de rediffusion. Les 5 qui passent sont choisis parmi les inscrits.'
                : 'Free. No replay. The 5 who go on are picked from those signed up.'}
            </p>

            <dl className="mx-auto mt-10 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 text-left">
              {[
                { t: fr ? 'Places' : 'Slots', d: fr ? '5 par live' : '5 per live' },
                { t: fr ? 'Devant' : 'Audience', d: fr ? '+100 000 personnes' : '100,000+ people' },
                { t: fr ? 'Prix' : 'Price', d: fr ? 'Gratuit' : 'Free' },
              ].map((item) => (
                <div key={item.t} className="px-4 py-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{item.t}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-white">{item.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#070707] py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-300">{fr ? 'Le deal' : 'The deal'}</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">
              {fr ? 'Tu sais vendre ton truc. Pas forcément en faire un contenu qu\u2019on a envie de regarder.' : 'You know how to sell your thing. Not always how to turn it into content people want to watch.'}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-400 md:text-lg">
              {fr
                ? 'C\u2019est ce qu\u2019on règle en une heure. Pas de théorie : ton cas, en direct, devant tout le monde.'
                : 'That is what we fix in one hour. No theory: your case, live, in front of everyone.'}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange-300">
                {fr ? 'Les 15 premières minutes' : 'The first 15 minutes'}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-snug">
                {fr ? 'Comment je repère une idée qui peut exploser.' : 'How I spot an idea that can blow up.'}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">
                {fr ? 'Le système que j\u2019utilise pour sortir 6 millions de vues par mois.' : 'The system I use to get 6 million views a month.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {FORMULA_STEPS.map((s) => (
                  <span key={s.en} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[13px] font-semibold text-neutral-200">
                    {fr ? s.fr : s.en}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-orange-400/30 bg-orange-400/[0.06] p-6 md:p-7">
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange-300">
                {fr ? 'Les 45 minutes suivantes' : 'The next 45 minutes'}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-snug">
                {fr ? '5 entrepreneurs passent en direct avec leur business.' : '5 entrepreneurs go live with their business.'}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">
                {fr ? 'Leur expertise, ce qu\u2019ils postent aujourd\u2019hui. On construit ensemble :' : 'Their expertise, what they post today. Together we build:'}
              </p>
              <ul className="mt-4 space-y-2.5">
                {BUILD_STEPS.map((s) => (
                  <li key={s.en} className="flex gap-3 text-[15px] text-neutral-200">
                    <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                    {fr ? s.fr : s.en}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex gap-4 rounded-3xl border border-white/10 p-6">
              <Eye className="mt-0.5 h-6 w-6 shrink-0 text-orange-300" aria-hidden />
              <div>
                <p className="font-bold">{fr ? 'Si tu regardes' : 'If you watch'}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-neutral-400">
                  {fr
                    ? 'Tu vois la méthode appliquée sur 5 business différents. À la troisième, tu sais l\u2019appliquer au tien.'
                    : 'You see the method applied to 5 different businesses. By the third, you know how to apply it to yours.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-3xl border border-white/10 p-6">
              <Mic className="mt-0.5 h-6 w-6 shrink-0 text-orange-300" aria-hidden />
              <div>
                <p className="font-bold">{fr ? 'Si tu passes' : 'If you go on'}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-neutral-400">
                  {fr
                    ? 'Tu repars avec ta liste de contenus à tourner et la logique derrière chacun. Et tu présentes ton business devant plus de 100 000 personnes. Le live, c\u2019est aussi ta pub.'
                    : 'You leave with your list of videos to shoot and the logic behind each one. And you present your business to over 100,000 people. The live is also your ad.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="container max-w-4xl">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">{fr ? 'Les règles du jeu' : 'The rules'}</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {RULES.map((rule, i) => (
              <li key={rule.en} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb020] to-[#ff5a2b] text-sm font-black text-black">
                  {i + 1}
                </span>
                <p className="mt-4 text-lg font-bold leading-snug">{fr ? rule.fr : rule.en}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-400">{fr ? rule.descFr : rule.descEn}</p>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-14 max-w-2xl rounded-3xl border border-orange-400/30 bg-[#120b06] px-6 py-10 text-center shadow-[0_0_60px_-10px_rgba(255,106,43,0.25)]">
            <p className="text-3xl font-black leading-tight md:text-4xl">
              {fr ? 'Une vidéo peut changer un business.' : 'One video can change a business.'}
            </p>
            <p className="mt-2 text-lg text-neutral-300">{fr ? 'Et si c\u2019était ta prochaine ?' : 'What if it is your next one?'}</p>
            <JoinButton source="postit_footer" live={live} fr={fr} className="mt-7" />
            <p className="mt-3 text-[13px] text-neutral-500">
              {live ? (fr ? 'En direct maintenant' : 'Live now') : <>{fr ? 'Prochain live ' : 'Next live '}{dateLabel}{fr ? ' · 12h' : ' · noon'}</>}
            </p>
          </div>
        </div>
      </section>

      <TopCreatorsSection compact />
    </main>
  )
}
