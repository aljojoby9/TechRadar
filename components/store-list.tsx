"use client"

import { useEffect, useState } from 'react'
import type { Store } from "@/lib/types"
import StoreCard from "./store-card"
import { motion } from "framer-motion"

export default function StoreList() {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStores() {
      try {
        const response = await fetch('/api/stores')
        const data = await response.json()
        setStores(data)
      } catch (error) {
        console.error('Failed to fetch stores:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStores()
  }, [])

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Nearby Stores</h2>
        <span className="text-sm text-gray-500">{stores.length} stores</span>
      </div>

      <motion.div
        className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StoreCard store={store} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

