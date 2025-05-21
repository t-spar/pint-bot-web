'use client'

import { useState, useEffect } from 'react'
import { fetchDiscordUsers, UserDisplay } from '@/lib/discord-api/users-info'

export function useDiscordUsers(ids: string[]) {
  const [users, setUsers] = useState<UserDisplay[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDiscordUsers(ids)
        if (!cancelled) setUsers(data)
      } catch (err: any) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [ids.join(',')])

  return { users, loading, error }
}