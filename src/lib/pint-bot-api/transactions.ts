import { _fetchRaw, Transaction } from "./utils";

export async function getTransactions(
  userId?: string,
  startDate?: string,
  endDate?: string,
  transactionType?: "owe" | "settle"
): Promise<{ transactions: Transaction[] }> {
  try {
    const url = new URL("/api/transactions", window.location.origin);

    if (userId) url.searchParams.set("userId", userId);
    if (startDate) url.searchParams.set("startDate", startDate);
    if (endDate) url.searchParams.set("endDate", endDate);
    if (transactionType) url.searchParams.set("transactionType", transactionType);

    const data = (await _fetchRaw(url.toString())) as Transaction[];

    return { transactions: data };
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return { transactions: [] };
  }
}
