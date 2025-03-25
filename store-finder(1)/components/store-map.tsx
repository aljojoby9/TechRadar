"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import type { Store } from "@/lib/types"
import { toast } from 'sonner'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: '/marker-icon.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
}

export default function StoreMap() {
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          setError('Location access denied')
          toast.error('Location access denied')
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
      setError('Geolocation not supported')
      toast.error('Geolocation not supported')
    }

    // Fetch stores
    async function loadStores() {
      try {
        const response = await fetch('/api/stores')
        const data = await response.json()
        console.log('Loaded stores:', data)
        
        // Check for stores with invalid coordinates
        const invalidStores = data.filter(
          (store: Store) => typeof store.latitude !== 'number' || typeof store.longitude !== 'number'
        )
        if (invalidStores.length > 0) {
          console.warn('Stores with invalid coordinates:', invalidStores)
        }
        
        setStores(data)
      } catch (error) {
        console.error("Failed to fetch stores:", error)
        setError('Failed to load stores')
        toast.error('Failed to load stores')
      } finally {
        setIsLoading(false)
      }
    }

    loadStores()
  }, [])

  if (isLoading) {
    return <div className="h-full flex items-center justify-center">Loading map...</div>
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-600">
            You can still view the store location by clicking the link below
          </p>
          <a
            href={`https://www.openstreetmap.org/search?q=${encodeURIComponent(selectedStore?.address || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
          >
            View on OpenStreetMap
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow">
        <h3 className="font-medium text-sm">Map View</h3>
        <span className="text-xs text-gray-500 block mt-1">Showing {stores.length} stores</span>
      </div>

      <div className="h-full w-full">
        <MapContainer
          center={[userLocation?.lat || defaultCenter.lat, userLocation?.lng || defaultCenter.lng]}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stores
            .filter(store => typeof store.latitude === 'number' && typeof store.longitude === 'number')
            .map((store) => (
            <Marker
              key={store.id}
              position={[store.latitude, store.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => setSelectedStore(store)
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{store.name}</h3>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  <p className="text-sm text-gray-600 mt-1">{store.openingHours}</p>
                  <div className="mt-2 flex justify-between">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        store.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {store.isOpen ? "Open Now" : "Closed"}
                    </span>
                    <button
                      className="text-sm text-blue-600"
                      onClick={() => window.location.href = `/stores/${store.id}`}
                    >
                      View Inventory
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

