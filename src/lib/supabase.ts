import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '') || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const createClient = () =>
  createBrowserClient(
    supabaseUrl || 'https://example.supabase.co',
    supabaseAnonKey || 'dummy_key'
  )

// Cliente para uso directo en componentes de cliente
export const supabase = createClient()
