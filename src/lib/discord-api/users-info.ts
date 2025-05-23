export type UserDisplay = { id: string; displayName: string }

export async function fetchDiscordUsers(ids: string[]): Promise<UserDisplay[]> {
  if (ids.length === 0) return []

  const res = await fetch(`/api/discord-users?ids=${ids.join(',')}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? 'Failed to fetch Discord users')
  }

  const data = await res.json()
  return data.users as UserDisplay[]
}