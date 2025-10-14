// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingEnvMessage = [
  "Missing Supabase env:",
  `VITE_SUPABASE_URL=${String(url)}`,
  `VITE_SUPABASE_ANON_KEY=${anon ? "***set***" : "undefined"}`
].join(" ");

if (!url || !anon) {
  if (import.meta.env.PROD) {
    throw new Error(missingEnvMessage);
  }

  console.warn(`${missingEnvMessage}. Falling back to mock Supabase client.`);
}

type SupabaseClient = ReturnType<typeof createClient>;

const createMockSupabaseClient = () =>
  new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (prop === "then") {
        return undefined;
      }

      return () => {
        throw new Error(
          `Supabase client unavailable. ${missingEnvMessage}. ` +
          "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable Supabase features."
        );
      };
    }
  });

export const supabase: SupabaseClient =
  url && anon ? createClient(url, anon) : createMockSupabaseClient();
