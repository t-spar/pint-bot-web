"use client";

import { getTransactions } from "@/lib/pint-bot-api/transactions";
import { parseAmount } from "@/lib/utils/parsing";
import { useEffect, useState } from "react";

export default function TransactionSummary() {
  const [summary, setSummary] = useState<{
    totalOwes: number;
    totalSettles: number;
    avgOwe: number;
    avgSettle: number;
    earliest: string | null;
    latest: string | null;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const { transactions } = await getTransactions();

      let oweCount = 0;
      let settleCount = 0;
      let oweTotal = 0;
      let settleTotal = 0;
      let timestamps: number[] = [];

      transactions.forEach((transaction) => {
        const amount = parseAmount(transaction.amount);
        timestamps.push(new Date(transaction.timestamp).getTime());

        if (transaction.type === "owe") {
          oweCount++;
          oweTotal += amount;
        } else if (transaction.type === "settle") {
          settleCount++;
          settleTotal += amount;
        }
      });

      const earliest = timestamps.length
        ? new Date(Math.min(...timestamps)).toLocaleString()
        : null;
      const latest = timestamps.length ? new Date(Math.max(...timestamps)).toLocaleString() : null;

      setSummary({
        totalOwes: oweCount,
        totalSettles: settleCount,
        avgOwe: oweCount ? Number((oweTotal / oweCount).toFixed(3)) : 0,
        avgSettle: settleCount ? Number((settleTotal / settleCount).toFixed(3)) : 0,
        earliest,
        latest,
      });
    }

    load();
  }, []);

  if (!summary) return <div>Loading summary...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent Stats (Last 30 Days)</h2>
      <div>
        <strong>Total Owe:</strong> {summary.totalOwes}
      </div>
      <div>
        <strong>Total Settle:</strong> {summary.totalSettles}
      </div>
      <div>
        <strong>Average Owe:</strong> {summary.avgOwe.toFixed(2)} pints
      </div>
      <div>
        <strong>Average Settle:</strong> {summary.avgSettle.toFixed(2)} pints
      </div>
      <div>
        <strong>Most Recent Transaction:</strong> {summary.latest} UTC
      </div>
    </div>
  );
}
