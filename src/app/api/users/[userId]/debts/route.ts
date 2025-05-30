import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params;
  const res = await fetch(`${process.env.BOT_API_URL}/users/${userId}/debts`);
  const data = await res.json();

  return NextResponse.json(data);
}