'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { X, CheckCircle2, ArrowRight, ArrowDown } from 'lucide-react'
import { getCalApi } from "@calcom/embed-react"
import CallbackButton from '@/components/CallbackButton'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import { useCalLink } from '@/hooks/useCalLink'
import { SocialIcons } from '@/components/ui/social-icons'

interface TaskLine {
  fr: string
  en: string
  qty: number
  unitFr: string
  unitEn: string
  hours: number
  cost: number
  viewsAlone?: number
  viewsEmpire?: number
}

interface Platform {
  id: string
  name: string
  icon: React.ReactNode
  tasks: TaskLine[]
}

const platforms: Platform[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <SocialIcons.linkedin />,
    tasks: [
      { fr: 'Posts LinkedIn', en: 'LinkedIn posts', qty: 30, unitFr: 'posts', unitEn: 'posts', hours: 30, cost: 3000, viewsAlone: 1000, viewsEmpire: 10000 },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <SocialIcons.instagram />,
    tasks: [
      { fr: 'Posts Instagram', en: 'Instagram posts', qty: 30, unitFr: 'posts', unitEn: 'posts', hours: 30, cost: 600, viewsAlone: 500, viewsEmpire: 5000 },
      { fr: 'Carrousels', en: 'Carousels', qty: 12, unitFr: 'carrousels', unitEn: 'carousels', hours: 24, cost: 960, viewsAlone: 800, viewsEmpire: 8000 },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <SocialIcons.youtube />,
    tasks: [
      { fr: 'Montage YouTube (20 min)', en: 'YouTube editing (20 min)', qty: 4, unitFr: 'vidéos', unitEn: 'videos', hours: 12, cost: 800, viewsAlone: 500, viewsEmpire: 15000 },
    ],
  },
  {
    id: 'shorts',
    name: 'Shorts / Reels / TikTok',
    icon: <SocialIcons.tiktok />,
    tasks: [
      { fr: 'Shorts / Reels / TikTok', en: 'Shorts / Reels / TikTok', qty: 30, unitFr: 'shorts', unitEn: 'shorts', hours: 90, cost: 3000, viewsAlone: 1000, viewsEmpire: 15000 },
    ],
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    icon: <SocialIcons.newsletter />,
    tasks: [
      { fr: 'Newsletters', en: 'Newsletters', qty: 30, unitFr: 'NL', unitEn: 'NL', hours: 60, cost: 3000, viewsAlone: 100, viewsEmpire: 500 },
    ],
  },
  {
    id: 'substack',
    name: 'Substack',
    icon: <SocialIcons.substack />,
    tasks: [
      { fr: 'Notes Substack', en: 'Substack notes', qty: 30, unitFr: 'notes', unitEn: 'notes', hours: 15, cost: 600, viewsAlone: 50, viewsEmpire: 500 },
    ],
  },
]

const afterItems = [
  { fr: 'Posts LinkedIn rédigés à votre voix', en: 'LinkedIn posts written in your voice' },
  { fr: 'Vidéos montées + Shorts découpés', en: 'Videos edited + Shorts cut' },
  { fr: 'Un interviewer dédié pour vos contenus', en: 'A dedicated interviewer for your content' },
  { fr: 'Newsletters écrites et envoyées', en: 'Newsletters written and sent' },
  { fr: 'Carrousels & posts Instagram créés', en: 'Carousels & Instagram posts created' },
  { fr: 'Publié quotidiennement sur 6+ plateformes', en: 'Published daily on 6+ platforms' },
]

const painPoints = [
  { fr: 'Aucune garantie de viralité', en: 'No guarantee of virality' },
  { fr: 'Seul face au syndrome de la page blanche', en: "Alone facing writer's block" },
  { fr: 'Pas de système, vous improvisez', en: 'No system, you improvise' },
]

function fmt(n: number) {
  return n.toLocaleString('fr-FR')
}

export default function QuickWinsSection() {
  const { lang, t } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const [selected, setSelected] = useState<Set<string>>(new Set(['linkedin', 'instagram', 'youtube', 'shorts', 'newsletter', 'substack']))

  const namespace = 'audit-empire'
  const calLink = useCalLink()

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace })
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#dafc68" },
          dark: { "cal-brand": "#dafc68" }
        }
      })
    })()
  }, [namespace])

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const sharedTasks: TaskLine[] = [
    { fr: 'Interviewer', en: 'Interviewer', qty: 7, unitFr: 'séances', unitEn: 'sessions', hours: 7, cost: 1400 },
    { fr: 'Scripts vidéos', en: 'Video scripts', qty: 30, unitFr: 'scripts', unitEn: 'scripts', hours: 30, cost: 1500 },
  ]

  const needsSharedTasks = selected.has('youtube') || selected.has('shorts') || selected.has('instagram') || selected.has('linkedin')

  const activeTasks = useMemo(() => {
    const platformTasks = platforms
      .filter(p => selected.has(p.id))
      .flatMap(p => p.tasks)
    return needsSharedTasks ? [...sharedTasks, ...platformTasks] : platformTasks
  }, [selected, needsSharedTasks])

  const totalHours = activeTasks.reduce((s, t) => s + t.hours, 0)
  const totalCost = activeTasks.reduce((s, t) => s + t.cost, 0)
  const totalPieces = activeTasks.reduce((s, t) => s + t.qty, 0)
  const totalViewsAlone = activeTasks.reduce((s, t) => s + (t.viewsAlone || 0) * t.qty, 0)

  const viewsMultipliers = { min: 0.3, avg: 1, top: 5 }
  const [viewsTier, setViewsTier] = useState<'min' | 'avg' | 'top'>('avg')
  const baseViewsEmpire = activeTasks.reduce((s, t) => s + (t.viewsEmpire || 0) * t.qty, 0)
  const totalViewsEmpire = Math.round(baseViewsEmpire * viewsMultipliers[viewsTier])

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.05),transparent)]" />

      <div ref={ref} className="relative z-10 container max-w-6xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-white text-center max-w-3xl mx-auto mb-10"
        >
          {fr ? (
            <><span className="text-red-400">Avant</span> Empire vs <span className="text-empire">Après</span> Empire</>
          ) : (
            <><span className="text-red-400">Before</span> Empire vs <span className="text-empire">After</span> Empire</>
          )}
        </motion.h2>

        {/* Platform toggles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-2.5 mb-14"
        >
          {platforms.map(p => {
            const active = selected.has(p.id)
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  active
                    ? 'bg-empire/10 border-empire/40 shadow-[0_0_15px_rgb(var(--empire-rgb)_/_0.15)]'
                    : 'bg-neutral-900 border-white/[0.06] opacity-50 hover:opacity-70'
                }`}
              >
                <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`}>{p.icon}</span>
                <span className={`text-sm font-medium ${active ? 'text-white' : 'text-neutral-500'}`}>{p.name}</span>
                {active && <CheckCircle2 size={14} className="text-empire" />}
              </button>
            )
          })}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">

          {/* ── CALCULATEUR ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative rounded-2xl border border-red-500/20 bg-neutral-950 overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

            <div className="p-5 md:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center">
                  <X className="text-red-400" size={18} />
                </div>
                <div>
                  <p className="text-red-400 font-bold text-sm uppercase tracking-wider">
                    {fr ? 'Sans Empire' : 'Without Empire'}
                  </p>
                  <p className="text-[11px] text-neutral-600">{fr ? 'Seul ou en externalisant' : 'Alone or outsourcing'}</p>
                </div>
              </div>

              {selected.size === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-neutral-600 text-sm">{fr ? 'Sélectionnez au moins une plateforme' : 'Select at least one platform'}</p>
                </div>
              ) : (
                <>
                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_45px_45px_65px] gap-1 mb-1 px-2">
                    <span className="text-[9px] text-neutral-700 uppercase tracking-wider"></span>
                    <span className="text-[9px] text-neutral-700 uppercase tracking-wider text-center">{fr ? 'Qté' : 'Qty'}</span>
                    <span className="text-[9px] text-neutral-700 uppercase tracking-wider text-center">{fr ? 'H' : 'H'}</span>
                    <span className="text-[9px] text-neutral-700 uppercase tracking-wider text-right">{fr ? 'Coût' : 'Cost'}</span>
                  </div>

                  <div className="rounded-lg bg-black/40 border border-white/[0.04] overflow-hidden mb-4">
                    {activeTasks.map((task, i) => (
                      <div
                        key={`${task.fr}-${i}`}
                        className="grid grid-cols-[1fr_45px_45px_65px] gap-1 items-center px-2.5 py-2 border-b border-white/[0.03] last:border-0"
                      >
                        <span className="text-[12px] text-neutral-400 truncate">{fr ? task.fr : task.en}</span>
                        <span className="text-[11px] text-neutral-500 font-mono text-center">{task.qty}</span>
                        <span className="text-[11px] text-neutral-600 font-mono text-center">{task.hours}h</span>
                        <span className="text-[11px] text-red-400/60 font-mono text-right">{fmt(task.cost)}€</span>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="grid grid-cols-[1fr_45px_45px_65px] gap-1 items-center px-2.5 py-3 bg-red-500/[0.08] border-t-2 border-red-500/20">
                      <span className="text-[13px] font-bold text-red-400">TOTAL</span>
                      <span className="text-[11px] text-red-400/50 font-mono text-center">{totalPieces}</span>
                      <span className="text-[13px] font-bold text-red-400 font-mono text-center">{totalHours}h</span>
                      <span className="text-[13px] font-bold text-red-400 font-mono text-right">{fmt(totalCost)}€</span>
                    </div>
                  </div>

                  {/* Pain points */}
                  <div className="pt-3 border-t border-white/[0.04] space-y-2">
                    {painPoints.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <X className="text-red-500/40 shrink-0 mt-0.5" size={11} />
                        <span className="text-[11px] text-neutral-600">{fr ? item.fr : item.en}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* ── AVEC EMPIRE ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative rounded-2xl border border-empire/30 bg-neutral-950 overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-empire/60 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-empire/10 blur-3xl" />

            <div className="p-5 md:p-7 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-empire/15 flex items-center justify-center">
                  <CheckCircle2 className="text-empire" size={18} />
                </div>
                <div>
                  <p className="text-empire font-bold text-sm uppercase tracking-wider">
                    {fr ? 'Avec Empire' : 'With Empire'}
                  </p>
                  <p className="text-[11px] text-neutral-600">{fr ? 'On gère tout pour vous' : 'We handle everything'}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                {/* What you do */}
                <div className="text-center py-4 mb-5 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full bg-empire/5 blur-2xl" />
                  </div>
                  <p className="relative text-4xl md:text-5xl font-black text-empire leading-none">15 min</p>
                  <p className="relative text-neutral-500 text-sm mt-2">
                    {fr ? 'de vocal par semaine · c\'est tout' : 'of voice notes per week · that\'s it'}
                  </p>
                </div>

                {/* What you get */}
                <div className="space-y-0 mb-5">
                  {afterItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
                    >
                      <CheckCircle2 className="text-empire/70 shrink-0" size={15} />
                      <span className="text-[13px] text-neutral-300">{fr ? item.fr : item.en}</span>
                    </div>
                  ))}
                </div>

                {/* Views — based on real client data */}
                {selected.size > 0 && (
                  <div className="mt-auto p-4 rounded-xl bg-empire/[0.07] border border-empire/20">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider text-center mb-1">
                      {fr ? 'Personnes touchées / mois' : 'People reached / month'}
                    </p>
                    <p className="text-[9px] text-neutral-600 text-center mb-3">
                      {fr ? 'Basé sur les résultats réels de nos clients' : 'Based on real client results'}
                    </p>

                    {/* Tier tabs */}
                    <div className="flex rounded-lg bg-black/40 border border-white/[0.04] p-0.5 mb-3">
                      {([
                        { key: 'min' as const, fr: 'Début', en: 'Starting', desc: fr ? 'Mois 1-2' : 'Month 1-2' },
                        { key: 'avg' as const, fr: 'Moyenne', en: 'Average', desc: fr ? 'Mois 3-6' : 'Month 3-6' },
                        { key: 'top' as const, fr: 'Top clients', en: 'Top clients', desc: fr ? 'Mois 6+' : 'Month 6+' },
                      ]).map(tier => (
                        <button
                          key={tier.key}
                          onClick={() => setViewsTier(tier.key)}
                          className={`flex-1 py-2 text-center rounded-md transition-all cursor-pointer ${
                            viewsTier === tier.key
                              ? 'bg-empire/20 text-empire border border-empire/30'
                              : 'text-neutral-600 hover:text-neutral-400 border border-transparent'
                          }`}
                        >
                          <span className="text-[11px] font-medium block">{fr ? tier.fr : tier.en}</span>
                          <span className="text-[9px] opacity-60 block">{tier.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Views number */}
                    <div className="text-center">
                      <p className="text-3xl font-black text-empire font-mono">
                        {totalViewsEmpire >= 1000000
                          ? `${(totalViewsEmpire / 1000000).toFixed(1)}M+`
                          : `${fmt(totalViewsEmpire)}+`}
                      </p>
                      <p className="text-[10px] text-empire/50 mt-1">{fr ? 'personnes touchées / mois' : 'people reached / month'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <button
            data-cal-namespace={namespace}
            data-cal-link={calLink}
            data-cal-config='{"layout":"month_view","theme":"dark"}'
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-empire text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.3)]"
          >
            {t.common.startNow}
            <ArrowRight size={20} />
          </button>
          <div className="mt-3">
            <CallbackButton variant="subtle" />
          </div>
          <CtaReassurance className="mt-4 px-2" />
        </motion.div>
      </div>
    </section>
  )
}
