import { NextResponse } from 'next/server'
import { getCatalog } from '@/lib/source-api'

export async function GET() {
  try {
    const data = await getCatalog()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Catalog proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 }
    )
  }
}
