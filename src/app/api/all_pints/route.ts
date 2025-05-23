import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(`${process.env.BOT_API_URL}/all_pints`)
  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream error ${res.status}` },
      { status: res.status }
    )
  }
  const data = await res.json()
  return NextResponse.json(data)
}