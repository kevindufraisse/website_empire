import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Check if an incomplete application already exists for this email
    // (step_completed < 6 = not yet submitted)
    const { data: existing } = await supabaseAdmin
      .from('applications')
      .select('id, step_completed')
      .eq('email', body.email.toLowerCase().trim())
      .lt('step_completed', 6)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existing?.id) {
      // Reuse the existing record — update contact info in case it changed
      await supabaseAdmin
        .from('applications')
        .update({
          first_name: body.first_name,
          last_name: body.last_name,
          phone: body.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      return NextResponse.json(
        { id: existing.id, resumed: true, step: existing.step_completed },
        { status: 200 }
      )
    }

    // No existing incomplete application — create a new one
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email.toLowerCase().trim(),
        phone: body.phone,
        step_completed: 1,
        status: 'new',
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id, resumed: false }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/applications]', err)
    return NextResponse.json({ error: 'Erreur lors de la création.' }, { status: 500 })
  }
}
