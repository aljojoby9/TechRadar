"use client"

import { useState } from "react"
import StoreMap from "./store-map"
import StoreFilter from "./store-filter"
import { useToast } from "@/hooks/use-toast"

interface Store {
  id: string
  name: string
  location: { lat: number; lng: number }
}

interface StoreExplorerProps {
  initialStores: Store[]
  userLocation: { lat: number; lng: number }
}

export default function StoreExplorer({ initialStores, userLocation }: StoreExplorerProps) {
  const [filteredStores, setFilteredStores] = useState<Store[]>(initialStores)
  const { toast } = useToast()

  function toRad(deg: number) {
    return deg * (Math.PI / 180)
  }

  function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // radius of Earth in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleFilter = (filter: { search: string; radius: number }) => {
    // Filter by name (case insensitive) and distance in km
    const filtered = initialStores.filter((store) => {
      const matchesSearch = store.name.toLowerCase().includes(filter.search.toLowerCase())
      const distance = calcDistance(
        userLocation.lat,
        userLocation.lng,
        store.location.lat,
        store.location.lng
      )
      return matchesSearch && distance <= filter.radius
    })

    if (filtered.length === 0) {
      toast("No stores found within the given criteria.")
    }

    setFilteredStores(filtered)
  }

  return (
    <div className="flex flex-col space-y-4">
      <StoreFilter onFilter={handleFilter} />
      <StoreMap stores={filteredStores} userLocation={userLocation} />
    </div>
  )
}