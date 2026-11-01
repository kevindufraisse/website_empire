'use client'
import { useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { startFreeTrial } from '@/lib/startTrial'
import { trackAmplitude } from '@/lib/amplitude'
import { FormulaHeroStatic } from '@/components/HomeFormula'
export default function HomeHero(){
 const {lang}=useLanguage();const fr=lang==='fr';const [loading,setLoading]=useState(false)
 return <section className="home-hero"><div className="home-hero-inner"><p className="home-eyebrow">EMPIRE INTERNET</p><h1>{fr?'Vos idées.':'Your ideas.'}<br/><span>{fr?'Une présence partout.':'A presence everywhere.'}</span></h1><p className="home-hero-description">{fr?'Envoyez une idée ou une inspiration. Partagez votre expertise. Empire crée, adapte et programme vos contenus.':'Send an idea or an inspiration. Share your expertise. Empire creates, adapts and schedules your content.'}</p><button className="home-button" disabled={loading} onClick={async()=>{if(loading)return;setLoading(true);trackAmplitude('home_hero_trial_clicked');await startFreeTrial();setLoading(false)}}>{loading?(fr?'Ouverture…':'Opening…'):(fr?'Tester gratuitement':'Try it free')}<ArrowUpRight size={19}/></button><div className="home-hero-formula"><span>{fr?'Une formule. Un parcours simple.':'One formula. One simple workflow.'}</span><div id="formula-hero-slot"><FormulaHeroStatic fr={fr}/></div></div><a className="home-scroll-link" href="#home-masterclass">{fr?'Découvrez comment ça marche':'See how it works'}<ArrowDown size={15}/></a></div></section>
}
