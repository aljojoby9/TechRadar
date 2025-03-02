"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

export default function ProductSearch() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", query, "in category:", category)
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-xl font-semibold mb-4">Find Products</h2>
        <form onSubmit={handleSearch}>
          <div className="relative mb-4">
            <motion.div
              className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
              whileHover={{ scale: 1.1 }}
            >
              <Search className="h-5 w-5 text-gray-400" />
            </motion.div>
            <Input
              type="text"
              className="bg-gray-50/50 backdrop-blur-sm border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              onClick={() => setIsExpanded(true)}
            />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <Label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
                    Category
                  </Label>
                  <select
                    id="category"
                    className="bg-gray-50/50 backdrop-blur-sm border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="groceries">Groceries</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports & Outdoors</option>
                  </select>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    id="in-stock"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="in-stock" className="ml-2 text-sm font-medium text-gray-900">
                    In-stock items only
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Search
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  )
}

