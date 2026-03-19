'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CheckCircle2, MessageCircle, Check, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DemoThankYouPage() {
  const { lang } = useLanguage()
  const [confirmed, setConfirmed] = useState(false)
  const [showFullText, setShowFullText] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ 'event': 'cal_booking_confirmed' });
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Schedule');
      }
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(218,252,104,0.1),transparent)]" />

      <div className="container py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-20 h-20 rounded-full bg-empire/20 border-4 border-empire flex items-center justify-center mx-auto mb-4 shadow-[0_0_50px_rgba(218,252,104,0.3)]"
            >
              <CheckCircle2 className="text-empire" size={40} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold text-white mb-3"
            >
              {lang === 'fr' ? 'Rendez-vous confirmé !' : 'Appointment confirmed!'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-neutral-300"
            >
              {lang === 'fr'
                ? 'En attendant, découvrez comment Empire fonctionne 👇'
                : 'In the meantime, discover how Empire works 👇'}
            </motion.p>
          </div>

          {/* Confirm Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-center mb-8"
          >
            <button
              onClick={() => setConfirmed(true)}
              disabled={confirmed}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                confirmed
                  ? 'bg-empire/20 border-2 border-empire text-empire cursor-default'
                  : 'bg-empire text-black hover:scale-105 shadow-[0_0_30px_rgba(218,252,104,0.4)] animate-pulse'
              }`}
            >
              {confirmed ? (
                <>
                  <Check size={24} />
                  {lang === 'fr' ? 'Confirmé ✓' : 'Confirmed ✓'}
                </>
              ) : (
                lang === 'fr' ? 'Confirmer mon rendez-vous' : 'Confirm my appointment'
              )}
            </button>
          </motion.div>

          {/* Loom Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-neutral-900/50" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.loom.com/embed/184e8823d9154d74aeca55a5cd488f08?hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_speed=true&t=0"
                frameBorder="0"
                allowFullScreen
                allow="autoplay"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </motion.div>

          {/* Transcript Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                {lang === 'fr' ? 'Ce que vous allez découvrir' : 'What you\'ll discover'}
              </h2>

              <div className={`space-y-5 text-neutral-300 leading-relaxed ${!showFullText ? 'max-h-[600px] overflow-hidden relative' : ''}`}>
                <p>
                  <strong className="text-empire">Le problème :</strong> Vous êtes entrepreneur, CEO ou freelance. Vous savez que le contenu est un levier business indispensable, mais entre vos clients, votre delivery et votre quotidien, il ne reste plus d'énergie pour écrire un post ou monter une vidéo. Trouver des idées, rédiger, tourner, monter, programmer, publier — c'est le travail de 5 personnes. Ce n'est pas censé être le vôtre.
                </p>

                <p>
                  <strong className="text-empire">Les tentatives classiques :</strong> Vous avez peut-être essayé de déléguer à un freelance — contenu générique, retards, turnover. Ou de tout faire vous-même — motivé 2 semaines, 3 posts, zéro traction, abandon. Ce n'est pas un problème de discipline. Vous n'aviez juste pas de système.
                </p>

                <p>
                  <strong className="text-empire">Ce que font les top créateurs :</strong> Grant Cardone, Alex Hormozi, Matt Gray — ils ne créent pas du contenu assis devant un écran. Ils parlent, et une équipe transforme tout derrière. Sauf que ça leur coûte 50 à 100 000€ par mois et 5 ans à mettre en place. Empire reproduit ce système pour vous, clé en main.
                </p>

                <p>
                  <strong className="text-empire">Le système Empire en 3 étapes :</strong>
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-empire font-bold mt-0.5">1.</span>
                    <span><strong className="text-white">L'extraction</strong> — Vous parlez 15 minutes lors d'une interview. L'IA, formée sur votre expertise, capture vos meilleures idées, votre vocabulaire, vos angles. Plus vous l'utilisez, plus elle vous connaît.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-empire font-bold mt-0.5">2.</span>
                    <span><strong className="text-white">La transformation</strong> — Une équipe d'assistants formés pendant des mois prend le relais. Ils coupent vos vidéos, rédigent vos posts LinkedIn, structurent vos newsletters, créent vos Reels et Shorts. Chaque contenu est vérifié : orthographe, ton, qualité.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-empire font-bold mt-0.5">3.</span>
                    <span><strong className="text-white">La publication</strong> — Une interview génère une semaine entière de contenu sur 6 plateformes : LinkedIn, YouTube, Instagram, Twitter/X, Threads et newsletter. Vous relisez, vous validez, c'est publié.</span>
                  </li>
                </ul>

                <p>
                  <strong className="text-empire">Résultats concrets :</strong> Un copywriter à 2 500€/mois produisait des newsletters. Quand le système Empire a pris le relais, plus de 75% des lecteurs ont préféré la version IA. Un abonné a écrit : "Je ne sais pas ce qui s'est passé, mais ta newsletter s'est tellement améliorée."
                </p>

                <p>
                  <strong className="text-empire">Témoignages :</strong> Marguerite, experte marketing B2B, a doublé son pipeline commercial en un mois. Sophie, sparring partner pour fondateurs, est passée de posts aléatoires à 1-3 contenus par jour. Antoine, dirigeant, confirme : "Bizarrement, c'est mon ton naturel."
                </p>

                <p>
                  <strong className="text-empire">Avant vs Après Empire :</strong> Avant — 3-4 posts par mois, des heures de travail, une seule plateforme, zéro retour. Après — publication quotidienne sur 6 plateformes, 15 minutes par semaine, calendrier rempli, leads entrants automatiques.
                </p>

                <p>
                  <strong className="text-empire">Pour qui c'est fait :</strong> Entrepreneurs, CEOs, freelances qui font plus de 5 000€/mois et qui veulent transformer leur visibilité en ligne en levier business — sans sacrifier leur temps. Limité à 100 clients pour garantir la qualité.
                </p>

                <p>
                  <strong className="text-empire">L'audit gratuit :</strong> 45 minutes pour analyser votre business, vos plateformes et votre positionnement. On vous dit honnêtement si Empire est adapté ou pas. Et même si ce n'est pas le bon moment, vous repartez avec toutes nos ressources : templates, méthodes et outils.
                </p>

                {!showFullText && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
                )}
              </div>

              {!showFullText && (
                <button
                  onClick={() => setShowFullText(true)}
                  className="mt-4 flex items-center gap-2 text-empire font-medium hover:underline mx-auto"
                >
                  {lang === 'fr' ? 'Lire la suite' : 'Read more'}
                  <ChevronDown size={16} />
                </button>
              )}
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
              {lang === 'fr' ? 'Des questions avant le rendez-vous ?' : 'Questions before the meeting?'}
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
                  {lang === 'fr' ? 'Contactez-nous sur WhatsApp' : 'Contact us on WhatsApp'}
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
