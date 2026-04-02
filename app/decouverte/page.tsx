import YoutubeAdForm from '@/components/YoutubeAdForm'

export const metadata = {
  title: 'Découvrir Empire Internet — Appel Stratégique Gratuit',
  description: 'Réserve ton appel de 30 min avec Empire Internet. On t\'explique comment générer 10M+ vues/mois depuis une interview de 15 min.',
  robots: 'noindex',
}

const stats = [
  { value: '10M+', label: 'vues/mois générées' },
  { value: '200+', label: 'entrepreneurs accompagnés' },
  { value: '15 min', label: 'par semaine suffisent' },
]

const steps = [
  { num: '01', title: 'On parle 30 min', desc: 'Tu nous parles de ton activité. On analyse si notre système s\'adapte à toi.' },
  { num: '02', title: 'On te montre le plan', desc: 'Comment on transformerait ton expertise en contenu viral sur chaque réseau.' },
  { num: '03', title: 'Tu décides', desc: 'Aucune pression. Si ça te parle, on avance. Sinon, l\'appel est quand même utile.' },
]

export default function DecouvertePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(218,252,104,0.08),transparent)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(218,252,104,0.03),transparent)] pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* ── Minimal logo bar ───────────────────────────── */}
        <div className="flex items-center justify-center py-5 border-b border-white/5">
          <a href="/" className="text-white font-bold text-lg tracking-tight hover:text-empire transition-colors">
            Empire Internet
          </a>
        </div>

        {/* ── Main layout ─────────────────────────────────── */}
        <div className="flex-1 container max-w-5xl mx-auto px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">

            {/* ── Left : Pitch ──────────────────────────────── */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-empire/10 border border-empire/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
                <span className="text-xs font-bold text-empire tracking-widest uppercase">Comme dans la vidéo →</span>
              </div>

              {/* H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                10M+ vues/mois.{' '}
                <span className="text-empire">Depuis 15 min/semaine.</span>
              </h1>

              <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-8">
                Tu parles. On crée — posts, reels, newsletters, vidéos — et on publie partout.{' '}
                <span className="text-white font-semibold">Ton expertise transformée en machine à contenu, sans que tu t'en occupes.</span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {stats.map((s, i) => (
                  <div key={i} className="flex flex-col items-center py-3 px-2 rounded-xl bg-white/5 border border-white/8 text-center">
                    <span className="text-lg md:text-xl font-black text-empire">{s.value}</span>
                    <span className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* What happens */}
              <div className="space-y-4 mb-8 hidden md:block">
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Ce qui se passe lors de l'appel</p>
                {steps.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black bg-empire/10 border border-empire/30 text-empire">
                      {s.num}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm leading-tight">{s.title}</p>
                      <p className="text-neutral-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Founders */}
              <div className="hidden md:flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/8">
                <div className="flex -space-x-3">
                  <img
                    src="https://media.licdn.com/dms/image/v2/D4E03AQG4nlTt-7wB9w/profile-displayphoto-crop_800_800/B4EZi8WwoyHEAI-/0/1755506740516?e=1775692800&v=beta&t=3Oq_HdQ6GKMFVN6CwQCbvB2Qh7VWo1ls1KIroOyhPYY"
                    alt="Kevin"
                    className="w-10 h-10 rounded-full border-2 border-black object-cover"
                  />
                  <img
                    src="https://media.licdn.com/dms/image/v2/D4E03AQF43VvOp7iRkw/profile-displayphoto-scale_400_400/B4EZzc5.uqHAAg-/0/1773232713405?e=1775692800&v=beta&t=Z4CykW-joMs63r3xGQHIdOaqpNtjtC7jQdcL5HSHJNs"
                    alt="Marc"
                    className="w-10 h-10 rounded-full border-2 border-black object-cover"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Kevin & Marc Dufraisse</p>
                  <p className="text-neutral-500 text-xs">Fondateurs · Empire Internet</p>
                </div>
              </div>
            </div>

            {/* ── Right : Form / Booking ─────────────────────── */}
            <div>
              <div className="sticky top-8">
                <div className="p-6 md:p-8 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_60px_rgba(218,252,104,0.06)]">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">
                      Réserve ton appel gratuit
                    </h2>
                    <p className="text-neutral-500 text-sm">
                      30 min · En visio · Avec Kevin ou Marc
                    </p>
                  </div>
                  <YoutubeAdForm />
                </div>
              </div>
            </div>

          </div>

          {/* ── Mobile steps ─── shown below form on mobile ── */}
          <div className="md:hidden mt-10 space-y-4">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold text-center">Ce qui se passe lors de l'appel</p>
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black bg-empire/10 border border-empire/30 text-empire">
                  {s.num}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{s.title}</p>
                  <p className="text-neutral-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer minimal ─────────────────────────────── */}
        <div className="border-t border-white/5 py-5 text-center">
          <p className="text-xs text-neutral-700">© 2026 Empire Internet · <a href="/" className="hover:text-neutral-500 transition-colors">Retour au site</a></p>
        </div>

      </div>
    </main>
  )
}
