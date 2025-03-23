import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // All routes that require authentication
  if (
    // Store owner specific routes
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/store-owner') ||
    
    // User routes
    pathname.startsWith('/profile') || 
    pathname.startsWith('/account')
  ) {
    // updateSession will check if the user is authenticated and verify correct role access
    return await updateSession(request)
  }
  
  // Allow public access to all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

