import type { CoupleProfileIndex } from "@/app/types/app.type";

export type CoupleConversationMessageImage = {
    id: number;
    filePath: string;
};

export type CoupleConversationMessage = {
    id: number;
    key: string;
    sentAtIsoString: string;
    sentByCoupleProfileIndex: CoupleProfileIndex;
    content: string;
    images: CoupleConversationMessageImage[];
    receiverEmojiReaction: string | null;
    recordingFilePath: string | null;
};

export type CoupleConversationSettings = {
    dailyMessageLimit: number;
};

export type CoupleConversation = {
    id: number;
    settings: CoupleConversationSettings;
    settingsProposal: null | {
        newSettings: CoupleConversationSettings;
        createdBy: CoupleProfileIndex;
    };
};

export type InsertCoupleConversationMessagePayload = {
    key: string;
    sentAt: Date;
    sentByCoupleProfileIndex: CoupleProfileIndex;
    content: string;
};

export type NormalizedConversationUiItemMessage = {
    key: string;
    type: "message";
    content: string;
    isPending: boolean;
    isReceived: boolean;
    isNextItemAMessageSentBySameUser: boolean;
    isFirstMessage: boolean;
    sentAtUTC: Date;
    formattedSentAt: string;
    formattedDate: string;
    imagesAbsoluteURLs: string[];
    emojiReaction: string | null;
    canReact: boolean;
    recordingFilePath: string | null;
};

export type NormalizedConversationUiItemDate = {
    key: string;
    type: "date";
    formattedDate: string;
};

export type NormalizedConversationUiItem = NormalizedConversationUiItemMessage | NormalizedConversationUiItemDate;
