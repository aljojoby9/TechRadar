// app/page.tsx (Server Component)
import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import HomeClient from "@/components/home-client"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Home() {
  // Create the Supabase client
  const supabase = await createClient();
  
  // Safely fetch user data with error handling
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data && data.user) {
      // Format the user data to match the expected interface in HomeClient
      user = {
        id: data.user.id,
        email: data.user.email || '',
        app_metadata: data.user.app_metadata || {},
        user_metadata: data.user.user_metadata || {},
        aud: data.user.aud || '',
        created_at: data.user.created_at || '',
      };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  // Get user role
  const userRole = user?.user_metadata?.role || user?.user_metadata?.user_type;
  const isStoreOwner = userRole === "store_owner";
  const isRegularUser = user && !isStoreOwner;

  return (
    <div>
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Show dashboard link for store owners */}
            {isStoreOwner && (
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Store Dashboard
              </Link>
            )}
            
            {/* Show profile/user dashboard link for regular users */}
            {isRegularUser && (
              <Link
                href="/profile"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                My Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>
      <HomeClient user={user} />
    </div>
  )
}