'use client'

import { useState } from 'react'
import {
  Check,
  ArrowRight,
  XCircle,
  Scissors,
  Film,
  PenLine,
  Share2,
  Users,
  TrendingUp,
  Zap,
  Bot,
  Coins,
  Gift,
  Copy,
} from 'lucide-react'

const ONBOARDING_URL = 'https://app.empire-internet.com/onboarding'

const PLATFORMS = [
  { label: 'LinkedIn', svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', color: '#0A66C2' },
  { label: 'Instagram', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', color: '#E4405F' },
  { label: 'TikTok', svg: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z', color: '#ffffff' },
  { label: 'YouTube', svg: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', color: '#FF0000' },
  { label: 'Newsletter', svg: 'M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z', color: '#dafc68' },
  { label: 'Facebook', svg: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: '#1877F2' },
  { label: 'X', svg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', color: '#ffffff' },
]

const REPLACED_ROLES = [
  { role: 'Monteur vidéo', cost: '2 500' },
  { role: 'Community Manager', cost: '2 800' },
  { role: 'Ghostwriter LinkedIn', cost: '1 500' },
  { role: 'Stratège contenu', cost: '3 000' },
]

const SERVICES = [
  {
    icon: Scissors,
    title: 'On découpe vos interviews',
    desc: 'Vos interviews caméra sont découpées en clips viraux, prêts à publier.',
  },
  {
    icon: Film,
    title: 'On monte vos Reels',
    desc: "Montage pro avec hooks, sous-titres et transitions qui captent l'attention.",
  },
  {
    icon: PenLine,
    title: 'On écrit vos posts & newsletters',
    desc: 'Posts LinkedIn, newsletters… rédigés avec votre voix, votre style.',
  },
  {
    icon: Share2,
    title: 'On multiplie sur tous les réseaux',
    desc: 'Un contenu = LinkedIn, Instagram, TikTok, YouTube, X, Threads, Facebook. Partout, en même temps.',
  },
  {
    icon: Bot,
    title: 'Cerveau Empire',
    desc: 'Nos agents IA trouvent les sujets les plus viraux pour votre niche. Le format le plus simple pour créer du contenu.',
  },
]

const PAIN_POINTS = [
  'Apprendre le copywriting',
  'Écrire vos contenus vous-même',
  'Découper vos vidéos pendant des heures',
  'Chercher un hook pour chaque post',
  'Recruter des freelances',
  'Virer des freelances qui ne livrent pas',
  'Payer 2 000€/mois pour monter des Reels',
]

function PromoCode() {
  const [copied, setCopied] = useState(false)
  const code = '660738'

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl bg-empire/[0.08] border border-empire/30 p-4">
      <div className="flex items-center gap-3 mb-3">
        <Gift size={16} className="text-empire" />
        <p className="text-sm font-bold text-white">20€ de crédits offerts</p>
      </div>
      <p className="text-xs text-neutral-400 mb-3">
        Utilisez ce code lors de votre premier achat de crédits.
      </p>
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-black/40 border border-empire/20 hover:border-empire/40 transition-all cursor-pointer group"
      >
        <span className="font-mono text-lg font-bold text-empire tracking-widest">{code}</span>
        <span className="flex items-center gap-1.5 text-xs text-neutral-400 group-hover:text-empire transition-colors">
          <Copy size={12} />
          {copied ? 'Copié !' : 'Copier'}
        </span>
      </button>
    </div>
  )
}

export default function PaygClient() {
  const totalReplacedCost = REPLACED_ROLES.reduce(
    (sum, r) => sum + parseInt(r.cost.replace(/\s/g, ''), 10),
    0,
  )

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgb(var(--empire-rgb)_/_0.12),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgb(var(--empire-rgb)_/_0.06),transparent)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ── Navbar ── */}
        <nav className="border-b border-white/5 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full px-4 sm:px-6 py-4">
            <a
              href="/"
              className="text-white font-bold text-base tracking-tight hover:text-empire transition-colors"
            >
              Empire Internet
            </a>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
                <span className="text-empire font-semibold uppercase tracking-wider">
                  Beta · 50 places
                </span>
              </div>
              <a
                href={ONBOARDING_URL}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-empire text-black font-bold text-xs hover:brightness-110 transition-all"
              >
                Recruter mon équipe
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-12 md:pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6">
              Run a media machine.
              <br />
              Close leads.{' '}
              <span className="text-empire relative">
                Never manage.
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-empire/40 rounded-full" />
              </span>
            </h1>

            <p className="text-neutral-400 text-lg sm:text-xl leading-relaxed mb-4 max-w-2xl mx-auto">
              Envoyez-nous une interview de 15 min et on crée vos contenus —
              LinkedIn, Instagram, TikTok, YouTube — avec les systèmes des meilleurs entrepreneurs du web.
            </p>

            <p className="text-neutral-500 text-sm mb-10 max-w-xl mx-auto">
              Chaque contenu est vérifié et validé par des humains avant publication.
            </p>

            {/* Platform logos */}
            <div className="flex items-center justify-center gap-5 sm:gap-8 mb-10">
              {PLATFORMS.map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-2 group">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/[0.10] transition-all">
                    <svg viewBox="0 0 24 24" fill={p.color} className="w-5 h-5 sm:w-5.5 sm:h-5.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <path d={p.svg} />
                    </svg>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium">{p.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 mb-12">
              <a
                href={ONBOARDING_URL}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-empire text-black font-bold text-base hover:brightness-110 transition-all inline-flex items-center justify-center gap-2 shadow-[0_0_40px_-8px_rgb(var(--empire-rgb)_/_0.5)]"
              >
                Recruter mon équipe
                <ArrowRight size={18} />
              </a>
              <span className="text-xs text-neutral-500">
                En 5 minutes, c'est lancé · 50 places en beta
              </span>
            </div>

            {/* Stats bar */}
            <div className="inline-flex items-center gap-8 sm:gap-12 px-8 py-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              {[
                { value: '6+', label: 'plateformes couvertes' },
                { value: '1M+', label: 'vues générées' },
                { value: '+9 800€', label: 'sauvés / mois' },
              ].map((s, i) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl sm:text-2xl font-extrabold text-empire leading-none">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-neutral-500 mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comment ça marche ── */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <p className="text-center text-neutral-500 text-xs uppercase tracking-widest font-bold mb-6">
            3 étapes. Zéro prise de tête.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
            {[
              { step: '1', icon: Zap, title: "Vous passez l'interview", desc: '30 min face caméra' },
              { step: '2', icon: TrendingUp, title: 'On produit tout', desc: 'Découpe, montage, rédaction' },
              { step: '3', icon: Share2, title: 'On publie partout', desc: '7+ plateformes, chaque jour' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-3 sm:gap-2.5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] flex-1 sm:flex-initial">
                  <div className="w-8 h-8 rounded-lg bg-empire/10 border border-empire/20 flex items-center justify-center flex-shrink-0">
                    <s.icon size={14} className="text-empire" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight">{s.title}</p>
                    <p className="text-[11px] text-neutral-500">{s.desc}</p>
                  </div>
                </div>
                {i < 2 && (
                  <ArrowRight size={14} className="text-neutral-600 hidden sm:block flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* ── Services Bento ── */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="text-center mb-10">
            <p className="text-empire text-xs font-bold uppercase tracking-widest mb-3">
              Votre content machine
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              On s&apos;occupe de tout. Vous, vous parlez.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className={`group relative p-5 sm:p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-empire/20 transition-all ${
                  i === SERVICES.length - 1 && SERVICES.length % 3 === 2
                    ? 'sm:col-span-2 lg:col-span-1'
                    : ''
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-empire/10 border border-empire/20 flex items-center justify-center mb-4 group-hover:bg-empire/15 transition-all">
                  <s.icon size={16} className="text-empire" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-neutral-600 text-xs mt-5">
            Tous les contenus sont vérifiés et validés par des humains avant publication.
          </p>
        </section>

        {/* ── Avant / Après ── */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="text-center mb-10">
            <p className="text-empire text-xs font-bold uppercase tracking-widest mb-3">
              Avant / Après
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              Économisez{' '}
              <span className="text-empire">14h par jour.</span>
            </h2>
            <p className="text-neutral-400 text-sm mt-3 max-w-lg mx-auto">
              Le temps que vous passez à produire du contenu vs. ce qu&apos;il vous reste avec Empire.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-2 text-xs text-neutral-500 font-bold uppercase tracking-wider">
              <span>Tâche</span>
              <span className="w-16 text-center">Avant</span>
              <span className="w-16 text-center">Après</span>
            </div>
            {[
              { task: 'Post LinkedIn', before: '1h', after: '2 min' },
              { task: 'Reel Instagram', before: '1h', after: '2 min' },
              { task: 'Newsletter', before: '2h', after: '2 min' },
              { task: 'Carrousel', before: '2h', after: '2 min' },
              { task: 'Vidéo YouTube', before: '5h', after: '15 min' },
              { task: 'Veille & idées', before: '1h', after: '1 min' },
              { task: 'Community management', before: '1h', after: '1 min' },
              { task: 'Miniatures', before: '1h', after: '1 min' },
            ].map((row) => (
              <div
                key={row.task}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <span className="text-sm text-white font-medium">{row.task}</span>
                <span className="w-16 text-center text-sm text-red-400/80 line-through">{row.before}</span>
                <span className="w-16 text-center text-sm text-empire font-bold">{row.after}</span>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3.5 rounded-xl bg-empire/[0.08] border border-empire/30">
              <span className="text-sm text-white font-bold">Total / jour</span>
              <span className="w-16 text-center text-sm text-red-400 font-bold line-through">14h</span>
              <span className="w-16 text-center text-sm text-empire font-extrabold">26 min</span>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-empire text-xs font-bold uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              Payez avec des crédits.{' '}
              <span className="text-empire">Publiez autant que vous voulez.</span>
            </h2>
            <p className="text-neutral-400 text-sm mt-3 max-w-lg mx-auto">
              Achetez des crédits, utilisez-les pour produire et publier vos contenus sur toutes les plateformes.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 sm:p-8">
              {/* Crédits + Promo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-empire/10 border border-empire/20 flex items-center justify-center">
                  <Coins size={18} className="text-empire" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Système de crédits</p>
                  <p className="text-xs text-neutral-500">Chaque contenu produit consomme des crédits — publiez autant que vous le souhaitez</p>
                </div>
              </div>

              <PromoCode />

              <div className="h-px bg-white/10 my-6" />

              {/* Inclus */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-empire/10 border border-empire/20 flex items-center justify-center">
                  <Users size={18} className="text-empire" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">100% vérifié par des humains</p>
                  <p className="text-xs text-neutral-500">Zéro robot, zéro approximation.</p>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {[
                  'Découpage intelligent de vos interviews',
                  'Montage pro de vos Reels & Shorts',
                  'Rédaction de vos posts LinkedIn',
                  'Rédaction de vos newsletters',
                  'Multiplication sur tous les réseaux',
                  'Hooks travaillés pour chaque contenu',
                  'Orthographe et style corrigés',
                  'Stratégie optimisée pour chaque plateforme',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-neutral-300">
                    <Check size={14} className="text-empire shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="h-px bg-white/10 mb-6" />

              {/* CTA */}
              <div className="text-center">
                <div className="inline-flex items-center justify-between p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-5 w-full max-w-sm">
                  <div className="text-left">
                    <p className="text-xs text-neutral-500">Vs. recruter en interne</p>
                    <p className="text-sm font-bold text-white">Vous économisez</p>
                  </div>
                  <p className="text-2xl font-extrabold text-empire">+9 800€<span className="text-sm font-medium text-neutral-400">/mois</span></p>
                </div>

                <div>
                  <a
                    href={ONBOARDING_URL}
                    className="w-full sm:w-auto px-10 py-4 rounded-xl bg-empire text-black font-bold text-base hover:brightness-110 transition-all inline-flex items-center justify-center gap-2 shadow-[0_0_40px_-8px_rgb(var(--empire-rgb)_/_0.5)]"
                  >
                    Recruter mon équipe
                    <ArrowRight size={18} />
                  </a>
                  <p className="text-xs text-neutral-500 mt-3">
                    Sans engagement · Accès immédiat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <div className="border-t border-white/5 py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-neutral-500">
              © 2026 Empire Internet
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <a href="/" className="hover:text-white transition-colors">Accueil</a>
              <a href="/terms" className="hover:text-white transition-colors">CGV</a>
              <a href="/privacy" className="hover:text-white transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
