import type { CoupleProfileIndex } from "@/app/types/app.type";
import type {
    CoupleConversationMessage,
    InsertCoupleConversationMessagePayload,
    NormalizedConversationUiItem,
} from "@/conversation/types/conversation.type";
import {
    areUTCDatesDifferentDays,
    formatDateUTCForConversationItemDate,
    formatDateUTCForConversationItemMessage,
} from "@/conversation/utils/conversation-date.util";

type UnifiedMessage = {
    key: string;
    content: string;
    sentAt: Date;
    sentByCoupleProfileIndex: CoupleProfileIndex;
    isPending: boolean;
};

export const buildConversationItems = (
    messages: CoupleConversationMessage[],
    pendingMessages: InsertCoupleConversationMessagePayload[],
    currentCoupleProfileIndex: number,
): NormalizedConversationUiItem[] => {
    const conversationItems: NormalizedConversationUiItem[] = [];

    // Merge and sort all messages (most recent first)
    const allMessages: UnifiedMessage[] = [
        ...pendingMessages.map((msg) => ({ ...msg, isPending: true })),
        ...messages
            .map((msg) => ({ ...msg, isPending: false }))
            .map((msg) => ({
                ...msg,
                sentAt: new Date(msg.sentAtIsoString),
            })),
    ].sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());

    for (let index = 0; index < allMessages.length; index++) {
        const previousMessage: UnifiedMessage | undefined = allMessages[index - 1]; // more recent
        const currentMessage = allMessages[index];
        let insertedADate = false;

        // Insert date separator when day changes (between current and older message)
        if (previousMessage) {
            if (areUTCDatesDifferentDays(currentMessage.sentAt, previousMessage.sentAt)) {
                conversationItems.push({
                    type: "date" as const,
                    key: currentMessage.sentAt.toISOString(),
                    formattedDate: formatDateUTCForConversationItemDate(currentMessage.sentAt),
                });

                insertedADate = true;
            }
        }

        const currentSenderId = currentMessage.sentByCoupleProfileIndex;
        const previousSenderId = previousMessage?.sentByCoupleProfileIndex;

        const isReceived = currentMessage.sentByCoupleProfileIndex !== currentCoupleProfileIndex;

        const images: string[] = [];
        if ("images" in currentMessage) {
            const msg = currentMessage as CoupleConversationMessage & {
                sentAt: Date;
                isPending: boolean;
            };
            for (const image of msg.images) {
                if ("filePath" in image) {
                    images.push(`https://kzvkyjrcnwgvrgxtprty.supabase.co/storage/v1/object/public/${image.filePath}`);
                }
            }
        }

        conversationItems.push({
            type: "message" as const,
            key: currentMessage.key,
            content: currentMessage.content,
            sentAtUTC: currentMessage.sentAt,
            isPending: currentMessage.isPending,
            isReceived,
            imagesAbsoluteURLs: images,
            formattedSentAt: formatDateUTCForConversationItemMessage(currentMessage.sentAt),
            formattedDate: formatDateUTCForConversationItemDate(currentMessage.sentAt),
            isNextItemAMessageSentBySameUser: !insertedADate && previousSenderId === currentSenderId,
            isFirstMessage: index === 0,
            emojiReaction:
                "receiverEmojiReaction" in currentMessage
                    ? (currentMessage.receiverEmojiReaction as string | null)
                    : null,
            canReact: isReceived && !currentMessage.isPending,
            recordingFilePath:
                "recordingFilePath" in currentMessage ? (currentMessage.recordingFilePath as string | null) : null,
        });
    }

    return conversationItems;
};
