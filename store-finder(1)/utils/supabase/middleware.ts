import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.user) {
    response.headers.set('x-user-id', session.user.id)
  }

  const { data: { user } } = await supabase.auth.getUser()
  
  // If no user is found and the URL starts with a protected route, redirect to sign-in
  if (!user && (
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/profile') || 
    request.nextUrl.pathname.startsWith('/store-owner')
  )) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // Role-based access control
  if (user) {
    const userRole = user.user_metadata?.role || user.user_metadata?.user_type
    
    // Paths that only store owners can access
    const storeOwnerPaths = ['/dashboard', '/store-owner']
    
    // Check if the current path starts with any store owner path
    const isStoreOwnerPath = storeOwnerPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )
    
    // Redirect store owner paths if user is not a store owner
    if (isStoreOwnerPath && userRole !== 'store_owner') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

