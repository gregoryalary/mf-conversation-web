import * as z from "zod";

import type {
    CoupleConversation,
    CoupleConversationMessage,
    CoupleConversationMessageImage,
    InsertCoupleConversationMessagePayload,
} from "@/conversation/types/conversation.type";

const COUPLE_CONVERSATION_SCHEMA = z.object({
    id: z.number(),
    settings_daily_message_limit: z.number(),
    settings_proposal_new_daily_message_limit: z.number().nullable(),
    settings_proposal_created_by_couple_profile_index: z.literal([1, 2]).nullable(),
});

const COUPLE_CONVERSATION_MESSAGE_IMAGE_SCHEMA = z.object({
    id: z.number(),
    file_path: z.string(),
});

const COUPLE_CONVERSATION_MESSAGE_SCHEMA = z.object({
    id: z.number(),
    key: z.string(),
    sent_at: z.string().regex(/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/),
    sent_by_couple_profile_index: z.literal([1, 2]),
    content: z.string(),
    receiver_reaction_emoji: z.emoji().nullable(),
    couple_conversation_message_images: z.array(COUPLE_CONVERSATION_MESSAGE_IMAGE_SCHEMA),
    recording_file_path: z.string().nullable(),
});

const TODAY_COUPLE_CONVERSATION_MESSAGES_COUNT_SCHEMA = z.number().min(0);

const INSERT_COUPLE_CONVERSATION_MESSAGE_MUTATION_VARIABLE_SCHEMA = z.object({
    key: z.string(),
    content: z.string(),
    sentByCoupleProfileIndex: z.literal([1, 2]),
    sentAt: z.date(),
});

const normalizeValidatedCoupleConversation = (
    validated: z.infer<typeof COUPLE_CONVERSATION_SCHEMA>,
): CoupleConversation => ({
    id: validated.id,
    settings: {
        dailyMessageLimit: validated.settings_daily_message_limit,
    },
    settingsProposal:
        validated.settings_proposal_created_by_couple_profile_index !== null &&
        validated.settings_proposal_new_daily_message_limit !== null
            ? {
                  createdBy: validated.settings_proposal_created_by_couple_profile_index,
                  newSettings: {
                      dailyMessageLimit: validated.settings_proposal_new_daily_message_limit,
                  },
              }
            : null,
});

const normalizeValidatedCoupleConversationMessageImage = (
    validated: z.infer<typeof COUPLE_CONVERSATION_MESSAGE_IMAGE_SCHEMA>,
): CoupleConversationMessageImage => ({
    id: validated.id,
    filePath: validated.file_path,
});

const normalizeValidatedCoupleConversationMessage = (
    validated: z.infer<typeof COUPLE_CONVERSATION_MESSAGE_SCHEMA>,
): CoupleConversationMessage => ({
    id: validated.id,
    key: validated.key,
    sentAtIsoString: validated.sent_at,
    sentByCoupleProfileIndex: validated.sent_by_couple_profile_index,
    content: validated.content,
    images: validated.couple_conversation_message_images.map(normalizeValidatedCoupleConversationMessageImage),
    receiverEmojiReaction: validated.receiver_reaction_emoji,
    recordingFilePath: validated.recording_file_path,
});

export const parseGetCoupleConversationPayload = async (payload: unknown): Promise<CoupleConversation> => {
    const validated = await COUPLE_CONVERSATION_SCHEMA.parseAsync(payload);
    return normalizeValidatedCoupleConversation(validated);
};

export const parseGetCoupleConversationMessagesPayload = async (
    payload: unknown,
): Promise<CoupleConversationMessage[]> => {
    const validated = await z.array(COUPLE_CONVERSATION_MESSAGE_SCHEMA).parseAsync(payload);
    return validated.map(normalizeValidatedCoupleConversationMessage);
};

export const parseGetTodayCoupleConversationMessagesCount = async (payload: unknown): Promise<number> => {
    const validated = await TODAY_COUPLE_CONVERSATION_MESSAGES_COUNT_SCHEMA.parseAsync(payload);
    return validated;
};

export const parseInsertedCoupleConversationMessagePayload = async (
    payload: unknown,
): Promise<CoupleConversationMessage> => {
    const validated = await COUPLE_CONVERSATION_MESSAGE_SCHEMA.parseAsync(payload);
    return normalizeValidatedCoupleConversationMessage(validated);
};

export const parseInsertMessageMutationVariables = (variables: unknown[]): InsertCoupleConversationMessagePayload[] => {
    const validated = z.array(INSERT_COUPLE_CONVERSATION_MESSAGE_MUTATION_VARIABLE_SCHEMA).parse(variables);
    return validated.map((validated) => ({
        ...validated,
        sentAt: new Date(validated.sentAt),
    }));
};
