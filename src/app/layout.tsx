import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { Providers } from "./providers";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const sansFont = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const monoFont = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Pint Bot Web",
  description: "A web interface for Pint Bot",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <html lang="en">
      <head />
      <body className={`${sansFont.variable} ${monoFont.variable} antialiased`}>
        <Providers session={session}>
          <div className="flex h-screen">
            <aside className="w-64 flex-shrink-0">
              <Sidebar />
            </aside>
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
