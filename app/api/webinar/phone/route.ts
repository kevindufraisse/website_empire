import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createOrUpdateContact } from '@/lib/systemeio'

export const runtime = 'nodejs'

interface PhoneBody {
  contactId?: number
  email?: string
  telephone?: string
  problematique?: string
}

export async function POST(req: NextRequest) {
  let body: PhoneBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  const telephone = (body.telephone || '').trim()
  const problematique = (body.problematique || '').trim()

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  if (telephone) {
    try {
      await createOrUpdateContact({
        email,
        phoneNumber: telephone,
        locale: 'fr',
      })
    } catch (err) {
      console.error('[POST /api/webinar/phone] systemeio update failed', err)
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY
  if (url && serviceKey) {
    try {
      const supabaseAdmin = createClient(url, serviceKey)
      const updates: Record<string, string> = {}
      if (telephone) updates.phone = telephone
      if (problematique) updates.problematique = problematique
      if (Object.keys(updates).length) {
        await supabaseAdmin
          .from('webinar_leads')
          .update(updates)
          .eq('email', email)
      }
    } catch (err) {
      console.error('[POST /api/webinar/phone] supabase update failed', err)
    }
  }

  return NextResponse.json({ success: true })
}
