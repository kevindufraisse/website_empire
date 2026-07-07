'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { CheckCircle2, ArrowRight, X } from 'lucide-react'
import { CtaReassurance } from '@/components/ui/cta-reassurance'
import { SocialIcons } from '@/components/ui/social-icons'
import OnboardingLink from '@/components/OnboardingLink'

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: <SocialIcons.linkedin />, pieces: 30 },
  { id: 'instagram', name: 'Instagram', icon: <SocialIcons.instagram />, pieces: 42 },
  { id: 'youtube', name: 'YouTube', icon: <SocialIcons.youtube />, pieces: 4 },
  { id: 'shorts', name: 'Shorts / Reels / TikTok', icon: <SocialIcons.tiktok />, pieces: 30 },
  { id: 'newsletter', name: 'Newsletter', icon: <SocialIcons.newsletter />, pieces: 30 },
  { id: 'substack', name: 'Substack', icon: <SocialIcons.substack />, pieces: 30 },
]

const withoutEmpireTasks = [
  { fr: 'Interviewer', en: 'Interviewer', qty: 7, hours: '7h', cost: '1 400€' },
  { fr: 'Scripts vidéos', en: 'Video scripts', qty: 30, hours: '30h', cost: '1 500€' },
  { fr: 'Posts LinkedIn', en: 'LinkedIn posts', qty: 30, hours: '30h', cost: '3 000€' },
  { fr: 'Posts Instagram', en: 'Instagram posts', qty: 30, hours: '30h', cost: '600€' },
  { fr: 'Carrousels', en: 'Carousels', qty: 12, hours: '24h', cost: '960€' },
  { fr: 'Montage YouTube (20 min)', en: 'YouTube editing (20 min)', qty: 4, hours: '12h', cost: '800€' },
  { fr: 'Shorts / Reels / TikTok', en: 'Shorts / Reels / TikTok', qty: 30, hours: '90h', cost: '3 000€' },
  { fr: 'Newsletters', en: 'Newsletters', qty: 30, hours: '60h', cost: '3 000€' },
  { fr: 'Notes Substack', en: 'Substack notes', qty: 30, hours: '15h', cost: '600€' },
]

const deliverables = [
  { fr: 'Posts LinkedIn rédigés à votre voix', en: 'LinkedIn posts written in your voice' },
  { fr: 'Vidéos montées + Shorts découpés', en: 'Videos edited + Shorts cut' },
  { fr: 'Un coach dédié pour structurer votre contenu', en: 'A dedicated coach to structure your content' },
  { fr: 'Newsletters écrites et envoyées', en: 'Newsletters written and sent' },
  { fr: 'Carrousels & posts Instagram créés', en: 'Carousels & Instagram posts created' },
  { fr: 'Publié quotidiennement sur 6+ plateformes', en: 'Published daily on 6+ platforms' },
]

export default function QuickWinsSection() {
  const { lang, t } = useLanguage()
  const fr = lang === 'fr'
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const totalPieces = platforms.reduce((s, p) => s + p.pieces, 0)

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--empire-rgb)_/_0.05),transparent)]" />

      <div ref={ref} className="relative z-10 container max-w-6xl mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {fr
              ? <>Faire ça vous-même : <span className="text-empire">298h et 14 860€ par mois.</span></>
              : <>Doing this yourself: <span className="text-empire">298h and €14,860 per month.</span></>}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {fr
              ? "Être présent sur un seul réseau, c'est ouvrir votre boutique 1 jour sur 7. Voici ce que coûte l'omniprésence sans Empire."
              : 'Being on one platform is opening your shop 1 day out of 7. Here\'s what omnipresence costs without Empire.'}
          </p>
        </motion.div>

        {/* Platforms strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {platforms.map(p => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border bg-empire/10 border-empire/40"
            >
              <span className="opacity-100">{p.icon}</span>
              <span className="text-[13px] font-medium text-white">{p.name}</span>
              <span className="text-[11px] text-empire font-mono font-bold">{p.pieces}</span>
            </div>
          ))}
        </motion.div>

        {/* Before / After grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16"
        >
          {/* SANS EMPIRE */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                {fr ? 'Sans Empire' : 'Without Empire'}
              </p>
              <p className="text-xs text-neutral-600 mt-0.5">
                {fr ? 'Seul ou en externalisant' : 'Alone or outsourcing'}
              </p>
            </div>

            <div className="px-6 py-4">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 pb-2 border-b border-white/10 mb-1">
                <span className="text-[11px] text-neutral-600 font-medium" />
                <span className="text-[11px] text-neutral-600 font-medium text-right w-8">{fr ? 'Qté' : 'Qty'}</span>
                <span className="text-[11px] text-neutral-600 font-medium text-right w-10">H</span>
                <span className="text-[11px] text-neutral-600 font-medium text-right w-16">{fr ? 'Coût' : 'Cost'}</span>
              </div>

              {/* Table rows */}
              {withoutEmpireTasks.map((task, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-[12px] text-neutral-400">{fr ? task.fr : task.en}</span>
                  <span className="text-[12px] text-neutral-500 text-right w-8 font-mono">{task.qty}</span>
                  <span className="text-[12px] text-neutral-500 text-right w-10 font-mono">{task.hours}</span>
                  <span className="text-[12px] text-neutral-500 text-right w-16 font-mono">{task.cost}</span>
                </div>
              ))}

              {/* Total */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-3 pt-3 mt-2 border-t border-white/20">
                <span className="text-sm font-bold text-white">TOTAL</span>
                <span className="text-sm font-bold text-white text-right w-8 font-mono">203</span>
                <span className="text-sm font-bold text-white text-right w-10 font-mono">298h</span>
                <span className="text-sm font-bold text-red-400 text-right w-16 font-mono">14 860€</span>
              </div>
            </div>

            {/* Pain points */}
            <div className="px-6 pb-5 pt-2 space-y-2">
              {[
                { fr: 'Aucune régularité, aucune autorité', en: 'No consistency, no authority' },
                { fr: 'Seul face au syndrome de la page blanche', en: 'Alone facing blank page syndrome' },
                { fr: 'Pas de système, vous improvisez', en: 'No system, you improvise' },
              ].map((pain, i) => (
                <div key={i} className="flex items-center gap-2">
                  <X className="text-red-400/70 shrink-0" size={14} />
                  <span className="text-[12px] text-neutral-500">{fr ? pain.fr : pain.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AVEC EMPIRE */}
          <div className="rounded-2xl border border-empire/30 bg-neutral-950 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-empire/60 to-transparent" />

            <div className="px-6 py-4 border-b border-empire/20 bg-empire/[0.03]">
              <p className="text-sm font-bold text-empire uppercase tracking-wider">
                {fr ? 'Avec Empire' : 'With Empire'}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {fr ? 'On gère tout pour vous' : 'We handle everything for you'}
              </p>
            </div>

            <div className="px-6 py-6">
              {/* Big number */}
              <div className="text-center mb-6">
                <p className="text-4xl md:text-5xl font-black text-empire font-mono">{totalPieces}+</p>
                <p className="text-neutral-500 text-sm mt-1">
                  {fr ? 'contenus publiés par mois' : 'pieces of content per month'}
                </p>
              </div>

              {/* Interview badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empire/10 border border-empire/30">
                  <span className="text-2xl font-black text-empire">1h</span>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {fr ? 'de parole / semaine' : 'of talking / week'}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {fr ? "c'est tout ce qu'on vous demande" : "that's all we ask"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-0">
                {deliverables.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0"
                  >
                    <CheckCircle2 className="text-empire/70 shrink-0" size={15} />
                    <span className="text-[13px] text-neutral-300">{fr ? item.fr : item.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <OnboardingLink className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-empire text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.3)]">
            {t.common.startNow}
            <ArrowRight size={20} />
          </OnboardingLink>
          <CtaReassurance className="mt-4 px-2" />
        </motion.div>
      </div>
    </section>
  )
}
