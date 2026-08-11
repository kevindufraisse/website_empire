'use client'

import { Check, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import HowItWorksAccordion from '@/components/sections/HowItWorksAccordion'
import FounderSection from '@/components/sections/FounderSection'
import FAQSection from '@/components/sections/FAQSection'
import { Reveal } from '@/components/Reveal'

const CLIENT_LOGOS = [
  { name: 'Ippon Technologies', src: '/logos/ippon.png' },
  { name: 'Socratiz', src: '/logos/presse-agence.png' },
  { name: 'The Sanctuary Group', src: '/logos/sanctuary.png' },
]

function Hero() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  return (
    <section className="relative w-full pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(212,165,116,0.12),transparent)]" />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-autopilot mb-4">
            {fr ? 'Pour les CEO qui veulent déléguer' : 'For CEOs who want to delegate'}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            {fr ? (
              <>
                Vous dirigez votre entreprise.{' '}
                <span className="text-autopilot">Nous dirigeons votre image.</span>
              </>
            ) : (
              <>
                You run your company.{' '}
                <span className="text-autopilot">We run your image.</span>
              </>
            )}
          </h1>
          <p className="mt-5 text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {fr
              ? 'Une conversation par mois suffit. Notre équipe transforme vos idées en contenus, les publie sur vos réseaux et construit une audience qui vous apporte des opportunités.'
              : 'One conversation a month is enough. Our team turns your ideas into content, publishes on your networks and builds an audience that brings opportunities.'}
          </p>
          <p className="mt-3 text-sm font-medium text-neutral-400">
            {fr ? 'Vous restez CEO. Nous nous occupons du reste.' : 'You stay CEO. We handle the rest.'}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/join-us?offer=legende"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-autopilot text-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,165,116,0.35)]"
            >
              {fr ? 'Réserver un appel' : 'Book a call'}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#offer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border border-white/15 text-neutral-200 hover:border-autopilot/40 hover:text-white transition-colors"
            >
              {fr ? 'Voir ce qui est inclus' : 'See what\'s included'}
            </a>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {CLIENT_LOGOS.map((l) => (
              <img
                key={l.name}
                src={l.src}
                alt={l.name}
                className="h-8 md:h-10 w-auto object-contain brightness-0 invert opacity-55"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function OfferIncluded() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const pillars = fr
    ? [
        {
          title: 'Kevin pilote votre marque',
          desc: 'Stratégie, angles, direction éditoriale. C\'est lui (ou un expert senior) qui porte le système.',
          faces: [
            { src: '/founders/kevin.jpg', alt: 'Kevin Dufraisse' },
          ],
          items: ['Stratégie', 'Sessions', 'Accompagnement', 'Optimisation'],
        },
        {
          title: 'Une équipe exécute pour vous',
          desc: 'Production, publication, distribution, reporting. Vous ne touchez à rien au quotidien.',
          faces: [
            { src: '/founders/kevin.jpg', alt: 'Kevin' },
            { src: '/founders/marc.jpg', alt: 'Marc' },
          ],
          items: ['Production', 'Publication', 'Distribution', 'Reporting', 'Conversion'],
          extraFace: '+3',
        },
      ]
    : [
        {
          title: 'Kevin runs your brand',
          desc: 'Strategy, angles, editorial direction. He (or a senior expert) owns the system.',
          faces: [
            { src: '/founders/kevin.jpg', alt: 'Kevin Dufraisse' },
          ],
          items: ['Strategy', 'Sessions', 'Support', 'Optimization'],
        },
        {
          title: 'A team executes for you',
          desc: 'Production, publishing, distribution, reporting. You don\'t touch day-to-day ops.',
          faces: [
            { src: '/founders/kevin.jpg', alt: 'Kevin' },
            { src: '/founders/marc.jpg', alt: 'Marc' },
          ],
          items: ['Production', 'Publishing', 'Distribution', 'Reporting', 'Conversion'],
          extraFace: '+3',
        },
      ]

  const openOfferQuiz = () => {
    window.dispatchEvent(new Event('open-offer-quiz'))
  }

  return (
    <section id="offer" className="relative w-full py-16 md:py-24 bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(212,165,116,0.08),transparent)]" />
      <div className="container relative z-10">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-autopilot/20 blur-md" />
                <img
                  src="/founders/kevin.jpg"
                  alt="Kevin Dufraisse"
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover object-top border-2 border-autopilot shadow-[0_0_40px_rgba(212,165,116,0.35)]"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-autopilot mb-3">
              {fr ? 'Légende · Opéré par Kevin' : 'Légende · Operated by Kevin'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {fr ? 'Kevin gère votre marque.' : 'Kevin manages your brand.'}
            </h2>
            <p className="mt-4 text-neutral-400 leading-relaxed max-w-lg mx-auto">
              {fr
                ? 'Pas un abonnement SaaS. Kevin et son équipe portent votre image de A à Z. Vous, une conversation par mois.'
                : 'Not a SaaS subscription. Kevin and his team carry your brand end to end. You: one conversation a month.'}
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              {fr
                ? 'L\'appel mensuel : Kevin ou un expert en viralité.'
                : 'The monthly call: Kevin or a virality expert.'}
            </p>
          </div>
        </Reveal>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={0.06 + i * 0.08}>
              <div className="h-full rounded-2xl border border-autopilot/25 bg-gradient-to-br from-autopilot/10 to-white/[0.02] p-6 md:p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    {pillar.faces.map((f) => (
                      <img
                        key={f.alt}
                        src={f.src}
                        alt={f.alt}
                        className="w-11 h-11 rounded-full object-cover object-top border-2 border-autopilot ring-2 ring-black"
                        loading="lazy"
                      />
                    ))}
                    {'extraFace' in pillar && pillar.extraFace && (
                      <div className="w-11 h-11 rounded-full border-2 border-autopilot bg-autopilot/20 text-autopilot text-xs font-bold flex items-center justify-center ring-2 ring-black">
                        {pillar.extraFace}
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-5">{pillar.desc}</p>
                <ul className="flex flex-wrap gap-2">
                  {pillar.items.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-200"
                    >
                      <Check className="w-3 h-3 text-autopilot shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <a
              href="/join-us?offer=legende"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-autopilot text-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,165,116,0.3)]"
            >
              {fr ? 'Réserver un appel' : 'Book a call'}
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={openOfferQuiz}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-autopilot/40 bg-autopilot/10 px-5 py-2.5 text-sm font-semibold text-autopilot hover:bg-autopilot/20 transition-colors"
            >
              <span className="text-autopilot">✦</span>
              {fr ? 'Pas sûr ? Quelle offre pour vous ?' : 'Not sure? Which offer for you?'}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function LegendePageContent() {
  return (
    <main className="relative">
      <Hero />
      <HowItWorksAccordion />
      <OfferIncluded />
      <FounderSection />
      <FAQSection variant="home" />
    </main>
  )
}
