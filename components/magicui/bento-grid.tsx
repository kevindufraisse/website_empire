import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-3 gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string
  className: string
  background: ReactNode
  Icon: any
  description: string
  href: string
  cta: string
}) => (
  <div
    key={name}
    className={cn(
      'group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-xl',
      'bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10',
      'hover:border-empire/30 transition-all',
      className
    )}
  >
    {/* Background - derrière tout */}
    <div className="absolute inset-0">{background}</div>
    
    {/* Overlay gradient pour assurer la lisibilité */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    
    {/* Contenu - devant avec z-index */}
    <div className="relative z-10 flex transform-gpu flex-col gap-1 p-6">
      {/* Icon removed as per user request */}
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    
    {/* Hover overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] z-5" />
  </div>
)

export { BentoCard, BentoGrid }

