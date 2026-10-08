'use client'

import { Brain, Building2, Rocket } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AcademyWhyViralitySection() {
  const { lang } = useLanguage()
  const fr = lang === 'fr'

  const points = fr
    ? [
        {
          icon: Brain,
          num: '01',
          title: "L'IA sait produire. Pas décider quoi dire.",
          desc: "Elle génère du texte et des images. Elle ne choisit pas l'angle, le timing, ni ce qui fera réagir un marché.",
        },
        {
          icon: Building2,
          num: '02',
          title: 'Les entreprises cherchent cette compétence.',
          desc: 'Elles ont besoin de personnes capables de transformer leur expertise en attention - pas seulement de publier plus souvent.',
        },
        {
          icon: Rocket,
          num: '03',
          title: 'Les meilleurs créateurs deviennent des opérateurs de croissance.',
          desc: "Ce n'est plus seulement créer. C'est construire un système qui attire, convertit et se répète.",
        },
      ]
    : [
        {
          icon: Brain,
          num: '01',
          title: "AI can produce. It can't decide what to say.",
          desc: "It generates text and images. It doesn't pick the angle, the timing, or what will move a market.",
        },
        {
          icon: Building2,
          num: '02',
          title: 'Companies are looking for this skill.',
          desc: 'They need people who can turn expertise into attention - not just post more often.',
        },
        {
          icon: Rocket,
          num: '03',
          title: 'Top creators become growth operators.',
          desc: "It's no longer just creating. It's building a system that attracts, converts and repeats.",
        },
      ]

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-black py-20 md:py-28">
      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-academy">
            {fr ? "L'opportunité" : 'The opportunity'}
          </p>
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            {fr
              ? 'Pourquoi cette compétence devient indispensable'
              : 'Why this skill is becoming essential'}
          </h2>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.num} className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs font-bold tracking-wider text-academy/70">{p.num}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-academy/20 bg-academy/10">
                  <p.icon size={18} className="text-academy" />
                </div>
              </div>
              <h3 className="mb-2 text-base font-bold leading-snug text-white">{p.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-400">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center md:p-8">
          <p className="text-sm leading-relaxed text-neutral-300 md:text-base">
            {fr
              ? "Le marché de la creator economy est estimé à 313 Md$ en 2026 (Goldman Sachs). MrBeast recrute un Head of Viral Marketing. Les postes se paient entre 200K et 400K$/an. Le chiffre n'est pas le pitch - c'est la preuve que le métier existe déjà."
              : "The creator economy is estimated at $313B in 2026 (Goldman Sachs). MrBeast is hiring a Head of Viral Marketing. Roles pay $200K–$400K/year. The number isn't the pitch - it's proof the job already exists."}
          </p>
        </div>
      </div>
    </section>
  )
}
