import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, calculateScore } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        step_completed: 1,
        status: 'new',
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/applications]', err)
    return NextResponse.json({ error: 'Erreur lors de la création.' }, { status: 500 })
  }
}
