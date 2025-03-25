// components/home-client.tsx (Client Component)
"use client"

import StoreMap from "@/components/store-map"
import ProductSearch from "@/components/product-search"
import dynamic from 'next/dynamic'
import { Suspense } from "react"
import { motion } from "framer-motion"
import AuthButton from "@/components/auth/auth-button"

// Import StoreList dynamically since it's a server component
const StoreList = dynamic(() => import("@/components/store-list"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

interface User {
  id: string;
  email: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
  aud: string;
  created_at: string;
}

interface HomeClientProps {
  user: User | null;
}

export default function HomeClient({ user }: HomeClientProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-6">
              <ProductSearch />
            </div>
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-6">
              <StoreList />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-6 h-[600px]">
              <StoreMap />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}