'use client'

import React, { useEffect, useState } from 'react'
import { getAllDebts } from '@/lib/pint-bot-api/debts'
import { useDiscordUsers } from '@/hooks/useDiscordUsers'
import { DebtEntry } from '@/lib/pint-bot-api/utils'
import { formatMixed } from '@/lib/utils/formatting'

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
    return <p className="p-8">Loading…</p>
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
        <p>No pint debts found.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {debts.map((d) => {
            const found = discordUsers.find(u => u.id === String(d.id))
            const displayName = found?.displayName ?? `User ${d.id}`

            return (
              <li key={d.id} className="border p-4 rounded">
                <p><strong>{displayName}</strong></p>
                <p><em>owes</em> {formatMixed(d.owes)} pints</p>
                <p><em>owed</em> {formatMixed(d.isOwed)} pints</p>
              </li>
            )
          })}
        </ul>
      )}

      <section className="text-right">
        <h2 className="font-semibold">Total in Circulation:</h2>
        <p className="text-lg">{formatMixed(total)} pints</p>
      </section>
    </main>
  )
}