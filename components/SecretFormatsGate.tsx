'use client'
import { useRef, useState } from 'react'
import { ArrowDown, ArrowRight, LockKeyhole } from 'lucide-react'
import { startFreeTrial } from '@/lib/startTrial'
import { TrialReassurance } from './ui/cta'
import { MasterclassForm, MasterclassThumbnail, useMasterclassRequested } from './sections/HomeMasterclassGate'
import s from './StableHomeJourney.module.css'

/** A normal, permanently mounted page section: scrolling cannot discard a draft. */
export default function SecretFormatsGate({ staticMode = false }: { staticMode?: boolean }) {
  const requested = useMasterclassRequested()
  const [justRequested, setJustRequested] = useState(false)
  const [reservedHeight, setReservedHeight] = useState(0)
  const section = useRef<HTMLElement>(null)
  function confirmed() {
    setReservedHeight(section.current?.offsetHeight || 0)
    setJustRequested(true)
  }
  return <section ref={section} id="formula-secret" className={`${s.secret} ${staticMode ? s.staticSecret : ''}`} data-scene="secret" data-conversion-block="persistent" data-requested={requested === null ? 'loading' : String(requested)} aria-labelledby="secret-formats-title" style={reservedHeight ? { minHeight: staticMode ? reservedHeight : `max(${reservedHeight}px, calc(100svh - 64px))` } : undefined}>
    <div className={s.secretInner}>
      <div className={s.secretCopy}>
        <span className={s.reserved}><LockKeyhole size={14}/>Réservé à l’application</span>
        <h2 id="secret-formats-title">Les autres formats restent secrets.</h2>
        <p>{requested ? 'Retrouve tous les formats directement dans Empire.' : 'Comprends les mécaniques de ces formats dans la masterclass gratuite. Les autres formats se découvrent dans l’application.'}</p>
      </div>
      <div className={s.secretAction}>
        {requested === null ? <div className={s.placeholder} aria-busy="true"/> : requested ? <>
          <p className={s.confirmation} role={justRequested ? 'status' : undefined}>{justRequested ? 'Ta demande de masterclass est enregistrée.' : 'Ta masterclass a déjà été demandée.'}</p>
          <button className={s.trial} onClick={() => startFreeTrial()}>Tester gratuitement<ArrowRight size={18}/></button>
          <TrialReassurance fr stacked className="mt-2.5"/>
        </> : <><div className={s.secretThumbnail}><MasterclassThumbnail/></div><MasterclassForm idPrefix="secret" onReady={confirmed}/></>}
      </div>
    </div>
    <a href="#formula-diffusion" className={s.continue}>Continuer la découverte<ArrowDown size={17}/></a>
  </section>
}
