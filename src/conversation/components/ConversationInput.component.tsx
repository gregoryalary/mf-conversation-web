import { type FC, type KeyboardEvent, useState } from "react";

import { Smile } from "lucide-react";

import type { CoupleProfileIndex } from "@/app/types/app.type";
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from "@/components/ui/emoji-picker";
import type { InsertCoupleConversationMessagePayload } from "@/conversation/types/conversation.type";

type Props = {
    coupleConversationId: number;
    coupleProfileIndex: CoupleProfileIndex;
    isAtLimit: boolean;
    onSend: (payload: InsertCoupleConversationMessagePayload) => void;
};

const ConversationInput: FC<Props> = ({ coupleProfileIndex, isAtLimit, onSend }) => {
    const [text, setText] = useState("");
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || isAtLimit) return;

        onSend({
            key: crypto.randomUUID(),
            sentAt: new Date(),
            sentByCoupleProfileIndex: coupleProfileIndex,
            content: trimmed,
        });

        setText("");
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    if (isAtLimit) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 flex flex-row items-center justify-center z-10">
            <div className="flex flex-row items-start max-w-3xl mx-auto py-3 px-4 gap-3 h-42 rounded-t-[10px] mx-auto w-full z-10 bg-black w-full border border-neutral-900 border-b-0">
                <div className="relative">
                    {isEmojiPickerVisible && (
                        <div className="absolute -translate-y-full -top-4">
                            <EmojiPicker
                                locale="fr"
                                className="h-[326px] rounded-lg border shadow-md"
                                onEmojiSelect={({ emoji }) => {
                                    setText((prev) => prev + emoji);
                                    setIsEmojiPickerVisible(false);
                                }}
                            >
                                <EmojiPickerSearch lang="fr-FR" />
                                <EmojiPickerContent />
                            </EmojiPicker>
                        </div>
                    )}
                    <button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => setIsEmojiPickerVisible((prev) => !prev)}
                    >
                        <Smile strokeWidth={1} size={24} />
                    </button>
                </div>
                <textarea
                    className="resize-none self-stretch w-full text-sm outline-none p-0.5"
                    placeholder="Message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

export default ConversationInput;
