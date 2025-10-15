// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://blsecepdbtdbkpptqrxe.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsc2VjZXBkYnRkYmtwcHRxcnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyOTczODYsImV4cCI6MjA3MDg3MzM4Nn0.ERUp68jam__LphqaDFmmJlPjvwz5lui0zthLrkZasHU";

const sanitizeEnv = (value: string | undefined) => value?.trim() || undefined;

const envSupabaseUrl = sanitizeEnv(import.meta.env.VITE_SUPABASE_URL as string | undefined);
const envSupabaseAnon = sanitizeEnv(import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

export const SUPABASE_READY = Boolean(envSupabaseUrl && envSupabaseAnon);

export const SUPABASE_URL = envSupabaseUrl ?? FALLBACK_SUPABASE_URL;
export const SUPABASE_ANON = envSupabaseAnon ?? FALLBACK_SUPABASE_ANON_KEY;
export const SUPABASE_USING_FALLBACK = SUPABASE_URL === FALLBACK_SUPABASE_URL || SUPABASE_ANON === FALLBACK_SUPABASE_ANON_KEY;

const envStatusMessage = [
  "Supabase configuration:",
  `VITE_SUPABASE_URL=${envSupabaseUrl ?? "<fallback>"}`,
  `VITE_SUPABASE_ANON_KEY=${envSupabaseAnon ? "***set***" : "<fallback>"}`
].join(" ");

if (SUPABASE_USING_FALLBACK && import.meta.env.DEV) {
  console.info(`${envStatusMessage}. Using embedded Supabase credentials because environment variables are missing.`);
}

if (!SUPABASE_READY && import.meta.env.DEV && !SUPABASE_USING_FALLBACK) {
  console.warn(`${envStatusMessage}. Supabase features are disabled until the variables are set.`);
}

type SupabaseClient = ReturnType<typeof createClient>;

const shouldCreateClient = SUPABASE_READY || SUPABASE_USING_FALLBACK;

export const supabase = shouldCreateClient
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : (null as unknown as SupabaseClient);
