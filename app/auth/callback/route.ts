import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Redirect to dashboard instead of homepage
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }
  }

  // Return the user to the sign-in page if something goes wrong
  return NextResponse.redirect(`${requestUrl.origin}/auth/sign-in`)
} 