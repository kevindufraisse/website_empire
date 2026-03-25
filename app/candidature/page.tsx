import AcademyApplicationForm from '@/components/AcademyApplicationForm'
import RetroGrid from '@/components/magicui/retro-grid'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Test d\'éligibilité — Bootcamp Empire Internet',
  description: 'Vérifie si tu es éligible au bootcamp Head of Viralité. Formulaire de 2 min. Réponse sous 24h.',
}

const founders = [
  {
    name: 'Kevin Dufraisse',
    img: 'https://media.licdn.com/dms/image/v2/D4E03AQG4nlTt-7wB9w/profile-displayphoto-crop_800_800/B4EZi8WwoyHEAI-/0/1755506740516?e=1775692800&v=beta&t=3Oq_HdQ6GKMFVN6CwQCbvB2Qh7VWo1ls1KIroOyhPYY',
  },
  {
    name: 'Marc Dufraisse',
    img: 'https://media.licdn.com/dms/image/v2/D4E03AQF43VvOp7iRkw/profile-displayphoto-scale_400_400/B4EZzc5.uqHAAg-/0/1773232713405?e=1775692800&v=beta&t=Z4CykW-joMs63r3xGQHIdOaqpNtjtC7jQdcL5HSHJNs',
  },
]

export default function CandidaturePage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      <RetroGrid />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(218,252,104,0.08),transparent)]" />

      <div className="relative z-10 container py-16 md:py-24">
        {/* Back link */}
        <div className="mb-10">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Retour au bootcamp
          </Link>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.1fr] gap-12 items-start">

          {/* Left — context */}
          <div className="md:sticky md:top-24">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-empire flex items-center justify-center">
                <span className="text-black font-black text-sm">EI</span>
              </div>
              <span className="text-white font-bold text-sm">Empire Internet</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-empire/10 border border-empire/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-empire animate-pulse" />
              <span className="text-xs font-bold text-empire tracking-widest uppercase">Sur sélection · 17 places restantes</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              Test d'éligibilité.{' '}
              <span className="text-empire">2 minutes.</span>
            </h1>
            <p className="text-neutral-400 text-base leading-relaxed mb-8">
              Ce bootcamp n'est pas pour tout le monde — c'est voulu.
              On accepte uniquement des profils qui s'impliquent vraiment.
              Ce formulaire nous aide à trouver les bons.
            </p>

            {/* What happens */}
            <div className="space-y-4 mb-8">
              {[
                { num: '01', text: 'Tu remplis le formulaire', sub: 'Environ 2 minutes.' },
                { num: '02', text: 'On analyse ton profil', sub: 'Sous 24h ouvrées.' },
                { num: '03', text: 'On te répond', sub: 'Admis ou pas — honnêtement.' },
                { num: '04', text: 'Tu rejoins la promo', sub: 'Démarrage le 25 avril.' },
              ].map(s => (
                <div key={s.num} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-empire/10 border border-empire/30 flex items-center justify-center flex-shrink-0 text-xs font-black text-empire">
                    {s.num}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{s.text}</p>
                    <p className="text-neutral-600 text-xs">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Founders */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex -space-x-2">
                {founders.map(f => (
                  <Image
                    key={f.name}
                    src={f.img}
                    alt={f.name}
                    width={36}
                    height={36}
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

          {/* Right — form */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
            <AcademyApplicationForm />
          </div>

        </div>
      </div>
    </main>
  )
}
