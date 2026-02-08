import { getAppSupabase } from "@/app/utils/app-supabase.util";

export const getCouple = async (coupleId: number): Promise<unknown> => {
    const { data } = await getAppSupabase()
        .from("couples")
        .select("*, profile_1:profiles!profile_1_id (*), profile_2:profiles!profile_2_id (*)")
        .eq("id", coupleId)
        .limit(1)
        .single()
        .throwOnError();

    return data;
};
