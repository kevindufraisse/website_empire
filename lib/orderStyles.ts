import glass from '@/components/pricing/pricing.module.css'

// Surfaces en verre fumé, propres à la page Tarifs du site.
export const ORDER_CARD = `${glass.panel} ${glass.featured} ${glass.plan}`
export const ORDER_CARD_QUIET = `${glass.panel} ${glass.plan}`
export const ORDER_SEGMENTS = `grid gap-1 p-1 ${glass.segments}`
export const ORDER_SEGMENT = `min-h-11 cursor-pointer px-1.5 py-2 text-center ${glass.segment}`
export const ORDER_TAG = `inline-block px-2.5 py-1 text-[11px] font-medium tabular-nums ${glass.tag}`
export const ORDER_LABEL = 'text-xs font-medium uppercase tracking-[0.12em] text-neutral-300'
export const ORDER_CTA = `inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 px-4 text-sm font-semibold disabled:opacity-60 ${glass.primaryButton}`
export const ORDER_CTA_SECONDARY = `inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 px-4 text-sm font-semibold disabled:opacity-60 ${glass.secondaryButton}`
export const ORDER_PRICE = 'font-semibold leading-none tracking-tight text-white tabular-nums'
export const ORDER_STRUCK = 'font-medium text-neutral-300 line-through decoration-neutral-300 decoration-[1.5px] tabular-nums'
export const ORDER_CHECK = 'mt-0.5 h-4 w-4 shrink-0 text-neutral-200'
