"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface StoreFilterProps {
  onFilter: (filter: { search: string; radius: number }) => void
}

export default function StoreFilter({ onFilter }: StoreFilterProps) {
  const [search, setSearch] = useState("")
  const [radius, setRadius] = useState(10)

  const handleFilter = () => {
    onFilter({ search, radius })
  }

  return (
    <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg shadow-sm">
      <Input 
        placeholder="Search stores..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      <Input
        type="number"
        min="1"
        placeholder="Radius (km)"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
      />
      <Button onClick={handleFilter}>Apply Filter</Button>
    </div>
  )
}