import { NextResponse } from 'next/server'
import { getBalance } from '@/lib/source-api'

export async function GET() {
  try {
    const data = await getBalance()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Balance proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    )
  }
}
