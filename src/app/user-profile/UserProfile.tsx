"use client"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export default function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading…</p>
  }

  if (!session) {
    return <p>You’re not signed in.</p>
  }

  const { user } = session
  return (
    <div>
      <Image
        src={user.image ?? "/default-avatar.png"}
        alt={user.name ?? "User avatar"}
        width={64}
        height={64}
        style={{ borderRadius: 32 }}
      />
      <h2>{user.name}</h2>
      {user.email && <p>{user.email}</p>}
      {user.id && <p>Discord ID: {user.id}</p>}
      <button
        onClick={() => signOut()}
        className="mt-4 px-3 py-2 rounded border font-medium hover:underline"
      >
        Sign out
      </button>
    </div>
  )
}