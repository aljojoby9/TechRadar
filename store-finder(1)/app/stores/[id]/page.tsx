import type { Store, Product } from "@/lib/types"
import { fetchStoreById, fetchStoreProducts } from "@/lib/api"
import { MapPin, Clock, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import ProductInventoryList from "@/components/product-inventory-list"
import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import AuthButton from "@/components/auth/auth-button"
import ChatbotWrapper from "@/components/chatbot/chatbot-wrapper"
import MapWrapper from "@/components/map-wrapper"

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  store_id: string;
}

export default async function StorePage({ params }: { params: { id: string } }) {
  const storeId = params.id;
  const cookieStore = cookies();
  const supabase = await createClient();
  
  // Fetch store data
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('id', storeId)
    .single();

  if (storeError || !store) {
    return notFound();
  }
  
  // Fetch inventory - don't require authentication
  const { data: inventory, error: inventoryError } = await supabase
    .from('inventory')
    .select('*')
    .eq('store_id', storeId);
  
  // Try to get user session, but don't require it
  const { data } = await supabase.auth.getSession();
  const session = data?.session;
  
  // Check if user is logged in, but make it optional
  let isOwner = false;
  if (session) {
    const { data: userData } = await supabase.auth.getUser();
    isOwner = userData?.user?.id === store.owner_id;
  }

  return (
    <div className="container mx-auto py-8">
      {/* Store details */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{store.name}</h1>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              <span>{store.address}</span>
            </div>
            {store.opening_hours && (
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                <span>{store.opening_hours}</span>
              </div>
            )}
            {store.phone && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                <span>{store.phone}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              store.is_open ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {store.is_open ? "Open Now" : "Closed"}
            </span>
          </div>
        </div>
        
        {/* Store location map */}
        <div className="w-full md:w-1/2">
          <MapWrapper 
            store={{
              id: store.id,
              name: store.name,
              address: store.address,
              latitude: store.latitude,
              longitude: store.longitude,
              openingHours: store.opening_hours,
              isOpen: store.is_open
            }}
            height="300px"
          />
        </div>
      </div>
      
      {/* Show inventory */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Available Inventory</h2>
        {inventoryError ? (
          <p>Error loading inventory</p>
        ) : inventory && inventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item: InventoryItem) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <h3 className="font-medium">{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No inventory items available</p>
        )}
      </div>
      
      {/* Only show edit button for store owner */}
      {isOwner && (
        <div className="mt-6">
          <Link href={`/dashboard/stores/${params.id}/edit`}>
            <Button>Edit Store</Button>
          </Link>
        </div>
      )}
      
      {/* Add the chatbot wrapper component with storeId */}
      <ChatbotWrapper storeId={storeId} />
    </div>
  );
}

