import { NextResponse } from 'next/server'

/**
 * Very simple in-memory cache.
 * (Resets whenever your serverless instance restarts.)
 */
const nameCache = new Map<string, string>()

/**
 * Fetch a single user.
 */
async function fetchUserWithRetry(id: string, token: string): Promise<{ id: string; displayName: string }> {
  const url = `https://discord.com/api/users/${id}`
  let attempt = 0

  while (true) {
    attempt++
    const res = await fetch(url, {
      headers: { Authorization: `Bot ${token}` },
    })

    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after')
      const waitMs = retryAfter ? Number(retryAfter) * 1000 : 1000
      console.warn(`429 for ${id}, retrying after ${waitMs}ms (attempt ${attempt})`)
      await new Promise((r) => setTimeout(r, waitMs))
      continue
    }

    if (!res.ok) {
      throw new Error(`Discord API ${res.status} for ID ${id}`)
    }

    const u = await res.json()
    const displayName = u.global_name || `${u.username}#${u.discriminator}`
    return { id, displayName }
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const idsParam = url.searchParams.get('ids')
  if (!idsParam) {
    return NextResponse.json({ error: 'Missing `ids` query parameter' }, { status: 400 })
  }

  const ids = idsParam.split(',').filter(Boolean)
  const token = process.env.DISCORD_BOT_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 })
  }

  try {
    const users: { id: string; displayName: string }[] = []

    for (const id of ids) {
      if (nameCache.has(id)) {
        users.push({ id, displayName: nameCache.get(id)! })
      } else {
        const { displayName } = await fetchUserWithRetry(id, token)
        nameCache.set(id, displayName)
        users.push({ id, displayName })
      }
      await new Promise((r) => setTimeout(r, 100))
    }

    return NextResponse.json({ users })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}