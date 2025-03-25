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
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session error:", error);
      return <HomeClient user={null} />;
    }

    if (session?.user) {
      // Check user role
      const userRole = session.user.user_metadata?.role || session.user.user_metadata?.user_type;
      if (userRole === 'store_owner') {
        redirect('/dashboard/store_owner');
      }
      
      // Format the user data to match the expected interface in HomeClient
      user = {
        id: session.user.id,
        email: session.user.email || '',
        app_metadata: session.user.app_metadata || {},
        user_metadata: session.user.user_metadata || {},
        aud: session.user.aud || '',
        created_at: session.user.created_at || '',
      };
    }
  } catch (error: any) {
    console.error("Error in Home page:", error?.message || error);
    return <HomeClient user={null} />;
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
                href="/dashboard/store_owner"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Store Dashboard
              </Link>
            )}
            
            {/* Show profile/user dashboard link for regular users */}
            {isRegularUser && (
              <Link
                href="/dashboard/user"
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