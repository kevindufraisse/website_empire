'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import s from './LeadMagnetJourney.module.css'
import './PersistentJourneyViewport.css'

export const LEAD_RESULT_POSTER = '/demo/leadmagnet-result-20261104.jpg'
// Matching visual passage: the original steps card and its French adaptation.
// Offsets are relative to the previously inspected, locally hosted excerpts.
const CLIPS = [
  { key: 'source', title: 'Le Reel original', detail: 'Le format de départ', video: '/demo/leadmagnet-source-20261104.mp4', poster: '/demo/leadmagnet-source-20261104.jpg', start: 3, end: 5.95 },
  { key: 'result', title: 'La version de Kevin', detail: 'Le même format, recréé avec Empire', video: '/demo/leadmagnet-result-20261104.mp4', poster: LEAD_RESULT_POSTER, start: 6, end: 10 },
] as const

/** Both supplied edits stay visible together. Only playback offsets change;
 * the actual video assets, illustrations and subtitles are not reconstructed. */
export default function LeadMagnetComparison({ staticMode = false }: { staticMode?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const still = staticMode || reduced
  useEffect(() => {
    const element = root.current
    if (!element || still) return
    const videos = Array.from(element.querySelectorAll('video'))
    let visible = false
    const sync = () => videos.forEach(video => {
      if (visible && !paused && !document.hidden) video.play().catch(() => {})
      else video.pause()
    })
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: .15 })
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); videos.forEach(video => video.pause()) }
  }, [paused, still])
  function restart() {
    root.current?.querySelectorAll('video').forEach(video => {
      if (Number.isFinite(video.duration)) video.currentTime = Math.min(Number(video.dataset.start || 0), Math.max(0, video.duration - .1))
      video.play().catch(() => {})
    })
    setPaused(false)
  }
  return <div ref={root} className={s.comparison} data-lead-comparison>
    <div className={s.pair}>
      {CLIPS.map(clip => <figure key={clip.key} className={s.clip} data-lead-clip={clip.key}>
        <figcaption><b>{clip.title}</b><span>{clip.detail}</span></figcaption>
        <div className={s.screen}>{still ? <img src={clip.poster} alt={clip.title + ' : illustrations et présentateur dans le même cadre'}/> : <video src={clip.video + '#t=' + clip.start} data-start={clip.start} poster={clip.poster} aria-label={clip.title + ' — extrait réel'} muted playsInline preload="metadata" onLoadedMetadata={event => { event.currentTarget.currentTime = clip.start }} onTimeUpdate={event => { const video = event.currentTarget; if (video.currentTime >= clip.end) video.currentTime = clip.start }} onEnded={event => { const video = event.currentTarget; video.currentTime = clip.start; if (!paused && !document.hidden) video.play().catch(() => {}) }} onError={() => setFailed(true)} />}</div>
      </figure>)}
      <span className={s.pairArrow} aria-hidden="true"><ArrowRight size={22}/></span>
    </div>
    <div className={s.comparisonFooter}>
      <p>Le format d’origine, repris en français avec Kevin.</p>
      {!still && <div className={s.playback}><button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Lire les deux vidéos' : 'Mettre les deux vidéos en pause'}>{paused ? <Play size={15}/> : <Pause size={15}/>}<span>{paused ? 'Lire' : 'Pause'}</span></button><button type="button" onClick={restart} aria-label="Revoir les deux vidéos depuis le début"><RotateCcw size={15}/><span>Revoir</span></button></div>}
      <a href="https://www.instagram.com/reel/De1ncaACJuN/" target="_blank" rel="noreferrer">Voir le Reel de Kevin <ArrowRight size={13}/></a>
    </div>
    {failed && <p className={s.mediaError} role="status">La vidéo ne se charge pas. Les aperçus restent affichés ; le Reel de Kevin est accessible avec le lien ci-dessus.</p>}
  </div>
}
