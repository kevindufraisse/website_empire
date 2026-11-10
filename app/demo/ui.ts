// Classes partagées par les étapes de /demo. Mêmes codes que la home
// (HeroSection) : bouton lime, texte noir, rayon 12 px, cartes #111.
export const primaryButton =
  'group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-empire px-5 py-3.5 sm:px-8 text-base font-bold text-black shadow-[0_0_30px_rgb(var(--empire-rgb)_/_0.35)] transition-all [@media(hover:hover)]:hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-empire'
// Même gabarit que le bouton lime (hauteur, texte, largeur), contour blanc
// 1,5 px à 60 % : bien visible sur le noir (components/ui/cta.tsx).
export const secondaryButton =
  'group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-[1.5px] border-white/60 bg-[#0a0a0a] px-5 py-3.5 sm:px-8 text-base font-bold text-white transition hover:border-white hover:bg-[#151515] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
export const badge = 'inline-flex items-center gap-2 rounded-full border border-empire/40 bg-empire/10 px-4 py-1.5 text-xs font-bold text-empire'
export const card = 'rounded-2xl border border-white/10 bg-[#111]'
export const input =
  'w-full rounded-xl border border-white/20 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 transition-all focus:border-empire/60 focus:outline-none focus:ring-1 focus:ring-empire/40'
export const label = 'mb-1.5 block text-sm font-medium text-neutral-300'
export const fieldError = 'text-sm text-red-300'
