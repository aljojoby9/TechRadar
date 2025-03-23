"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { validatePhoneNumber, getPhoneErrorMessage } from "@/lib/validation"
import { useRouter } from "next/navigation"

type StoreFormProps = {
  initialData?: {
    id?: string
    name?: string
    address?: string
    phone?: string
    hours?: string
    description?: string
  }
  mode: "create" | "edit"
}

export default function StoreForm({ initialData = {}, mode }: StoreFormProps) {
  const [name, setName] = useState(initialData.name || "")
  const [address, setAddress] = useState(initialData.address || "")
  const [phone, setPhone] = useState(initialData.phone || "")
  const [hours, setHours] = useState(initialData.hours || "")
  const [description, setDescription] = useState(initialData.description || "")
  const [errors, setErrors] = useState<{
    name?: string
    phone?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    
    // Validate phone as user types
    const phoneError = getPhoneErrorMessage(newPhone);
    setErrors(prev => ({ ...prev, phone: phoneError || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields before submission
    const validationErrors: { name?: string; phone?: string } = {};
    
    if (!name.trim()) validationErrors.name = "Store name is required";
    
    const phoneError = getPhoneErrorMessage(phone);
    if (phoneError) validationErrors.phone = phoneError;
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      // Get user ID for store owner
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("You must be logged in to create a store")
      }
      
      if (mode === "create") {
        // Create new store
        const { data, error } = await supabase
          .from('stores')
          .insert([
            {
              name,
              address,
              phone,
              hours,
              description,
              owner_id: user.id
            }
          ])
          .select()
        
        if (error) throw error
        
        // Redirect to the new store page
        router.push(`/dashboard/stores/${data[0].id}`)
      } else if (mode === "edit" && initialData.id) {
        // Update existing store
        const { error } = await supabase
          .from('stores')
          .update({
            name,
            address,
            phone,
            hours,
            description
          })
          .eq('id', initialData.id)
        
        if (error) throw error
        
        // Redirect back to store page
        router.push(`/dashboard/stores/${initialData.id}`)
      }
      
      router.refresh()
    } catch (error) {
      console.error("Store save error:", error)
      setErrors({ 
        general: error.message || "Failed to save store" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Store Name *</Label>
        <Input
          id="name"
          placeholder="My Awesome Store"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="123 Main St, City, State"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          placeholder="1234567890"
          value={phone}
          onChange={handlePhoneChange}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hours">Business Hours</Label>
        <Input
          id="hours"
          placeholder="Mon-Fri: 9am-5pm, Sat: 10am-3pm"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Tell customers about your store..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      {errors.general && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800">
          {errors.general}
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : mode === "create" ? "Create Store" : "Update Store"}
      </Button>
    </form>
  )
}