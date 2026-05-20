import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(
  supabaseUrl || "https://invalid-project.supabase.co",
  supabaseAnonKey || "invalid-anon-key",
);

export type CloudSnapshotRow = {
  user_id: string;
  state_json: Record<string, unknown>;
  updated_at: string;
  schema_version: number;
};
