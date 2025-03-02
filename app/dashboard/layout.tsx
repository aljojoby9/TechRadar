import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { session }, error } = await supabase.auth.getSession()

  if (!session || error) {
    redirect('/auth/sign-in')
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is a store owner
  if (user?.user_metadata?.role !== 'store_owner') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav user={user} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
} 