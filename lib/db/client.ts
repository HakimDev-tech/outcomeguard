import { createClient } from "@supabase/supabase-js";

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

const supabaseUrl = getRequiredEnvironmentVariable(
  "NEXT_PUBLIC_SUPABASE_URL"
);

const supabaseServiceRoleKey = getRequiredEnvironmentVariable(
  "SUPABASE_SERVICE_ROLE_KEY"
);

/**
 * Server-side Supabase client.
 *
 * This client uses the service-role key and MUST only be used
 * in trusted server-side code.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
