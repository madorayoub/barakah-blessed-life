// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const SUPABASE_READY = Boolean(SUPABASE_URL && SUPABASE_ANON);

const missingEnvMessage = [
  "Missing Supabase env:",
  `VITE_SUPABASE_URL=${String(SUPABASE_URL)}`,
  `VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON ? "***set***" : "undefined"}`
].join(" ");

if (!SUPABASE_READY && import.meta.env.DEV) {
  console.warn(`${missingEnvMessage}. Supabase features are disabled until the variables are set.`);
}

type SupabaseClient = ReturnType<typeof createClient>;

export const supabase = SUPABASE_READY
  ? createClient(SUPABASE_URL!, SUPABASE_ANON!)
  : (null as unknown as SupabaseClient);
