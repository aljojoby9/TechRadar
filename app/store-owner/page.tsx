// app/store-owner/page.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function StoreOwnerPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  const [storeName, setStoreName] = useState("")
  const [storeAddress, setStoreAddress] = useState("")
  const [storePhone, setStorePhone] = useState("")
  const [itemName, setItemName] = useState("")
  const [itemSKU, setItemSKU] = useState("")
  const [itemStock, setItemStock] = useState(0)

  // Check user role on component mount
  useEffect(() => {
    async function checkUserRole() {
      setLoading(true)
      const { data } = await supabase.auth.getUser()
      const userRole = data.user?.user_metadata?.role || data.user?.user_metadata?.user_type
      
      if (!data.user || userRole !== 'store_owner') {
        // Redirect non-store owners to home page
        router.push('/')
        return
      }
      
      setLoading(false)
    }
    
    checkUserRole()
  }, [router, supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Save store data
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .insert([
        {
          name: storeName,
          address: storeAddress,
          phone: storePhone,
        },
      ])
      .select()
      .single()

    if (storeError) {
      console.error("Error saving store:", storeError)
      return
    }

    // Save item data
    const { error: itemError } = await supabase.from("items").insert([
      {
        name: itemName,
        sku: itemSKU,
        stock_quantity: itemStock,
        store_id: store.id,
      },
    ])

    if (itemError) {
      console.error("Error saving item:", itemError)
      return
    }

    // Redirect to home or success page
    router.push("/")
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Add Store and Items</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Store Address</label>
          <input
            type="text"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Store Phone</label>
          <input
            type="text"
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Item SKU</label>
          <input
            type="text"
            value={itemSKU}
            onChange={(e) => setItemSKU(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Stock</label>
          <input
            type="number"
            value={itemStock}
            onChange={(e) => setItemStock(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  )
}