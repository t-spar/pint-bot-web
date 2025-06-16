import { _fetchRaw, Transaction } from "./utils";

export async function getTransactions(
  userId?: string,
  start_date?: string,
  end_date?: string,
  transaction_type?: "owe" | "settle"
): Promise<{ transactions: Transaction[] }> {
  try {
    const url = new URL("/api/transactions", window.location.origin);

    if (userId) url.searchParams.set("user_id", userId);
    if (start_date) url.searchParams.set("start_date", start_date);
    if (end_date) url.searchParams.set("end_date", end_date);
    if (transaction_type) url.searchParams.set("type", transaction_type);

    const data = (await _fetchRaw(url.toString())) as Transaction[];

    return { transactions: data };
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return { transactions: [] };
  }
}
