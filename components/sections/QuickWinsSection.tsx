'use client'

import { useState } from 'react'
import { Check, Clock3, Wallet } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import EmpireSalesCta from '@/components/EmpireSalesCta'

type Copy = [fr: string, en: string]
const COLUMNS = [
  { id: 'alone', label: ['Soi-même', 'Yourself'] as Copy },
  { id: 'freelance', label: ['Freelance', 'Freelancer'] as Copy },
  { id: 'agency', label: ['Agence', 'Agency'] as Copy },
  { id: 'chatgpt', label: ['ChatGPT', 'ChatGPT'] as Copy },
  { id: 'tools', label: ['CapCut + Buffer', 'CapCut + Buffer'] as Copy },
  { id: 'empire', label: ['Empire', 'Empire'] as Copy },
] as const
const ROWS: { label: Copy; cells: Copy[] }[] = [
  { label: ['Sujets & veille', 'Topics & research'], cells: [
    ['Vos idées et votre recherche', 'Your ideas and research'],
    ['Recherche selon la mission et votre brief', 'Research based on scope and your brief'],
    ['Stratégie et veille selon le contrat', 'Strategy and research based on scope'],
    ['Exploration et recherche à piloter', 'Research and exploration to guide'],
    ['Vos idées et vos fichiers en entrée', 'Your ideas and files as input'],
    ['Idées, vocaux, questions clients + veille concurrents', 'Ideas, voice notes, client questions + competitor research'],
  ] },
  { label: ['Formats', 'Formats'], cells: [
    ['À repérer, adapter et tester', 'Find, adapt and test them'],
    ['Selon la spécialité et le brief', 'Depends on specialisation and brief'],
    ['Conception selon le périmètre', 'Designed within the agreed scope'],
    ['Angles, structures et scripts', 'Angles, structures and scripts'],
    ['Montage, modèles et sous-titres', 'Editing, templates and captions'],
    ['Réaction, FAQ, illustration… inspirés de votre marché', 'Reaction, Q&A, illustration… inspired by your market'],
  ] },
  { label: ['Production', 'Production'], cells: [
    ['Écriture, tournage et montage', 'Writing, recording and editing'],
    ['Écriture ou montage selon la mission', 'Writing or editing based on scope'],
    ['Production par l’équipe prévue', 'Production by the assigned team'],
    ['Textes et scripts, production à organiser', 'Text and scripts; arrange production'],
    ['Vous pilotez le montage et les exports', 'You manage editing and exports'],
    ['Votre prise, puis montage et relecture humaine', 'Your take, then editing and human review'],
  ] },
  { label: ['Diffusion & volume', 'Publishing & volume'], cells: [
    ['Adapter et publier sur chaque réseau', 'Adapt and publish on each channel'],
    ['Réseaux et volume selon la mission', 'Channels and volume depend on scope'],
    ['Réseaux et volume selon le contrat', 'Channels and volume depend on contract'],
    ['Transfert vers vos outils de publication', 'Transfer to your publishing tools'],
    ['Publication multiréseau dans Buffer', 'Multi-channel publishing in Buffer'],
    ['Une idée déclinée en contenus pour 7 réseaux', 'One idea adapted into content for 7 channels'],
  ] },
  { label: ['Republication', 'Republishing'], cells: [
    ['Sélectionner et reprogrammer', 'Select and reschedule'],
    ['À inclure dans la mission', 'Include it in the scope'],
    ['Selon le calendrier convenu', 'Based on the agreed calendar'],
    ['À organiser avec vos outils', 'Arrange it with your tools'],
    ['Réutilisation et programmation dans Buffer', 'Reuse and schedule content in Buffer'],
    ['Vos meilleurs contenus reprogrammés avec votre accord', 'Your best content rescheduled with your approval'],
  ] },
  { label: ['Suivi des résultats', 'Results tracking'], cells: [
    ['Vos mesures à réunir', 'Gather your metrics'],
    ['Reporting selon la mission', 'Reporting depends on scope'],
    ['Reporting selon le contrat', 'Reporting depends on contract'],
    ['Analyse des données que vous fournissez', 'Analyse data you provide'],
    ['Statistiques selon les offres', 'Analytics vary by plan'],
    ['Vues, abonnés et leads suivis par contenu', 'Views, followers and leads tracked by content'],
  ] },
  { label: ['Votre temps', 'Your time'], cells: [
    ['Toute la chaîne à prendre en charge', 'Manage the entire workflow'],
    ['Briefs, tournage, échanges et validations', 'Briefs, recording, feedback and approvals'],
    ['Cadrage, suivi et validations', 'Kick-off, coordination and approvals'],
    ['Prompts, choix et production', 'Prompts, selection and production'],
    ['Montage, exports et programmation', 'Editing, exports and scheduling'],
    ['20 min à 1 h / semaine, selon votre production', '20 min to 1 h / week, depending on your production'],
  ] },
  { label: ['Votre budget', 'Your budget'], cells: [
    ['Vos outils + votre temps', 'Your tools + your time'],
    ['Honoraires selon volume et mission', 'Fees depend on volume and scope'],
    ['Devis selon l’équipe et le périmètre', 'Quote based on team and scope'],
    ['Selon l’offre + vos outils de production', 'Chosen plan + production tools'],
    ['Des offres distinctes pour chaque outil', 'Separate plans for each tool'],
    ['Un abonnement + les crédits utilisés', 'One subscription + credits used'],
  ] },
]

export default function QuickWinsSection() {
  const { lang } = useLanguage()
  const { autopilot } = useAutopilot()
  const [compared, setCompared] = useState<string>('alone')
  const fr = lang === 'fr'
  const t = (copy: Copy) => copy[fr ? 0 : 1]
  const columnClass = (id: string) => id === compared || id === 'empire' ? '' : 'hidden lg:table-cell'
  if (autopilot) return null

  return <section className="relative bg-[#0c1009] px-4 py-20 md:py-28" aria-labelledby="comparison-title">
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 text-center">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-empire">{fr ? 'TEMPS + COÛT' : 'TIME + COST'}</p>
        <h2 id="comparison-title" className="text-3xl font-bold tracking-tight md:text-5xl">{fr ? 'Créer du contenu a un coût.' : 'Content has a cost.'}<br/><span className="text-empire">{fr ? 'Votre temps en fait partie.' : 'Your time is part of it.'}</span></h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-neutral-400">{fr ? 'Comparez toute la chaîne : les sujets, les formats, la production, la diffusion et ce qu’il vous reste à faire.' : 'Compare the entire workflow: topics, formats, production, publishing and what remains on your plate.'}</p>
      </div>
      <div className="mx-auto mb-7 grid max-w-4xl gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 p-4"><Clock3 size={23} className="shrink-0 text-empire"/><p className="text-xs leading-relaxed text-neutral-300">{fr ? '20 min à 1 h par semaine : vos prises et vos validations, selon votre volume de production.' : '20 min to 1 h per week: your recordings and approvals, depending on your production volume.'}</p></div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 p-4"><Wallet size={23} className="shrink-0 text-empire"/><p className="text-xs leading-relaxed text-neutral-300">{fr ? 'Le budget couvre aussi l’adaptation, la diffusion et la republication.' : 'Your budget also covers adaptation, publishing and republishing.'}</p></div>
      </div>
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <label htmlFor="comparison-alternative" className="text-xs font-semibold text-neutral-300">{fr ? 'Comparer Empire à' : 'Compare Empire with'}</label>
        <select id="comparison-alternative" value={compared} onChange={event => setCompared(event.target.value)} className="min-h-11 rounded-lg border border-white/25 bg-[#1d2418] px-3 text-sm text-white outline-empire">{COLUMNS.filter(c => c.id !== 'empire').map(c => <option key={c.id} value={c.id}>{t(c.label)}</option>)}</select>
      </div>
      <table className="w-full table-fixed border-separate border-spacing-0 text-left" aria-label={fr ? 'Comparaison des solutions de création de contenu' : 'Content creation approaches compared'}>
        <caption className="sr-only">{fr ? 'Fonctionnalités, temps et coût. Sur mobile, choisissez une solution à comparer à Empire.' : 'Features, time and cost. On mobile, choose an alternative to compare with Empire.'}</caption>
        <thead className="sticky top-16 z-20">
          <tr><th scope="col" className="w-[27%] rounded-tl-xl border-y border-l border-white/20 bg-[#1d2418] px-2 py-4 text-[11px] font-bold text-white sm:px-3 lg:w-[14%]">{fr ? 'Ce que vous comparez' : 'What you compare'}</th>
            {COLUMNS.map(c => <th key={c.id} scope="col" className={`${columnClass(c.id)} border-y border-l border-white/20 px-2 py-4 text-xs font-bold sm:px-3 ${c.id === 'empire' ? 'rounded-tr-xl border-r border-empire/40 bg-[#29391b] text-empire' : 'bg-[#1d2418] text-white'}`}><span className="inline-flex flex-wrap items-center gap-1">{t(c.label)}{c.id === 'empire' && <Check size={13}/>}</span></th>)}
          </tr>
        </thead>
        <tbody>{ROWS.map((row, index) => <tr key={row.label[1]}>
          <th scope="row" className={`border-b border-l border-white/10 bg-[#151a11] px-2 py-4 text-[11px] font-semibold leading-relaxed text-neutral-200 sm:px-3 ${index === ROWS.length - 1 ? 'rounded-bl-xl' : ''}`}>{t(row.label)}</th>
          {COLUMNS.map((column, i) => <td key={column.id} className={`${columnClass(column.id)} border-b border-l border-white/10 px-2 py-4 align-top text-[11px] leading-relaxed sm:px-3 ${column.id === 'empire' ? `border-r border-empire/20 bg-[#1c2715] font-medium text-neutral-100 ${index === ROWS.length - 1 ? 'rounded-br-xl' : ''}` : 'bg-[#11160e] text-neutral-400'}`}>{t(row.cells[i])}</td>)}
        </tr>)}</tbody>
      </table>
      <p className="mx-auto mt-5 max-w-3xl text-center text-[10px] leading-relaxed text-neutral-500">{fr ? 'Périmètre, temps et tarifs selon les prestations, le volume et les offres. Fonctions des outils : ' : 'Scope, time and pricing depend on service, volume and plan. Tool features: '}<a className="underline underline-offset-2" href="https://openai.com/chatgpt/use-cases/writing-with-ai/" target="_blank" rel="noopener noreferrer">ChatGPT</a>{' · '}<a className="underline underline-offset-2" href="https://www.capcut.com/tools/add-subtitles-to-video" target="_blank" rel="noopener noreferrer">CapCut</a>{' · '}<a className="underline underline-offset-2" href="https://buffer.com/publish" target="_blank" rel="noopener noreferrer">Buffer</a>.</p>
      <div className="mt-9 text-center"><EmpireSalesCta source="home-comparison"/></div>
    </div>
  </section>
}
