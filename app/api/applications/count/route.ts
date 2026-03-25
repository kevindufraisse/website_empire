import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const revalidate = 60 // cache for 60 seconds

export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('applications')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    return NextResponse.json({ count: count ?? 0 }, { status: 200 })
  } catch (err) {
    console.error('[GET /api/applications/count]', err)
    return NextResponse.json({ count: 0 }, { status: 200 })
  }
}
