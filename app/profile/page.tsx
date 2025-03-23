import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function UserDashboardPage() {
  const supabase = await createClient()
  
  // Get user info
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (!user || error) {
    redirect('/auth/sign-in')
  }
  
  // Check user role - only allow regular users
  const userRole = user.user_metadata?.role || user.user_metadata?.user_type
  
  // If the user is a store owner, redirect them to the store owner dashboard
  if (userRole === 'store_owner') {
    redirect('/dashboard')
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
        <div className="space-y-3">
          <div>
            <span className="text-gray-500">Name:</span> 
            <span className="ml-2 font-medium">{user.user_metadata?.name || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-gray-500">Email:</span> 
            <span className="ml-2 font-medium">{user.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Account type:</span> 
            <span className="ml-2 font-medium">Regular User</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">My Saved Stores</h2>
        <p className="text-gray-500">You haven't saved any stores yet.</p>
        <Link 
          href="/" 
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Browse Stores
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <p className="text-gray-500">No recent activities to display.</p>
      </div>
    </div>
  )
}