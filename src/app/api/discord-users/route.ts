import { NextResponse } from 'next/server'

/**
 * Very simple in-memory cache.
 * (Resets whenever your serverless instance restarts.)
 */
const nameCache = new Map<string, string>()

const MAX_RETRIES = 2

/**
 * Fetch a single user.
 */
async function fetchMemberWithRetry(id: string, token: string, serverId: string) {
  const url = `https://discord.com/api/guilds/${serverId}/members/${id}`
  let attempt = 0

  while (true) {
    attempt++

    if (attempt > MAX_RETRIES) {
      throw new Error(`Too many retries (${MAX_RETRIES}) fetching member ${id}`)
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bot ${token}` },
    })

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('retry-after') ?? '1') * 1000
      console.warn(`Rate limited fetching ${id}, retry #${attempt} in ${retryAfter}ms`)
      await new Promise((r) => setTimeout(r, retryAfter))
      continue
    }

    if (res.status === 404) {
      return fetchUserGlobal(id, token)
    }

    if (!res.ok) {
      throw new Error(`Discord API ${res.status} for Member ${id}`)
    }

    const member = await res.json() as {
      nick: string | null
      user: { username: string; discriminator: string; global_name: string | null }
    }

    const displayName =
      member.nick ?? member.user.global_name ?? `${member.user.username}#${member.user.discriminator}`

    return { id, displayName }
  }
}

/**
 * Fetch a user by ID from the Discord API.
 * If the user is not a member of the server, fetch their global info.
 */
async function fetchUserGlobal(id: string, token: string) {
  const res = await fetch(`https://discord.com/api/users/${id}`, {
    headers: { Authorization: `Bot ${token}` },
  })
  if (!res.ok) {
    throw new Error(`Discord API ${res.status} for User ${id}`)
  }
  const u = await res.json() as {
    username: string
    discriminator: string
    global_name: string | null
  }
  const displayName = u.global_name ?? `${u.username}#${u.discriminator}`
  return { id, displayName }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const idsParam = url.searchParams.get('ids')
  if (!idsParam) {
    return NextResponse.json({ error: 'Missing `ids` query parameter' }, { status: 400 })
  }

  const ids = idsParam.split(',').filter(Boolean)
  const token = process.env.DISCORD_BOT_TOKEN!
  const serverId = process.env.DISCORD_SERVER_ID!
  if (!token || !serverId) {
    return NextResponse.json({ error: 'Bot token or Server ID missing' }, { status: 500 })
  }

  try {
    const users: { id: string; displayName: string }[] = []

    for (const id of ids) {
      if (nameCache.has(id)) {
        users.push({ id, displayName: nameCache.get(id)! })
      } else {
        const member = await fetchMemberWithRetry(id, token, serverId)
        nameCache.set(id, member.displayName)
        users.push(member)
      }
      // small delay between calls to avoid hitting rate limits
      await new Promise((r) => setTimeout(r, 100))
    }

    return NextResponse.json({ users })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 })
  }
}
