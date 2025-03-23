"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Store } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClickAway } from "@/hooks/use-click-away"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [stores, setStores] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("stores")
  const supabase = createClient()
  const suggestionsRef = useRef(null)
  
  // Close suggestions when clicking outside
  useClickAway(suggestionsRef, () => {
    setShowSuggestions(false)
  })

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }
      
      try {
        const { data: storeData } = await supabase
          .from('stores')
          .select('id, name')
          .ilike('name', `%${query}%`)
          .limit(5)
          
        const { data: productData } = await supabase
          .from('inventory')
          .select('id, name, store_id, stores(name)')
          .ilike('name', `%${query}%`)
          .limit(5)
          
        const combinedSuggestions = [
          ...(storeData || []).map(store => ({ 
            id: store.id, 
            name: store.name, 
            type: 'store' 
          })),
          ...(productData || []).map(product => ({ 
            id: product.id, 
            name: product.name, 
            type: 'product',
            storeId: product.store_id,
            storeName: product.stores?.name
          }))
        ]
        
        setSuggestions(combinedSuggestions)
        setShowSuggestions(combinedSuggestions.length > 0)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      }
    }
    
    const debounceTimer = setTimeout(() => {
      fetchSuggestions()
    }, 300)
    
    return () => clearTimeout(debounceTimer)
  }, [query, supabase])

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    setShowSuggestions(false)
    
    try {
      // Search stores
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('name')
      
      if (storesError) throw storesError
      setStores(storesData || [])
      
      // Search inventory items
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('*, store_id, stores(id, name)')
        .ilike('name', `%${query}%`)
        .order('name')
      
      if (inventoryError) throw inventoryError
      setProducts(inventoryData || [])
      
      // Set active tab based on results
      if ((storesData?.length || 0) === 0 && (inventoryData?.length || 0) > 0) {
        setActiveTab("products")
      } else {
        setActiveTab("stores")
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name)
    setShowSuggestions(false)
    handleSearch()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Search Stores & Products</h1>
      
      <div className="relative mb-8">
        <div className="flex gap-2">
          <Input
            placeholder="Search for stores or products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </div>
        
        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((suggestion) => (
              <div
                key={`${suggestion.type}-${suggestion.id}`}
                className="p-2 hover:bg-muted cursor-pointer flex items-center"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.type === 'store' ? (
                  <>
                    <Store className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{suggestion.name}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{suggestion.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      at {suggestion.storeName}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Rest of the search results display remains the same */}
      <Tabs defaultValue="stores" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="stores">Stores ({stores.length})</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
        </TabsList>
        
        {/* Store results tab */}
        <TabsContent value="stores">
          {/* Store results content */}
        </TabsContent>
        
        {/* Products results tab */}
        <TabsContent value="products">
          {/* Products results content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}