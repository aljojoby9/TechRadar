"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Item = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  store_id: string
  image_url: string
}

export default function StoreItems({ storeId }: { storeId: string }) {
  const [items, setItems] = useState<Item[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from('items')
        .select('*')
        .eq('store_id', storeId)
        .order('name')

      if (data) setItems(data)
    }

    fetchItems()
  }, [storeId])

  // Memoize the grid to prevent unnecessary re-renders
  const itemGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            layoutId={item.id}
          >
            {item.image_url && (
              <motion.img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md"
                loading="lazy"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <motion.h3 className="font-bold mt-2">{item.name}</motion.h3>
            <motion.p className="text-gray-600 line-clamp-2">{item.description}</motion.p>
            <motion.p className="font-semibold mt-2">₹{item.price}</motion.p>
            <motion.p className="text-sm text-gray-500">In stock: {item.stock}</motion.p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  ), [items])

  return itemGrid
}