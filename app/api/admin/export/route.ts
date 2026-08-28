import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactsContent, cvContent, exhibitions, homeContent, paintings, textsContent } from '@/lib/db/schema'
import { assertAdmin } from '@/lib/require-admin'

export async function GET() {
  try {
    await assertAdmin()
    const [home, exhibitionsRows, paintingsRows, cv, contacts, texts] = await Promise.all([
      db.select().from(homeContent),
      db.select().from(exhibitions),
      db.select().from(paintings),
      db.select().from(cvContent),
      db.select().from(contactsContent),
      db.select().from(textsContent),
    ])
    const backup = { exportedAt: new Date().toISOString(), home, exhibitions: exhibitionsRows, paintings: paintingsRows, cv, contacts, texts }
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="kim-yeadam-content-backup.json"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[admin export]', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
