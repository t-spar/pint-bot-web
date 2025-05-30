"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDiscordUsers } from "@/hooks/useDiscordUsers";
import { DebtEntry } from "@/lib/pint-bot-api/utils";
import { getUserDebts } from "@/lib/pint-bot-api/users";
import { formatMixed } from "@/lib/utils/formatting";

export default function UserDebtsClient() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [debts, setDebts] = useState<DebtEntry[]>([]);
  const [totalOwes, setTotalOwes] = useState<string>("0");
  const [totalIsOwed, setTotalIsOwed] = useState<string>("0");
  const [loadingDebts, setLoadingDebts] = useState(true);
  const [errorDebts, setErrorDebts] = useState<string>();

  useEffect(() => {
    if (!userId) return;

    getUserDebts(userId)
      .then(({ debts, totalOwes, totalIsOwed }) => {
        setDebts(debts);
        setTotalOwes(totalOwes);
        setTotalIsOwed(totalIsOwed);
      })
      .catch((err) => {
        console.error(err);
        setErrorDebts(err.message);
      })
      .finally(() => setLoadingDebts(false));
  }, [userId]);

  const ids = debts.map((d) => String(d.id));
  const { users: discordUsers, loading: loadingUsers, error: errorUsers } = useDiscordUsers(ids);

  if (!userId) return <p className="p-8">Not signed in</p>;
  if (loadingDebts || loadingUsers) return <p className="p-8">Loading…</p>;
  if (errorDebts) return <p className="p-8 text-red-500">Error: {errorDebts}</p>;
  if (errorUsers) return <p className="p-8 text-red-500">User fetch error: {errorUsers}</p>;

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Pint Debts</h1>

      {debts.length === 0 ? (
        <p>You have no pint debts.</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {debts.map((d) => {
            const found = discordUsers.find((u) => u.id === String(d.id));
            const displayName = found?.displayName ?? `User ${d.id}`;

            return (
              <li key={d.id} className="border p-4 rounded">
                <p>
                  <strong>{displayName}</strong>
                </p>
                <p>
                  <em>owed by you</em> {formatMixed(d.owes)} pints
                </p>
                <p>
                  <em>owed to you</em> {formatMixed(d.isOwed)} pints
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <section className="text-right space-y-1">
        <div>
          <h2 className="font-semibold">You Owe:</h2>
          <p className="text-lg">{formatMixed(totalOwes)} pints</p>
        </div>
        <div>
          <h2 className="font-semibold">Owed to You:</h2>
          <p className="text-lg">{formatMixed(totalIsOwed)} pints</p>
        </div>
      </section>
    </main>
  );
}
