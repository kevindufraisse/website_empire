import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { buildCertificationPdf } from '@/lib/certificationPdf'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')?.toUpperCase().trim()
    if (!code) {
      return NextResponse.json({ error: 'Code requis' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('certifications')
      .select('first_name, last_name, tier, promotion, issued_at')
      .eq('verification_code', code)
      .limit(1)
      .maybeSingle()

    if (error || !data || !['bronze', 'silver', 'gold'].includes(data.tier)) {
      return NextResponse.json({ error: 'Certification introuvable' }, { status: 404 })
    }

    const origin =
      req.headers.get('x-forwarded-host') && req.headers.get('x-forwarded-proto')
        ? `${req.headers.get('x-forwarded-proto')}://${req.headers.get('x-forwarded-host')}`
        : req.nextUrl.origin

    const verifyUrl = `${origin.replace(/\/$/, '')}/verify?code=${encodeURIComponent(code)}`

    const pdf = await buildCertificationPdf({
      firstName: data.first_name,
      lastName: data.last_name,
      tier: data.tier as 'bronze' | 'silver' | 'gold',
      promotion: data.promotion,
      issuedAtIso: data.issued_at,
      code,
      verifyUrl,
    })

    const safeFile = code.replace(/[^A-Z0-9-]/g, '')
    const filename = `Empire-Certification-${safeFile}.pdf`

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (err) {
    console.error('[GET /api/certifications/pdf]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
