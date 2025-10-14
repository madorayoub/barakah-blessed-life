// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail fast in production if missing (avoids silent 401s)
if (!url || !anon) {
  const msg = [
    "Missing Supabase env:",
    `VITE_SUPABASE_URL=${String(url)}`,
    `VITE_SUPABASE_ANON_KEY=${anon ? "***set***" : "undefined"}`
  ].join(" ");
  // Throwing here is OK — we want a clear error during runtime if CI didn't inject envs.
  throw new Error(msg);
}

export const supabase = createClient(url, anon);
