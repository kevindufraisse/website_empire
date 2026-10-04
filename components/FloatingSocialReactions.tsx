'use client'

type Kind =
  | 'ig-heart'
  | 'ig-share'
  | 'li-like'
  | 'li-share'
  | 'yt-like'
  | 'yt-share'
  | 'tt-heart'
  | 'tt-share'
  | 'x-heart'
  | 'x-repost'
  | 'fb-like'
  | 'fb-heart'

const REACTIONS: { left: string; delay: string; duration: string; kind: Kind }[] = [
  { left: '4%', delay: '0s', duration: '9s', kind: 'ig-heart' },
  { left: '12%', delay: '3.4s', duration: '11s', kind: 'ig-share' },
  { left: '19%', delay: '1.6s', duration: '10s', kind: 'li-like' },
  { left: '28%', delay: '6.2s', duration: '12s', kind: 'li-share' },
  { left: '36%', delay: '0.8s', duration: '9.5s', kind: 'yt-like' },
  { left: '45%', delay: '4.8s', duration: '11s', kind: 'yt-share' },
  { left: '54%', delay: '2.4s', duration: '10.5s', kind: 'tt-heart' },
  { left: '63%', delay: '7.1s', duration: '12s', kind: 'tt-share' },
  { left: '71%', delay: '1.1s', duration: '9s', kind: 'x-heart' },
  { left: '80%', delay: '5.5s', duration: '11.5s', kind: 'x-repost' },
  { left: '88%', delay: '3s', duration: '10s', kind: 'fb-like' },
  { left: '95%', delay: '8s', duration: '12s', kind: 'fb-heart' },
]

function ReactionGlyph({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'ig-heart':
      return (
        <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden>
          <path
            fill="#FF3040"
            d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
          />
        </svg>
      )
    case 'ig-share':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden>
          <line x1="22" y1="3" x2="9.218" y2="10.083" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <polygon
            fill="none"
            points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'li-like':
      return (
        <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden>
          <circle cx="16" cy="16" r="16" fill="#378FE9" />
          <path
            fill="#fff"
            d="M18.8 12.4h-3.2l.5-3.3c.1-.7-.2-1.2-.8-1.2h-.3c-.4 0-.7.2-.9.5l-2.6 4h-2.7c-.6 0-1.1.5-1.1 1.1v7c0 .6.5 1.1 1.1 1.1h8.3c1.1 0 2-.8 2.1-1.8l.8-6.3c.2-.8-.4-1.4-1.2-1.4z"
          />
          <path fill="#fff" d="M8.3 12.4H6.9c-.6 0-1.1.5-1.1 1.1v7c0 .6.5 1.1 1.1 1.1h1.4v-9.2z" />
        </svg>
      )
    case 'li-share':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden>
          <path
            fill="#378FE9"
            d="M19.5 12.2 14 7v3.1c-5.3.4-8.2 3.3-9.5 8.1 2.4-2.6 5.6-3.9 9.5-3.9V17l5.5-4.8z"
          />
        </svg>
      )
    case 'yt-like':
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <path
            fill="white"
            d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H3v10h4h1h9.43c1.06 0 1.98-.67 2.19-1.61l1.34-6C21.23 12.15 20.18 11 18.77 11zM7 20H4v-8h3v8z"
          />
        </svg>
      )
    case 'yt-share':
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <path
            fill="white"
            d="M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z"
          />
        </svg>
      )
    case 'tt-heart':
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <path
            fill="#FE2C55"
            d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      )
    case 'tt-share':
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <path
            fill="white"
            d="M12.72 2.29a1 1 0 0 1 1.41 0l7.29 7.3a1 1 0 0 1-.7 1.7h-3.1v3.21c0 3.2-2.14 5.5-5.62 5.5H7.2a1 1 0 0 1 0-2h4.8c2.14 0 3.62-1.31 3.62-3.5V11.3h-3.2a1 1 0 0 1-.7-1.7l5-5.31-3.99-4a1 1 0 0 1 0-1.41z"
            transform="translate(-1.2 1.2)"
          />
        </svg>
      )
    case 'x-heart':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden>
          <path
            fill="#F91880"
            d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
          />
        </svg>
      )
    case 'x-repost':
      return (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden>
          <path
            fill="#00BA7C"
            d="M4.75 3.79 9.353 8.09 7.647 9.91 6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75C5.403 20 3.5 18.1 3.5 15.75V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25C18.597 4 20.5 5.9 20.5 8.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"
          />
        </svg>
      )
    case 'fb-like':
      return (
        <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden>
          <circle cx="16" cy="16" r="16" fill="#1877F2" />
          <path
            fill="#fff"
            d="M18.77 12.77h-3.23l.52-3.4c.1-.66-.24-1.2-.83-1.2h-.27c-.36 0-.69.2-.85.52L11.5 12.77H8.73c-.59 0-1.07.48-1.07 1.07v7.09c0 .59.48 1.07 1.07 1.07h8.37c1.07 0 1.96-.8 2.09-1.86l.85-6.4c.16-.84-.49-1.47-1.34-1.47z"
          />
          <path fill="#fff" d="M8.2 12.77H6.8c-.59 0-1.07.48-1.07 1.07v7.09c0 .59.48 1.07 1.07 1.07h1.4V12.77z" />
        </svg>
      )
    case 'fb-heart':
      return (
        <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
          <defs>
            <linearGradient id="fb-love-hero" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF6680" />
              <stop offset="1" stopColor="#E02C5A" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="20" fill="url(#fb-love-hero)" />
          <path
            fill="#fff"
            d="M20 28.6s-6.2-3.9-8.3-7.2c-1.6-2.5-.6-5.5 2.2-6.2 1.6-.4 3.1.3 4.2 1.7 1.1-1.4 2.6-2.1 4.2-1.7 2.8.7 3.8 3.7 2.2 6.2C26.2 24.7 20 28.6 20 28.6z"
          />
        </svg>
      )
  }
}

export default function FloatingSocialReactions() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden motion-reduce:hidden" aria-hidden>
      {REACTIONS.map((reaction, index) => {
        const badge = reaction.kind === 'fb-like' || reaction.kind === 'fb-heart' || reaction.kind === 'li-like'
        return (
          <span
            key={`${reaction.left}-${reaction.kind}`}
            className={`hero-float-reaction absolute bottom-[-48px] flex h-10 w-10 items-center justify-center ${
              badge
                ? 'rounded-full shadow-lg'
                : 'rounded-full border border-white/10 bg-black/55 shadow-lg backdrop-blur-sm'
            } ${index > 5 ? 'hidden sm:flex' : ''}`}
            style={{
              left: reaction.left,
              animationDuration: reaction.duration,
              animationDelay: reaction.delay,
            }}
          >
            <ReactionGlyph kind={reaction.kind} />
          </span>
        )
      })}
    </div>
  )
}
