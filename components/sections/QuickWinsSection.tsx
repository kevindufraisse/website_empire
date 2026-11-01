'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { Check, Clock3, Wallet } from 'lucide-react'
import EmpireSalesCta from '@/components/EmpireSalesCta'

type Copy = { fr:string;en:string }
const ROWS: { name:Copy; time:Copy; cost:Copy; workflow:Copy; empire?:boolean }[] = [
  { name:{fr:'Tout faire soi-même',en:'Do it yourself'},time:{fr:'Veille, script, tournage, montage, publication',en:'Research, script, record, edit, publish'},cost:{fr:'Vos outils + votre temps',en:'Your tools + your time'},workflow:{fr:'Vous produisez et adaptez chaque contenu.',en:'You produce and adapt every piece.'} },
  { name:{fr:'Freelance',en:'Freelancer'},time:{fr:'Briefs, échanges, tournage et validations',en:'Briefs, feedback, recording and approvals'},cost:{fr:'Honoraires selon le volume et la mission',en:'Fees depend on volume and scope'},workflow:{fr:'Une ou plusieurs expertises, selon la mission.',en:'One or more specialities, depending on scope.'} },
  { name:{fr:'Agence',en:'Agency'},time:{fr:'Cadrage, points de suivi et validations',en:'Kick-off, coordination and approvals'},cost:{fr:'Devis selon l’équipe et le périmètre',en:'Quote based on team and scope'},workflow:{fr:'Une équipe qui pilote la production convenue.',en:'A team manages the agreed production.'} },
  { name:{fr:'ChatGPT',en:'ChatGPT'},time:{fr:'Échanges, sélection des idées, puis production',en:'Prompts, idea selection, then production'},cost:{fr:'Selon l’offre + vos outils de production',en:'Chosen plan + your production tools'},workflow:{fr:'Un assistant pour réfléchir, structurer et écrire.',en:'An assistant for ideas, structure and writing.'} },
  { name:{fr:'CapCut + Buffer',en:'CapCut + Buffer'},time:{fr:'Montage, exports et préparation des publications',en:'Editing, exporting and preparing posts'},cost:{fr:'Des offres distinctes pour chaque outil',en:'Separate plans for each tool'},workflow:{fr:'Montage dans CapCut, programmation dans Buffer.',en:'Edit in CapCut, schedule in Buffer.'} },
  { name:{fr:'Empire',en:'Empire'},time:{fr:'Votre point de vue, votre prise, votre validation',en:'Your point of view, your take, your approval'},cost:{fr:'Un abonnement et des crédits selon votre production',en:'One subscription and credits for your production'},workflow:{fr:'Du lien au format, puis aux contenus adaptés à vos réseaux.',en:'From link to format, then content adapted to your channels.'},empire:true },
]
export default function QuickWinsSection() {
  const {lang}=useLanguage();const {autopilot}=useAutopilot();const fr=lang==='fr';const t=(c:Copy)=>fr?c.fr:c.en
  if(autopilot)return null
  return <section className="relative bg-[#0c1009] px-4 py-20 md:py-28" aria-labelledby="comparison-title">
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 text-center"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-empire">{fr?'TEMPS + COÛT':'TIME + COST'}</p><h2 id="comparison-title" className="text-3xl font-bold tracking-tight md:text-5xl">{fr?'Créer du contenu a un coût.':'Content has a cost.'}<br/><span className="text-empire">{fr?'Votre temps en fait partie.':'Your time is part of it.'}</span></h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">{fr?'Seul, accompagné, avec des outils ou avec Empire : comparez ce que vous payez et ce qu’il vous reste à faire.':'On your own, with a team, with tools or with Empire: compare what you pay for and what remains on your plate.'}</p></div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[.025] p-5"><Clock3 className="shrink-0 text-empire" size={23}/><div><b className="text-sm">{fr?'Votre temps':'Your time'}</b><p className="mt-1 text-xs leading-relaxed text-neutral-400">{fr?'L’expertise et la prise de parole restent les vôtres. Le reste peut s’enchaîner.':'The expertise and voice stay yours. The rest can follow in one workflow.'}</p></div></div><div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[.025] p-5"><Wallet className="shrink-0 text-empire" size={23}/><div><b className="text-sm">{fr?'Votre budget':'Your budget'}</b><p className="mt-1 text-xs leading-relaxed text-neutral-400">{fr?'Regardez toute la chaîne : création, montage, adaptation et diffusion.':'Look at the entire chain: creation, editing, adaptation and publishing.'}</p></div></div></div>
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#141811]">
        <div className="hidden grid-cols-[.8fr_1.2fr_1fr_1.3fr] border-b border-white/10 md:grid">{[fr?'Votre solution':'Your approach',fr?'Ce que vous faites encore':'What you still do',fr?'Ce que vous payez':'What you pay for',fr?'Ce qui est pris en charge':'What it covers'].map(h=><div key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">{h}</div>)}</div>
        {ROWS.map(row=><div key={row.name.en} className={`border-b border-white/[.07] last:border-0 md:grid md:grid-cols-[.8fr_1.2fr_1fr_1.3fr] ${row.empire?'bg-empire/[.07]':''}`}>
          <div className="flex items-center gap-2 px-5 pt-5 pb-2 md:py-5"><b className={`text-sm ${row.empire?'text-empire':'text-white'}`}>{t(row.name)}</b>{row.empire&&<Check className="text-empire" size={15}/>}</div>
          {[{label:fr?'Votre temps':'Your time',value:row.time},{label:fr?'Votre budget':'Your budget',value:row.cost},{label:fr?'Prise en charge':'Coverage',value:row.workflow}].map(cell=><div key={cell.label} className={`px-5 py-2 last:pb-5 md:border-l md:border-white/[.05] md:py-5 ${row.empire?'text-neutral-100':'text-neutral-400'}`}><p className="mb-1 text-[9px] uppercase tracking-wider text-neutral-500 md:hidden">{cell.label}</p><p className="text-[12px] leading-relaxed">{t(cell.value)}</p></div>)}
        </div>)}
      </div>
      <p className="mx-auto mt-5 max-w-3xl text-center text-[10px] leading-relaxed text-neutral-500">{fr?'Périmètre et tarifs selon les prestations et les offres. Fonctions des outils : ':'Scope and pricing depend on the service and plan. Tool features: '}<a className="underline underline-offset-2" href="https://openai.com/chatgpt/use-cases/writing-with-ai/" target="_blank" rel="noopener noreferrer">ChatGPT</a>{' · '}<a className="underline underline-offset-2" href="https://www.capcut.com/tools/add-subtitles-to-video" target="_blank" rel="noopener noreferrer">CapCut</a>{' · '}<a className="underline underline-offset-2" href="https://buffer.com/publish" target="_blank" rel="noopener noreferrer">Buffer</a>.</p>
      <div className="mt-9 text-center"><EmpireSalesCta source="home-comparison"/></div>
    </div>
  </section>
}
