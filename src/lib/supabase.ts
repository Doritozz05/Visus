import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '') || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )

// Client for direct use in client components
export const supabase = createClient()
