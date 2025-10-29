import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Supabase client creation:", {
    hasUrl: !!url,
    hasKey: !!key,
    url: url ? `${url.substring(0, 20)}...` : "undefined",
  })

  if (!url || !key) {
    throw new Error(`Missing Supabase environment variables. URL: ${!!url}, Key: ${!!key}`)
  }

  return createBrowserClient(url, key)
}
