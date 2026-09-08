'use client'

/**
 * RepurposingSection — pourquoi une idée doit sortir en plusieurs formats,
 * démontré sur un cas réel du compte de Kevin plutôt qu'affirmé.
 *
 * Les chiffres viennent de `social_publications` (workspace `ws_a6F0cdnK1`,
 * relevés le 8 septembre 2026) : le post HugoDécrypte écrit le 10 juin 2026
 * a fait 304 535 vues sur Threads et 84 sur X ; la même idée tournée en reel
 * le 11 juin a fait 69 785 vues sur Instagram. LinkedIn n'est volontairement
 * pas chiffré : Postproxy ne remonte aucune vue pour les posts publiés par
 * l'API (cf. AGENTS.md de l'app), donc on n'a pas de nombre fiable et on n'en
 * invente pas. Le message tient sans : un post écrit pour LinkedIn a fait
 * 99 % de ses vues ailleurs.
 *
 * Si l'exemple est remplacé, il faut un cas où l'écart entre réseaux est réel
 * et vérifiable dans la base - c'est l'écart qui fait l'argument, pas le
 * total.
 */

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'
import { SocialIcons } from '@/components/ui/social-icons'

const POST_HOOK = [
  'HugoDecrypte a lancé sa chaîne YouTube en disant qu\'il voulait créer un média pour aider les gens à comprendre l\'actu.',
  'Un média indépendant, neutre, fait par les jeunes, pour les jeunes.',
  'Aujourd\'hui, regarde ses titres YouTube. C\'est exactement les mêmes que BFM et TF1.',
]

type Hit = {
  network: keyof typeof SocialIcons
  labelFr: string
  labelEn: string
  formatFr: string
  formatEn: string
  views: number
}

const HITS: Hit[] = [
  { network: 'threads', labelFr: 'Threads', labelEn: 'Threads', formatFr: 'Le même texte, le même jour', formatEn: 'Same text, same day', views: 304535 },
  { network: 'instagram', labelFr: 'Instagram', labelEn: 'Instagram', formatFr: 'La même idée en reel, le lendemain', formatEn: 'Same idea as a reel, the next day', views: 69785 },
  { network: 'twitter', labelFr: 'X', labelEn: 'X', formatFr: 'Le même texte, le même jour', formatEn: 'Same text, same day', views: 84 },
]

const TOTAL = HITS.reduce((s, h) => s + h.views, 0)
const MAX = Math.max(...HITS.map((h) => h.views))

function fmtViews(n: number, fr: boolean) {
  if (n >= 1000) {
    const k = Math.round(n / 1000)
    return fr ? `${k.toLocaleString('fr-FR')} 000` : `${k}k`
  }
  return String(n)
}

export default function RepurposingSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, inView] = useReveal('-80px')

  if (autopilot) return null

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#050505] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgb(var(--empire-rgb)_/_0.08),transparent)]" />
      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
              {fr ? 'Une idée ne se publie pas une fois' : 'An idea is never published once'}
            </p>
            <h2 className="text-3xl font-extrabold leading-[1.1] text-white md:text-5xl">
              {fr ? (
                <>Écrit pour LinkedIn.<br />{fmtViews(TOTAL, fr)} vues… ailleurs.</>
              ) : (
                <>Written for LinkedIn.<br />{fmtViews(TOTAL, fr)} views… elsewhere.</>
              )}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-400 md:text-lg">
              <p>
                {fr
                  ? 'Le 10 juin, Kevin écrit un post sur HugoDécrypte, pensé pour LinkedIn. Publié tel quel sur Threads le même jour : 305 000 vues. Sur X, le même texte : 84. Le lendemain, la même idée dite face caméra, en reel : 70 000 vues sur Instagram.'
                  : 'On June 10, Kevin wrote a post about HugoDécrypte, meant for LinkedIn. Published as is on Threads the same day: 305,000 views. On X, the same text: 84. The next day, the same idea said on camera, as a reel: 70,000 views on Instagram.'}
              </p>
              <p>
                {fr
                  ? 'Personne ne peut prédire où une idée va prendre. Donc chaque idée sort dans plusieurs formats, sur tous vos réseaux, et on regarde où elle a pris. Une idée que vous ne republiez pas, c\'est de la visibilité que vous laissez à quelqu\'un d\'autre.'
                  : 'Nobody can predict where an idea will take off. So every idea goes out in several formats, on all your networks, and we watch where it landed. An idea you don\'t republish is reach you leave to someone else.'}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                fr ? ['1', 'idée'] : ['1', 'idea'],
                fr ? ['2', 'formats'] : ['2', 'formats'],
                fr ? ['7', 'réseaux'] : ['7', 'networks'],
              ].map(([n, l]) => (
                <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{n}</p>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Le cas : le post, puis ce qu'il a fait réseau par réseau */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="relative"
          >
            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-6">
              <div className="flex items-center gap-3">
                <img src="/founders/kevin.jpg" alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-white">Kevin Dufraisse</p>
                  <p className="text-[11px] text-neutral-500">{fr ? '10 juin 2026 · écrit pour LinkedIn' : 'June 10, 2026 · written for LinkedIn'}</p>
                </div>
                <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-neutral-300 [&_svg]:h-4 [&_svg]:w-4">
                  <SocialIcons.linkedin />
                </span>
              </div>
              <div className="mt-4 space-y-2 text-[13px] leading-relaxed text-neutral-300">
                {POST_HOOK.map((p, i) => (
                  <p key={p} className={i === 0 ? 'font-semibold text-white' : ''}>{p}</p>
                ))}
                <p className="text-neutral-600">…</p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-empire">
                  {fr ? 'La même idée, republiée' : 'The same idea, republished'}
                </p>
                <ul className="mt-3 space-y-3">
                  {HITS.map((h, i) => {
                    const Icon = SocialIcons[h.network]
                    const pct = Math.max(1.5, (h.views / MAX) * 100)
                    return (
                      <li key={h.network}>
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-neutral-200 [&_svg]:h-3.5 [&_svg]:w-3.5">
                            <Icon />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                              <p className="truncate text-[12px] text-neutral-400">
                                <span className="font-semibold text-white">{fr ? h.labelFr : h.labelEn}</span>
                                <span className="text-neutral-600"> · </span>
                                {fr ? h.formatFr : h.formatEn}
                              </p>
                              <p className={`shrink-0 text-[13px] font-bold tabular-nums ${h.views >= 1000 ? 'text-white' : 'text-neutral-500'}`}>
                                {h.views.toLocaleString(fr ? 'fr-FR' : 'en-US')} {fr ? 'vues' : 'views'}
                              </p>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={inView ? { width: `${pct}%` } : { width: 0 }}
                                transition={{ duration: 0.9, delay: 0.4 + i * 0.15, ease: 'easeOut' }}
                                className={`h-full rounded-full ${h.views >= 1000 ? 'bg-empire' : 'bg-neutral-600'}`}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-4 text-[11px] leading-relaxed text-neutral-600">
                  {fr
                    ? 'Vues relevées le 8 septembre 2026 sur le compte de Kevin. LinkedIn ne transmet pas les vues des posts publiés par API, on ne les invente pas.'
                    : 'Views recorded on September 8, 2026 on Kevin\'s account. LinkedIn does not report views for API-published posts; we don\'t make them up.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
