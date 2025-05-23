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
    return <p className="p-8">Loading…</p>
  }
  if (errorDebts) {
    return <p className="p-8 text-red-500">Error loading debts: {errorDebts}</p>
  }
  if (errorUsers) {
    return <p className="p-8 text-red-500">Error loading user names: {errorUsers}</p>
  }

  /**
 * Turn a string like "91/6" into "15 1/6",
 * "7/3" into "2 1/3", "4/2" into "2", "3/4" stays "3/4", and
 * plain numbers pass through unchanged.
 */
  function formatMixed(fraction: string): string {
    // if it’s not a fraction, just return it
    if (!fraction.includes('/')) return fraction;

    const [numStr, denStr] = fraction.split('/');
    const num = parseInt(numStr, 10);
    const den = parseInt(denStr, 10);

    if (isNaN(num) || isNaN(den) || den === 0) return fraction;

    const whole = Math.floor(num / den);
    const rem = num % den;

    if (rem === 0) {
      // exact division
      return String(whole);
    }
    if (whole === 0) {
      // proper fraction
      return `${rem}/${den}`;
    }
    // mixed number
    return `${whole} ${rem}/${den}`;
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