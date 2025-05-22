import { createClient } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession()

  // Optional: Check auth state
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not signed in and the current path is not /login,
  // redirect the user to /login
  if (!user && !request.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - auth (auth endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
}