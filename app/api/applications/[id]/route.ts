import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { calculateScore } from '@/lib/scoring'
import { waitUntil } from '@vercel/functions'
import { shouldTagApplication, tagCompletedApplication, type ApplicationBeforeUpdate } from '@/lib/applicationTag'

// Le tag Systeme.io part après la réponse (waitUntil) : la recherche d'un
// contact existant y prend parfois plus de 10 s, le candidat n'attend pas.
export const maxDuration = 60

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/applications/:id]', err)
    return NextResponse.json({ error: 'Introuvable.' }, { status: 404 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { id } = params

    // On the final step, calculate DISC score
    const isFinal = body.step_completed >= 6
    let scoreData = {}
    let prev: ApplicationBeforeUpdate | null = null
    if (isFinal) {
      const { score, disc } = calculateScore(body)
      scoreData = { score, profile_color: disc, disc_profile: disc }
      // Lu AVANT l'écriture : c'est ce qui dit si la candidature était déjà
      // complète (un renvoi ne doit pas relancer la séquence d'emails).
      const { data } = await supabaseAdmin
        .from('applications')
        .select('step_completed, email, first_name, last_name')
        .eq('id', id)
        .single()
      prev = data
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

    // Candidature complète pour la première fois → tag Systeme.io, qui inscrit
    // à la campagne « Candidature reçue ». La candidature est déjà en base :
    // rien de ce qui suit ne peut faire échouer le formulaire.
    if (prev && shouldTagApplication(prev, body.step_completed)) {
      waitUntil(tagCompletedApplication(prev))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/applications/:id]', err)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour.' }, { status: 500 })
  }
}
