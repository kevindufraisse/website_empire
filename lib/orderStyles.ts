// Cartes de la page Tarifs du site. Contrastes renforcés : texte secondaire
// opaque, contours visibles, sélection claire et formule populaire en vert Empire.

export const ORDER_CARD = 'relative rounded-2xl border-2 border-empire/70 bg-gradient-to-b from-[#252c20] to-[#151b11] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_16px_48px_rgba(0,0,0,0.35)]'
export const ORDER_CARD_QUIET = 'relative rounded-2xl border-2 border-white/25 bg-[#17191c]'
export const ORDER_SEGMENTS = 'grid gap-1 rounded-xl border border-white/35 bg-[#17191c] p-1'
export const ORDER_SEGMENT = (active: boolean) => `min-h-11 cursor-pointer rounded-lg px-1.5 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empire ${
  active
    ? 'bg-white text-black shadow-sm'
    : 'text-neutral-200 hover:bg-white/10 hover:text-white'
}`
export const ORDER_TAG = 'inline-block rounded-md border border-empire/50 bg-empire/10 px-2 py-1 text-[11px] font-semibold tabular-nums text-empire'
export const ORDER_LABEL = 'text-xs font-medium uppercase tracking-[0.12em] text-neutral-300'
export const ORDER_CTA = 'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-empire px-4 text-sm font-semibold text-black shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] transition-colors hover:bg-[#e5ff92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empire focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-60'
export const ORDER_CTA_SECONDARY = 'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/50 bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empire disabled:opacity-60'
export const ORDER_PRICE = 'font-semibold leading-none tracking-tight text-white tabular-nums'
export const ORDER_STRUCK = 'font-medium text-neutral-300 line-through decoration-neutral-300 decoration-[1.5px] tabular-nums'
export const ORDER_CHECK = 'mt-0.5 h-4 w-4 shrink-0 text-empire'
