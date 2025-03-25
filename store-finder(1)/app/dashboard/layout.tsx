import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const supabase = await createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return redirect("/auth/sign-in")
  }

  const { data: userData } = await supabase.from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/40 p-4">
        <nav className="space-y-2">
          <h2 className="text-lg font-semibold">Store Owner Dashboard</h2>
          <Link href="/dashboard/stores" className="block hover:text-primary">
            My Stores
          </Link>
          <Link href="/dashboard/products" className="block hover:text-primary">
            Inventory
          </Link>
          {userData?.role === 'admin' && (
            <Link href="/dashboard/admin" className="block hover:text-primary">
              Admin Tools
            </Link>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}