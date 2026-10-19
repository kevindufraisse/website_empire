// Mêmes classes que `empire-tracking/src/lib/orderStyles.ts` (le pricing et les
// pages de commande de l'app) : un prospect qui passe du site à l'app retrouve
// les mêmes cartes. Bord clair en haut, ombre profonde, seul le bouton principal
// est blanc plein.

export const ORDER_CARD = 'relative rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#17171a] to-[#0e0e10] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_40px_90px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,0,0,0.6)]'
export const ORDER_CARD_QUIET = 'relative rounded-2xl border border-white/[0.07] bg-white/[0.02]'
export const ORDER_SEGMENTS = 'grid gap-1 rounded-xl border border-white/[0.07] bg-black/50 p-1'
export const ORDER_SEGMENT = (active: boolean) => `cursor-pointer rounded-lg px-1.5 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
  active
    ? 'bg-[#26262b] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.6)]'
    : 'text-white/45 hover:text-white/80'
}`
export const ORDER_TAG = 'inline-block rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-px text-[10px] font-semibold tabular-nums text-white/70'
export const ORDER_LABEL = 'text-[11px] font-medium uppercase tracking-[0.14em] text-white/40'
export const ORDER_CTA = 'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_8px_24px_-8px_rgba(255,255,255,0.25)] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-60'
export const ORDER_CTA_SECONDARY = 'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.03] px-4 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-60'
export const ORDER_PRICE = 'font-semibold leading-none tracking-tight text-white tabular-nums'
export const ORDER_STRUCK = 'font-medium text-white/35 line-through decoration-white/40 decoration-[1.5px] tabular-nums'
export const ORDER_CHECK = 'mt-0.5 h-4 w-4 shrink-0 text-white/60'
