'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCalApi } from '@calcom/embed-react'
import { ArrowRight, CheckCircle2, Share2, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCalLink } from '@/hooks/useCalLink'

type Choice = null | 'later' | 'maybe'

const CAL_NAMESPACE = 'academy-upsell'

// Les trois accès d'un membre (29 octobre 2026).
const SLACK_INVITE_URL = 'https://join.slack.com/t/empire-community/shared_invite/zt-48r5is0lz-MiYTUfVBYgNymUbb56h_6g'
const MONDAY_LIVE_URL = 'https://join.empire-internet.com/masterclass-empire-internet'
const APP_URL = 'https://app.empire-internet.com'

export default function AcademyThankYouClient() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const calLink = useCalLink()

  const [choice, setChoice] = useState<Choice>(null)
  const [copied, setCopied] = useState(false)
  const [prefillName, setPrefillName] = useState('')
  const [prefillEmail, setPrefillEmail] = useState('')
  const [showPrefill, setShowPrefill] = useState(false)
  const calReadyRef = useRef(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      // This page is public. Only the signed Stripe webhook confirms a purchase.
      ;(window as any).dataLayer.push({ event: 'academy_thank_you_view' })
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE })
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#dafc68' },
          dark: { 'cal-brand': '#dafc68' },
        },
      })
      calReadyRef.current = true
    })()
  }, [])

  async function openCalWithPrefill(name: string, email: string) {
    const cal = await getCalApi({ namespace: CAL_NAMESPACE })
    cal('modal', {
      calLink,
      config: { name, email, theme: 'dark' },
    })
  }

  function handleBookClick() {
    setShowPrefill(true)
  }

  function handlePrefillSubmit(e: React.FormEvent) {
    e.preventDefault()
    setShowPrefill(false)
    openCalWithPrefill(prefillName, prefillEmail)
  }

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
                ? 'Votre paiement est confirmé. Le bootcamp s’ouvre tout de suite dans votre espace : environ 1 heure par jour, à votre rythme, avec la communauté.'
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
                  { href: APP_URL, t: 'Ouvrir l’app Empire', d: 'Connectez-vous avec l’email du paiement : le bootcamp vous y attend.' },
                  { href: SLACK_INVITE_URL, t: 'Rejoindre le Slack', d: 'La communauté Empire Partners, pour avancer et poser vos questions.' },
                  { href: MONDAY_LIVE_URL, t: 'S’inscrire au live du lundi', d: 'Un live chaque lundi à 14 h.' },
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

          {/* Upsell card */}
          <AnimatePresence mode="wait">
            {choice === null && (
              <motion.div
                key="offer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.4 }}
              >
                <div className="relative rounded-2xl border border-empire/30 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 md:p-8 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-empire to-transparent" />

                  <p className="text-xs font-bold text-empire tracking-widest uppercase mb-2">
                    {fr ? 'Vous voulez aller plus loin ?' : 'Want to go further?'}
                  </p>
                  <h2 className="text-lg md:text-xl font-bold text-white leading-tight mb-4">
                    {fr ? 'Empire peut tout faire pour vous.' : 'Empire can do everything for you.'}
                  </h2>

                  <div className="space-y-2 mb-5 text-sm text-neutral-300 leading-relaxed">
                    <p>
                      {fr
                        ? <>Empire Partners vous apprend le système. <span className="text-white font-semibold">Empire, c&apos;est l&apos;étape d&apos;après :</span> on prend en charge votre production de contenu. Vous n&apos;avez plus à publier.</>
                        : <>Empire Partners teaches you the system. <span className="text-white font-semibold">Empire is the next step:</span> we handle your entire content production. You don&apos;t have to publish anymore.</>}
                    </p>
                  </div>

                  {showPrefill ? (
                    <form onSubmit={handlePrefillSubmit} className="space-y-2 mb-2">
                      <p className="text-xs text-neutral-400 mb-3">
                        {fr ? 'Pour pré-remplir votre réservation :' : 'To pre-fill your booking:'}
                      </p>
                      <input
                        required
                        type="text"
                        placeholder={fr ? 'Votre prénom et nom' : 'Your full name'}
                        value={prefillName}
                        onChange={e => setPrefillName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/15 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-empire/50"
                      />
                      <input
                        required
                        type="email"
                        placeholder={fr ? 'Votre email' : 'Your email'}
                        value={prefillEmail}
                        onChange={e => setPrefillEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/15 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-empire/50"
                      />
                      <button
                        type="submit"
                        className="w-full p-3.5 rounded-xl bg-empire text-black font-bold text-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)] cursor-pointer"
                      >
                        {fr ? 'Choisir mon créneau →' : 'Pick my slot →'}
                      </button>
                      <button type="button" onClick={() => setShowPrefill(false)} className="block mx-auto text-xs text-neutral-500 hover:text-neutral-300 transition-colors pt-1">
                        {fr ? 'Annuler' : 'Cancel'}
                      </button>
                    </form>
                  ) : (
                    <div className="grid sm:grid-cols-3 gap-2">
                      <button
                        onClick={handleBookClick}
                        className="p-3.5 rounded-xl bg-empire text-black font-bold text-sm hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(218,252,104,0.2)] cursor-pointer text-center"
                      >
                        {fr ? 'Réserver un appel' : 'Book a call'}
                      </button>
                      <button
                        onClick={() => setChoice('maybe')}
                        className="p-3.5 rounded-xl bg-white/[0.06] border border-white/15 text-white font-semibold text-sm hover:bg-white/[0.1] transition-all text-center"
                      >
                        {fr ? 'En savoir plus' : 'Learn more'}
                      </button>
                      <button
                        onClick={() => setChoice('later')}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-neutral-400 text-sm hover:bg-white/[0.06] transition-all text-center"
                      >
                        {fr ? 'Plus tard' : 'Later'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {choice === 'maybe' && (
              <motion.div
                key="maybe"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="relative rounded-2xl border border-empire/30 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 md:p-8 overflow-hidden">
                  <button
                    onClick={() => setChoice(null)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>

                  <p className="text-xs font-bold text-empire tracking-widest uppercase mb-2">
                    {fr ? 'Comment ça se passe' : 'How it works'}
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-5">
                    {fr ? 'Un appel de 45 minutes avec notre équipe.' : 'A 45-minute call with our team.'}
                  </h2>

                  <div className="space-y-3 mb-6">
                    {(fr
                      ? [
                          { t: 'On regarde votre business', d: 'Votre activité, vos objectifs, ce que vous faites déjà.' },
                          { t: "On vous explique ce qu'on ferait", d: 'Production quotidienne LinkedIn + Shorts + newsletter. Vous validez, on publie.' },
                          { t: 'Vous décidez', d: "Si c'est non, vous continuez avec Empire Partners comme prévu." },
                        ]
                      : [
                          { t: 'We look at your business', d: 'Your activity, your goals, what you already do.' },
                          { t: "We explain what we'd do", d: 'Daily LinkedIn + Shorts + newsletter production. You approve, we publish.' },
                          { t: 'You decide', d: "If it's a no, you carry on with Empire Partners as planned." },
                        ]
                    ).map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-empire/10 border border-empire/30 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-empire">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{s.t}</p>
                          <p className="text-xs text-neutral-400 leading-relaxed">{s.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showPrefill ? (
                    <form onSubmit={handlePrefillSubmit} className="space-y-2">
                      <p className="text-xs text-neutral-400 mb-3">
                        {fr ? 'Pour pré-remplir votre réservation :' : 'To pre-fill your booking:'}
                      </p>
                      <input
                        required
                        type="text"
                        placeholder={fr ? 'Votre prénom et nom' : 'Your full name'}
                        value={prefillName}
                        onChange={e => setPrefillName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/15 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-empire/50"
                      />
                      <input
                        required
                        type="email"
                        placeholder={fr ? 'Votre email' : 'Your email'}
                        value={prefillEmail}
                        onChange={e => setPrefillEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/[0.06] border border-white/15 text-white text-sm placeholder:text-neutral-500 outline-none focus:border-empire/50"
                      />
                      <button
                        type="submit"
                        className="w-full px-6 py-3.5 bg-empire text-black font-bold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(218,252,104,0.25)] cursor-pointer"
                      >
                        {fr ? 'Choisir mon créneau →' : 'Pick my slot →'}
                      </button>
                      <button type="button" onClick={() => setShowPrefill(false)} className="block mx-auto text-xs text-neutral-500 hover:text-neutral-300 transition-colors pt-1">
                        {fr ? 'Annuler' : 'Cancel'}
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        onClick={handleBookClick}
                        className="w-full block px-6 py-3.5 bg-empire text-black font-bold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(218,252,104,0.25)] cursor-pointer text-center"
                      >
                        {fr ? 'Réserver mon créneau' : 'Book my slot'}
                      </button>
                      <button
                        onClick={() => setChoice('later')}
                        className="block mx-auto mt-3 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                      >
                        {fr ? 'Plus tard, je commence le bootcamp' : "Later, I'll start the bootcamp"}
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {choice === 'later' && (
              <motion.div
                key="later"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 md:p-8 text-center">
                  <button
                    onClick={() => setChoice(null)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>

                  <p className="text-lg font-bold text-white mb-2">
                    {fr ? 'Pas de souci. Concentrez-vous sur le bootcamp.' : 'No worries. Focus on the bootcamp.'}
                  </p>
                  <p className="text-sm text-neutral-400 max-w-md mx-auto">
                    {fr
                      ? "L'offre reste valable pendant les 21 jours du bootcamp. Écrivez-nous à tout moment à support@empire-internet.com."
                      : "The offer remains valid for the 21 days of the bootcamp. Write to us anytime at support@empire-internet.com."}
                  </p>
                  <button
                    onClick={() => setChoice(null)}
                    className="mt-4 text-xs text-academy hover:underline"
                  >
                    {fr ? "Revoir l'offre" : 'See the offer again'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  {fr ? 'Bloquez votre agenda' : 'Block your calendar'}
                </p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {fr
                    ? '21 jours à votre rythme, environ 1 heure par jour.'
                    : '21 days at your own pace, about 1 hour a day.'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <p className="text-white text-sm font-semibold mb-1">
                  {fr ? 'Préparez 3 sujets' : 'Prepare 3 topics'}
                </p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {fr
                    ? 'Les thèmes sur lesquels vous voulez être reconnu.'
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
                ? "Quelqu'un dans votre entourage devrait rejoindre Empire Partners ?"
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
