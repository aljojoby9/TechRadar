"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// Import the chatbot with dynamic loading (client-side only)
const Chatbot = dynamic(() => import("@/components/chatbot/chatbot"), {
  ssr: false,
})

export default function ChatbotWrapper({ storeId }: { storeId?: string }) {
  const pathname = usePathname()
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(storeId)
  
  // Extract store ID from URL if on a store page and no storeId prop is provided
  useEffect(() => {
    if (!storeId && pathname) {
      const match = pathname.match(/\/stores\/([^\/]+)/)
      if (match && match[1]) {
        setCurrentStoreId(match[1])
      } else {
        setCurrentStoreId(undefined)
      }
    } else {
      setCurrentStoreId(storeId)
    }
  }, [pathname, storeId])

  return <Chatbot storeId={currentStoreId} />
}