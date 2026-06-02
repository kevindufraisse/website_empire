'use client'

import { useState } from 'react'
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Film,
  FileText,
  Mail,
  Video,
  Layers,
  Scissors,
  ChevronDown,
  Check,
  Coins,
} from 'lucide-react'

// ── Credit grille ────────────────────────────────────────────────────
const ALL_ITEMS = [
  { name: 'Reel monté', credits: 350, section: 'Contenus' },
  { name: 'Vidéo YouTube', credits: 275, section: 'Contenus' },
  { name: 'Carrousel LinkedIn', credits: 180, section: 'Contenus' },
  { name: 'Newsletter', credits: 115, section: 'Contenus' },
  { name: 'Post LinkedIn / X', credits: 85, section: 'Contenus' },
  { name: 'Reel sous-titré', credits: 29, section: 'Contenus' },
  { name: 'Best Of compilation', credits: 100, section: 'Extras' },
]

const FREE_FEATURES = [
  'Dashboard & Analytics',
  'CRM / Leads / Profils',
  'Liens courts + tracking clics',
  'Calendrier de contenu',
  'Publication multi-réseaux',
  'Intégrations (Cal, Tally, Systeme.io)',
  'Substack Notes auto-publish',
  'Skool auto-publish',
  'Programme affilié',
  'Team / Multi-workspace',
  'Configuration clone IA',
  'Rappels interview automatiques',
  'Captures texte Telegram',
  'API / Webhooks',
]

// ── Personas (ClassPass-style — content output only) ─────────────────
const PERSONAS = [
  {
    name: 'Thomas',
    role: 'Coach business',
    pack: 'Starter · 199€/mois',
    color: 'from-blue-500 to-indigo-600',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    desc: 'Thomas démarre. Il fait 1 session vocale par mois et ajoute quelques posts à l\'unité quand il a de l\'inspiration.',
    content: [
      { label: 'Posts LinkedIn / X', qty: 14 },
      { label: 'Newsletters', qty: 7 },
    ],
    total: 21,
  },
  {
    name: 'Sarah',
    role: 'Consultante marketing',
    pack: 'Growth · 499€/mois',
    color: 'from-empire to-yellow-500',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    desc: 'Sarah fait 2 interviews caméra par mois. Elle ajoute des reels montés pour ses lancements.',
    content: [
      { label: 'Posts LinkedIn / X', qty: 14 },
      { label: 'Newsletters', qty: 14 },
      { label: 'Reels sous-titrés', qty: 14 },
      { label: 'Vidéos YouTube', qty: 2 },
      { label: 'Carrousels', qty: 2 },
      { label: 'Reels montés', qty: 2 },
    ],
    total: 60,
  },
  {
    name: 'Marc',
    role: 'CEO SaaS',
    pack: 'Illimité · 999€/mois',
    color: 'from-purple-500 to-pink-500',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    desc: 'Marc produit en continu. 4 interviews par mois, YouTube chaque semaine, et des reels montés pour LinkedIn.',
    content: [
      { label: 'Posts LinkedIn / X', qty: 28 },
      { label: 'Newsletters', qty: 28 },
      { label: 'Reels sous-titrés', qty: 28 },
      { label: 'Vidéos YouTube', qty: 4 },
      { label: 'Carrousels', qty: 4 },
      { label: 'Reels montés', qty: 4 },
      { label: 'Best Of', qty: 1 },
    ],
    total: 110,
  },
]

const FAQS = [
  {
    q: 'C\'est quoi les crédits Empire ?',
    a: 'Les crédits sont la monnaie de production de contenu sur Empire. Tu les dépenses pour lancer des interviews, créer des posts, des newsletters, des reels, des vidéos YouTube et des carrousels.',
  },
  {
    q: 'Que se passe-t-il si je n\'utilise pas tous mes crédits ?',
    a: 'Ils restent sur ton compte. Pas d\'expiration. Tu peux les utiliser le mois suivant ou accumuler pour un mois chargé.',
  },
  {
    q: 'C\'est quoi la différence entre reel sous-titré et reel monté ?',
    a: 'Le reel sous-titré (29 cr) est généré automatiquement à partir de ton interview : découpage IA + sous-titrage. Le reel monté (350 cr) est édité par la team Empire avec un montage pro, des transitions et un format optimisé pour la viralité.',
  },
  {
    q: 'Pourquoi faire un bundle interview plutôt que du contenu à l\'unité ?',
    a: 'Le bundle part d\'un seul enregistrement et génère automatiquement des posts, newsletters et reels. À l\'unité, chaque contenu a besoin de sa propre source.',
  },
  {
    q: 'C\'est quoi la différence entre les packs et l\'Illimité ?',
    a: 'Avec les packs, tu achètes des crédits et tu choisis comment les dépenser. Avec l\'Illimité, pas de compteur : YouTube et carrousel inclus dans chaque interview, plus la communauté privée, le bootcamp et le coaching.',
  },
  {
    q: 'Je peux résilier quand je veux ?',
    a: 'Oui. Modifie ou résilie ton forfait à tout moment. Tes crédits acquis restent disponibles.',
  },
]

function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <img
      src={src}
      alt={name}
      className="w-16 h-16 rounded-full object-cover shadow-lg shrink-0"
    />
  )
}

function CreditBadge({ amount }: { amount: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-bold text-white">
      {amount.toLocaleString('fr-FR')}
      <Coins size={13} className="text-empire" />
    </span>
  )
}

export default function CreditsClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_-10%,rgb(var(--empire-rgb)_/_0.08),transparent)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="border-b border-white/5">
          <div className="flex items-center justify-between max-w-4xl mx-auto w-full px-4 sm:px-6 py-4">
            <a
              href="/pay-as-you-go"
              className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              Retour aux plans
            </a>
            <div className="flex items-center gap-1.5 text-xs">
              <Sparkles size={12} className="text-empire" />
              <span className="text-empire font-semibold uppercase tracking-wider">
                Crédits Empire
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-20">
          {/* ── Hero ──────────────────────────────────────── */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              C&apos;est quoi les{' '}
              <span className="text-empire">crédits</span> ?
            </h1>
            <p className="text-neutral-400 text-base leading-relaxed">
              Les crédits Empire te permettent de créer du contenu sur tous tes
              réseaux. Utilise-les comme tu veux pour créer un programme de
              contenu personnalisé.
            </p>
          </div>

          {/* ── Personas (ClassPass-style) ─────────────────── */}
          <section className="space-y-8">
            <div className="text-center">
              <p className="text-sm text-neutral-400">
                Découvre comment des membres Empire utilisent leurs crédits
                pour créer leur contenu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PERSONAS.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4"
                  >
                    {/* Header with avatar */}
                    <div className="flex items-start gap-3">
                      <Avatar src={p.avatar} name={p.name} />
                      <div className="min-w-0 pt-0.5">
                        <p className="text-base font-bold text-white leading-tight">
                          <span className="text-empire">{p.total}</span>{' '}
                          contenus / mois
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {p.name} · {p.role}
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {p.pack}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {p.desc}
                    </p>

                    {/* Content breakdown */}
                    <div className="space-y-1.5 pt-3 border-t border-white/10">
                      {p.content.map((c, j) => (
                        <div key={j} className="flex items-center justify-between">
                          <span className="text-xs text-neutral-400">
                            {c.label}
                          </span>
                          <span className="text-sm font-bold text-white">
                            {c.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
          </section>

          {/* ── How credits work ──────────────────────────── */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-white text-center">
              Comment ça marche
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: 'Utilise-les pour créer',
                  desc: 'Lance des interviews, génère des posts, newsletters, reels, YouTube, carrousels. Le coût varie selon le type de contenu.',
                },
                {
                  title: 'Ils s\'accumulent',
                  desc: 'Crédits non utilisés = reportés au mois suivant. Pas d\'expiration. Un mois calme ? Ils t\'attendent.',
                },
                {
                  title: 'Les bundles, c\'est le plus rentable',
                  desc: 'Un seul enregistrement génère des posts + newsletters + reels d\'un coup. C\'est le meilleur ratio crédits/contenu.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-2"
                >
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Credit costs grid (simplified) ────────────── */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-white text-center">
              Grille tarifaire
            </h2>

            {(['Contenus', 'Extras'] as const).map((section) => {
              const items = ALL_ITEMS.filter((i) => i.section === section)
              return (
                <div
                  key={section}
                  className="rounded-2xl p-5 space-y-3 border border-white/10 bg-white/[0.03]"
                >
                  <p className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                    {section}
                  </p>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
                      >
                        <span className="text-sm text-neutral-200">
                          {item.name}
                        </span>
                        <CreditBadge amount={item.credits} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Gratuit */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                Gratuit · 0 <Coins size={10} className="inline text-empire" />
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {FREE_FEATURES.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 text-xs text-neutral-300"
                  >
                    <Check size={11} className="text-empire shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────── */}
          <section className="space-y-5">
            <h2 className="text-xl font-bold text-white text-center">
              Questions fréquentes
            </h2>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all hover:border-white/20"
                >
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-sm font-medium text-white pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-neutral-400 shrink-0 transition-transform ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {openFaq === i && (
                    <div className="px-4 pb-3.5">
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center space-y-3 pb-8">
            <a
              href="/pay-as-you-go"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-empire text-black font-bold text-sm hover:brightness-110 transition-colors shadow-[0_0_20px_-4px_rgb(var(--empire-rgb)_/_0.35)]"
            >
              Choisir mon pack
              <ArrowRight size={16} />
            </a>
            <p className="text-[11px] text-neutral-500">
              50 places en beta · Sans engagement
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 py-5 text-center">
          <p className="text-xs text-neutral-400">
            © 2026 Empire Internet ·{' '}
            <a href="/" className="hover:text-white transition-colors">
              Retour au site
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
