import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Bucket = {
  tokens: number
  lastRefill: number
}

const rateLimitBuckets = new Map<string, Bucket>()
const MAX_TOKENS = 30
const REFILL_MS = 60_000

interface CalDAVRequest {
  method: string
  url: string
  credentials: {
    username: string
    password: string
  }
  body?: string
  headers?: Record<string, string>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      })
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables are not configured for the CalDAV proxy')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const bucket = rateLimitBuckets.get(user.id) ?? { tokens: MAX_TOKENS, lastRefill: Date.now() }
    const now = Date.now()
    const elapsed = now - bucket.lastRefill
    if (elapsed > REFILL_MS) {
      bucket.tokens = MAX_TOKENS
      bucket.lastRefill = now
    }

    if (bucket.tokens <= 0) {
      rateLimitBuckets.set(user.id, bucket)
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    bucket.tokens -= 1
    rateLimitBuckets.set(user.id, bucket)

    const requestData: CalDAVRequest = await req.json()
    const { method, url, credentials, body, headers = {} } = requestData

    // Validate required fields
    if (!method || !url || !credentials?.username || !credentials?.password) {
      return new Response('Missing required fields', {
        status: 400,
        headers: corsHeaders 
      })
    }

    console.log(`CalDAV Proxy: ${method} ${url}`)

    // Prepare CalDAV request headers
    const caldavHeaders: Record<string, string> = {
      'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
      'User-Agent': 'Barakah-Tasks-CalDAV/1.0',
      ...headers
    }

    // Set appropriate content type based on method
    if (method === 'PROPFIND' || method === 'PROPPATCH' || method === 'MKCALENDAR') {
      caldavHeaders['Content-Type'] = 'application/xml; charset=utf-8'
    } else if (method === 'PUT' && body?.includes('BEGIN:VCALENDAR')) {
      caldavHeaders['Content-Type'] = 'text/calendar; charset=utf-8'
    }

    // Add CalDAV specific headers
    if (method === 'PROPFIND') {
      caldavHeaders['Depth'] = headers['Depth'] || '1'
    }

    // Make the CalDAV request
    const caldavResponse = await fetch(url, {
      method,
      headers: caldavHeaders,
      body: body || undefined,
    })

    console.log(`CalDAV Response: ${caldavResponse.status} ${caldavResponse.statusText}`)

    // Get response body
    const responseBody = await caldavResponse.text()
    
    // Log response for debugging
    if (!caldavResponse.ok) {
      console.error('CalDAV Error Response:', responseBody)
    }

    // Return the CalDAV response
    return new Response(JSON.stringify({
      status: caldavResponse.status,
      statusText: caldavResponse.statusText,
      headers: Object.fromEntries(caldavResponse.headers.entries()),
      body: responseBody,
      ok: caldavResponse.ok
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('CalDAV Proxy Error:', error)
    
    return new Response(JSON.stringify({
      error: 'CalDAV proxy failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})