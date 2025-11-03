import { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
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
    
    {/* Contenu - devant avec z-index, remonte au hover */}
    <div className="relative z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-8">
      {/* Icon removed as per user request */}
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    {/* CTA au hover - apparaît en bas */}
    <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-full transform-gpu flex-row items-center p-6 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
      <a 
        href={href}
        className="pointer-events-auto flex items-center gap-2 rounded-lg bg-empire/20 border border-empire/30 px-4 py-2 text-sm font-semibold text-white hover:bg-empire/30 transition-colors"
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
    
    {/* Hover overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] z-5" />
  </div>
)

export { BentoCard, BentoGrid }

