import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase-middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  const url = request.nextUrl

  if (url.pathname === '/') {
    if (request.cookies.has('visus_landing_visited')) {
      return NextResponse.redirect(new URL('/library', url))
    }
    response.cookies.set('visus_landing_visited', 'true', {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    })
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
