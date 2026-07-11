import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'hero_ab'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const VARIANTS = ['control', 'minimal', 'pricing'] as const
type Variant = (typeof VARIANTS)[number]

function isVariant(v: string | undefined): v is Variant {
  return VARIANTS.includes(v as Variant)
}

export function middleware(req: NextRequest) {
  const existing = req.cookies.get(COOKIE_NAME)?.value
  const variant: Variant = isVariant(existing)
    ? existing
    : VARIANTS[Math.floor(Math.random() * VARIANTS.length)]

  const res =
    variant === 'minimal'
      ? NextResponse.rewrite(new URL('/hero-minimal', req.url))
      : variant === 'pricing'
        ? NextResponse.rewrite(new URL('/hero-pricing', req.url))
        : NextResponse.next()

  if (existing !== variant) {
    res.cookies.set(COOKIE_NAME, variant, {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    })
  }

  return res
}

export const config = {
  matcher: '/',
}
