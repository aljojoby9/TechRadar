import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import SignInForm from "@/components/auth/signin-form"

export const metadata: Metadata = {
  title: "Sign In | Store Inventory Finder",
  description: "Sign in to your Store Inventory Finder account",
}
export default async function SignInPage() {
  const cookieStore = cookies()
  const supabase = await createClient()

  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      // Add return statement before redirect
      return redirect("/")
    }
  } catch (error) {
    console.error('Authentication error:', error)
    // Consider returning an error state here
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Sign in to your account
          </p>
        </div>
        <SignInForm />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/sign-up" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

