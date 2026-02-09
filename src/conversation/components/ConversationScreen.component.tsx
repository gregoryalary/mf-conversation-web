import { type FC, useEffect, useRef, useState } from "react";

import { EllipsisIcon, PauseIcon, PlayIcon } from "lucide-react";

import type { CoupleProfileIndex, Profile } from "@/app/types/app.type";
import Counter from "@/bits/components/Counter.component";
import DecryptedText from "@/bits/components/DecryptedText.component";
import ConversationBackground from "@/conversation/components/ConversationBackground.component";
import ConversationInput from "@/conversation/components/ConversationInput.component";
import ConversationMessages from "@/conversation/components/ConversationMessages.component";
import useConversationBackgroundSelection, {
    BACKGROUND_OPTIONS,
} from "@/conversation/hooks/useConversationBackgroundSelection.hook";
import useConversationGetCoupleConversationQuery from "@/conversation/hooks/useConversationGetCoupleConversationQuery.hook";
import useConversationMessagesQuery from "@/conversation/hooks/useConversationMessagesQuery.hook";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/shadcdn/components/ui/dropdown-menu";

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
        <div>
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

    const { selectedBackgrounds, toggleBackground } = useConversationBackgroundSelection();

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const todayCount = todayCoupleConversationMessageCount ?? 0;
    const isAtLimit = todayCount >= dailyMessageLimit;

    return (
        <div>
            <div className="fixed top-0 left-0 right-0 flex flex-row items-center justify-center z-10">
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
                    <div className="text-base text-white flex flex-row items-center gap-3">
                        <div className="flex flex-row items-center gap-1">
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
                        {/* biome-ignore lint/a11y/useMediaCaption: background music */}
                        <audio
                            ref={audioRef}
                            autoPlay
                            src="/background.mp3"
                            loop
                            preload="auto"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        />
                        <button
                            type="button"
                            className="text-white cursor-pointer"
                            onClick={() => {
                                const audio = audioRef.current;
                                if (!audio) return;
                                if (isPlaying) {
                                    audio.pause();
                                } else {
                                    audio.play();
                                }
                            }}
                        >
                            {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="text-white cursor-pointer">
                                    <EllipsisIcon size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Fonds</DropdownMenuLabel>
                                {BACKGROUND_OPTIONS.map((option) => (
                                    <DropdownMenuCheckboxItem
                                        key={option}
                                        checked={selectedBackgrounds === null || selectedBackgrounds.includes(option)}
                                        onSelect={(event) => event.preventDefault()}
                                        onCheckedChange={() => toggleBackground(option)}
                                    >
                                        {option}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
            </div>

            {isLoadingCoupleConversationMessages ? null : (
                <ConversationMessages
                    className={isAtLimit ? "pt-16" : "pt-16 pb-42"}
                    messages={coupleConversationMessages ?? []}
                    pendingMessages={pendingCoupleConversationPendingMessages}
                    coupleProfileIndex={coupleProfileIndex}
                />
            )}

            {!isAtLimit && (
                <ConversationInput
                    coupleConversationId={coupleConversationId}
                    coupleProfileIndex={coupleProfileIndex}
                    onSend={insertCoupleConversationMessage}
                />
            )}
        </div>
    );
};

export default ConversationScreen;
