'use client'

/**
 * RepurposingSection - pourquoi une idée doit sortir en plusieurs formats,
 * démontré sur un cas réel du compte de Kevin plutôt qu'affirmé. Une phrase,
 * puis le visuel : la même idée au centre, ce qu'elle a fait réseau par
 * réseau autour.
 *
 * Chiffres : Threads 304 535, Instagram (reel) 69 785 et X 84 viennent de
 * `social_publications` (workspace `ws_a6F0cdnK1`, relevés le 8 septembre
 * 2026). LinkedIn - 39 546 impressions, 110 réactions, 43 commentaires,
 * 9 republications - vient de l'écran LinkedIn du post, relevé par Kevin le
 * même jour : Postproxy ne remonte aucune vue pour les posts publiés par API,
 * donc la base dit 0 et on ne s'en sert pas. Si l'exemple est remplacé, il
 * faut un cas où l'écart entre réseaux est réel et vérifiable - c'est l'écart
 * qui fait l'argument, pas le total.
 */

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'
import { SocialIcons } from '@/components/ui/social-icons'

type Hit = {
  network: keyof typeof SocialIcons
  label: string
  formatFr: string
  formatEn: string
  views: number
  /** Détail sous le chiffre (réactions, commentaires…) quand on l'a. */
  subFr?: string
  subEn?: string
  origin?: boolean
}

const HITS: Hit[] = [
  { network: 'linkedin', label: 'LinkedIn', formatFr: 'Le post, écrit pour LinkedIn', formatEn: 'The post, written for LinkedIn', views: 39546, subFr: '110 réactions · 43 commentaires · 9 republications', subEn: '110 reactions · 43 comments · 9 reposts', origin: true },
  { network: 'threads', label: 'Threads', formatFr: 'Le même texte, le même jour', formatEn: 'Same text, same day', views: 304535, subFr: '73 commentaires', subEn: '73 comments' },
  { network: 'instagram', label: 'Instagram', formatFr: 'La même idée en reel, le lendemain', formatEn: 'Same idea as a reel, the next day', views: 69785 },
  { network: 'twitter', label: 'X', formatFr: 'Le même texte, le même jour', formatEn: 'Same text, same day', views: 84 },
]

const TOTAL = HITS.reduce((s, h) => s + h.views, 0)
const MAX = Math.max(...HITS.map((h) => h.views))

const fmtK = (n: number, fr: boolean) => {
  if (n < 1000) return String(n)
  const k = Math.round(n / 1000)
  return fr ? `${k} 000` : `${k}k`
}

export default function RepurposingSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')

  if (autopilot) return null

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#050505] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgb(var(--empire-rgb)_/_0.08),transparent)]" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
            {fr ? 'La formule · 3. La diffusion' : 'The formula · 3. Distribution'}
          </p>
          <h2 className="text-3xl font-extrabold leading-[1.1] text-white md:text-5xl">
            {fr ? <>Une idée. {fmtK(TOTAL, fr)} vues.</> : <>One idea. {fmtK(TOTAL, fr)} views.</>}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
            {fr
              ? 'Une idée ne se publie pas une fois. Écrit pour LinkedIn : 40 000 vues. Le même texte collé sur Threads : 305 000. Personne ne sait où une idée va prendre - donc chaque idée sort partout, et chaque idée que vous ne republiez pas est de la visibilité perdue.'
              : 'An idea is never published once. Written for LinkedIn: 40,000 views. The same text pasted on Threads: 305,000. Nobody knows where an idea will take off - so every idea goes everywhere, and every idea you don\'t republish is reach you lose.'}
          </p>
        </motion.div>

        {/* Le visuel : l'idée au centre, les réseaux autour */}
        <div className="relative mx-auto mt-12 grid max-w-5xl items-center gap-6 md:mt-16 md:grid-cols-[minmax(0,300px)_1fr] md:gap-10">
          {/* L'idée */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative mx-auto w-full max-w-[300px]"
          >
            <div className="rounded-3xl border border-empire/40 bg-[#0b0b0b] p-5 shadow-[0_0_80px_-20px_rgb(var(--empire-rgb)_/_0.35)]">
              <div className="flex items-center gap-3">
                <img src="/founders/kevin.jpg" alt="" className="h-9 w-9 rounded-full object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-white">Kevin Dufraisse</p>
                  <p className="text-[11px] text-neutral-500">{fr ? '10 juin 2026 · 1 idée' : 'June 10, 2026 · 1 idea'}</p>
                </div>
              </div>
              <p className="mt-4 text-[14px] font-semibold leading-snug text-white">
                HugoDecrypte a lancé sa chaîne YouTube en disant qu'il voulait créer un média pour aider les gens à comprendre l'actu.
              </p>
              <p className="mt-2 text-[13px] leading-snug text-neutral-400">
                Aujourd'hui, regarde ses titres. C'est exactement les mêmes que BFM et TF1…
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-empire/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-empire">{fr ? 'Post écrit' : 'Written post'}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-300">{fr ? '+ Reel' : '+ Reel'}</span>
              </div>
            </div>
            {/* Connecteur vers la colonne de droite (desktop) */}
            <div className="pointer-events-none absolute -right-10 top-1/2 hidden h-px w-10 bg-gradient-to-r from-empire/60 to-transparent md:block" />
          </motion.div>

          {/* Les réseaux */}
          <ul className="grid gap-3 sm:grid-cols-2">
            {HITS.map((h, i) => {
              const Icon = SocialIcons[h.network]
              const pct = Math.max(2, (h.views / MAX) * 100)
              const strong = h.views >= 1000
              return (
                <motion.li
                  key={h.network}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl border p-4 ${h.network === 'threads' ? 'border-empire/40 bg-empire/[0.06]' : 'border-white/10 bg-white/[0.03]'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-100 [&_svg]:h-4 [&_svg]:w-4">
                      <Icon />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white">{h.label}</p>
                      <p className="truncate text-[11px] text-neutral-500">{fr ? h.formatFr : h.formatEn}</p>
                    </div>
                  </div>
                  <p className={`mt-3 text-3xl font-extrabold tabular-nums leading-none ${strong ? 'text-white' : 'text-neutral-500'}`}>
                    {h.views.toLocaleString(fr ? 'fr-FR' : 'en-US')}
                    <span className="ml-1.5 text-xs font-semibold text-neutral-500">{fr ? 'vues' : 'views'}</span>
                  </p>
                  {(h.subFr || h.subEn) && (
                    <p className="mt-1 text-[11px] text-neutral-500">{fr ? h.subFr : h.subEn}</p>
                  )}
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${pct}%` } : { width: 0 }}
                      transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: 'easeOut' }}
                      className={`h-full rounded-full ${strong ? 'bg-empire' : 'bg-neutral-600'}`}
                    />
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-[11px] leading-relaxed text-neutral-600">
          {fr
            ? 'Chiffres relevés le 8 septembre 2026 sur le compte de Kevin (LinkedIn : impressions affichées par LinkedIn).'
            : 'Numbers recorded on September 8, 2026 on Kevin\'s account (LinkedIn: impressions as shown by LinkedIn).'}
        </p>
      </div>
    </section>
  )
}
