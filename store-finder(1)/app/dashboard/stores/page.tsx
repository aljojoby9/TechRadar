import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { Plus, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function StoresPage() {
  const supabase = await createClient()

  const { data: stores } = await supabase
    .from('stores')
    .select('*, items(count)')
    .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Store Management</h1>
        <Button asChild>
          <Link href="/dashboard/stores/add">
            <Plus className="h-4 w-4 mr-2" />
            Add New Store
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores?.map((store) => (
          <div key={store.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold">{store.name}</h3>
              <div className="mt-2 flex items-start text-gray-600">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{store.address}</span>
              </div>
              <div className="mt-1 flex items-start text-gray-600">
                <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{store.opening_hours}</span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    store.is_open
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {store.is_open ? 'Open' : 'Closed'}
                </span>
                <span className="text-sm text-gray-500">
                  {store.items[0].count} items
                </span>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-between">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/stores/${store.id}/inventory`}>
                  Manage Inventory
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/stores/${store.id}/edit`}>
                  Edit Store
                </Link>
              </Button>
            </div>
          </div>
        ))}
        {!stores?.length && (
          <div className="col-span-full">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              No stores found. Add a store to get started.
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 