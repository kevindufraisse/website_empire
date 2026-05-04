import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')?.toUpperCase().trim()

    if (!code) {
      return NextResponse.json({ error: 'Code requis' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('certifications')
      .select('first_name, last_name, tier, promotion, issued_at, linkedin_url, photo_url')
      .eq('verification_code', code)
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ valid: false }, { status: 404 })
    }

    return NextResponse.json({
      valid: true,
      first_name: data.first_name,
      last_name: data.last_name,
      tier: data.tier,
      promotion: data.promotion,
      issued_at: data.issued_at,
      linkedin_url: data.linkedin_url,
      photo_url: data.photo_url,
    })
  } catch (err) {
    console.error('[GET /api/certifications/verify]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
