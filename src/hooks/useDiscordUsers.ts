'use client'

import { useState, useEffect, useMemo } from 'react'
import { fetchDiscordUsers, UserDisplay } from '@/lib/discord-api/users-info'

export function useDiscordUsers(ids: string[]) {
  const [users, setUsers] = useState<UserDisplay[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const idsKey = useMemo(() => {
    const sorted = [...ids].sort((a, b) => a.localeCompare(b))
    return JSON.stringify(sorted)
  }, [ids])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const parsedIds: string[] = JSON.parse(idsKey)
        const data = await fetchDiscordUsers(parsedIds)
        if (!cancelled) setUsers(data)
      } catch (err: any) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [idsKey])

  return { users, loading, error }
}