import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://kzvkyjrcnwgvrgxtprty.supabase.co",
    "sb_publishable_t2VJQtGSPztPqmUZvuUZKw_l2y5pY58",
);

export const getAppSupabase = () => supabase;
