'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Infinity as InfinityIcon } from 'lucide-react'
import OrbitingCircles from '@/components/magicui/orbiting-circles'
import BorderBeam from '@/components/magicui/border-beam'
import NumberTicker from '@/components/magicui/number-ticker'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const PlatformLogos = {
  linkedin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.523.99 4.088 4.088 0 01.99 1.523c.163.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 01-.99 1.523 4.088 4.088 0 01-1.523.99c-.46.163-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 01-1.523-.99 4.088 4.088 0 01-.99-1.523c-.163-.46-.35-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 01.99-1.523A4.088 4.088 0 015.15 2.207c.46-.163 1.26-.35 2.43-.403C8.846 2.175 9.227 2.163 12 2.163M12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.903.333 4.14.63a6.21 6.21 0 00-2.244 1.46A6.21 6.21 0 00.436 4.334C.139 5.097-.064 5.969.006 7.247.014 8.527 0 8.935 0 12.194s.014 3.668.072 4.948c.058 1.277.26 2.15.558 2.913a6.21 6.21 0 001.46 2.244 6.21 6.21 0 002.244 1.46c.763.297 1.636.5 2.913.558C8.527 23.986 8.935 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.15-.26 2.913-.558a6.21 6.21 0 002.244-1.46 6.21 6.21 0 001.46-2.244c.297-.763.5-1.636.558-2.913.058-1.28.072-1.688.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.26-2.15-.558-2.913a6.21 6.21 0 00-1.46-2.244A6.21 6.21 0 0019.86.63C19.097.333 18.225.13 16.948.072 15.668.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  tiktok: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9a6.27 6.27 0 00-.79-.05A6.34 6.34 0 003.15 15.4a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.17a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.6z"/>
    </svg>
  ),
  youtube: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  x: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  threads: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.688 10.939c-.1-.044-.2-.085-.3-.124-.174-3.4-1.934-5.34-4.992-5.36h-.026c-1.83 0-3.35.79-4.282 2.23l1.684 1.154c.695-1.064 1.79-1.292 2.598-1.292h.018c1.003.007 1.762.298 2.256.866.36.414.6.987.72 1.717a12.64 12.64 0 00-2.9-.187c-2.898.168-4.762 1.854-4.636 4.194.064 1.196.66 2.224 1.676 2.896.86.57 1.967.853 3.115.796 1.516-.075 2.705-.636 3.534-1.668.63-.783 1.03-1.8 1.22-3.116.73.44 1.273.99 1.575 1.647.51 1.12.54 2.958-.66 4.156-1.05 1.049-2.313 1.503-4.222 1.518-2.12-.016-3.73-.695-4.784-2.02-1.016-1.278-1.54-3.117-1.558-5.465.018-2.348.542-4.188 1.558-5.466C8.563 5.193 10.173 4.513 12.292 4.497c2.135.017 3.774.699 4.87 2.026.54.654.94 1.46 1.2 2.393l1.903-.51a8.578 8.578 0 00-1.595-3.167C17.114 3.382 14.926 2.514 12.3 2.494h-.016c-2.618.02-4.786.888-6.45 2.583C4.216 6.829 3.511 9.143 3.49 12.006l-.001.06.001.06c.021 2.863.726 5.177 2.344 6.929 1.664 1.8 3.832 2.564 6.45 2.583h.016c2.324-.017 4.036-.64 5.406-1.965 1.75-1.692 1.802-3.905 1.108-5.44-.498-1.1-1.408-2.003-2.625-2.627-.082.584-.196 1.131-.344 1.638.652.352 1.113.79 1.372 1.324.38.78.395 2.134-.575 3.101-.85.847-1.88 1.207-3.38 1.218-1.674-.013-2.925-.548-3.865-1.67-.862-1.03-1.314-2.515-1.345-4.417.031-1.902.483-3.387 1.345-4.417.94-1.122 2.19-1.657 3.866-1.67h.013c.967.006 1.81.172 2.515.493z"/>
    </svg>
  ),
}

/** Step 1 — Kevin + Marc reviewing your profile */
function ApplyVisual() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="absolute -inset-3 rounded-full bg-academy/10 animate-pulse opacity-40" style={{ animationDuration: '3s' }} />
        <div className="relative flex -space-x-3">
          <img src="/founders/kevin.jpg" alt="Kevin Dufraisse" className="h-12 w-12 rounded-full border-2 border-academy object-cover object-top ring-2 ring-black" loading="lazy" />
          <img src="/founders/marc.jpg" alt="Marc Dufraisse" className="h-12 w-12 rounded-full border-2 border-academy object-cover ring-2 ring-black" loading="lazy" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/40">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-green-400">{fr ? 'On étudie votre profil' : 'We review your profile'}</span>
      </div>
      <p className="text-center text-[10px] font-bold uppercase tracking-wider text-academy">
        {fr ? '20 places · sur sélection' : '20 spots · by selection'}
      </p>
    </div>
  )
}

/** Step 2 — Publish on platforms with real logos orbiting */
function ProgramVisual() {
  const items: { key: string; icon: React.ReactNode; bg: string }[] = [
    { key: 'li', icon: PlatformLogos.linkedin, bg: '#0A66C2' },
    { key: 'ig', icon: PlatformLogos.instagram, bg: '#E1306C' },
    { key: 'tk', icon: PlatformLogos.tiktok, bg: '#000' },
    { key: 'yt', icon: PlatformLogos.youtube, bg: '#FF0000' },
    { key: 'x', icon: PlatformLogos.x, bg: '#000' },
    { key: 'th', icon: PlatformLogos.threads, bg: '#000' },
  ]
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-academy/20 border border-academy/40 text-academy font-bold text-sm z-10 shadow-[0_0_20px_rgba(252,165,165,0.3)]">
        21j
      </div>
      {items.map((p, i) => (
        <OrbitingCircles key={p.key} radius={48} duration={22} delay={i * (22 / items.length)} path={i === 0}>
          <div className="flex h-7 w-7 items-center justify-center rounded-full shadow-lg border border-white/20" style={{ background: p.bg }}>
            {p.icon}
          </div>
        </OrbitingCircles>
      ))}
    </div>
  )
}

/** Step 3 — Certification badge with LinkedIn-style badge */
function CertificationVisual() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2.5 px-3">
      <div className="relative w-full max-w-[140px] rounded-xl bg-gradient-to-br from-academy/20 to-white/5 border border-academy/30 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-academy/20 border border-academy/40 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-academy"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </div>
          <div>
            <p className="text-[9px] text-neutral-500 leading-tight">{fr ? 'Certifié par' : 'Certified by'}</p>
            <p className="text-[11px] font-bold text-white leading-tight">Empire Internet</p>
          </div>
        </div>
        <div className="flex gap-1">
          {['🥉', '🥈', '🥇'].map((m, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-md bg-white/5 border border-white/10 py-1 text-center text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              {m}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Step 4 — Leads & clients flowing in */
function ClientsVisual() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const leads = fr
    ? [
        { name: 'Sophie B.', msg: 'Je veux travailler avec vous', time: '2m' },
        { name: 'Thomas R.', msg: 'Votre contenu m\'a convaincu', time: '14m' },
        { name: 'Julie M.', msg: 'On peut en discuter ?', time: '1h' },
      ]
    : [
        { name: 'Sophie B.', msg: 'I want to work with you', time: '2m' },
        { name: 'Thomas R.', msg: 'Your content convinced me', time: '14m' },
        { name: 'Julie M.', msg: 'Can we discuss?', time: '1h' },
      ]

  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center gap-2 px-2.5">
      {leads.map((lead, i) => (
        <motion.div
          key={i}
          className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-academy/20"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
        >
          <div className="h-6 w-6 rounded-full bg-academy/20 border border-academy/30 flex items-center justify-center text-[8px] font-bold text-academy flex-shrink-0">
            {lead.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-white truncate">{lead.name}</p>
            <p className="text-[9px] text-neutral-500 truncate">{lead.msg}</p>
          </div>
          <span className="text-[8px] text-neutral-600 flex-shrink-0">{lead.time}</span>
        </motion.div>
      ))}
      {isInView && (
        <div className="flex items-baseline gap-1 text-academy mt-1">
          <span className="text-base font-bold">+</span>
          <NumberTicker value={12} className="text-base font-bold text-academy" />
          <span className="text-[9px] font-bold uppercase tracking-wider">{fr ? 'clients/mois' : 'clients/mo'}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Après les 21 jours — le réseau Empire Partners. Présenté en bandeau et non en
 * 5e carte : ce n'est pas une étape du bootcamp, c'est ce qui reste après.
 */
function PartnersVisual() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const updates = fr
    ? [
        { label: 'Nouveau format : le post « autopsie »', tag: 'Format' },
        { label: '12 hooks qui ont cartonné ce mois-ci', tag: 'Analyse' },
        { label: 'Mission client dispo · 500 €', tag: 'Mission' },
      ]
    : [
        { label: 'New format: the "autopsy" post', tag: 'Format' },
        { label: '12 hooks that crushed it this month', tag: 'Breakdown' },
        { label: 'Client mission available · €500', tag: 'Mission' },
      ]

  return (
    <div className="flex w-full flex-shrink-0 flex-col gap-1.5 md:w-[260px]">
      {updates.map((u, i) => (
        <motion.div
          key={u.label}
          className="flex items-center gap-2 rounded-lg border border-academy/20 bg-white/5 px-2.5 py-1.5"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.12 }}
        >
          <span className="flex-shrink-0 rounded bg-academy/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-academy">
            {u.tag}
          </span>
          <span className="truncate text-[10px] text-neutral-300">{u.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default function AcademyHowItWorksSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const steps = fr
    ? [
        { title: 'Candidatez au programme', desc: 'Remplissez votre candidature. Si vous êtes sélectionné, vous accédez au programme.' },
        { title: 'Suivez le programme 21 jours', desc: 'Publiez sur vos comptes en utilisant nos méthodes. 15 min/jour.' },
        { title: 'Recevez votre certification Empire', desc: 'Bronze, Argent ou Or selon vos résultats. Un badge LinkedIn officiel.' },
        { title: 'On vous trouve vos clients', desc: 'Votre contenu attire des leads. On vous aide à les convertir en clients.' },
      ]
    : [
        { title: 'Apply to the program', desc: 'Fill out your application. If selected, you access the program.' },
        { title: 'Follow the 21-day program', desc: 'Publish on your accounts using our methods. 15 min/day.' },
        { title: 'Get your Empire certification', desc: 'Bronze, Silver or Gold based on your results. An official LinkedIn badge.' },
        { title: 'We find your clients', desc: 'Your content attracts leads. We help you convert them into clients.' },
      ]

  const visuals = [
    <ApplyVisual key="apply" />,
    <ProgramVisual key="program" />,
    <CertificationVisual key="cert" />,
    <ClientsVisual key="clients" />,
  ]

  return (
    <section className="relative w-full py-14 md:py-20 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(252,165,165,0.06),transparent)]" />

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          <FadeInBlock>
            <div className="text-center mb-10">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-academy/10 border border-academy/30">
                <p className="text-sm font-bold text-academy">
                  {fr ? 'COMMENT ÇA MARCHE' : 'HOW IT WORKS'}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {fr ? (
                  <>4 étapes pour devenir <span className="text-academy">viral</span></>
                ) : (
                  <>4 steps to go <span className="text-academy">viral</span></>
                )}
              </h2>
            </div>
          </FadeInBlock>

          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <FadeInBlock key={step.title} delay={0.1 + i * 0.1}>
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-academy/25 bg-gradient-to-br from-academy/10 to-white/[0.02]">
                  <BorderBeam size={120} duration={8 + i * 2} delay={i * 1.5} colorFrom="#fca5a5" colorTo="rgba(252,165,165,0.2)" />
                  <div className="h-[180px] flex items-center justify-center p-3">{visuals[i]}</div>
                  <div className="relative mt-auto bg-gradient-to-t from-black via-black/90 to-transparent p-5 pt-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-academy text-sm font-bold text-black">
                      {i + 1}
                    </span>
                    <p className="mt-2.5 text-base font-bold text-white leading-snug">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">{step.desc}</p>
                  </div>
                </div>
              </FadeInBlock>
            ))}
          </div>

          {/* Après les 21 jours — le réseau Empire Partners, en bandeau */}
          <FadeInBlock delay={0.5}>
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-academy/25 bg-gradient-to-br from-academy/10 to-white/[0.02] p-5 md:p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
                <PartnersVisual />
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-academy text-black">
                      <InfinityIcon size={14} strokeWidth={3} />
                    </span>
                    <h3 className="text-base font-bold text-white md:text-lg">
                      {fr
                        ? 'Et après : vous restez dans le réseau Empire Partners'
                        : 'And after: you stay in the Empire Partners network'}
                    </h3>
                    <span className="whitespace-nowrap rounded-full border border-academy/30 bg-academy/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-academy">
                      {fr ? 'À vie · gratuit' : 'For life · free'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 md:text-base">
                    {fr
                      ? 'Nos nouveaux formats, nos analyses de contenus et les mises à jour de la méthode vous arrivent gratuitement, à vie. C’est aussi là que passent les missions clients.'
                      : 'Our new formats, our content breakdowns and every method update reach you free, for life. It’s also where client missions are posted.'}
                  </p>
                </div>
              </div>
            </div>
          </FadeInBlock>
        </div>
      </div>
    </section>
  )
}
