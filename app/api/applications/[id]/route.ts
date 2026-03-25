import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, calculateScore } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { id } = params

    // On the final step, calculate DISC score
    const isFinal = body.step_completed >= 5
    let scoreData = {}
    if (isFinal) {
      const { score, disc } = calculateScore(body)
      scoreData = { score, profile_color: disc, disc_profile: disc }
    }

    const { error } = await supabaseAdmin
      .from('applications')
      .update({
        ...body,
        ...scoreData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/applications/:id]', err)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour.' }, { status: 500 })
  }
}
