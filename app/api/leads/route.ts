import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { first_name, phone, email, source = 'youtube' } = body

    if (!phone && !email) {
      return NextResponse.json({ error: 'Téléphone ou email requis.' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .insert({ first_name, phone, email, source })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/leads]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
