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

export default async function StorePage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  try {
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('id', params.id)
      .single()

    if (storeError) {
      console.error('Store fetch error:', storeError)
      return notFound()
    }
  }
  
  // Fetch inventory - don't require authentication
  const { data: inventory, error: inventoryError } = await supabase
    .from('inventory')
    .select('*')
    .eq('store_id', storeId) // Use the extracted storeId
  
  // Try to get user session, but don't require it
  const { data } = await supabase.auth.getSession()
  const session = data?.session
  
  // Check if user is logged in, but make it optional
  let isOwner = false
  if (session) {
    const { data: userData } = await supabase.auth.getUser()
    isOwner = userData?.user?.id === store.owner_id
  }

  // In your return statement
  return (
    <div className="container mx-auto py-8">
      {/* Store details */}
      <h1 className="text-3xl font-bold">{store.name}</h1>
      
      {/* Show inventory */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Available Inventory</h2>
        {inventoryError ? (
          <p>Error loading inventory</p>
        ) : inventory && inventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => (
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
  )
}

