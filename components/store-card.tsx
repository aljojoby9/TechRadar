"use client"

import type { Store } from "@/lib/types"
import { MapPin, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedGradient } from "./ui/animated-gradient"

export default function StoreCard({ store }: { store: Store }) {
  return (
    <AnimatedGradient>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group relative"
      >
        <Link
          href={`/stores/${store.id}`}
          className="block bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-lg p-4 transition-all duration-200"
        >
          <div className="flex justify-between">
            <h3 className="font-medium group-hover:text-blue-600 transition-colors">{store.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full 
              ${store.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {store.isOpen ? "Open" : "Closed"}
            </span>
          </div>

          <motion.div
            className="mt-2 flex items-start text-sm text-gray-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>{store.address}</span>
          </motion.div>

          <motion.div
            className="mt-1 flex items-start text-sm text-gray-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Clock className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>{store.openingHours}</span>
          </motion.div>

          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm">{store.inventoryCount} items in stock</span>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </motion.div>
    </AnimatedGradient>
  )
}

