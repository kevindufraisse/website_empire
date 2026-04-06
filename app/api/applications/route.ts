import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Check if ANY application exists for this email - always reuse the most advanced one
    const { data: existing } = await supabaseAdmin
      .from('applications')
      .select('id, step_completed, disc_profile')
      .eq('email', body.email.toLowerCase().trim())
      .order('step_completed', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existing?.id) {
      // Always reuse - update contact info
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
        {
          id: existing.id,
          resumed: true,
          step: existing.step_completed,
          completed: existing.step_completed >= 6,
          disc_profile: existing.disc_profile ?? null,
        },
        { status: 200 }
      )
    }

    // No existing application at all - create a new one
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
