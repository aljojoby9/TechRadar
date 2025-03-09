import type { Store, Product } from "@/lib/types"
import { fetchStoreById, fetchStoreProducts } from "@/lib/api"
import { MapPin, Clock, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import ProductInventoryList from "@/components/product-inventory-list"
import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import AuthButton from "@/components/auth/auth-button"

async function getStore(id: string): Promise<Store> {
  return fetchStoreById(id)
}

async function getStoreProducts(id: string): Promise<Product[]> {
  return fetchStoreProducts(id)
}

interface StorePageProps {
  params: Promise<{ id: string }>
}

export default async function StorePage({ params }: StorePageProps) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const storeId = resolvedParams.id;
  
  const store = await getStore(storeId)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-600 mt-2">Store Details</p>
          </div>
          <AuthButton user={user} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all stores
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              <div className="mt-2 flex items-start text-gray-600">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{store.address}</span>
              </div>
              <div className="mt-2 flex items-start text-gray-600">
                <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{store.openingHours}</span>
              </div>
              <div className="mt-2 flex items-start text-gray-600">
                <Phone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{store.phone}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${store.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {store.isOpen ? "Open Now" : "Closed"}
              </span>
              <p className="text-sm text-gray-500 mt-2">{store.inventoryCount} items in stock</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Available Inventory</h2>
          <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading inventory...</div>}>
            <ProductInventoryList storeId={storeId} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

