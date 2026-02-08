import type { CoupleProfileIndex } from "@/app/types/app.type";
import { getAppSupabase } from "@/app/utils/app-supabase.util";
import { getTodayUTCBounds } from "@/conversation/utils/conversation-date.util";

export const getCoupleConversation = async (coupleId: number): Promise<unknown> => {
    const { data } = await getAppSupabase()
        .from("couple_conversations")
        .select("*")
        .eq("couple_id", coupleId)
        .single()
        .throwOnError();

    return data;
};

export const setCoupleConversationLastProfileMessageReadAt = async (
    coupleConversationId: number,
    coupleProfileIndex: CoupleProfileIndex,
    lastMessageReadAt: Date,
) => {
    const column =
        coupleProfileIndex === 1
            ? ("last_profile_1_message_read_at" as const)
            : ("last_profile_2_message_read_at" as const);

    const { data } = await getAppSupabase()
        .from("couple_conversations")
        .update({ [column]: lastMessageReadAt })
        .eq("id", coupleConversationId)
        .lt(column, lastMessageReadAt)
        .maybeSingle()
        .throwOnError();

    return data;
};

export const getCoupleConversationMessages = async (
    coupleConversationId: number,
    pageSize: number,
    olderThan: Date | null,
): Promise<unknown> => {
    let query = getAppSupabase()
        .from("couple_conversation_messages")
        .select("*, couple_conversation_message_images(*)")
        .eq("couple_conversation_id", coupleConversationId)
        .order("sent_at", { ascending: false })
        .limit(pageSize);

    if (olderThan) {
        query = query.lt("sent_at", olderThan.toUTCString());
    }

    const { data } = await query.throwOnError();

    return data;
};

const getCoupleConversationMessageImages = async (coupleConversationMessageId: number): Promise<unknown> => {
    const { data } = await getAppSupabase()
        .from("couple_conversation_message_images")
        .select("*")
        .eq("couple_conversation_message_id", coupleConversationMessageId)
        .throwOnError();

    return data;
};

export const getTodayCoupleConversationMessagesCount = async (coupleConversationId: number): Promise<unknown> => {
    const { start, end } = getTodayUTCBounds();

    const { count } = await getAppSupabase()
        .from("couple_conversation_messages")
        .select("*", { count: "exact", head: true })
        .eq("couple_conversation_id", coupleConversationId)
        .gte("sent_at", start)
        .lte("sent_at", end)
        .throwOnError();

    return count;
};

export const insertCoupleConversationMessage = async (
    coupleConversationId: number,
    key: string,
    sentByCoupleProfileIndex: CoupleProfileIndex,
    content: string,
): Promise<unknown> => {
    const { data } = await getAppSupabase()
        .from("couple_conversation_messages")
        .insert({
            couple_conversation_id: coupleConversationId,
            key: key,
            sent_by_couple_profile_index: sentByCoupleProfileIndex,
            content: content,
        })
        .select("*, couple_conversation_message_images(*)")
        .single()
        .throwOnError();

    return data;
};

export const onCoupleConversationMessageInsertedOrUpdated = (
    coupleConversationId: number,
    callback: (payload: unknown) => Promise<void>,
): (() => void) => {
    const channel = getAppSupabase()
        .channel(`couple-conversation-messages-insert-channel-${coupleConversationId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "couple_conversation_messages",
                filter: `couple_conversation_id=eq.${coupleConversationId}`,
            },
            async (payload) => {
                if ("id" in payload.new) {
                    const images = await getCoupleConversationMessageImages(payload.new.id);
                    callback({
                        ...payload.new,
                        couple_conversation_message_images: images,
                    });
                }
            },
        )
        .subscribe();

    return () => {
        channel.unsubscribe();
    };
};
