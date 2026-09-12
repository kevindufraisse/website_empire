'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Check, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LoomEmbed from '@/components/LoomEmbed'

function ThankYouContent() {
  const { lang } = useLanguage()
  const searchParams = useSearchParams()
  const fromWaitlist = searchParams.get('from') === 'waitlist'
  const [confirmed, setConfirmed] = useState(false)
  const fr = lang === 'fr'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: fromWaitlist ? 'empire_waitlist_joined' : 'cal_booking_confirmed',
      })
      if ((window as any).fbq) {
        ;(window as any).fbq('track', fromWaitlist ? 'Lead' : 'Schedule')
      }
    }
  }, [fromWaitlist])

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgb(var(--empire-rgb)_/_0.1),transparent)]" />

      <div className="container py-12 relative z-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-20 h-20 rounded-full bg-empire/20 border-4 border-empire flex items-center justify-center mx-auto mb-4 shadow-[0_0_50px_rgb(var(--empire-rgb)_/_0.3)]"
            >
              <CheckCircle2 className="text-empire" size={40} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold text-white mb-3"
            >
              {fromWaitlist
                ? fr
                  ? 'C\'est bien reçu !'
                  : 'Got it!'
                : fr
                  ? 'Rendez-vous confirmé !'
                  : 'Appointment confirmed!'}
            </motion.h1>
          </div>

          {/* Le setter démarre par écrit ; un appel reste optionnel. */}
          {fromWaitlist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <div className="flex items-start gap-4 rounded-2xl border border-empire/40 bg-empire/[0.08] p-5 md:p-6">
                <span className="relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-empire text-black">
                  <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-empire opacity-30 [animation-duration:1.8s]" />
                  <MessageCircle size={20} className="relative" />
                </span>
                <div>
                  <p className="text-lg font-bold text-white md:text-xl">
                    {fr ? 'On vous écrit dans un instant.' : 'We’ll message you in a moment.'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-300 md:text-base">
                    {fr
                      ? 'Un membre de l’équipe lance la discussion sur WhatsApp pour répondre à vos questions, vous proposer l’offre la plus adaptée et vous accompagner dans l’onboarding. Un appel est possible uniquement si vous le souhaitez.'
                      : 'A team member will start the conversation on WhatsApp, answer your questions, recommend the best plan and guide your onboarding. A call is only needed if you want one.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <p className="mb-3 text-center text-sm text-neutral-400">
              {fr ? 'En attendant notre message, regardez le système 👇' : 'While you wait for our message, watch the system 👇'}
            </p>
            <LoomEmbed title="Empire - le système" />
            <div className="text-center mt-2">
              <a
                href="https://www.loom.com/share/184e8823d9154d74aeca55a5cd488f08"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-empire transition-colors"
              >
                {fr ? 'Ouvrir dans une nouvelle fenêtre →' : 'Open in a new window →'}
              </a>
            </div>
          </motion.div>

          {!fromWaitlist && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-center mb-10"
          >
            <button
              onClick={() => setConfirmed(true)}
              disabled={confirmed}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                confirmed
                  ? 'bg-empire/20 border-2 border-empire text-empire cursor-default'
                  : 'bg-empire text-black hover:scale-105 shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.4)] animate-bounce'
              }`}
            >
              {confirmed ? (
                <>
                  <Check size={24} />
                  {fr ? 'Confirmé ✓' : 'Confirmed ✓'}
                </>
              ) : (
                fr ? 'Confirmer mon rendez-vous' : 'Confirm my appointment'
              )}
            </button>
          </motion.div>
          )}

          {/* Comment ça marche - aligné sur la formule actuelle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4">
                {fr ? 'Comment ça marche' : 'How it works'}
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-empire/20 flex items-center justify-center text-empire font-bold text-sm shrink-0">1</span>
                  <p className="text-sm text-neutral-300">
                    {fr
                      ? 'Vous parlez 20 minutes par semaine depuis l\'app : interview guidée, face caméra ou dictée sans caméra.'
                      : 'You talk 20 minutes a week from the app: guided interview, on camera or dictation without a camera.'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-empire/20 flex items-center justify-center text-empire font-bold text-sm shrink-0">2</span>
                  <p className="text-sm text-neutral-300">
                    {fr
                      ? 'Notre équipe fait le montage, rédige vos posts et votre newsletter. Un humain relit chaque texte.'
                      : 'Our team edits, writes your posts and your newsletter. A human proofreads every text.'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-empire/20 flex items-center justify-center text-empire font-bold text-sm shrink-0">3</span>
                  <p className="text-sm text-neutral-300">
                    {fr
                      ? 'Publié sur 7 réseaux + newsletter : LinkedIn, YouTube, Instagram, TikTok, X, Threads, Facebook. Chaque lien est tracké jusqu\'au client.'
                      : 'Published on 7 networks + newsletter: LinkedIn, YouTube, Instagram, TikTok, X, Threads, Facebook. Every link is tracked down to the client.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  )
}

export default function DemoThankYouPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <ThankYouContent />
    </Suspense>
  )
}
