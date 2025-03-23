"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AddStorePage() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [storeName, setStoreName] = useState("")
  const [storeAddress, setStoreAddress] = useState("")
  const [storePhone, setStorePhone] = useState("")
  const [storeHours, setStoreHours] = useState("")
  const [isOpen, setIsOpen] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("User not authenticated")
      }
      
      // Create the minimal store object with only the fields we know exist
      const storeData = {
        name: storeName,
        address: storeAddress,
        owner_id: user.id
      };
      
      console.log("Submitting store data:", storeData);
      
      // Save store data with absolute minimal fields
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .insert([storeData])
        .select()
        .single()

      if (storeError) {
        throw new Error(`Error saving store: ${storeError.message}`)
      }

      console.log("Store created successfully:", store);
      
      // Redirect to the stores list
      router.push("/dashboard/stores")
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Store</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/stores">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stores
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Store Name</label>
            <Input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Keep the UI fields for better UX but don't submit them */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              type="text"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 italic">Optional - will be added in a future update</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Opening Hours</label>
            <Input
              type="text"
              value={storeHours}
              onChange={(e) => setStoreHours(e.target.value)}
              placeholder="e.g. Mon-Fri: 9am-5pm, Sat: 10am-4pm"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 italic">Optional - will be added in a future update</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
              id="is-open"
              disabled={isLoading}
            />
            <label htmlFor="is-open" className="ml-2 text-sm font-medium">
              Store is currently open
            </label>
            <span className="ml-2 text-xs text-gray-500 italic">(Visual only - will be functional in a future update)</span>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Store"}
          </Button>
        </form>
      </div>
    </div>
  )
} 