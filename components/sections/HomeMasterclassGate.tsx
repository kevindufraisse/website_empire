'use client'

import { useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUpRight, Check, Mail, Play } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAutopilot } from '@/contexts/AutopilotContext'
import { storeVideoEmail } from '@/components/VideoEmailGate'
import { trackAmplitude } from '@/lib/amplitude'

export default function HomeMasterclassGate() {
  const {lang}=useLanguage();const fr=lang==='fr';const {autopilot}=useAutopilot()
  const [email,setEmail]=useState('');const [company,setCompany]=useState('')
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle')
  const [invalid,setInvalid]=useState(false)
  const [thumbnailUnavailable,setThumbnailUnavailable]=useState(false)
  if(autopilot)return null
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if(status==='loading')return
    setStatus('loading');setInvalid(false)
    try {
      const res=await fetch('/api/home-masterclass',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,company,locale:lang})})
      const data=await res.json()
      if(!res.ok||!data.success){setInvalid(data.code==='invalid_fields');setStatus('error');return}
      storeVideoEmail(email.trim().toLowerCase())
      setStatus('success')
      trackAmplitude('home_masterclass_requested')
    } catch {setStatus('error')}
  }
  return <section className="relative border-y border-white/10 bg-[#111111] py-16 md:py-20" aria-labelledby="masterclass-title" id="home-masterclass">
    <div className="container mx-auto grid max-w-5xl items-center gap-9 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
      <a href="/vsl" target="_blank" rel="noopener noreferrer" aria-label={fr ? 'Voir la masterclass gratuite de 1 h 26' : 'Watch the free 1h26 masterclass'} className="group relative mx-auto block w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_20px_70px_#0005] transition hover:border-empire/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-empire">
        <div className="relative aspect-video overflow-hidden">
          {thumbnailUnavailable ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#181b15]"><span className="grid h-12 w-16 place-items-center rounded-xl bg-[#ff0033] text-white"><Play size={24} fill="currentColor"/></span><span className="text-sm font-semibold text-white">{fr ? 'Voir la masterclass sur YouTube' : 'Watch the masterclass on YouTube'}</span></div> : <img src="https://i.ytimg.com/vi/AKfoDblGUNs/maxresdefault.jpg" alt={fr ? 'Miniature YouTube de la masterclass de Kevin Dufraisse' : 'YouTube thumbnail of Kevin Dufraisse’s masterclass'} width={1280} height={720} loading="lazy" onError={()=>setThumbnailUnavailable(true)} className="absolute inset-0 h-full w-full object-cover" />}
          <span className="absolute right-3 top-3 rounded bg-black/75 px-2 py-1 text-[10px] font-bold tracking-wider text-white">1 H 26</span>
          <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-empire text-black shadow-lg transition group-hover:scale-110"><Play size={16} fill="currentColor" aria-hidden /></span>
        </div>
      </a>
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-empire">{fr?'Gratuite · Très recommandée':'Free · Highly recommended'}</p>
        <h2 id="masterclass-title" className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl">{fr?'Avant de découvrir la suite…':'Before you discover the rest…'}</h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-400">{fr?'Recevez la masterclass de 1 h 26 pour comprendre la formule, ce qui fait qu’un contenu est vu et comment l’appliquer à votre activité. À regarder quand vous voulez.':'Get the 1h26 masterclass to understand the formula, what gets content seen, and how to apply it to your business. Watch whenever you like.'}</p>
        {status==='success'?<div role="status" className="mt-6 rounded-xl border border-empire/25 bg-empire/5 p-5"><p className="flex items-center gap-2 font-semibold text-empire"><Check size={18}/>{fr?'Votre demande est enregistrée.':'Your request is registered.'}</p><p className="mt-2 text-sm text-neutral-300">{fr?'Vous pouvez aussi ouvrir la masterclass dès maintenant.':'You can also open the masterclass now.'}</p><a href="/vsl" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-white underline underline-offset-4">{fr?'Voir la masterclass':'Watch the masterclass'}<ArrowUpRight size={15}/></a></div>:<form onSubmit={submit} className="mt-6" aria-label={fr?'Recevoir la masterclass':'Receive the masterclass'}>
          <label htmlFor="masterclass-email" className="mb-2 block text-xs font-medium text-neutral-300">{fr?'Votre email':'Your email'}</label>
          <div className="flex flex-col gap-2 sm:flex-row"><input id="masterclass-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@entreprise.com" aria-invalid={status==='error'&&invalid} aria-describedby={status==='error'?'masterclass-error':undefined} disabled={status==='loading'} className="min-h-12 min-w-0 flex-1 rounded-lg border border-white/20 bg-black/30 px-4 text-sm text-white outline-none focus:border-empire disabled:opacity-60"/><button type="submit" disabled={status==='loading'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-empire px-4 text-sm font-bold text-black transition hover:bg-[#e5ff91] disabled:opacity-60"><Mail size={15}/>{status==='loading'?(fr?'Enregistrement…':'Registering…'):(fr?'Recevoir gratuitement':'Send it to me free')}</button></div>
          <div className="hidden" aria-hidden><label htmlFor="masterclass-company">Company</label><input id="masterclass-company" name="company" value={company} onChange={e=>setCompany(e.target.value)} tabIndex={-1} autoComplete="off"/></div>
          {status==='error'&&<p role="alert" id="masterclass-error" className="mt-3 text-xs text-red-300">{invalid?(fr?'Vérifiez votre adresse email.':'Please check your email address.'):(fr?'L’inscription n’a pas abouti. Réessayez, ou continuez la découverte.':'Registration did not complete. Try again, or continue exploring.')}</p>}
        </form>}
        <a href="#formula-message" onClick={()=>trackAmplitude('home_masterclass_skipped')} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded px-1 text-sm text-neutral-300 underline decoration-white/20 underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-empire">{status==='success'?(fr?'Continuer la découverte':'Keep exploring'):(fr?'Passer et découvrir la formule':'Skip and discover the formula')}<ArrowDown size={14}/></a>
      </div>
    </div>
  </section>
}
