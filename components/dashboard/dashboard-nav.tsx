"use client"

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Store, Package, MapPin, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface DashboardNavProps {
  user: User
}

export function DashboardNav({ user }: DashboardNavProps) {
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // Redirect to home page after sign out
    window.location.href = '/'
  }

  return (
    <nav className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6" />
          <span className="text-lg font-semibold">Store Dashboard</span>
        </div>
        
        <div className="pt-4 space-y-1">
          <p className="px-2 text-sm font-medium text-gray-500">Manage</p>
          
          <Link 
            href="/dashboard/inventory" 
            className="flex items-center space-x-2 px-2 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Package className="h-5 w-5" />
            <span>Inventory</span>
          </Link>

          <Link 
            href="/dashboard/stores" 
            className="flex items-center space-x-2 px-2 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <MapPin className="h-5 w-5" />
            <span>Stores</span>
          </Link>

          <Link 
            href="/dashboard/settings" 
            className="flex items-center space-x-2 px-2 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 w-52">
        <div className="px-2 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata.name || user.email}
              </p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-4 flex items-center space-x-2 px-2 py-2 w-full text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  )
} 