'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Share2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Les trois accès d'un membre (29 octobre 2026).
const SLACK_INVITE_URL = 'https://join.slack.com/t/empire-community/shared_invite/zt-48r5is0lz-MiYTUfVBYgNymUbb56h_6g'
const MONDAY_LIVE_URL = 'https://join.empire-internet.com/masterclass-empire-internet'
const APP_URL = 'https://app.empire-internet.com'

export default function AcademyThankYouClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      // This page is public. Only the signed Stripe webhook confirms a purchase.
      ;(window as any).dataLayer.push({ event: 'academy_thank_you_view' })
    }
  }, [])

  function shareLink() {
    const url = 'https://empire-internet.com/academy'
    if (navigator.share) {
      navigator.share({ title: 'Empire Partners', url })
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden pt-20 md:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(252,165,165,0.1),transparent)]" />

      <div className="relative z-10 container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Confirmation Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-14 h-14 rounded-full bg-academy/20 border-2 border-academy flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="text-academy" size={28} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-4xl font-black text-white mb-3"
            >
              {fr ? 'Bienvenue dans ' : 'Welcome to '}<span className="text-academy">Empire Partners</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base text-neutral-400 max-w-lg mx-auto"
            >
              {fr
                ? 'Ton paiement est confirmé. Le bootcamp s’ouvre tout de suite dans ton espace : environ 1 heure par jour, à ton rythme, avec la communauté.'
                : 'Your payment is confirmed. The bootcamp opens right away in your account: about 1 hour a day, at your own pace, with the community.'}
            </motion.p>
          </div>

          {/* Les trois accès */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-10 space-y-3"
          >
            {(fr
              ? [
                  { href: APP_URL, t: 'Ouvre l’app Empire', d: 'Connecte-toi avec l’email du paiement : le bootcamp t’y attend.' },
                  { href: SLACK_INVITE_URL, t: 'Rejoins le Slack', d: 'La communauté Empire Partners, pour avancer et poser tes questions.' },
                  { href: MONDAY_LIVE_URL, t: 'Inscris-toi au live du lundi', d: 'Un live chaque lundi à 14 h.' },
                ]
              : [
                  { href: APP_URL, t: 'Open the Empire app', d: 'Sign in with your payment email: the bootcamp is waiting for you.' },
                  { href: SLACK_INVITE_URL, t: 'Join the Slack', d: 'The Empire Partners community, to move forward and ask your questions.' },
                  { href: MONDAY_LIVE_URL, t: 'Register for the Monday live', d: 'A live every Monday at 2 pm.' },
                ]
            ).map((a, i) => (
              <a
                key={a.href}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-academy/25 bg-academy/[0.05] px-5 py-4 transition hover:border-academy/50"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-academy text-[12px] font-black text-black">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-white">{a.t}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-neutral-400">{a.d}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-academy" />
              </a>
            ))}
          </motion.div>

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
            <p className="text-xs font-bold text-neutral-500 tracking-widest uppercase mb-3 text-center">
              {fr ? 'Prochaines étapes' : 'Next steps'}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-white text-sm font-semibold mb-1">
                  {fr ? 'Bloque ton agenda' : 'Block your calendar'}
                </p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {fr
                    ? '21 jours à ton rythme, environ 1 heure par jour.'
                    : '21 days at your own pace, about 1 hour a day.'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-white text-sm font-semibold mb-1">
                  {fr ? 'Prépare 3 sujets' : 'Prepare 3 topics'}
                </p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {fr
                    ? 'Les thèmes sur lesquels tu veux être reconnu.'
                    : 'The topics you want to be known for.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-neutral-500 mb-3">
              {fr
                ? "Quelqu'un dans ton entourage devrait rejoindre Empire Partners ?"
                : 'Someone in your circle should join Empire Partners?'}
            </p>
            <button
              onClick={shareLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-sm text-white font-medium hover:bg-white/[0.1] transition-all"
            >
              <Share2 size={14} className="text-academy" />
              {copied
                ? (fr ? 'Lien copié' : 'Link copied')
                : (fr ? 'Partager Empire Partners' : 'Share Empire Partners')}
            </button>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-neutral-500">
              {fr ? 'Une question ? ' : 'Questions? '}
              <a href="mailto:support@empire-internet.com" className="text-neutral-300 hover:text-white transition-colors">support@empire-internet.com</a>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
