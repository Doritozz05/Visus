import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '') || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )

// Cliente para uso directo en componentes de cliente
export const supabase = createClient()
