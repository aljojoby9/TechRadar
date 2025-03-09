"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import type { Store } from "@/lib/types"

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
}

export default function StoreMap() {
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user's location
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error.message || JSON.stringify(error))
          setUserLocation(defaultCenter)
        },
        { 
          enableHighAccuracy: true, 
          timeout: 5000, 
          maximumAge: 0 
        }
      )
    } else {
      // Fallback for browsers that don't support geolocation
      setUserLocation(defaultCenter)
    }

    // Fetch stores
    async function loadStores() {
      try {
        const response = await fetch('/api/stores')
        const data = await response.json()
        setStores(data)
      } catch (error) {
        console.error("Failed to fetch stores:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStores()
  }, [])

  if (isLoading) {
    return <div className="h-full flex items-center justify-center">Loading map...</div>
  }

  // Calculate relative positions for stores based on their coordinates
  const bounds = stores.reduce(
    (acc, store) => ({
      minLat: Math.min(acc.minLat, store.latitude),
      maxLat: Math.max(acc.maxLat, store.latitude),
      minLng: Math.min(acc.minLng, store.longitude),
      maxLng: Math.max(acc.maxLng, store.longitude),
    }),
    {
      minLat: Infinity,
      maxLat: -Infinity,
      minLng: Infinity,
      maxLng: -Infinity,
    }
  )
  // In the getRelativePosition function
  const getRelativePosition = (lat: number, lng: number) => {
    // Check if bounds are valid
    if (bounds.minLat === Infinity || bounds.maxLat === -Infinity || 
        bounds.minLng === Infinity || bounds.maxLng === -Infinity) {
      // Return a default position if bounds are invalid
      return { x: 50, y: 50 };
    }
    
    const latRange = bounds.maxLat - bounds.minLat || 1
    const lngRange = bounds.maxLng - bounds.minLng || 1
  
    return {
      x: ((lng - bounds.minLng) / lngRange) * 100,
      y: ((lat - bounds.minLat) / latRange) * 100,
    }
  }
  return (
    <div className="h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow">
        <h3 className="font-medium text-sm">Map View</h3>
        <span className="text-xs text-gray-500 block mt-1">Showing {stores.length} stores</span>
      </div>

      {/* Simplified map representation */}
      <div className="h-full bg-blue-50 rounded-lg relative overflow-hidden">
        {stores.map((store) => {
          const pos = getRelativePosition(store.latitude, store.longitude)
          return (
            <div
              key={store.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:z-50"
              style={{
                top: `${pos.y}%`,
                left: `${pos.x}%`,
              }}
              onClick={() => setSelectedStore(store)}
            >
              <div className={`p-1 rounded-full ${selectedStore?.id === store.id ? 'bg-red-500' : 'bg-blue-500'} shadow-lg hover:scale-110 transition-transform duration-200`}>
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
          )
        })}

        {userLocation && (
          <div
            className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 pulse-animation"
            style={{
              top: `${getRelativePosition(userLocation.lat, userLocation.lng).y}%`,
              left: `${getRelativePosition(userLocation.lat, userLocation.lng).x}%`,
            }}
          />
        )}
      </div>

      {selectedStore && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold">{selectedStore.name}</h3>
          <p className="text-sm text-gray-600">{selectedStore.address}</p>
          <p className="text-sm text-gray-600 mt-1">{selectedStore.openingHours}</p>
          <div className="mt-2 flex justify-between">
            <span
              className={`text-sm px-2 py-1 rounded ${
                selectedStore.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {selectedStore.isOpen ? "Open Now" : "Closed"}
            </span>
            <button
              className="text-sm text-blue-600"
              onClick={() => window.location.href = `/stores/${selectedStore.id}`}
            >
              View Inventory
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  )
}

