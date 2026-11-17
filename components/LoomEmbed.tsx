'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

/** The long-form sales video (~20 min) used on /vsl, /thank-you and the quiz result. */
export const VSL_LOOM_ID = '184e8823d9154d74aeca55a5cd488f08'
/** Hero demo (~1 min) that sat on the homepage before the July 2026 animation swap. */
export const DEMO_1MIN_LOOM_ID = '9751f76501dc436f8728f46736d7aea8'

interface Props {
  /** Loom video id. Defaults to the long VSL. */
  id?: string
  /** Applied to the 16:9 wrapper. */
  className?: string
  title?: string
  /** Show a lightweight play button and only load Loom once clicked. */
  facade?: boolean
  /** Image shown behind the play button (a frame of the video), instead of the plain gradient. */
  poster?: string
}

export default function LoomEmbed({ id = VSL_LOOM_ID, className = '', title, facade, poster }: Props) {
  const [playing, setPlaying] = useState(!facade)
  const src =
    `https://www.loom.com/embed/${id}` +
    '?hideEmbedTopBar=true&hide_owner=true&hide_share=true&hide_speed=true&hide_title=true&t=0' +
    (facade ? '&autoplay=1' : '')

  if (!playing) return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-white/15 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(212,165,116,.28),rgba(20,18,16,.9)_55%,#0b0a09)] text-left shadow-2xl ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      {poster && <span className="absolute inset-0 bg-black/25" aria-hidden />}
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-autopilot text-[#17110b] shadow-[0_0_0_10px_rgba(212,165,116,.15)] transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
          <Play aria-hidden className="ml-1 h-7 w-7 fill-current" />
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-10 text-sm font-medium text-white/90 sm:text-base">
        {title}
      </span>
    </button>
  )

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-900/50 ${className}`}
      style={{ paddingBottom: '56.25%' }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
