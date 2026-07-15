'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Loader2, Clock, ArrowRight, Shield, Zap, Users, Brain, Video, Mic } from 'lucide-react'
import { trackAmplitude, getAmplitudeDeviceId } from '@/lib/amplitude'
import { FLASH_PROMO_ID, fetchFlashPromo, getBrowserFingerprint, formatCountdown } from '@/lib/flash-promo'

const PROMO_PRICE = 499
const BASE_PRICE = 799
const PLAN = 'scale'
const BILLING = 'monthly'

const WHATS_INCLUDED = [
  { icon: Mic, text: '15 min/semaine d\u2019enregistrement \u2192 contenu sur 7 r\u00e9seaux' },
  { icon: Video, text: 'Posts LinkedIn, reels, newsletters, YouTube, carrousels \u2014 mont\u00e9s et r\u00e9dig\u00e9s pour toi' },
  { icon: Users, text: 'Session d\u2019onboarding priv\u00e9e en live avec l\u2019\u00e9quipe' },
  { icon: Brain, text: 'Cerveau Empire \u2014 IA qui conna\u00eet ton business et trouve les sujets viraux' },
  { icon: Zap, text: 'Bootcamps Viralit\u00e9 offerts \u2014 tous les r\u00e9seaux couverts' },
  { icon: Shield, text: '\u00c9quipe humaine d\u00e9di\u00e9e \u2014 relecture, corrections, publication' },
]

const TIMELINE = [
  { day: 'Jour 1', text: 'Onboarding priv\u00e9. On cale ton positionnement, ta cible, ton angle.' },
  { day: 'Jour 2', text: 'Tes sujets sont trouv\u00e9s. Notre syst\u00e8me analyse ta niche.' },
  { day: 'Jour 3\u20135', text: 'Tu enregistres 15 min. On \u00e9crit, on monte, on adapte \u00e0 7 r\u00e9seaux.' },
  { day: 'Jour 7', text: 'Tes premiers contenus sont en ligne.' },
]

export default function FinalOfferClient() {
  const [loading, setLoading] = useState(false)
  const [promoLeft, setPromoLeft] = useState<string | null>(null)
  const [promoDeadline, setPromoDeadline] = useState<number | null>(null)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    fetchFlashPromo().then((status) => {
      if (!status || status.expired) return
      setPromoDeadline(new Date(status.deadline).getTime())
    })
  }, [])

  useEffect(() => {
    if (!promoDeadline) return
    const tick = () => {
      const remaining = promoDeadline - Date.now()
      if (remaining <= 0) { setPromoLeft(null); return }
      setPromoLeft(formatCountdown(remaining))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [promoDeadline])

  const handleCheckout = async () => {
    if (loading) return
    setLoading(true)
    trackAmplitude('final_offer_checkout_click', { price: PROMO_PRICE, plan: PLAN })

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: PLAN,
          billing: BILLING,
          lang: 'fr',
          coaching: false,
          ampDeviceId: getAmplitudeDeviceId(),
          promoId: FLASH_PROMO_ID,
          fingerprint: getBrowserFingerprint(),
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
    } catch {
      // fallback
    }
    setLoading(false)
    window.location.href = `https://app.empire-internet.com/onboarding?plan=${PLAN}&billing=${BILLING}&intent=trial`
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">
            Offre exclusive &mdash; participants du live
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Empire Internet au tarif que tu ne reverras pas
          </h1>

          <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            12 000 cr&eacute;dits/mois &middot; ~177 contenus produits pour toi &middot; Posts, reels, newsletters, YouTube, carrousels sur 7 r&eacute;seaux &middot; &eacute;quipe humaine d&eacute;di&eacute;e.
          </p>

          {/* Price card */}
          <div className="relative mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="text-2xl text-neutral-600 line-through tabular-nums">{BASE_PRICE}&euro;</span>
              <span className="text-5xl font-extrabold tabular-nums">{PROMO_PRICE}&euro;</span>
              <span className="text-base text-neutral-400">/mois</span>
            </div>
            <p className="text-sm text-neutral-500 mb-1">&agrave; vie &mdash; ton tarif ne changera jamais</p>

            {promoLeft && (
              <div className="flex items-center justify-center gap-2 mt-4 mb-5">
                <Clock size={14} className="text-red-400" />
                <span className="text-sm text-red-400 font-semibold">
                  Expire dans <span className="font-mono tabular-nums">{promoLeft}</span>
                </span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-empire px-6 py-4 text-base font-bold text-black transition-all hover:brightness-110 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Activer mon compte Empire
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="mt-3 text-xs text-neutral-500">
              7 jours d&rsquo;essai gratuit &middot; Annulez en 1 clic &middot; Paiement s&eacute;curis&eacute; par Stripe
            </p>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 border-t border-white/5">
        <div className="container max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-8 text-center">Ce que tu obtiens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHATS_INCLUDED.map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <item.icon size={18} className="mt-0.5 shrink-0 text-empire" />
                <p className="text-sm text-neutral-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 border-t border-white/5">
        <div className="container max-w-xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-8 text-center">Ce qui se passe apr&egrave;s ton inscription</h2>
          <div className="space-y-6">
            {TIMELINE.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-empire/15 text-xs font-bold text-empire">
                    {i + 1}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="mt-1 w-px flex-1 bg-white/10" />}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-bold text-white">{step.day}</p>
                  <p className="text-sm text-neutral-400 mt-0.5">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objections */}
      <section className="py-16 border-t border-white/5">
        <div className="container max-w-xl mx-auto px-4 space-y-6">
          {[
            { q: 'C\u2019est trop cher.', a: 'Un ghostwriter LinkedIn seul co\u00fbte plus cher chaque mois \u2014 et il ne couvre ni tes newsletters ni tes 6 autres r\u00e9seaux. Paiement en plusieurs fois possible.' },
            { q: '\u00c7a va sonner comme un robot ?', a: 'Non. Le contenu part de TA voix : tu enregistres 15 min, nos \u00e9quipes \u00e9crivent et montent \u00e0 partir de tes mots. Tu valides avant publication.' },
            { q: 'Je n\u2019ai pas le temps.', a: '15 min d\u2019enregistrement par semaine. Tout le reste \u2014 \u00e9criture, montage, newsletters, publication sur 7 r\u00e9seaux \u2014 c\u2019est nous.' },
            { q: '\u00c7a marchera dans ma niche ?', a: 'On a des clients du coaching au conseil en passant par l\u2019e-commerce. Si tu as une expertise et un produit, on produit ton contenu.' },
          ].map((faq) => (
            <div key={faq.q} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-bold text-white mb-1">&laquo; {faq.q} &raquo;</p>
              <p className="text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="container max-w-md mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex -space-x-2">
              <img src="/founders/kevin.jpg" alt="Kevin" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
              <img src="/founders/marc.jpg" alt="Marc" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
            </div>
            <p className="text-sm text-neutral-400">Kevin & Marc Dufraisse</p>
          </div>
          <p className="text-lg font-semibold text-white mb-2">
            Ce syst&egrave;me &eacute;tait r&eacute;serv&eacute; &agrave; des entrepreneurs qui pouvaient payer 1 000&euro; sans r&eacute;fl&eacute;chir.
          </p>
          <p className="text-neutral-400 text-sm mb-8">
            C&rsquo;est la premi&egrave;re fois qu&rsquo;il est accessible &agrave; ce prix.
          </p>

          <div className="flex items-baseline justify-center gap-3 mb-4">
            <span className="text-xl text-neutral-600 line-through tabular-nums">{BASE_PRICE}&euro;</span>
            <span className="text-4xl font-extrabold tabular-nums">{PROMO_PRICE}&euro;</span>
            <span className="text-sm text-neutral-400">/mois &agrave; vie</span>
          </div>

          {promoLeft && (
            <p className="text-sm text-red-400 font-semibold mb-6">
              <Clock size={14} className="inline mr-1.5 -mt-0.5" />
              Expire dans <span className="font-mono tabular-nums">{promoLeft}</span>
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-empire px-6 py-4 text-base font-bold text-black transition-all hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Activer mon compte Empire
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="mt-3 text-xs text-neutral-500">
            7 jours d&rsquo;essai gratuit &middot; Annulez en 1 clic
          </p>
        </div>
      </section>
    </main>
  )
}
