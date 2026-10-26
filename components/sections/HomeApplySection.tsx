'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import EmpireSalesCta from '@/components/EmpireSalesCta'

export default function HomeApplySection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const fr = lang === 'fr'
  if (autopilot) return null
  return (
    <section id="rejoindre" className="bg-black py-20 md:py-28">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-empire">{fr ? 'Choisissez votre rythme' : 'Choose your pace'}</p>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{fr ? 'Une présence régulière. Une offre adaptée à votre activité.' : 'A consistent presence. A plan that fits your business.'}</h2>
          <p className="mt-4 text-neutral-400">{fr ? 'Idées, création de contenus et publication sur vos 7 réseaux.' : 'Ideas, content creation and publishing across 7 networks.'}</p>
        </div>
        <div className="mt-8">
          <EmpireSalesCta source="home-offers" />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white">
          <a href="/tarifs" className="underline underline-offset-4">{fr ? 'Voir les offres et les tarifs' : 'View plans and pricing'}</a>
        </div>
      </div>
    </section>
  )
}
