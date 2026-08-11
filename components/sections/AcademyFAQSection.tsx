'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import AcademyWaitlistCta from '@/components/AcademyWaitlistCta'
import { ACADEMY_ENTRY_PRICE, ACADEMY_NEXT_PRICE_EN, ACADEMY_NEXT_PRICE_FR } from '@/lib/cohort-config'
import { useLanguage } from '@/contexts/LanguageContext'

function FadeInBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function AcademyFAQSection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = fr
    ? [
        {
          q: "Concrètement, comment ça marche ?",
          a: "21 jours, un défi par jour. Vous apprenez les mécaniques de la viralité en masterclass live, vous publiez le jour même et vous voyez ce qui marche sur vos vrais chiffres. À la fin, vous passez la certification Empire - Bronze, Argent ou Or selon vos résultats. Vous repartez avec un métier, pas avec un dossier de templates.",
        },
        {
          q: "C'est quoi la différence avec les autres bootcamps LinkedIn ?",
          a: "Les autres vous vendent une formation et vous laissent seul avec. Ici, la formation est le début : vous passez une certification basée sur vos vrais résultats, et si vous n'avez pas de projet à vous, on vous confie des clients Empire à coacher - 500€ par mission, avec le contenu produit par notre équipe. C'est le seul bootcamp qui débouche sur un revenu, pas juste sur une attestation.",
        },
        {
          q: 'Combien ça coûte ?',
          a: `Le tarif d'entrée est de ${ACADEMY_ENTRY_PRICE}\u202F€, payable en 3\u00d7 165\u202F€. C'est le prix des premières promotions : il passera à ${ACADEMY_NEXT_PRICE_FR}\u202F€ une fois la certification installée. La candidature vous place dans la file au tarif le plus bas.`,
        },
        {
          q: "J'ai pas de projet, c'est pour moi ?",
          a: "C'est même le cas le plus fréquent. Sans projet à vous, vous prenez la voie partenaire Empire : on vous met en relation avec nos clients à coacher (500€ par mission, environ 4h de travail), et notre équipe produit le contenu pour ces missions. Objectif : 3 000€/mois en 4h par semaine. Le bootcamp est fait pour démarrer de zéro.",
        },
        {
          q: 'Ça marche pour mon secteur ?',
          a: "Si vous vendez un savoir-faire, c'est fait pour vous. Freelances, dirigeants, coachs, consultants, formateurs, fondateurs SaaS, e-commerçants. La méthode est universelle : on adapte les angles à votre niche.",
        },
        {
          q: 'Ça prend combien de temps par jour ?',
          a: "Comptez 15 minutes pour publier votre contenu du jour, plus les masterclass live. Moins de 2h par semaine au total. Le reste du temps, vous faites les défis et vous absorbez les mécaniques.",
        },
        {
          q: "Et si je ne veux pas écrire mes contenus moi-même ?",
          a: "C'est une option, pas le cœur du bootcamp. Le programme vous apprend à créer vous-même - c'est ce qui fait la valeur de la certification. Si vous préférez déléguer la production ensuite, vous ajoutez un abonnement Empire et notre équipe s'en occupe. Sur la voie partenaire, la production des missions clients est prise en charge d'office.",
        },
        {
          q: "C'est garanti ?",
          a: "Personne ne devrait vous garantir des résultats. Ce qui est garanti : on se réserve le droit de refuser des inscriptions si le profil n'est pas adapté (remboursement intégral sous 48h). Et vous repartez avec la certification et les compétences, quoi qu'il arrive.",
        },
        {
          q: "Après les 21 jours, j'ai encore accès à quoi ?",
          a: "Les replays, les défis et le groupe alumni sont accessibles à vie, et votre certification reste sur votre profil LinkedIn. Si vous devenez partenaire Empire, on continue de produire le contenu de vos missions clients.",
        },
      ]
    : [
        {
          q: "How does it actually work?",
          a: "21 days, one challenge a day. You learn the mechanics of virality in live masterclasses, you publish the same day and you see what works on your own numbers. At the end you take the Empire certification - Bronze, Silver or Gold depending on your results. You leave with a craft, not a folder of templates.",
        },
        {
          q: "What's the difference with other LinkedIn bootcamps?",
          a: "Others sell you a course and leave you alone with it. Here the course is the beginning: you earn a certification based on your real results, and if you don't have a project of your own we hand you Empire clients to coach - €500 per mission, with the content produced by our team. It's the only bootcamp that leads to income rather than a certificate.",
        },
        {
          q: 'How much does it cost?',
          a: `The entry price is €${ACADEMY_ENTRY_PRICE}, payable in 3× €165. That's the price for the first cohorts: it will go to €${ACADEMY_NEXT_PRICE_EN} once the certification is established. Applying puts you in the queue at the lowest price.`,
        },
        {
          q: "I don't have a project, is this for me?",
          a: "That's the most common case. With no project of your own you take the Empire partner path: we connect you with our clients to coach (€500 per mission, around 4h of work), and our team produces the content for those missions. Target: €3,000/month in 4h a week. The bootcamp is designed to start from zero.",
        },
        {
          q: 'Does it work for my industry?',
          a: "If you sell expertise, it's made for you. Freelancers, executives, coaches, consultants, trainers, SaaS founders, e-commerce owners. The method is universal: we adapt the angles to your niche.",
        },
        {
          q: 'How much time does it take per day?',
          a: "Around 15 minutes to publish your content for the day, plus the live masterclasses. Less than 2h a week in total. The rest of the time you do the challenges and absorb the mechanics.",
        },
        {
          q: "What if I don't want to write my content myself?",
          a: "That's an option, not the core of the bootcamp. The programme teaches you to create it yourself - that's what makes the certification worth something. If you'd rather delegate production afterwards, you add an Empire subscription and our team handles it. On the partner path, production for client missions is covered by default.",
        },
        {
          q: "Is it guaranteed?",
          a: "Nobody should guarantee you results. What is guaranteed: we reserve the right to refuse applications if the profile isn't a fit (full refund within 48h). And you leave with the certification and the skills, whatever happens.",
        },
        {
          q: "After the 21 days, what do I still have access to?",
          a: "Replays, challenges and the alumni group are accessible for life, and your certification stays on your LinkedIn profile. If you become an Empire partner, we keep producing the content for your client missions.",
        },
      ]

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black via-[#0f0f0f] to-black overflow-hidden">
      <div className="container">
        <div className="max-w-4xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">FAQ</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                {fr ? 'Toutes vos questions.' : 'All your questions.'}{' '}
                <span className="text-academy">{fr ? 'Réponses honnêtes.' : 'Honest answers.'}</span>
              </h2>
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.1}>
            <div className="space-y-2.5">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <div
                    key={i}
                    className={cn(
                      'rounded-xl border transition-all overflow-hidden',
                      isOpen
                        ? 'bg-gradient-to-br from-white/10 to-white/[0.02] border-academy/30'
                        : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                    )}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full p-5 flex items-center justify-between text-left group min-h-[52px]"
                    >
                      <h3 className={cn(
                        'text-base md:text-lg font-semibold transition-colors pr-3',
                        isOpen ? 'text-academy' : 'text-white group-hover:text-academy'
                      )}>
                        {faq.q}
                      </h3>
                      <ChevronDown
                        className={cn(
                          'text-neutral-400 transition-all duration-300 flex-shrink-0',
                          isOpen ? 'rotate-180 text-academy' : 'group-hover:text-academy'
                        )}
                        size={18}
                      />
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-white/10">
                        <p className="text-sm md:text-base text-neutral-300 leading-relaxed pt-4">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </FadeInBlock>

          <FadeInBlock delay={0.3}>
            <div className="mt-14 text-center">
              <AcademyWaitlistCta
                source="faq"
                className="inline-flex items-center gap-2 px-8 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(252,165,165,0.3)]"
                sublabel={
                  <p className="text-xs text-neutral-400 mt-2">
                    {fr ? `Places limitées · à partir de ${ACADEMY_ENTRY_PRICE}€` : `Limited spots · from €${ACADEMY_ENTRY_PRICE}`}
                  </p>
                }
              >
                {fr ? 'Candidater à la prochaine promotion' : 'Apply to the next cohort'}
              </AcademyWaitlistCta>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
