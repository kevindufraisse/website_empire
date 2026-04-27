import AcademyApplicationForm from '@/components/AcademyApplicationForm'
import CandidatureBadge from '@/components/CandidatureBadge'
import Link from 'next/link'
import { COHORT_START_TEXT } from '@/lib/cohort-config'

export const metadata = {
  title: 'Candidature - Empire Academy',
  description: 'Vérifiez si vous êtes éligible à Empire Academy. 21 jours pour maîtriser la viralité. Formulaire de 2 min.',
}

const founders = [
  { name: 'Kevin Dufraisse', img: '/founders/kevin.png' },
  { name: 'Marc Dufraisse', img: '/founders/marc.jpg' },
]

export default function CandidaturePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(252, 165, 165,0.10),transparent)]" />

      <div className="relative z-10 container py-16 md:py-24">
        {/* Back link */}
        <div className="mb-10">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
          >
            ← Retour à Empire Academy
          </Link>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.1fr] gap-12 items-start">

          {/* Left - context */}
          <div className="md:sticky md:top-24">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-academy flex items-center justify-center">
                <span className="text-black font-black text-sm">EA</span>
              </div>
              <span className="text-white font-bold text-sm">Empire Academy</span>
            </div>

            <CandidatureBadge />

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              Candidature Empire Academy.{' '}
              <span className="text-academy">2 minutes.</span>
            </h1>
            <p className="text-neutral-400 text-base leading-relaxed mb-8">
              Empire Academy n'est pas pour tout le monde - c'est voulu.
              21 jours intensifs pour maîtriser la viralité, avec du contenu produit pour toi pendant le bootcamp.
              On sélectionne les profils qui s'impliquent vraiment.
            </p>

            {/* What happens */}
            <div className="space-y-4 mb-8">
              {[
                { num: '01', text: 'Vous remplissez le formulaire', sub: 'Environ 2 minutes.' },
                { num: '02', text: 'On analyse votre profil', sub: 'Sous 24h ouvrées.' },
                { num: '03', text: 'On vous répond', sub: 'Admis ou pas - honnêtement.' },
                { num: '04', text: 'Vous rejoignez la promo', sub: COHORT_START_TEXT },
              ].map(s => (
                <div key={s.num} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-academy/10 border border-academy/30 flex items-center justify-center flex-shrink-0 text-xs font-black text-academy">
                    {s.num}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{s.text}</p>
                    <p className="text-neutral-400 text-xs">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Founders */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.08] border border-white/15">
              <div className="flex -space-x-2">
                {founders.map(f => (
                  <img
                    key={f.name}
                    src={f.img}
                    alt={f.name}
                    className="w-9 h-9 rounded-full border-2 border-[#0a0a0a] object-cover"
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Kevin & Marc lisent chaque candidature{' '}
                <span className="text-white font-semibold">personnellement.</span>
              </p>
            </div>
          </div>

          {/* Right - form */}
          <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-academy/30 rounded-3xl p-8 shadow-[0_0_60px_-20px_rgba(252, 165, 165,0.35)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-academy to-transparent" />
            <AcademyApplicationForm />
          </div>

        </div>
      </div>
    </main>
  )
}
