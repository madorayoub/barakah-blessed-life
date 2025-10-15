// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const sanitizeEnv = (value: string | undefined) => value?.trim() || undefined;

const envSupabaseUrl = sanitizeEnv(import.meta.env.VITE_SUPABASE_URL as string | undefined);
const envSupabaseAnon = sanitizeEnv(import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

const DEV = import.meta.env.DEV;

const FALLBACK_SUPABASE_URL = "https://blsecepdbtdbkpptqrxe.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsc2VjZXBkYnRkYmtwcHRxcnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyOTczODYsImV4cCI6MjA3MDg3MzM4Nn0.ERUp68jam__LphqaDFmmJlPjvwz5lui0zthLrkZasHU";

export const SUPABASE_READY = Boolean(envSupabaseUrl && envSupabaseAnon);

export const SUPABASE_URL = envSupabaseUrl ?? (DEV ? FALLBACK_SUPABASE_URL : undefined);
export const SUPABASE_ANON = envSupabaseAnon ?? (DEV ? FALLBACK_SUPABASE_ANON_KEY : undefined);
const shouldCreateClient = Boolean(SUPABASE_URL && SUPABASE_ANON);
export const SUPABASE_USING_FALLBACK = DEV && (!envSupabaseUrl || !envSupabaseAnon);

const envStatusMessage = [
  "Supabase configuration:",
  `VITE_SUPABASE_URL=${envSupabaseUrl ?? "<fallback>"}`,
  `VITE_SUPABASE_ANON_KEY=${envSupabaseAnon ? "***set***" : "<fallback>"}`
].join(" ");

if (SUPABASE_USING_FALLBACK && DEV) {
  console.info(`${envStatusMessage}. Using embedded Supabase credentials because environment variables are missing.`);
}

if (!SUPABASE_READY && DEV && !SUPABASE_USING_FALLBACK) {
  console.warn(`${envStatusMessage}. Supabase features are disabled until the variables are set.`);
}

type SupabaseClient = ReturnType<typeof createClient>;
export const supabase: SupabaseClient | null = shouldCreateClient
  ? createClient(SUPABASE_URL!, SUPABASE_ANON!)
  : null;
