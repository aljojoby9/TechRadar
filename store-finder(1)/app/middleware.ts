import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  // Redirect authenticated users from auth pages
  if (session && pathname.startsWith('/auth')) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    return NextResponse.redirect(
      new URL(`/dashboard/${userData?.role || 'user'}`, request.url)
    )
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
    
    // Get role from user metadata
    const userRole = session.user.user_metadata?.role || session.user.user_metadata?.user_type;
    
    // Validate role segment
    const roleSegment = pathname.split('/')[2]
    if (roleSegment !== userRole) {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ]
}