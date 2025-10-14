import { AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SUPABASE_URL, SUPABASE_ANON } from "@/integrations/supabase/client";

const missingVars = [
  !SUPABASE_URL && "VITE_SUPABASE_URL",
  !SUPABASE_ANON && "VITE_SUPABASE_ANON_KEY",
].filter(Boolean) as string[];

export function MissingSupabaseConfig() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12 text-left">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            <CardTitle className="text-xl font-semibold">
              Supabase configuration is missing
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            The application stops loading before the router is mounted when the required Supabase credentials are not present.
          </p>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6 py-6 text-sm leading-6 text-muted-foreground">
          <section className="space-y-2">
            <h2 className="font-semibold text-base text-foreground">What you need to set</h2>
            <p>
              Add the following environment variables to a <code>.env.local</code> file (for local development) or to your deployment
              platform's environment configuration:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-foreground">
              <li><code>VITE_SUPABASE_URL</code></li>
              <li><code>VITE_SUPABASE_ANON_KEY</code></li>
            </ul>
            {missingVars.length > 0 ? (
              <p className="rounded-md bg-amber-50 px-3 py-2 text-amber-700">
                Missing right now: {missingVars.join(", ")}
              </p>
            ) : (
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">
                Both variables are set — reload the page to continue.
              </p>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-base text-foreground">Where to find the values</h2>
            <p>
              Inside Supabase, open your project, navigate to <strong>Project Settings → API</strong>, then copy the
              <strong> project URL</strong> and <strong>anon public key</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-semibold text-base text-foreground">Need a refresher?</h2>
            <p>
              Supabase's official documentation walks through the full setup in the "Getting started" guide.
            </p>
            <a
              href="https://supabase.com/docs/guides/getting-started/quickstarts/react"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700"
            >
              Open the Supabase React quickstart
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
