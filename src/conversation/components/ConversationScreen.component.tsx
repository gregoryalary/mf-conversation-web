import { type FC, useEffect } from "react";

import type { CoupleProfileIndex, Profile } from "@/app/types/app.type";
import ConversationInput from "@/conversation/components/ConversationInput.component";
import ConversationMessages from "@/conversation/components/ConversationMessages.component";
import useConversationGetCoupleConversationQuery from "@/conversation/hooks/useConversationGetCoupleConversationQuery.hook";
import useConversationMessagesQuery from "@/conversation/hooks/useConversationMessagesQuery.hook";

import ConversationBackground from "./ConversationBackground.component";

type Props = {
    coupleId: number;
    coupleProfileIndex: CoupleProfileIndex;
    currentProfile: Profile;
};

const ConversationScreen: FC<Props> = ({ coupleId, coupleProfileIndex, currentProfile }) => {
    const { getCoupleConversationQuery } = useConversationGetCoupleConversationQuery(coupleId);

    const coupleConversation = getCoupleConversationQuery.data;

    if (!coupleConversation) {
        return null;
    }

    return (
        <div className="h-screen">
            <ConversationBackground />
            <ConversationScreenInner
                coupleConversationId={coupleConversation.id}
                coupleProfileIndex={coupleProfileIndex}
                currentProfile={currentProfile}
                dailyMessageLimit={coupleConversation.settings.dailyMessageLimit}
            />
        </div>
    );
};

type InnerProps = {
    coupleConversationId: number;
    coupleProfileIndex: CoupleProfileIndex;
    currentProfile: Profile;
    dailyMessageLimit: number;
};

const ConversationScreenInner: FC<InnerProps> = ({
    coupleConversationId,
    coupleProfileIndex,
    currentProfile,
    dailyMessageLimit,
}) => {
    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const {
        coupleConversationMessages,
        pendingCoupleConversationPendingMessages,
        isLoadingCoupleConversationMessages,
        todayCoupleConversationMessageCount,
        insertCoupleConversationMessage,
    } = useConversationMessagesQuery(coupleConversationId, coupleProfileIndex);

    const todayCount = todayCoupleConversationMessageCount ?? 0;
    const isAtLimit = todayCount >= dailyMessageLimit;

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row items-center justify-center z-10">
                <header className="max-w-3xl mx-auto border border-neutral-900 border-t-0 flex justify-between bg-black py-3 px-5 w-full">
                    <span className="text-white">{currentProfile.name}</span>
                    <span>
                        {todayCount} / {dailyMessageLimit}
                    </span>
                </header>
            </div>

            <div className="max-w-3xl mx-auto flex-1 overflow-y-auto no-scrollbar">
                {isLoadingCoupleConversationMessages ? (
                    <div className="flex items-center w-center">Chargement...</div>
                ) : (
                    <ConversationMessages
                        messages={coupleConversationMessages ?? []}
                        pendingMessages={pendingCoupleConversationPendingMessages}
                        coupleProfileIndex={coupleProfileIndex}
                    />
                )}
            </div>

            <ConversationInput
                coupleConversationId={coupleConversationId}
                coupleProfileIndex={coupleProfileIndex}
                isAtLimit={isAtLimit}
                onSend={insertCoupleConversationMessage}
            />
        </div>
    );
};

export default ConversationScreen;
