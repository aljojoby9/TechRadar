import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getSession()
    
    if (!data?.session || error) {
      redirect('/auth/sign-in')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if user exists
    if (!user) {
      redirect('/auth/sign-in')
    }

    // Check if user has store_owner role
    const userRole = user.user_metadata?.role || user.user_metadata?.user_type
    if (userRole !== 'store_owner') {
      // Redirect non-store owners to the home page
      redirect('/')
    }

    return (
      <div className="flex min-h-screen">
        <DashboardNav user={user} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    )
  } catch (error) {
    console.error('Authentication error:', error)
    redirect('/auth/sign-in')
  }
}