"use client"

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

interface StoreLocationMapProps {
  store: {
    id: string
    name: string
    address: string
    latitude: number
    longitude: number
    openingHours?: string
    isOpen?: boolean
  }
  height?: string
}

export default function StoreLocationMap({ store, height = "300px" }: StoreLocationMapProps) {
  // Check if store has valid coordinates
  if (!store || typeof store.latitude !== 'number' || typeof store.longitude !== 'number') {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center h-[300px] flex items-center justify-center">
        <p className="text-gray-500">Store location not available</p>
      </div>
    )
  }

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[store.latitude, store.longitude]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[store.latitude, store.longitude]}
          icon={icon}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{store.name}</h3>
              <p className="text-sm text-gray-600">{store.address}</p>
              {store.openingHours && (
                <p className="text-sm text-gray-600 mt-1">{store.openingHours}</p>
              )}
              {typeof store.isOpen === 'boolean' && (
                <div className="mt-2">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      store.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {store.isOpen ? "Open Now" : "Closed"}
                  </span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
