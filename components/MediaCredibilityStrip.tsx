'use client'

const OUTLETS = [
  'BIG MEDIA',
  'BFM BUSINESS',
  'NOUVEL OBS',
  'THE FAMILY',
]

interface MediaCredibilityStripProps {
  className?: string
}

export default function MediaCredibilityStrip({ className = '' }: MediaCredibilityStripProps) {
  return (
    <div className={`relative z-10 w-full ${className}`}>
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 whitespace-nowrap">
            Vu sur
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1.5">
            {OUTLETS.map((outlet) => (
              <span
                key={outlet}
                className="text-[11px] md:text-xs font-bold tracking-[0.12em] uppercase text-neutral-300/80 whitespace-nowrap"
              >
                {outlet}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
