import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Confirm Email | Store Inventory Finder",
  description: "Confirm your email address",
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { token_hash?: string; type?: string }
}) {
  const cookieStore = cookies()
  const supabase = await createClient()

  const { token_hash, type } = searchParams

  if (!token_hash || !type) {
    return redirect("/auth/sign-in")
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as any,
  })

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">Error confirming email</h1>
          <p className="mt-2 text-center text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return redirect("/")
}

