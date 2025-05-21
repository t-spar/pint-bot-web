'use client'

import React, { useEffect, useState } from 'react'
import { getAllDebts, DebtEntry } from '@/lib/pint-bot-api/debts'
import { useDiscordUsers } from '@/hooks/useDiscordUsers'

export default function DebtsClient() {
  const [debts, setDebts] = useState<DebtEntry[]>([])
  const [total, setTotal] = useState<string>('0')
  const [loadingDebts, setLoadingDebts] = useState(true)
  const [errorDebts, setErrorDebts] = useState<string>()

  useEffect(() => {
    getAllDebts()
      .then(({ debts, total }) => {
        setDebts(debts)
        setTotal(total)
      })
      .catch(err => {
        console.error(err)
        setErrorDebts(err.message)
      })
      .finally(() => setLoadingDebts(false))
  }, [])

  const ids = debts.map(d => String(d.id))
  const {
    users: discordUsers,
    loading: loadingUsers,
    error: errorUsers,
  } = useDiscordUsers(ids)

  if (loadingDebts || loadingUsers) {
    return <p className="p-8 text-gray-500">Loading…</p>
  }
  if (errorDebts) {
    return <p className="p-8 text-red-500">Error loading debts: {errorDebts}</p>
  }
  if (errorUsers) {
    return <p className="p-8 text-red-500">Error loading user names: {errorUsers}</p>
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Pint Debts</h1>

      {debts.length === 0 ? (
        <p className="text-gray-500">No pint debts found.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {debts.map((d) => {
            const found = discordUsers.find(u => u.id === String(d.id))
            const displayName = found?.displayName ?? `User ${d.id}`

            return (
              <li key={d.id} className="border p-4 rounded">
                <p>
                  <strong>{displayName}</strong> owes <em>{d.owes} pints</em> and is owed <em>{d.isOwed} pints</em>
                </p>
              </li>
            )
          })}
        </ul>
      )}

      <section className="text-right">
        <h2 className="font-semibold">Total in Circulation:</h2>
        <p className="text-lg">{total} pints</p>
      </section>
    </main>
  )
}