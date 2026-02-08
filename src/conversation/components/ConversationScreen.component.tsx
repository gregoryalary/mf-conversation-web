import { type FC, useEffect } from "react";

import type { CoupleProfileIndex, Profile } from "@/app/types/app.type";
import ConversationInput from "@/conversation/components/ConversationInput.component";
import ConversationMessages from "@/conversation/components/ConversationMessages.component";
import useConversationGetCoupleConversationQuery from "@/conversation/hooks/useConversationGetCoupleConversationQuery.hook";
import useConversationMessagesQuery from "@/conversation/hooks/useConversationMessagesQuery.hook";

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
        <ConversationScreenInner
            coupleConversationId={coupleConversation.id}
            coupleProfileIndex={coupleProfileIndex}
            currentProfile={currentProfile}
            dailyMessageLimit={coupleConversation.settings.dailyMessageLimit}
        />
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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignSelf: "center",
                    maxWidth: "1024px",
                    width: "100%",
                    flexShrink: 0,
                    padding: "1em 0.6em",
                    borderBottom: "1px solid var(--foreground2)",
                    opacity: "0.5",
                }}
            >
                <span>{currentProfile.name}</span>
                <span>
                    {todayCount} / {dailyMessageLimit}
                </span>
            </header>

            <div style={{ flex: 1, overflow: "hidden" }}>
                {isLoadingCoupleConversationMessages ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                        }}
                    >
                        Chargement...
                    </div>
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
