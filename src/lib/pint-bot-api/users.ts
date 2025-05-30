import { _fetchRaw, DebtEntry } from "./utils";

export async function getUserDebts(userId: string): Promise<{
  debts: DebtEntry[];
  totalOwes: string;
  totalIsOwed: string;
}> {
  const json = (await _fetchRaw(`/api/users/${userId}/debts`)) as Record<string, any>;

  const mergeDebts = (
    data: Record<string, any[]>,
    field: "owes" | "isOwed",
    acc: Record<string, { owes: string[]; isOwed: string[] }>
  ) => {
    for (const [id, entries] of Object.entries(data)) {
      acc[id] ??= { owes: [], isOwed: [] };
      acc[id][field].push(...entries.map((e) => e.amount));
    }
  };

  const merged: Record<string, { owes: string[]; isOwed: string[] }> = {};

  mergeDebts(json.owed_by_you ?? {}, "owes", merged);
  mergeDebts(json.owed_to_you ?? {}, "isOwed", merged);

  const debts: DebtEntry[] = Object.entries(merged).map(([id, { owes, isOwed }]) => ({
    id,
    owes: owes.length ? owes.join(" + ") : "0",
    isOwed: isOwed.length ? isOwed.join(" + ") : "0",
  }));

  return {
    debts,
    totalOwes: json.total_owed_by_you ?? "0",
    totalIsOwed: json.total_owed_to_you ?? "0",
  };
}
