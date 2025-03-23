import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import SignUpForm from "@/components/auth/sign-up-form"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Sign Up | Store Inventory Finder",
  description: "Create a new Store Inventory Finder account",
}

export default async function SignUpPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Session check error:', error.message)
      // Continue to show sign up form if there's an error checking session
      return (
        <AuthLayout>
          <SignUpForm />
        </AuthLayout>
      )
    }

    if (session) {
      redirect("/dashboard")
    }
  } catch (error) {
    console.error('Authentication check error:', error)
    // Continue to show sign up form if there's an error
    return (
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </AuthLayout>
  )
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  )
}

