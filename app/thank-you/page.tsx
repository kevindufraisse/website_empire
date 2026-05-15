'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CheckCircle2, MessageCircle, Check, Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const faqObjections = {
  fr: [
    {
      q: "C'est cher / plus que ce que j'attendais",
      a: "Si vous deviez embaucher un ghostwriter, un monteur vidéo et un community manager, c'est minimum 7 500€/mois. Empire fait tout ça. La question n'est pas le prix - c'est combien vaut un seul client dans votre business. Si Empire vous en amène un dans les 3 prochains mois, vous êtes à combien ?",
    },
    {
      q: "C'est pas le bon moment",
      a: "Ne pas publier de contenu, c'est comme ouvrir votre boutique une seule fois par semaine. Vos concurrents, eux, sont ouverts tous les jours. Chaque mois sans contenu, c'est des opportunités que vous laissez passer.",
    },
    {
      q: "Je ne sais pas si mon secteur est compatible",
      a: "Si personne dans votre secteur ne publie de contenu, c'est une opportunité, pas un problème. La place est vide. Le premier qui s'installe devient la référence par défaut. Empire a des clients dans des niches très spécifiques - loss prevention, expertise comptable, conseil en fusion-acquisition.",
    },
    {
      q: "Je n'ai pas le temps",
      a: "Une interview par semaine. On gère tout le reste : rédaction, montage, planification, publication. Vous avez le temps de passer un coup de fil ? Vous avez le temps pour Empire.",
    },
    {
      q: "Mon contenu ne convertit pas, à quoi bon en faire plus ?",
      a: "Le contenu seul ne convertit pas - c'est normal. Il faut un système derrière : un lien, une newsletter, un tunnel. C'est exactement ce que votre coach met en place avec vous. Le contenu attire. Le système convertit.",
    },
    {
      q: "J'ai déjà investi dans un accompagnement et ça n'a rien donné",
      a: "On comprend. La différence : Empire n'est pas un cours ou une formation. C'est une équipe qui produit votre contenu chaque semaine, avec un coach dédié. Si vous parlez, on publie. Pas de promesse vague - du contenu livré.",
    },
    {
      q: "Il faut que j'en parle à mon associé",
      a: "On peut organiser un appel à trois pour que votre associé pose ses questions directement. Pas besoin de porter le message seul - on préfère répondre nous-mêmes.",
    },
  ],
  en: [
    {
      q: "It's too expensive / more than I expected",
      a: "If you had to hire a ghostwriter, video editor, and community manager, that's at least €7,500/month. Empire does all of that. The question isn't the price - it's how much one client is worth in your business. If Empire brings you one in the next 3 months, what's that worth?",
    },
    {
      q: "It's not the right time",
      a: "Not publishing content is like opening your shop only once a week. Your competitors are open every day. Every month without content is opportunities you're leaving on the table.",
    },
    {
      q: "I'm not sure my industry is compatible",
      a: "If nobody in your industry publishes content, that's an opportunity, not a problem. The space is empty. The first one to show up becomes the default authority. Empire has clients in very specific niches - loss prevention, accounting, M&A consulting.",
    },
    {
      q: "I don't have time",
      a: "One interview per week. We handle everything else: writing, editing, scheduling, publishing. If you have time for a phone call, you have time for Empire.",
    },
    {
      q: "My content doesn't convert, why make more?",
      a: "Content alone doesn't convert - that's normal. You need a system behind it: a link, a newsletter, a funnel. That's exactly what your coach sets up with you. Content attracts. The system converts.",
    },
    {
      q: "I already invested in coaching and got nothing",
      a: "We get it. The difference: Empire isn't a course or a program. It's a team that produces your content every week, with a dedicated coach. If you talk, we publish. No vague promises - content delivered.",
    },
    {
      q: "I need to talk to my partner about it",
      a: "We can set up a three-way call so your partner can ask questions directly. No need to carry the message alone - we'd rather answer ourselves.",
    },
  ],
}

export default function DemoThankYouPage() {
  const { lang } = useLanguage()
  const [confirmed, setConfirmed] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgb(var(--empire-rgb)_/_0.1),transparent)]" />

      <div className="container py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
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

          {/* Loom Video Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-4"
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
            <div className="text-center mt-2">
              <a
                href="https://www.loom.com/share/184e8823d9154d74aeca55a5cd488f08"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-empire transition-colors"
              >
                {lang === 'fr' ? 'Ouvrir dans une nouvelle fenêtre →' : 'Open in a new window →'}
              </a>
            </div>
          </motion.div>

          {/* Confirm Button */}
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
                  {lang === 'fr' ? 'Confirmé ✓' : 'Confirmed ✓'}
                </>
              ) : (
                lang === 'fr' ? 'Confirmer mon rendez-vous' : 'Confirm my appointment'
              )}
            </button>
          </motion.div>

          {/* How it works - compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4">
                {lang === 'fr' ? 'Comment ça marche' : 'How it works'}
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-empire/20 flex items-center justify-center text-empire font-bold text-sm shrink-0">1</span>
                  <p className="text-sm text-neutral-300">
                    {lang === 'fr'
                      ? 'Vous faites une interview par semaine avec votre coach. Pas de script, pas de préparation.'
                      : 'You do one interview per week with your coach. No script, no preparation.'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-empire/20 flex items-center justify-center text-empire font-bold text-sm shrink-0">2</span>
                  <p className="text-sm text-neutral-300">
                    {lang === 'fr'
                      ? 'Notre équipe rédige vos posts, monte vos vidéos, structure vos newsletters. Chaque contenu est vérifié par un humain.'
                      : 'Our team writes your posts, edits your videos, structures your newsletters. Every piece is reviewed by a human.'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-empire/20 flex items-center justify-center text-empire font-bold text-sm shrink-0">3</span>
                  <p className="text-sm text-neutral-300">
                    {lang === 'fr'
                      ? 'Publié tous les jours sur 6 plateformes : LinkedIn, YouTube, Instagram, X, Threads, newsletter. Vous validez, on publie.'
                      : 'Published daily on 6 platforms: LinkedIn, YouTube, Instagram, X, Threads, newsletter. You approve, we publish.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Objections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-10"
          >
            <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                {lang === 'fr' ? 'Questions fréquentes' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-neutral-400 text-sm mb-6">
                {lang === 'fr'
                  ? 'Ce que nos prospects demandent le plus souvent avant de démarrer.'
                  : 'What our prospects ask most often before getting started.'}
              </p>
              <div className="space-y-2">
                {(lang === 'fr' ? faqObjections.fr : faqObjections.en).map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 overflow-hidden transition-colors hover:border-empire/30"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-white font-medium text-sm md:text-base">{item.q}</span>
                      {openFaq === i ? (
                        <Minus className="text-empire shrink-0" size={18} />
                      ) : (
                        <Plus className="text-neutral-500 shrink-0" size={18} />
                      )}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4">
                        <p className="text-neutral-300 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
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
