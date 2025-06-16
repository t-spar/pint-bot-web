import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Extract query parameters
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Optional parameters
  const type = searchParams.get("type");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const userId = searchParams.get("userId");

  // Build query string
  const apiUrl = new URL(`${process.env.BOT_API_URL}/transactions`);
  if (type) apiUrl.searchParams.append("transaction_type", type);
  if (startDate) apiUrl.searchParams.append("start_date", startDate);
  if (endDate) apiUrl.searchParams.append("end_date", endDate);
  if (userId) apiUrl.searchParams.append("user_id", userId);

  const res = await fetch(apiUrl.toString());
  const data = await res.json();

  return NextResponse.json(data);
}