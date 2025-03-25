"use client"

import dynamic from "next/dynamic"

// Dynamically import the map component with ssr disabled
const StoreLocationMap = dynamic(
  () => import("@/components/store-location-map"),
  { ssr: false }
);

interface StoreData {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  openingHours?: string
  isOpen?: boolean
}

export default function MapWrapper({ 
  store, 
  height = "300px" 
}: { 
  store: StoreData, 
  height?: string 
}) {
  return (
    <StoreLocationMap 
      store={store}
      height={height}
    />
  );
} 