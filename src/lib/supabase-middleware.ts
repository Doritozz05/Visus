import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
        set(name: string, value: string, options: CookieOptions) {
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
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh the token if necessary
  const { data: { user } } = await supabase.auth.getUser()

  // Protect routes requiring MFA (example: /library, /settings, /dashboard, /reader)
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/library') || 
                          request.nextUrl.pathname.startsWith('/settings') ||
                          request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/reader');

  if (user && isProtectedRoute) {
    // 1. Verify current level
    const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    
    if (!aalError && aalData.currentLevel !== 'aal2') {
      // 2. Check if user has verified factors configured
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      const allFactors = factors ? [...(factors.totp || []), ...(factors.phone || [])] : [];
      const verifiedFactors = allFactors.filter(f => f.status === 'verified');
      
      if (verifiedFactors.length > 0) {
        // The user HAS MFA but has not passed it in this session.
        // We send them to login for the challenge.
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        // Save the URL they wanted to go to to return later
        url.searchParams.set('next', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  return response
}
