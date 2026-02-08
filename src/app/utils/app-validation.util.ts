import * as z from "zod";

import type { Couple, Profile } from "@/app/types/app.type";

const PROFILE_SCHEMA = z.object({
    id: z.number(),
    name: z.string(),
    picture_url: z.string(),
});

const COUPLE_SCHEMA = z.object({
    id: z.number(),
    profile_1: PROFILE_SCHEMA,
    profile_2: PROFILE_SCHEMA,
});

const normalizeValidatedProfile = (validated: z.infer<typeof PROFILE_SCHEMA>): Profile => ({
    id: validated.id,
    name: validated.name,
    pictureUrl: validated.picture_url,
});

const normalizeValidatedCouple = (validated: z.infer<typeof COUPLE_SCHEMA>): Couple => ({
    id: validated.id,
    profile1: normalizeValidatedProfile(validated.profile_1),
    profile2: normalizeValidatedProfile(validated.profile_2),
});

export const parseGetCouplePayload = (payload: unknown): Couple => {
    const validated = COUPLE_SCHEMA.parse(payload);
    return normalizeValidatedCouple(validated);
};
