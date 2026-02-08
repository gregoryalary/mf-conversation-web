import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getAppSupabase } from "@/app/utils/app-supabase.util";
import { getCoupleConversation } from "@/conversation/utils/conversation-api-http.util";
import { parseGetCoupleConversationPayload } from "@/conversation/utils/conversation-api-validation.util";

const buildGetCoupleConversationQueryKey = (coupleId: number) => ["couple-conversation", coupleId] as const;

const useConversationGetCoupleConversationQuery = (coupleId: number) => {
    const queryClient = useQueryClient();

    const getCoupleConversationQuery = useQuery({
        queryKey: buildGetCoupleConversationQueryKey(coupleId),
        queryFn: async () => {
            const payload = await getCoupleConversation(coupleId);
            return parseGetCoupleConversationPayload(payload);
        },
    });

    useEffect(() => {
        const channel = getAppSupabase()
            .channel(`couple-conversation-update-channel-${coupleId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "couple_conversations",
                    filter: `couple_id=eq.${coupleId}`,
                },
                async (payload) => {
                    const validatedNewConversation = await parseGetCoupleConversationPayload(payload.new);
                    queryClient.setQueryData(buildGetCoupleConversationQueryKey(coupleId), validatedNewConversation);
                },
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [coupleId, queryClient]);

    return { getCoupleConversationQuery };
};

export default useConversationGetCoupleConversationQuery;
