import { type FC, useEffect } from "react";

import type { CoupleProfileIndex, Profile } from "@/app/types/app.type";
import Counter from "@/bits/components/Counter.component";
import DecryptedText from "@/bits/components/DecryptedText.component";
import ConversationInput from "@/conversation/components/ConversationInput.component";
import ConversationMessages from "@/conversation/components/ConversationMessages.component";
import useConversationGetCoupleConversationQuery from "@/conversation/hooks/useConversationGetCoupleConversationQuery.hook";
import useConversationMessagesQuery from "@/conversation/hooks/useConversationMessagesQuery.hook";

import ConversationBackground from "./ConversationBackground.component";

type Props = {
    coupleId: number;
    coupleProfileIndex: CoupleProfileIndex;
    otherProfile: Profile;
};

const ConversationScreen: FC<Props> = ({ coupleId, coupleProfileIndex, otherProfile }) => {
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
                otherProfile={otherProfile}
                dailyMessageLimit={coupleConversation.settings.dailyMessageLimit}
            />
        </div>
    );
};

type InnerProps = {
    coupleConversationId: number;
    coupleProfileIndex: CoupleProfileIndex;
    otherProfile: Profile;
    dailyMessageLimit: number;
};

const ConversationScreenInner: FC<InnerProps> = ({
    coupleConversationId,
    coupleProfileIndex,
    otherProfile,
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
            <div className="absolute top-0 left-0 right-0 flex flex-row items-center justify-center z-10">
                <header className="h-12 rounded-b-[10px] max-w-3xl mx-auto border border-neutral-900 border-t-0 flex justify-between items-center bg-black py-3 px-5 w-full">
                    <DecryptedText
                        text={otherProfile.name}
                        className="text-white text-base text-white"
                        speed={100}
                        animateOn="view"
                        revealDirection="end"
                        useOriginalCharsOnly={false}
                        sequential={true}
                    />
                    <div className="text-base text-white flex flex-row items-center gap-1">
                        <Counter
                            fontSize={16}
                            textColor="white"
                            fontWeight={400}
                            value={todayCount}
                            gap={0}
                            horizontalPadding={0}
                            gradientHeight={0}
                        />
                        <span>/</span>
                        <span>{dailyMessageLimit}</span>
                    </div>
                </header>
            </div>

            {isLoadingCoupleConversationMessages ? null : (
                <ConversationMessages
                    messages={coupleConversationMessages ?? []}
                    pendingMessages={pendingCoupleConversationPendingMessages}
                    coupleProfileIndex={coupleProfileIndex}
                />
            )}

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
