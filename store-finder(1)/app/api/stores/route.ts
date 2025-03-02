import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { mockStores } from '@/lib/api' // Temporary import for mock data

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // First try to get stores from Supabase
    const { data: stores, error } = await supabase
      .from('stores')
      .select('*')
      .order('name')

    if (error || !stores || stores.length === 0) {
      // If no stores in database or error, return mock data
      return NextResponse.json(mockStores)
    }

    return NextResponse.json(stores)
  } catch (error) {
    console.error('Error fetching stores:', error)
    // Return mock data as fallback
    return NextResponse.json(mockStores)
  }
} 