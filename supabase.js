import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://nwlmfhiloiidwwmdhyph.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Q0EaJ_7zJO4bFY7ZF_eFYw_9ADzEc1A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});
