import Script from 'next/script'
import YoutubeAdForm, { MobileStickyBookCTA } from '@/components/YoutubeAdForm'

export const metadata = {
  title: 'Découvrir Empire Internet — Appel Stratégique Gratuit',
  description: '30 min pour voir si notre système de contenu s\'adapte à toi. Gratuit, sans engagement.',
  robots: 'noindex, nofollow',
}

const bullets = [
  'Zéro rédaction, zéro montage de ta part',
  'Publié sur Instagram, LinkedIn, TikTok, YouTube, X, Threads',
  '10M+ vues générées pour nos clients ce mois',
]


const KEVIN_IMG = 'https://media.licdn.com/dms/image/v2/D4E03AQG4nlTt-7wB9w/profile-displayphoto-crop_800_800/B4EZi8WwoyHEAI-/0/1755506740516?e=1775692800&v=beta&t=3Oq_HdQ6GKMFVN6CwQCbvB2Qh7VWo1ls1KIroOyhPYY'
const MARC_IMG = 'https://media.licdn.com/dms/image/v2/D4E03AQF43VvOp7iRkw/profile-displayphoto-scale_400_400/B4EZzc5.uqHAAg-/0/1773232713405?e=1775692800&v=beta&t=Z4CykW-joMs63r3xGQHIdOaqpNtjtC7jQdcL5HSHJNs'

export default function DecouvertePage() {
  return (
    <>
      {/* Senja script — load async */}
      <Script
        src="https://widget.senja.io/widget/dbb797c0-9c9f-491d-8b35-7bb197153711/platform.js"
        strategy="lazyOnload"
      />

      <main className="min-h-screen bg-black text-white overflow-x-hidden">

        {/* Background gradients */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_-10%,rgba(218,252,104,0.1),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_90%_80%,rgba(218,252,104,0.03),transparent)]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">

          {/* ── Logo bar ──────────────────────────────────────── */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
            <a href="/" className="text-white font-bold text-base tracking-tight hover:text-empire transition-colors">
              Empire Internet
            </a>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
              Appel gratuit disponible
            </div>
          </div>

          {/* ── HERO ─────────────────────────────────────────── */}
          <section className="px-4 sm:px-6 pt-8 pb-6 max-w-5xl mx-auto w-full">

            {/* Desktop 2-col / Mobile single col reversed (form first) */}
            <div className="grid md:grid-cols-[1fr_420px] gap-8 md:gap-12 items-start">

              {/* ── Left pitch — hidden on mobile, shown on desktop ── */}
              <div className="hidden md:block">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-empire/10 border border-empire/30 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
                  <span className="text-xs font-bold text-empire tracking-widest uppercase">Comme dans la vidéo →</span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                  Arrête d'écrire<br />
                  du contenu.<br />
                  <span className="text-empire">Parle 15 min.<br />On publie partout.</span>
                </h1>

                <p className="text-neutral-400 text-lg leading-relaxed mb-7">
                  Une interview par semaine → 30+ posts, reels, vidéos, newsletters. Sur 6 réseaux.{' '}
                  <span className="text-white font-semibold">Sans que tu écrives une seule ligne.</span>
                </p>

                <div className="space-y-2.5 mb-8">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-empire/15 border border-empire/30 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                          <path d="M1 5l3 3 7-7" stroke="#dafc68" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-neutral-300 text-sm">{b}</span>
                    </div>
                  ))}
                </div>

                {/* Founders */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/8">
                  <div className="flex -space-x-3">
                    <img src={KEVIN_IMG} alt="Kevin" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-black object-cover" />
                    <img src={MARC_IMG} alt="Marc" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-black object-cover" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Kevin & Marc Dufraisse</p>
                    <p className="text-neutral-500 text-xs">Fondateurs · Empire Internet</p>
                  </div>
                </div>
              </div>

              {/* ── Right : Form (sticky desktop, top on mobile) ── */}
              <div>
                {/* Mobile-only hero pitch above form */}
                <div className="md:hidden mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-empire/10 border border-empire/30 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
                    <span className="text-xs font-bold text-empire tracking-widest uppercase">Comme dans la vidéo →</span>
                  </div>
                  <h1 className="text-3xl font-extrabold leading-tight mb-3">
                    Tu parles 15 min.<br />
                    <span className="text-empire">On publie partout.</span>
                  </h1>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    30+ posts, reels, vidéos sur 6 réseaux — sans que tu écrives une seule ligne.
                  </p>
                </div>

                {/* Form card */}
                <div className="md:sticky md:top-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 shadow-[0_0_60px_rgba(218,252,104,0.07)]">
                    <div className="mb-5">
                      <h2 className="text-lg font-bold text-white">Réserve ton appel gratuit</h2>
                      <p className="text-neutral-500 text-sm mt-0.5">30 min · En visio · Avec Kevin ou Marc</p>
                    </div>
                    <YoutubeAdForm />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Testimonials — Senja ─────────────────────────── */}
          <section className="px-4 sm:px-6 py-10 max-w-5xl mx-auto w-full">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold text-center mb-6">Ce qu'en disent ceux qui sont passés par là</p>
            <div
              className="senja-embed"
              data-id="dbb797c0-9c9f-491d-8b35-7bb197153711"
              data-mode="shadow"
              data-lazyload="false"
              style={{ display: 'block', width: '100%' }}
            />
          </section>

          {/* ── Mobile-only founders ─────────────────────────── */}
          <section className="md:hidden px-4 pb-10 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/8">
              <div className="flex -space-x-3">
                <img src={KEVIN_IMG} alt="Kevin" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-black object-cover" />
                <img src={MARC_IMG} alt="Marc" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-black object-cover" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Kevin & Marc Dufraisse</p>
                <p className="text-neutral-500 text-xs">Fondateurs · Empire Internet</p>
              </div>
            </div>
          </section>

          {/* ── Footer ───────────────────────────────────────── */}
          <div className="border-t border-white/5 py-5 text-center mt-auto pb-24 md:pb-5">
            <p className="text-xs text-neutral-700">
              © 2026 Empire Internet ·{' '}
              <a href="/" className="hover:text-neutral-500 transition-colors">Retour au site</a>
            </p>
          </div>

        </div>

        {/* Sticky mobile CTA (appears when form scrolls out of view) */}
        <MobileStickyBookCTA />

      </main>
    </>
  )
}
