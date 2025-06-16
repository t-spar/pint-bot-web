export type DebtEntry = { 
    id: string;
    owes: string;
    isOwed: string;
}

export type Transaction = {
  type: "owe" | "settle";
  debtor: string;
  creditor: string;
  amount: string;
  reason: string;
  timestamp: string;
};

export async function _fetchRaw(path: string) {
  const res = await fetch(`${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}
