'use client'

import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { useReveal } from '@/hooks/useReveal'
import WaitlistEmailCta from '@/components/WaitlistEmailCta'

/**
 * Dernier argument avant le formulaire. Le prospect arrive ici avec la formule
 * complète (FormulaBar) sous les yeux : on lui montre le partage des rôles.
 * À gauche, ce qu'il apporte (son message, 20 minutes). À droite, ce
 * qu'Empire prend en charge, terme par terme. Pas de boîte, pas de coche :
 * une colonne de texte et l'email, puis le « contrat » en face.
 */
const HANDLED_FR: [string, string][] = [
  ['Sujets', 'chaque matin, ce qui monte dans votre niche, avec l\'angle et l\'accroche'],
  ['Format', '11 formats montés pour vous - vidéo ou dictée sans caméra'],
  ['Diffusion', '7 réseaux + newsletter, vos meilleurs posts republiés tout seuls'],
  ['Visibilité', 'chaque lien tracké jusqu\'au client : vous savez quel post a rapporté quoi'],
  ['Humains', 'une équipe relit chaque texte avant publication'],
]

const HANDLED_EN: [string, string][] = [
  ['Topics', 'every morning, what is rising in your niche, with the angle and the hook'],
  ['Format', '11 formats edited for you - on camera or dictated, no camera'],
  ['Distribution', '7 networks + newsletter, your best posts republished on their own'],
  ['Visibility', 'every link tracked down to the client: you know which post brought what'],
  ['Humans', 'a team proofreads every text before it goes out'],
]

const PROOF_FR: [string, string][] = [
  ['1 an', 'de R&D sur le système'],
  ['+10 000', 'posts testés'],
  ['8', 'personnes sur votre marque'],
]

const PROOF_EN: [string, string][] = [
  ['1 year', 'of R&D on the system'],
  ['10,000+', 'posts tested'],
  ['8', 'people on your brand'],
]

export default function HomeApplySection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  const [ref, isInView] = useReveal('-100px')

  if (autopilot) return null

  const handled = fr ? HANDLED_FR : HANDLED_EN
  const proof = fr ? PROOF_FR : PROOF_EN

  return (
    <section ref={ref} id="rejoindre" className="relative w-full overflow-hidden bg-black py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_50%,rgb(var(--empire-rgb)_/_0.10),transparent)]" />
      <div className="container relative px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Gauche : le pitch et l'email */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-empire">
              {fr ? 'Rejoindre Empire' : 'Join Empire'}
            </p>
            <h2 className="text-3xl font-extrabold leading-[1.08] text-white sm:text-4xl md:text-5xl">
              {fr ? (
                <>Vous avez le message.<br />On fait tout le reste.</>
              ) : (
                <>You have the message.<br />We do everything else.</>
              )}
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-neutral-400 md:text-lg">
              {fr
                ? '20 minutes par semaine dans vos écouteurs, face caméra ou en dictée. Au retour, le mois est monté, écrit, relu et programmé sur 7 réseaux.'
                : '20 minutes a week in your earphones, on camera or dictated. When you get back, the month is edited, written, proofread and scheduled on 7 networks.'}
            </p>

            <div className="mt-8 max-w-md">
              <WaitlistEmailCta className="!mx-0" />
              <p className="mt-3 text-[13px] text-neutral-500">
                {fr
                  ? 'On lit chaque demande. Si votre profil colle, vous démarrez avec 7 jours gratuits, sans engagement.'
                  : 'We read every request. If your profile fits, you start with 7 days free, no commitment.'}
              </p>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {proof.map(([n, label]) => (
                <div key={n}>
                  <dt className="text-2xl font-extrabold tabular-nums text-white">{n}</dt>
                  <dd className="text-[12px] text-neutral-500">{label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Droite : le partage des rôles */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="relative"
          >
            {/* Vous */}
            <div className="flex items-start gap-4 rounded-2xl border border-empire/40 bg-empire/[0.07] px-5 py-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-empire text-black">
                <Mic className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-empire">{fr ? 'Vous' : 'You'}</p>
                <p className="mt-0.5 text-base font-bold text-white">{fr ? 'Votre message' : 'Your message'}</p>
                <p className="mt-0.5 text-sm text-neutral-400">
                  {fr ? 'Une opinion, un constat, une actu à commenter. 20 minutes par semaine, c\'est tout.' : 'An opinion, an observation, a piece of news to react to. 20 minutes a week, that\'s it.'}
                </p>
              </div>
            </div>

            {/* Trait de liaison */}
            <div className="ml-[34px] h-6 w-px bg-gradient-to-b from-empire/60 to-white/10" />

            {/* Empire */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
              <p className="border-b border-white/8 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                {fr ? 'Empire' : 'Empire'}
              </p>
              <ul className="divide-y divide-white/8">
                {handled.map(([term, detail]) => (
                  <li key={term} className="grid grid-cols-[92px_1fr] items-baseline gap-3 px-5 py-3 sm:grid-cols-[104px_1fr]">
                    <span className="text-sm font-bold text-white">{term}</span>
                    <span className="text-[13px] leading-snug text-neutral-400">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
