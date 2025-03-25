import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default async function StoresPage() {
  const supabase = await createClient()
  
  // Fetch all stores
  const { data: stores, error } = await supabase
    .from('stores')
    .select('*')
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Stores</h1>
        <Link href="/dashboard/stores/new">
          <Button>Add New Store</Button>
        </Link>
      </div>
      
      {error ? (
        <p className="text-red-500">Error loading stores: {error.message}</p>
      ) : !stores || stores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No stores found</p>
          <Link href="/dashboard/stores/new">
            <Button>Add Your First Store</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Link 
              key={store.id} 
              href={`/stores/${store.id}`}
              className="block border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
              {store.address && (
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{store.address}</span>
                </div>
              )}
              {store.description && (
                <p className="text-muted-foreground line-clamp-2">{store.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}