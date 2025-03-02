// components/auth/auth-button.tsx
"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

export default function AuthButton({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh() // Refresh the page to update the UI
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-white">
        {user.user_metadata.name || user.email}
      </span>
      <button
        onClick={handleSignOut}
        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        Sign out
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/sign-in"
        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        Sign in
      </Link>
      <Link
        href="/auth/sign-up"
        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        Sign up
      </Link>
    </div>
  )
}