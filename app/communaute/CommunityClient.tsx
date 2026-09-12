'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, Check, Copy, ExternalLink, Linkedin, Mail, MessageCircle, Users } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { trackAmplitude } from '@/lib/amplitude'
import { SocialIcons } from '@/components/ui/social-icons'
import TopCreatorsSection from '@/components/sections/TopCreatorsSection'

const FALLBACK_INVITE =
  'https://join.slack.com/t/empire-community/shared_invite/zt-48r5is0lz-MiYTUfVBYgNymUbb56h_6g'

const NETWORKS = [
  { name: 'YouTube', Icon: SocialIcons.youtube },
  { name: 'Instagram', Icon: SocialIcons.instagram },
  { name: 'LinkedIn', Icon: SocialIcons.linkedin },
  { name: 'TikTok', Icon: SocialIcons.tiktok },
  { name: 'X', Icon: SocialIcons.twitter },
  { name: 'Threads', Icon: SocialIcons.threads },
  { name: 'Facebook', Icon: SocialIcons.facebook },
] as const

type Step = 'email' | 'access'

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 122.8 122.8" className={className} aria-hidden="true">
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
    </svg>
  )
}

const SLACK_NOTIFICATIONS = [
  {
    position: 'left-[3%] top-[27%]',
    channel: '#viralite',
    fr: 'Nouveau format partagé',
    en: 'New format shared',
    delay: 0,
  },
  {
    position: 'right-[3%] top-[34%]',
    channel: '#feedback',
    fr: '3 nouvelles réponses',
    en: '3 new replies',
    delay: 2.8,
  },
  {
    position: 'left-[7%] top-[66%]',
    channel: '#event',
    fr: 'Live avec Kevin · cette semaine',
    en: 'Live with Kevin · this week',
    delay: 5.6,
  },
  {
    position: 'right-[6%] top-[72%]',
    channel: '#success',
    fr: 'Quelqu’un a réagi 🔥',
    en: 'Someone reacted 🔥',
    delay: 8.4,
  },
] as const

function FloatingSlackActivity({ fr }: { fr: boolean }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {SLACK_NOTIFICATIONS.map((notification) => (
        <motion.div
          key={notification.channel}
          className={`absolute hidden w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-[#171717]/80 p-3 text-left shadow-2xl backdrop-blur-md md:flex ${notification.position}`}
          initial={{ y: 12, opacity: 0, scale: 0.96 }}
          animate={{
            y: [12, 0, -5, -12],
            opacity: [0, 0.72, 0.72, 0],
            scale: [0.96, 1, 1, 0.98],
          }}
          transition={{
            duration: 8,
            delay: notification.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
            <SlackLogo className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-bold text-empire">{notification.channel}</span>
            <span className="mt-0.5 block truncate text-xs text-neutral-300">
              {fr ? notification.fr : notification.en}
            </span>
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export default function CommunityClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [inviteUrl, setInviteUrl] = useState(FALLBACK_INVITE)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    trackAmplitude('community_offer_viewed')
  }, [])

  async function submitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const company = String(new FormData(e.currentTarget).get('company') || '')
    const trimmed = email.trim()
    if (!trimmed.includes('@')) {
      setError(fr ? 'Email invalide' : 'Invalid email')
      return
    }
    setError('')
    setSubmitting(true)
    trackAmplitude('community_join_clicked')
    try {
      const res = await fetch('/api/community-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, lang, company }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; inviteUrl?: string }
      if (!res.ok) {
        setError(data.error || (fr ? 'Impossible d’enregistrer ton email. Réessaie.' : 'Could not save your email. Try again.'))
        return
      }
      if (data.inviteUrl) setInviteUrl(data.inviteUrl)
      setStep('access')
    } catch {
      setError(fr ? 'Connexion impossible. Réessaie.' : 'Connection failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function referralText() {
    const text = fr
      ? 'Je viens de rejoindre la communauté gratuite Empire pour apprendre à être plus visible sur les réseaux. Tu peux la rejoindre ici :'
      : 'I just joined Empire’s free community to grow on social media. You can join here:'
    const shareUrl = `${window.location.origin}/communaute`
    return { text, shareUrl, fullText: `${text} ${shareUrl}` }
  }

  function shareReferral(channel: 'whatsapp' | 'linkedin' | 'email') {
    trackAmplitude('community_referral_shared', { channel })
    const { text, shareUrl, fullText } = referralText()
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(fullText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(fr ? 'Rejoins la communauté Empire' : 'Join the Empire community')}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
    }
    window.open(urls[channel], '_blank', 'noopener,noreferrer')
  }

  async function copyReferral() {
    trackAmplitude('community_referral_shared', { channel: 'copy' })
    await navigator.clipboard.writeText(referralText().shareUrl).catch(() => {})
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <section className="relative overflow-hidden bg-gradient-to-b from-black via-transparent to-[#0f0f0f] pb-8 pt-28 md:pb-10 md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.18),transparent)]" />
        <FloatingSlackActivity fr={fr} />

        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl">
              {fr
                ? 'Rejoins les meilleurs experts francophones en viralité.'
                : 'Join the best French-speaking virality experts.'}
            </h1>
            <h2 className="mx-auto mt-5 max-w-2xl text-xl font-bold leading-snug text-neutral-200 sm:text-2xl">
              {fr
                ? 'Sois visible, reconnu et acheté grâce à la communauté n°1 des créateurs.'
                : 'Get seen, recognized and chosen with the #1 creator community.'}
            </h2>

            <ul className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center" aria-label={fr ? 'Réseaux' : 'Networks'}>
              {NETWORKS.map(({ name, Icon }) => (
                <li
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-neutral-200"
                >
                  <Icon />
                  {name}
                </li>
              ))}
            </ul>

            <div className="mx-auto mt-8 max-w-3xl">
              {step === 'email' ? (
                <form onSubmit={submitEmail} method="post" action="/api/community-join">
                  <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(300px,1fr)_auto]">
                    <label className="sr-only" htmlFor="community-email">
                      Email
                    </label>
                    <input
                      id="community-email"
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={fr ? 'ton email' : 'your email'}
                      className="min-h-14 w-full flex-1 rounded-2xl border border-white/15 bg-white/[0.07] px-5 text-base text-white placeholder:text-neutral-500 focus:border-empire focus:outline-none focus:ring-2 focus:ring-empire/40"
                    />
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-empire px-8 text-base font-extrabold text-black shadow-[0_0_40px_rgb(var(--empire-rgb)_/_0.45)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60 sm:min-w-[220px]"
                    >
                      {submitting
                        ? (fr ? 'Enregistrement…' : 'Saving…')
                        : (fr ? 'Rejoindre la communauté gratuite' : 'Join the free community')}
                      <ArrowRight className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                  {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
                  <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold text-white">
                    {(fr
                      ? ['Lives en groupe', 'Masterclasses gratuites', 'Questions-réponses']
                      : ['Group lives', 'Free masterclasses', 'Live Q&A']
                    ).map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-empire" aria-hidden />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </form>
              ) : null}

              {step === 'access' ? (
                <div className="rounded-3xl border border-empire/30 bg-[#0b0d08] p-7 text-center shadow-[0_0_55px_rgb(var(--empire-rgb)_/_0.12)]">
                  <Check className="mx-auto h-8 w-8 text-empire" aria-hidden />
                  <h2 className="mt-3 text-2xl font-extrabold">
                    {fr ? 'Ton accès est prêt' : 'Your access is ready'}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-300">
                    {fr
                      ? 'Bienvenue ! Tu profites de 2 semaines offertes : 2 lives en groupe avec Kevin, les masterclasses et les questions-réponses.'
                      : 'Welcome! You get 2 free weeks with 2 group lives with Kevin, masterclasses and live Q&A.'}
                  </p>
                  <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-empire px-5 text-base font-extrabold text-black transition hover:brightness-110"
                  >
                    <SlackLogo className="h-5 w-5 shrink-0" />
                    {fr ? 'Rejoindre le Slack gratuit' : 'Join the free Slack'}
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>

                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="flex items-center justify-center gap-2 text-sm font-bold text-white">
                      <Users className="h-4 w-4 text-empire" aria-hidden />
                      {fr ? 'Invite quelqu’un avec toi' : 'Invite someone with you'}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => shareReferral('whatsapp')}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 text-sm font-bold text-black transition hover:brightness-110"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden />
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => shareReferral('linkedin')}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-3 text-sm font-bold text-white transition hover:brightness-110"
                      >
                        <Linkedin className="h-4 w-4" aria-hidden />
                        LinkedIn
                      </button>
                      <button
                        type="button"
                        onClick={() => shareReferral('email')}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/15"
                      >
                        <Mail className="h-4 w-4" aria-hidden />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={copyReferral}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-bold text-white transition hover:bg-white/15"
                      >
                        <Copy className="h-4 w-4" aria-hidden />
                        {fr ? 'Copier' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <TopCreatorsSection compact />
    </main>
  )
}
