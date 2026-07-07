import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'hero_ab'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

type Variant = 'control' | 'minimal'

export function middleware(req: NextRequest) {
  const existing = req.cookies.get(COOKIE_NAME)?.value
  const variant: Variant =
    existing === 'control' || existing === 'minimal'
      ? existing
      : Math.random() < 0.5
        ? 'minimal'
        : 'control'

  const res =
    variant === 'minimal'
      ? NextResponse.rewrite(new URL('/hero-minimal', req.url))
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
