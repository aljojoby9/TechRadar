"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/utils/supabase/client"
import { 
  validatePhoneNumber, 
  getPhoneErrorMessage,
  validateStoreName,
  getStoreNameErrorMessage,
  validateAddress,
  getAddressErrorMessage,
  validateBusinessHours,
  getBusinessHoursErrorMessage,
  validateDescription,
  getDescriptionErrorMessage
} from "@/lib/validation"
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
    address?: string
    phone?: string
    hours?: string
    description?: string
    general?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validateForm = () => {
    const validationErrors: typeof errors = {}
    let isValid = true

    // Validate store name
    const nameError = getStoreNameErrorMessage(name)
    if (nameError) {
      validationErrors.name = nameError
      isValid = false
    }

    // Validate address
    const addressError = getAddressErrorMessage(address)
    if (addressError) {
      validationErrors.address = addressError
      isValid = false
    }

    // Validate phone
    const phoneError = getPhoneErrorMessage(phone)
    if (phoneError) {
      validationErrors.phone = phoneError
      isValid = false
    }

    // Validate business hours
    const hoursError = getBusinessHoursErrorMessage(hours)
    if (hoursError) {
      validationErrors.hours = hoursError
      isValid = false
    }

    // Validate description
    const descriptionError = getDescriptionErrorMessage(description)
    if (descriptionError) {
      validationErrors.description = descriptionError
      isValid = false
    }

    setErrors(validationErrors)
    return isValid
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    const nameError = getStoreNameErrorMessage(newName)
    setErrors(prev => ({ ...prev, name: nameError || undefined }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value
    setAddress(newAddress)
    const addressError = getAddressErrorMessage(newAddress)
    setErrors(prev => ({ ...prev, address: addressError || undefined }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value
    setPhone(newPhone)
    const phoneError = getPhoneErrorMessage(newPhone)
    setErrors(prev => ({ ...prev, phone: phoneError || undefined }))
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value
    setHours(newHours)
    const hoursError = getBusinessHoursErrorMessage(newHours)
    setErrors(prev => ({ ...prev, hours: hoursError || undefined }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value
    setDescription(newDescription)
    const descriptionError = getDescriptionErrorMessage(newDescription)
    setErrors(prev => ({ ...prev, description: descriptionError || undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
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
    } catch (error: any) {
      console.error("Store save error:", error)
      setErrors({ 
        general: error?.message || "Failed to save store" 
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
          onChange={handleNameChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          placeholder="123 Main St, City, State"
          value={address}
          onChange={handleAddressChange}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
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
        <Label htmlFor="hours">Business Hours *</Label>
        <Input
          id="hours"
          placeholder="Mon-Fri: 9am-5pm, Sat: 10am-3pm"
          value={hours}
          onChange={handleHoursChange}
          className={errors.hours ? "border-red-500" : ""}
        />
        {errors.hours && <p className="text-sm text-red-500">{errors.hours}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Tell customers about your store..."
          value={description}
          onChange={handleDescriptionChange}
          rows={4}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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