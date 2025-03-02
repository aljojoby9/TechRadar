// app/page.tsx (Server Component)
import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import HomeClient from "@/components/home-client"
import Link from "next/link"

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Fetch user data on the server
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if the user is a store owner
  const isStoreOwner = user?.user_metadata?.role === "store_owner"

  return (
    <div>
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Title has been removed */}
          <div className="flex items-center gap-4">
            {/* Conditionally render the "Add Store" button */}
            {isStoreOwner && (
              <Link
                href="/store-owner"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Add Store
              </Link>
            )}
            {/* AuthButton and username have been removed from here */}
          </div>
        </div>
      </nav>
      <HomeClient user={user} /> {/* HomeClient will handle the username and AuthButton */}
    </div>
  )
}