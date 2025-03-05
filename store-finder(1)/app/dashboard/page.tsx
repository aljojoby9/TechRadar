import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Store } from "@/lib/types"
import { fetchStores } from "@/lib/api"
import { Building, Package, TrendingUp } from "lucide-react"
import AuthCheck from '@/components/AuthCheck'
import LoginRedirect from '@/components/LoginRedirect'
import Map from '@/components/Map'

async function getStores(): Promise<Store[]> {
  return fetchStores()
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Fetch store statistics
  const { data: stores } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .in('store_id', stores?.map(store => store.id) || [])

  const totalStores = stores?.length || 0
  const totalItems = items?.length || 0
  const totalStock = items?.reduce((sum, item) => sum + (item.stock || 0), 0) || 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Total Stores</h2>
          </div>
          <p className="mt-2 text-3xl font-bold">{totalStores}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-green-500" />
            <h2 className="text-lg font-semibold">Total Items</h2>
          </div>
          <p className="mt-2 text-3xl font-bold">{totalItems}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold">Total Stock</h2>
          </div>
          <p className="mt-2 text-3xl font-bold">{totalStock}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity to display.</p>
      </div>
    </div>
  )
}

