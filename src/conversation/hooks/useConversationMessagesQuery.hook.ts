import { useCallback, useEffect, useMemo } from "react";

import { useMutation, useMutationState, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CoupleProfileIndex } from "@/app/types/app.type";
import type {
    CoupleConversationMessage,
    InsertCoupleConversationMessagePayload,
} from "@/conversation/types/conversation.type";
import {
    getCoupleConversationMessages,
    getTodayCoupleConversationMessagesCount,
    insertCoupleConversationMessage,
    onCoupleConversationMessageInsertedOrUpdated,
    setCoupleConversationLastProfileMessageReadAt,
} from "@/conversation/utils/conversation-api-http.util";
import {
    parseGetCoupleConversationMessagesPayload,
    parseGetTodayCoupleConversationMessagesCount,
    parseInsertedCoupleConversationMessagePayload,
    parseInsertMessageMutationVariables,
} from "@/conversation/utils/conversation-api-validation.util";

const PAGE_SIZE = 100;

const buildGetCoupleConversationMessagesQueryKey = <const T extends number>(coupleConversationId: T) =>
    ["couple-conversation-messages", coupleConversationId] as const;

const buildGetTodayCoupleConversationMessageCountQueryKey = <const T extends number>(coupleConversationId: T) =>
    ["today-couple-conversation-message-count", coupleConversationId] as const;

const buildInsertMessageMutationMutationKey = <const T extends number>(coupleConversationId: T) =>
    ["couple-conversations-messages-insert", coupleConversationId] as const;

const useConversationMessagesQuery = (coupleConversationId: number, currentCoupleProfileIndex: CoupleProfileIndex) => {
    const queryClient = useQueryClient();

    const incrementTodayCoupleConversationMessageCountQueryData = useCallback(() => {
        queryClient.setQueryData<number>(
            buildGetTodayCoupleConversationMessageCountQueryKey(coupleConversationId),
            (current) => (typeof current !== "undefined" ? current + 1 : current),
        );
    }, [queryClient, coupleConversationId]);

    const { mutate: setCoupleConversationLastProfileMessageReadAtMutation } = useMutation({
        mutationFn: (at: Date) => {
            return setCoupleConversationLastProfileMessageReadAt(coupleConversationId, currentCoupleProfileIndex, at);
        },
    });

    const upsertCoupleConversationMessageToQueryData = useCallback(
        (toUpsert: CoupleConversationMessage) => {
            queryClient.setQueryData<CoupleConversationMessage[]>(
                buildGetCoupleConversationMessagesQueryKey(coupleConversationId),
                (currentMessages) => {
                    if (!currentMessages) return;

                    const alreadyExists = currentMessages.some((message) => message.id === toUpsert.id);

                    if (alreadyExists) {
                        return currentMessages.map((message) => (message.id === toUpsert.id ? toUpsert : message));
                    }

                    if (toUpsert.sentByCoupleProfileIndex !== currentCoupleProfileIndex) {
                        if (document.visibilityState === "visible") {
                            setCoupleConversationLastProfileMessageReadAtMutation(new Date(toUpsert.sentAtIsoString));
                        }
                        incrementTodayCoupleConversationMessageCountQueryData();

                        if (Notification.permission === "granted") {
                            new Notification("Nouveau message", {
                                body: toUpsert.content || "Image / audio",
                            });
                        }
                    }

                    return [toUpsert, ...currentMessages];
                },
            );
        },
        [
            queryClient,
            coupleConversationId,
            currentCoupleProfileIndex,
            setCoupleConversationLastProfileMessageReadAtMutation,
            incrementTodayCoupleConversationMessageCountQueryData,
        ],
    );

    const { data: coupleConversationMessages, isLoading: isLoadingCoupleConversationMessages } = useQuery({
        queryKey: buildGetCoupleConversationMessagesQueryKey(coupleConversationId),
        queryFn: async () => {
            const payload = await getCoupleConversationMessages(coupleConversationId, PAGE_SIZE, null);
            const validated = await parseGetCoupleConversationMessagesPayload(payload);

            if (validated[0] && document.visibilityState === "visible") {
                setCoupleConversationLastProfileMessageReadAtMutation(new Date(validated[0].sentAtIsoString));
            }

            return validated;
        },
        retry: false,
        staleTime: 10_000,
        gcTime: 0,
    });

    const { data: todayCoupleConversationMessageCount } = useQuery({
        queryKey: buildGetTodayCoupleConversationMessageCountQueryKey(coupleConversationId),
        queryFn: async () => {
            const payload = await getTodayCoupleConversationMessagesCount(coupleConversationId);
            return parseGetTodayCoupleConversationMessagesCount(payload);
        },
    });

    const { mutate: insertCoupleConversationMessageMutation } = useMutation({
        mutationKey: buildInsertMessageMutationMutationKey(coupleConversationId),
        mutationFn: async ({ key, sentByCoupleProfileIndex, content }: InsertCoupleConversationMessagePayload) => {
            const insertedMessagePayload = await insertCoupleConversationMessage(
                coupleConversationId,
                key,
                sentByCoupleProfileIndex,
                content,
            ).then(parseInsertedCoupleConversationMessagePayload);

            return insertedMessagePayload;
        },
        onSuccess: (data) => {
            upsertCoupleConversationMessageToQueryData(data);
            incrementTodayCoupleConversationMessageCountQueryData();
        },
    });

    const insertMessageMutationVariables = useMutationState({
        filters: {
            mutationKey: buildInsertMessageMutationMutationKey(coupleConversationId),
            status: "pending",
        },
        select: (mutation) => mutation.state.variables,
    });

    const pendingCoupleConversationPendingMessages = useMemo(
        () => parseInsertMessageMutationVariables(insertMessageMutationVariables),
        [insertMessageMutationVariables],
    );

    useEffect(() => {
        const unsubscribe = onCoupleConversationMessageInsertedOrUpdated(coupleConversationId, async (payload) => {
            const validated = await parseInsertedCoupleConversationMessagePayload(payload);
            upsertCoupleConversationMessageToQueryData(validated);
        });

        return () => {
            unsubscribe();
        };
    }, [coupleConversationId, upsertCoupleConversationMessageToQueryData]);

    return {
        coupleConversationMessages,
        pendingCoupleConversationPendingMessages,
        isLoadingCoupleConversationMessages,
        todayCoupleConversationMessageCount,
        insertCoupleConversationMessage: insertCoupleConversationMessageMutation,
    };
};

export default useConversationMessagesQuery;
