'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Play, Check, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import EmpireSalesCta from '@/components/EmpireSalesCta'
import WorkshopInvitation from '@/components/WorkshopInvitation'
import { trackAmplitude } from '@/lib/amplitude'

const DEMO_LOOM_ID = '00bc46ef533b4243ad108ed7549047be'
const ACCESS_KEY = 'empire_demo_access_v1'

export default function DemoPage() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<'email' | 'unavailable' | null>(null)

  useEffect(() => {
    try { setUnlocked(localStorage.getItem(ACCESS_KEY) === '1') } catch {}
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setError(null)
    try {
      const response = await fetch('/api/demo-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), company, locale: lang }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        setError(result.code === 'invalid_email' ? 'email' : 'unavailable')
        return
      }
      // A workshop registration alone must not unlock or count as a demo request.
      try { localStorage.setItem(ACCESS_KEY, '1') } catch {}
      setUnlocked(true)
      trackAmplitude('empire_demo_unlocked', { source: 'demo_page' })
    } catch {
      setError('unavailable')
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black px-4 pb-20 pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_20%,rgb(var(--empire-rgb)_/_0.1),transparent)]" />
      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-4 text-sm font-semibold text-empire">{fr ? 'La démo d’Empire · présentée par Kevin' : 'The Empire demo · presented by Kevin'}</p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {fr ? 'Vois comment Empire transforme tes idées en contenus.' : 'See how Empire turns your ideas into content.'}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-300 md:text-lg">
            {fr ? 'Découvre l’outil en vidéo, à ton rythme : création, montage et publication. La démo est en français.' : 'Explore the product at your own pace: creation, editing and publishing. The demo is in French.'}
          </p>
        </div>

        {unlocked ? (
          <section aria-label={fr ? 'Vidéo de démonstration' : 'Demo video'}>
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black" style={{ paddingTop: '75%' }}>
              <iframe
                src={`https://www.loom.com/embed/${DEMO_LOOM_ID}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`}
                title={fr ? 'Démo complète d’Empire par Kevin' : 'Full Empire demo by Kevin (French)'}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-center text-sm text-neutral-400">
              {fr ? 'Un souci avec le lecteur ? ' : 'Having trouble with the player? '}
              <a href={`https://www.loom.com/share/${DEMO_LOOM_ID}`} target="_blank" rel="noopener noreferrer" className="text-empire underline underline-offset-4">
                {fr ? 'Ouvrir la démo sur Loom' : 'Open the demo on Loom'}
              </a>
            </p>
            <div className="mt-10 rounded-2xl border border-empire/20 bg-empire/[0.04] px-4 py-7 sm:px-7">
              <h2 className="mb-2 text-center text-2xl font-bold text-white">{fr ? 'À toi de créer ton premier contenu.' : 'Your turn to create your first piece of content.'}</h2>
              <p className="mb-5 text-center text-neutral-300">{fr ? 'Crée ton compte et essaie Empire avec tes propres idées.' : 'Create your account and try Empire with your own ideas.'}</p>
              <EmpireSalesCta source="demo_video" showDemo={false} />
            </div>
            <WorkshopInvitation source="demo" />
          </section>
        ) : (
          <section className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/[0.05] p-6 sm:p-8" aria-labelledby="demo-access-title">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-empire/15 text-empire"><Play size={25} aria-hidden /></div>
            <h2 id="demo-access-title" className="text-center text-2xl font-bold text-white">{fr ? 'Accède à la démo gratuitement' : 'Get free access to the demo'}</h2>
            <p className="mb-6 mt-2 text-center text-neutral-300">{fr ? 'Entre ton email pour regarder la vidéo ici, immédiatement.' : 'Enter your email to watch the video here, right away.'}</p>
            <form onSubmit={submit} className="space-y-4" aria-busy={sending}>
              <div>
                <label htmlFor="demo-email" className="mb-2 block text-sm font-medium text-white">{fr ? 'Ton email' : 'Your email'}</label>
                <input id="demo-email" type="email" name="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} disabled={sending} aria-describedby={error ? 'demo-error' : undefined} className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3.5 text-white outline-none focus:border-empire focus:ring-1 focus:ring-empire disabled:opacity-60" placeholder="toi@entreprise.fr" />
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="demo-company">Company</label>
                <input id="demo-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={event => setCompany(event.target.value)} />
              </div>
              {error && <p id="demo-error" role="alert" className="text-sm text-red-300">{error === 'email' ? (fr ? 'Vérifie ton adresse email puis réessaie.' : 'Check your email address and try again.') : (fr ? 'Ton email n’a pas pu être enregistré. Réessaie dans un instant.' : 'We could not save your email. Please try again in a moment.')}</p>}
              <button type="submit" disabled={sending} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-empire px-5 py-3.5 font-bold text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
                {sending ? (fr ? 'Enregistrement…' : 'Saving…') : (fr ? 'Voir la démo' : 'Watch the demo')} {!sending && <ArrowRight size={18} aria-hidden />}
              </button>
              <p className="text-center text-xs leading-relaxed text-neutral-400">
                {fr ? 'Ton email sert au suivi de ta demande de démo. ' : 'Your email is used to follow up on your demo request. '}
                <a href="/privacy" className="underline underline-offset-2">{fr ? 'Confidentialité' : 'Privacy'}</a>
              </p>
            </form>
            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-neutral-400">
              {[fr ? 'Accès immédiat' : 'Instant access', fr ? 'Sans rendez-vous' : 'No appointment', fr ? 'Sans carte bancaire' : 'No credit card'].map(item => <span key={item} className="inline-flex items-center gap-1.5"><Check size={14} className="text-empire" aria-hidden />{item}</span>)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
