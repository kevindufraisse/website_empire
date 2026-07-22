'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Loader2, Clock, ArrowRight, X } from 'lucide-react'
import { trackAmplitude, getAmplitudeDeviceId } from '@/lib/amplitude'
import { FLASH_PROMO_ID, fetchFlashPromo, getBrowserFingerprint, formatCountdown } from '@/lib/flash-promo'

const PROMO_PRICE = 499
const BASE_PRICE = 799
const PLAN = 'scale'
const BILLING = 'monthly'

const STACK_ITEMS = [
  { name: 'Plan Empire 12 000 cr\u00e9dits/mois', desc: 'Posts LinkedIn, reels, newsletters, YouTube, carrousels \u2014 \u00e9crits et mont\u00e9s pour toi sur 7 r\u00e9seaux', value: 799 },
  { name: 'Onboarding en groupe', desc: 'Session live chaque lundi : on cale ton positionnement, ta cible, ton angle', value: 300 },
  { name: 'Masterclass personal branding (live)', desc: 'La m\u00e9thode compl\u00e8te pour devenir LA r\u00e9f\u00e9rence de ta niche', value: 500 },
  { name: 'Replay Academy', desc: 'Toutes les masterclass et bootcamps en replay, acc\u00e8s illimit\u00e9', value: 800 },
  { name: 'Cerveau Empire (IA)', desc: 'Notre IA scanne ta niche et tes concurrents pour trouver tes sujets viraux chaque jour', value: 500 },
  { name: 'Mise \u00e0 jour des formats', desc: 'Nouveaux formats ajout\u00e9s en continu \u2014 tu profites de chaque \u00e9volution sans payer plus', value: 1000 },
  { name: 'Communaut\u00e9 de cr\u00e9ateurs', desc: 'R\u00e9seau priv\u00e9 de fondateurs et cr\u00e9ateurs qui s\u2019entraident', value: 1000 },
  { name: 'Live toutes les semaines pendant 6 mois', desc: 'Coaching de groupe hebdo : feedback sur tes contenus, r\u00e9ponses \u00e0 tes questions', value: 1000 },
]

const RESULTS = [
  { name: 'Walid, CEO', result: '80K\u20ac de contrats sign\u00e9s' },
  { name: 'Am\u00e9lie', result: '130K vues en 3 semaines' },
  { name: 'Julien', result: '100K vues sur son premier post Instagram' },
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

  const stackTotal = STACK_ITEMS.reduce((sum, it) => sum + it.value, 0)

  const CTABlock = ({ id }: { id?: string }) => (
    <div id={id} className="mx-auto max-w-md scroll-mt-20">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-empire px-6 py-4 text-base font-bold text-black transition-all hover:brightness-110 disabled:opacity-60"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <>Activer mon compte Empire <ArrowRight size={18} /></>}
      </button>
      <p className="mt-2.5 text-center text-xs text-neutral-500">
        7 jours d&rsquo;essai gratuit &middot; Annulez en 1 clic &middot; Paiement s&eacute;curis&eacute; par Stripe
      </p>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-empire/30">
      {/* ── HERO ── */}
      <section className="pt-24 pb-10 md:pt-32 md:pb-14">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-empire uppercase tracking-widest mb-5">
            Offre r&eacute;serv&eacute;e aux participants du live
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] mb-6">
            Le syst&egrave;me complet qui remplace une &eacute;quipe de 15 personnes pour{' '}
            <span className="text-empire">{PROMO_PRICE}&euro;/mois</span>
          </h1>

          <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Tu parles 15 minutes. Notre &eacute;quipe produit tes posts LinkedIn, newsletters, reels, vid&eacute;os YouTube et carrousels &mdash; v&eacute;rifi&eacute;s par des humains et publi&eacute;s sur 7 r&eacute;seaux.
          </p>

          {promoLeft && (
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 mb-8">
              <Clock size={14} className="text-red-400" />
              <span className="text-sm text-red-400 font-semibold">
                Ce tarif expire dans <span className="font-mono tabular-nums">{promoLeft}</span>
              </span>
            </div>
          )}

          <CTABlock id="checkout" />
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-12 border-t border-white/5">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {RESULTS.map((r) => (
              <div key={r.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <p className="text-xl font-extrabold text-empire mb-1">{r.result}</p>
                <p className="text-xs text-neutral-500">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE STACK (Brunson-style) ── */}
      <section className="py-16 border-t border-white/5">
        <div className="container max-w-xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-2">Tout ce que tu obtiens</h2>
          <p className="text-sm text-neutral-500 text-center mb-10">Valeur cumul&eacute;e de chaque composant</p>

          <div className="space-y-0">
            {STACK_ITEMS.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 py-4 ${i > 0 ? 'border-t border-white/5' : ''}`}>
                <Check size={16} className="mt-0.5 shrink-0 text-empire" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
                {item.value > 0 && (
                  <span className="shrink-0 text-sm font-bold text-neutral-400 tabular-nums">{item.value}&euro;</span>
                )}
              </div>
            ))}
          </div>

          {/* Stack total */}
          <div className="mt-6 rounded-xl border border-empire/30 bg-empire/[0.06] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-neutral-300">Valeur totale</span>
              <span className="text-lg font-bold text-neutral-400 line-through tabular-nums">{stackTotal.toLocaleString('fr-FR')}&euro;/mois</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Ton prix &mdash; &agrave; vie</span>
              <span className="text-2xl font-extrabold text-empire tabular-nums">{PROMO_PRICE}&euro;/mois</span>
            </div>
          </div>

          {/* "If all it did" close (Brunson) */}
          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-neutral-400 leading-relaxed">
              Si tout ce que &ccedil;a faisait, c&rsquo;&eacute;tait de te lib&eacute;rer des <span className="text-white font-semibold">10 heures par semaine</span> que tu perds &agrave; cr&eacute;er du contenu&hellip; est-ce que &ccedil;a vaudrait 499&euro; ?
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Si tout ce que &ccedil;a faisait, c&rsquo;&eacute;tait de t&rsquo;amener <span className="text-white font-semibold">un seul client par mois</span>&hellip; est-ce que &ccedil;a vaudrait 499&euro; ?
            </p>
          </div>

          <div className="mt-8">
            <CTABlock />
          </div>
        </div>
      </section>

      {/* ── WHAT HAPPENS AFTER ── */}
      <section className="py-16 border-t border-white/5">
        <div className="container max-w-xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-8">Apr&egrave;s ton inscription, il se passe quoi ?</h2>
          <div className="space-y-5">
            {[
              { day: 'Lundi 12h', text: 'Session d\u2019onboarding en live. On cale ton positionnement, ta cible, ton angle. Places limit\u00e9es chaque semaine.' },
              { day: 'Jour 2', text: 'Tes sujets viraux sont trouv\u00e9s. Notre syst\u00e8me analyse ta niche et tes concurrents.' },
              { day: 'Jour 3\u20135', text: 'Tu enregistres tes 15 premi\u00e8res minutes. On \u00e9crit, on monte, on adapte \u00e0 7 r\u00e9seaux.' },
              { day: 'Jour 7', text: 'Tes premiers contenus sont en ligne. Tu n\u2019as rien \u00e9crit, rien mont\u00e9.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-empire/15 text-xs font-bold text-empire">{i + 1}</div>
                  {i < 3 && <div className="mt-1 w-px flex-1 bg-white/10" />}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-bold text-white">{step.day}</p>
                  <p className="text-sm text-neutral-400 mt-0.5">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-empire/10 border border-empire/20 px-4 py-2.5">
            <Clock size={14} className="text-empire shrink-0" />
            <p className="text-xs text-neutral-300">
              Prochaine session d&rsquo;onboarding : <span className="font-bold text-white">lundi &agrave; 12h</span> &mdash; places limit&eacute;es
            </p>
          </div>
        </div>
      </section>

      {/* ── OBJECTIONS ── */}
      <section className="py-16 border-t border-white/5">
        <div className="container max-w-xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-8">Les questions que tu te poses</h2>
          <div className="space-y-4">
            {[
              { q: 'C\u2019est trop cher.', a: 'Un ghostwriter LinkedIn seul co\u00fbte plus cher chaque mois \u2014 et il ne couvre ni tes newsletters ni tes 6 autres r\u00e9seaux. Le plan normal est \u00e0 799\u20ac. Tu paies 499\u20ac \u00e0 vie.' },
              { q: '\u00c7a va sonner comme un robot ?', a: 'Non. Le contenu part de TA voix : tu enregistres 15 min, nos \u00e9quipes \u00e9crivent et montent \u00e0 partir de tes mots, tes exemples, tes expressions. Tu valides avant publication.' },
              { q: 'Je n\u2019ai pas le temps.', a: '15 min d\u2019enregistrement par semaine. Tout le reste \u2014 \u00e9criture, montage, newsletters, publication sur 7 r\u00e9seaux \u2014 c\u2019est nous.' },
              { q: '\u00c7a marchera dans ma niche ?', a: 'Nos clients vont du coaching au conseil en passant par l\u2019e-commerce. Si tu as une expertise et un produit, on produit ton contenu.' },
              { q: 'Et si \u00e7a me pla\u00eet pas ?', a: '7 jours d\u2019essai gratuit. Annule en 1 clic, rien n\u2019est d\u00e9bit\u00e9. Apr\u00e8s \u00e7a, tu peux annuler \u00e0 tout moment.' },
            ].map((faq) => (
              <div key={faq.q}>
                <p className="text-sm font-bold text-white mb-1">&laquo; {faq.q} &raquo;</p>
                <p className="text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO CHOICES (Brunson close) ── */}
      <section className="py-16 border-t border-white/5">
        <div className="container max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-8">L&agrave;, tu as deux options</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-3">
                <X size={16} className="text-neutral-600" />
                <p className="text-sm font-bold text-neutral-400">Option 1 : ne rien faire</p>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Dans 3 mois, tu postes toujours 2 fois par semaine avec 300 vues. Tes concurrents moins bons que toi continuent de signer les clients que tu m&eacute;rites.
              </p>
            </div>
            <div className="rounded-xl border border-empire/30 bg-empire/[0.05] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Check size={16} className="text-empire" />
                <p className="text-sm font-bold text-white">Option 2 : d&eacute;marrer lundi</p>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Lundi 12h tu fais ton onboarding. Dans 7 jours tes premiers contenus sont en ligne sur 7 r&eacute;seaux. Dans 3 mois tu es LA r&eacute;f&eacute;rence de ta niche.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 border-t border-white/5">
        <div className="container max-w-md mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex -space-x-2">
              <img src="/founders/kevin.jpg" alt="Kevin" className="w-12 h-12 rounded-full border-2 border-black object-cover" />
              <img src="/founders/marc.jpg" alt="Marc" className="w-12 h-12 rounded-full border-2 border-black object-cover" />
            </div>
          </div>

          <p className="text-lg font-semibold text-white mb-2 leading-snug">
            Ce syst&egrave;me &eacute;tait r&eacute;serv&eacute; &agrave; des entrepreneurs qui payaient 1 000&euro;.
          </p>
          <p className="text-neutral-400 text-sm mb-8">
            C&rsquo;est la premi&egrave;re fois qu&rsquo;il est accessible &agrave; ce prix. Et ce tarif est verrouill&eacute; &agrave; vie.
          </p>

          <div className="flex items-baseline justify-center gap-3 mb-2">
            <span className="text-xl text-neutral-600 line-through tabular-nums">{BASE_PRICE}&euro;</span>
            <span className="text-4xl font-extrabold tabular-nums">{PROMO_PRICE}&euro;</span>
            <span className="text-sm text-neutral-400">/mois &agrave; vie</span>
          </div>

          {promoLeft && (
            <p className="text-sm text-red-400 font-semibold mb-6">
              Expire dans <span className="font-mono tabular-nums">{promoLeft}</span>
            </p>
          )}

          <CTABlock />
        </div>
      </section>
    </main>
  )
}
