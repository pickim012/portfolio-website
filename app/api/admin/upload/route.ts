import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { assertAdmin } from '@/lib/require-admin'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])

export async function POST(request: Request) {
  try {
    await assertAdmin()
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 })
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Image must be 20MB or smaller' }, { status: 400 })

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const blob = await put(`artwork/${crypto.randomUUID()}.${extension}`, file, { access: 'public', addRandomSuffix: false })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[admin upload]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
