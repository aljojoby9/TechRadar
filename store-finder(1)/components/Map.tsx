import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { useMemo } from 'react'

interface MapProps {
  center?: { lat: number; lng: number }
  markers?: Array<{ lat: number; lng: number }>
}
"use client"
export default function Map({ center = { lat: 10.5276, lng: 76.2144 }, markers = [] }: MapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  })

  const mapCenter = useMemo(() => center, [center])

  if (!isLoaded) return <div>Loading map...</div>

  return (
    <GoogleMap
      zoom={13}
      center={mapCenter}
      mapContainerClassName="w-full h-[400px] rounded-lg"
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lat: marker.lat, lng: marker.lng }}
        />
      ))}
    </GoogleMap>
  )
}