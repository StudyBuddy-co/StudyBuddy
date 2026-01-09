// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rbzmkkmqigutdkwtidbl.supabase.co"; // from Supabase dashboard
const supabaseKey = "sb_publishable_w0Mfdgj0-U5mV1l4jkX0kA_KGR6mNZu"; // from Supabase dashboard -> API -> anon key

export const supabase = createClient(supabaseUrl, supabaseKey);