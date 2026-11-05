'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import s from './LeadMagnetJourney.module.css'
import './PersistentJourneyViewport.css'

export const LEAD_RESULT_POSTER = '/demo/leadmagnet-result-synced-20261105.jpg'
// The French preview is retimed against the original script's visual landmarks.
// Both silent previews share a fifteen-second comparison timeline.
const CLIPS = [
  { key: 'source', title: 'Le Reel original', detail: 'Script original · anglais', video: '/demo/leadmagnet-source-opening-20261105.mp4', poster: '/demo/leadmagnet-source-synced-20261105.jpg' },
  { key: 'result', title: 'Le clone de Kevin', detail: 'Même script traduit · français', video: '/demo/leadmagnet-result-synced-20261105.mp4', poster: LEAD_RESULT_POSTER },
] as const

export default function LeadMagnetComparison({ staticMode = false }: { staticMode?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const restartPair = useRef<() => void>(() => {})
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const still = staticMode || reduced
  useEffect(() => {
    const element = root.current
    if (!element || still) return
    const videos = Array.from(element.querySelectorAll('video'))
    const [master, follower] = videos
    if (!master || !follower) return
    let visible = false, frame = 0, disposed = false, starting = false
    const shouldPlay = () => visible && !paused && !document.hidden && !element.closest('[aria-hidden="true"]')
    const stop = () => videos.forEach(video => video.pause())
    const ready = () => videos.every(video => video.readyState >= 3 && !video.seeking)
    const reset = () => {
      stop()
      videos.forEach(video => { if (Number.isFinite(video.duration)) video.currentTime = 0 })
      sync()
    }
    function sync() {
      if (disposed) return
      if (!shouldPlay()) { stop(); return }
      if (ready() && !starting && videos.some(video => video.paused)) {
        starting = true
        Promise.all(videos.map(video => video.play())).catch(stop).finally(() => { starting = false })
      } else if (!ready()) stop()
      if (!frame) frame = requestAnimationFrame(tick)
    }
    function tick() {
      frame = 0
      if (disposed || !shouldPlay()) { stop(); return }
      if (videos.some(video => video.ended) || master.currentTime >= 14.96) {
        reset()
      } else if (!ready()) {
        stop()
      } else {
        // One clock owns both previews, including after buffering and tab changes.
        if (Math.abs(master.currentTime - follower.currentTime) > .12) {
          stop()
          follower.currentTime = master.currentTime
        }
      }
      sync()
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: .15 })
    observer.observe(element)
    const pane = element.closest('[data-journey-pane]')
    const mutations = new MutationObserver(sync)
    if (pane) mutations.observe(pane, { attributes: true, attributeFilter: ['aria-hidden'] })
    const onWaiting = () => { stop(); sync() }
    const onSeeked = () => {
      // External seeks and "Revoir" also keep the follower on the shared clock.
      if (!master.seeking && !follower.seeking && Math.abs(master.currentTime - follower.currentTime) > .12) follower.currentTime = master.currentTime
      sync()
    }
    videos.forEach(video => {
      video.addEventListener('canplay', sync)
      video.addEventListener('waiting', onWaiting)
      video.addEventListener('seeking', stop)
      video.addEventListener('seeked', onSeeked)
      video.addEventListener('ended', reset)
    })
    document.addEventListener('visibilitychange', sync)
    restartPair.current = reset
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      mutations.disconnect()
      document.removeEventListener('visibilitychange', sync)
      videos.forEach(video => {
        video.removeEventListener('canplay', sync)
        video.removeEventListener('waiting', onWaiting)
        video.removeEventListener('seeking', stop)
        video.removeEventListener('seeked', onSeeked)
        video.removeEventListener('ended', reset)
      })
      stop()
      restartPair.current = () => {}
    }
  }, [paused, still])
  function restart() {
    restartPair.current()
    setPaused(false)
  }
  return <div ref={root} className={s.comparison} data-lead-comparison>
    <div className={s.pair}>
      {CLIPS.map(clip => <figure key={clip.key} className={s.clip} data-lead-clip={clip.key}>
        <figcaption><b>{clip.title}</b><span>{clip.detail}</span></figcaption>
        <div className={s.screen}>{still ? <img src={clip.poster} alt={clip.title + ' : même script, de l’anglais au français'}/> : <video src={clip.video} data-start="0" poster={clip.poster} aria-label={clip.title + ' — extrait réel'} muted playsInline preload="auto" onError={() => setFailed(true)} />}</div>
      </figure>)}
      <span className={s.pairArrow} aria-hidden="true"><ArrowRight size={22}/></span>
    </div>
    <div className={s.comparisonFooter}>
      <p>Même script. Traduit en français, recréé avec Kevin.</p>
      {!still && <div className={s.playback}><button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Lire les deux vidéos' : 'Mettre les deux vidéos en pause'}>{paused ? <Play size={15}/> : <Pause size={15}/>}<span>{paused ? 'Lire' : 'Pause'}</span></button><button type="button" onClick={restart} aria-label="Revoir les deux vidéos depuis le début"><RotateCcw size={15}/><span>Revoir</span></button></div>}
      <a href="https://www.instagram.com/reel/De1ncaACJuN/" target="_blank" rel="noreferrer">Voir le Reel de Kevin <ArrowRight size={13}/></a>
    </div>
    {failed && <p className={s.mediaError} role="status">La vidéo ne se charge pas. Les aperçus restent affichés ; le Reel de Kevin est accessible avec le lien ci-dessus.</p>}
  </div>
}
