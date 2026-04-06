import Script from 'next/script'
import YtLeadForm from '@/components/YtLeadForm'
import ClientResultsTicker from '@/components/ClientResultsTicker'

export const metadata = {
  title: 'Réserver un appel - Empire Internet',
  description: "45 min pour voir si notre système de contenu s'adapte à votre activité. Gratuit, sans engagement.",
}

const platforms = [
  { name: 'Instagram', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { name: 'LinkedIn', svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { name: 'TikTok', svg: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z' },
  { name: 'YouTube', svg: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { name: 'X', svg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'Threads', svg: 'M141.537 88.988c-.893-.452-1.804-.875-2.732-1.27-1.56-27.306-16.398-42.94-41.457-43.1h-.165c-14.985 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.077c8.25.053 14.474 2.452 18.503 7.129 2.933 3.405 4.893 8.11 5.865 14.05-7.314-1.243-15.224-1.625-23.68-1.14-23.82 1.372-39.134 15.264-38.105 34.568.519 9.792 5.397 18.216 13.733 23.719 7.047 4.652 16.123 6.927 25.557 6.412 12.457-.683 22.23-5.437 29.048-14.127 5.178-6.601 8.452-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.547 38.375-11.318 11.309-24.924 16.2-45.587 16.352-22.81-.17-40.06-7.484-51.275-21.742C20.168 139.965 14.74 120.681 14.537 96c.203-24.681 5.631-43.965 16.136-57.314C41.929 24.425 59.179 17.11 81.988 16.94c22.975.17 40.526 7.521 52.171 21.847 5.71 7.025 10.016 15.861 12.853 26.162l17.147-4.308c-3.44-12.7-8.853-23.626-16.22-32.687C133.036 9.641 111.202.196 82.07 0H81.942C52.867.19 31.277 9.642 16.773 28.08 3.867 44.487-2.79 67.316-3.007 95.932L-3 96l-0.007.068c.217 28.616 6.874 51.445 19.78 67.852C31.277 182.358 52.867 191.81 81.942 192h1.112c26.96-.173 44.555-6.708 59.05-21.19C161.08 151.866 160.51 128.12 154.26 113.54c-4.484-10.454-13.033-18.945-24.724-24.553zM98.44 129.507c-10.44.588-21.286-4.098-21.821-14.135-.464-7.441 5.229-15.745 22.394-16.735 1.966-.113 3.895-.168 5.79-.168 6.235 0 12.068.606 17.371 1.766-1.978 24.702-13.58 28.713-23.734 29.272z', viewBox: '0 0 192 192' },
]

const KEVIN_IMG = 'https://media.licdn.com/dms/image/v2/D4E03AQG4nlTt-7wB9w/profile-displayphoto-crop_800_800/B4EZi8WwoyHEAI-/0/1755506740516?e=1775692800&v=beta&t=3Oq_HdQ6GKMFVN6CwQCbvB2Qh7VWo1ls1KIroOyhPYY'

const AVATARS = [
  'https://i.pravatar.cc/48?img=11',
  'https://i.pravatar.cc/48?img=22',
  'https://i.pravatar.cc/48?img=33',
  'https://i.pravatar.cc/48?img=44',
  'https://i.pravatar.cc/48?img=55',
]

export default function DecouvertePage() {
  return (
    <>
      <Script
        src="https://widget.senja.io/widget/a7bf7e4a-0f3b-4751-8190-849f83d16306/platform.js"
        strategy="lazyOnload"
      />

      <main className="min-h-screen bg-black text-white overflow-x-hidden">

        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_-10%,rgba(218,252,104,0.08),transparent)]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">

          {/* Logo bar */}
          <div className="border-b border-white/5">
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full px-4 sm:px-6 py-4">
            <a href="/" className="text-white font-bold text-base tracking-tight hover:text-empire transition-colors">
              Empire Internet
            </a>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-empire animate-pulse" />
              Appel gratuit disponible
            </div>
          </div>
          </div>

          {/* ── Main 2-col layout ── */}
          <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* ── Left : Pitch ── */}
            <div className="lg:sticky lg:top-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Faites des millions de vues<br />
                et attirez des clients -{' '}
                <span className="text-empire">sans écrire<br className="hidden sm:block" />ni monter votre contenu.</span>
              </h1>

              <p className="text-neutral-400 text-base mb-3">
                Une interview de 15 min par semaine → 30+ posts, reels, vidéos, newsletters.
              </p>

              {/* Platform logos */}
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="text-[11px] text-neutral-600">Publié sur</span>
                {platforms.map((p) => (
                  <div
                    key={p.name}
                    title={p.name}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-empire/30 transition-all"
                  >
                    <svg viewBox={p.viewBox ?? '0 0 24 24'} fill="currentColor" className="w-4 h-4 text-neutral-400">
                      <path d={p.svg} />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Animated results ticker */}
              <div className="mb-6">
                <ClientResultsTicker />
              </div>

              {/* Creator credit */}
              <div className="flex items-center gap-2.5">
                <img src={KEVIN_IMG} alt="Kevin Dufraisse" width={32} height={32} className="w-8 h-8 rounded-full border border-white/15 object-cover" />
                <p className="text-neutral-500 text-xs">
                  Créé par <span className="text-white font-semibold">Kevin Dufraisse</span> · Top 48 LinkedIn France
                </p>
              </div>
            </div>

            {/* ── Right : Form → Cal.com ── */}
            <div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                <h2 className="text-lg font-bold text-white mb-5">Réservez votre appel gratuit</h2>
                <YtLeadForm eventName="organic_lead_form" />
              </div>

              {/* Social proof below form */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="flex -space-x-2">
                  {AVATARS.map((url, i) => (
                    <img key={i} src={url} alt="" width={24} height={24} className="w-6 h-6 rounded-full border-2 border-black object-cover" />
                  ))}
                </div>
                <p className="text-xs text-neutral-500">+100 entrepreneurs accompagnés</p>
              </div>
            </div>
          </div>

          {/* ── Senja ── */}
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pb-12">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold text-center mb-6">
              Ce qu'en disent ceux qui sont passés par là
            </p>
            <div
              className="senja-embed"
              data-id="a7bf7e4a-0f3b-4751-8190-849f83d16306"
              data-mode="shadow"
              data-lazyload="false"
              style={{ display: 'block', width: '100%' }}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 py-5 text-center">
            <p className="text-xs text-neutral-700">
              © 2026 Empire Internet ·{' '}
              <a href="/" className="hover:text-neutral-500 transition-colors">Retour au site</a>
            </p>
          </div>

        </div>
      </main>
    </>
  )
}
