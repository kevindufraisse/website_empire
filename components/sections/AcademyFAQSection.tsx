'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const faqs = [
  {
    q: "Concrètement, comment ça marche ?",
    a: "Tu parles 15 minutes - comme un vocal. De tes sujets, de tes idées. On récupère la transcription. Nos assistantes créent ton calendrier de publication. On rédige tes posts et on monte tes Shorts. Toi tu publies en 15 min. Pas de page blanche. Pas de montage. Tu parles, on fait le reste.",
  },
  {
    q: "C'est quoi la différence avec les autres bootcamps LinkedIn ?",
    a: "Les autres te donnent des templates et tu te débrouilles. Résultat : page blanche, 45 min/post, tu lâches au bout d'une semaine. Nous on écrit le contenu À TA place. Tu reçois tes posts et tes Shorts prêts à publier. Tu publies en 15 min. C'est le seul bootcamp où la production est gérée par notre équipe.",
  },
  {
    q: 'Combien ça coûte ?',
    a: "497€ en early bird (jusqu'au 9 mai), puis 697€, puis 897€ à partir du 16 mai. Paiement en 3x possible (165€/semaine en early bird). Pour te donner un repère : si tu fais tout seul (21 posts + 21 Shorts), ça revient à 3 360€ minimum. Le bootcamp coûte une fraction de ça.",
  },
  {
    q: "J'ai pas de projet, c'est pour moi ?",
    a: "Oui. Tu n'as pas besoin d'avoir un projet ou un business. On te trouve un sujet, on te crée ton contenu, et si tu choisis le chemin Empire, on te met en relation avec des clients (500€/mission). Le bootcamp est fait pour démarrer de zéro.",
  },
  {
    q: 'Ça marche pour mon secteur ?',
    a: "Si tu vends un savoir-faire, c'est fait pour toi. Freelances, dirigeants, coachs, consultants, formateurs, fondateurs SaaS, e-commerçants. La méthode est universelle : on adapte les angles à ta niche.",
  },
  {
    q: 'Ça prend combien de temps par jour ?',
    a: "15 minutes pour publier. 15 minutes une fois par semaine pour nous parler. Moins de 2h/semaine au total. Le reste du temps, tu fais les challenges et tu absorbes les mécaniques.",
  },
  {
    q: "C'est garanti ?",
    a: "Personne ne devrait te garantir des résultats. Ce qui est garanti : on se réserve le droit de refuser des inscriptions si le profil n'est pas adapté (remboursement intégral sous 48h). Et dans le pire des cas, tu repars avec +3 000€ de contenu créé pour toi. Tu ne perds jamais.",
  },
  {
    q: "Après les 21 jours, j'ai encore accès à quoi ?",
    a: "Les replays et les challenges sont accessibles à vie. Si tu deviens partenaire Empire, on continue de te créer ton contenu. Sinon, tu repars avec les compétences et tout le contenu produit pendant le bootcamp.",
  },
]

export default function AcademyFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative w-full py-20 md:py-28 bg-gradient-to-b from-black via-[#0f0f0f] to-black overflow-hidden">
      <div className="container">
        <div className="max-w-4xl mx-auto">

          <FadeInBlock>
            <div className="text-center mb-16">
              <p className="text-sm text-neutral-400 mb-3 tracking-widest uppercase">FAQ</p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Toutes tes questions.{' '}
                <span className="text-academy">Réponses honnêtes.</span>
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
              <a
                href="https://join.empire-internet.com/academy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-academy text-black font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(252, 165, 165,0.3)]"
              >
                Confirmer ma place - 497€
              </a>
              <p className="text-xs text-neutral-400 mt-2">ou 3x 165€/semaine</p>
            </div>
          </FadeInBlock>

        </div>
      </div>
    </section>
  )
}
