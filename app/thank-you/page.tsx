'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, MessageCircle, Check, Phone } from 'lucide-react'
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

          {/* Le message principal : on appelle dans un instant */}
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
                  <Phone size={20} className="relative" />
                </span>
                <div>
                  <p className="text-lg font-bold text-white md:text-xl">
                    {fr ? 'On vous contacte dans un instant.' : 'We will contact you in a moment.'}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-300 md:text-base">
                    {fr
                      ? 'Restez disponible par téléphone : un membre de l\'équipe vous appelle pour vous ouvrir l\'accès.'
                      : 'Stay available by phone: a team member will call you to open your access.'}
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
              {fr ? 'En attendant l\'appel, regardez le système 👇' : 'While you wait for the call, watch the system 👇'}
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

          {/* WhatsApp Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-neutral-400 mb-4">
              {fr ? 'Une question en attendant l\'appel ?' : 'A question while you wait for the call?'}
            </p>
            <a
              href="https://wa.me/33665427470"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366]/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                <MessageCircle className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold group-hover:text-[#25D366] transition-colors">
                  {fr ? 'Écrivez-nous sur WhatsApp' : 'Message us on WhatsApp'}
                </p>
                <p className="text-sm text-neutral-400">+33 6 65 42 74 70</p>
              </div>
            </a>
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
