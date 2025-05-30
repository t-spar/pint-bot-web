import { _fetchRaw } from "./utils"

export async function getAllDebts() {
  const json = await _fetchRaw('/api/debts') as Record<string, any>
  const total = json.total_in_circulation
  const debts = Object.entries(json)
    .filter(([k]) => k !== 'total_in_circulation')
    .map(([id, e]) => ({ id, owes: e.owes, isOwed: e.is_owed }))
  return { debts, total }
}
