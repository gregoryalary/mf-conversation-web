import { type FC, type KeyboardEvent, useState } from "react";

import type { CoupleProfileIndex } from "@/app/types/app.type";
import type { InsertCoupleConversationMessagePayload } from "@/conversation/types/conversation.type";

type Props = {
    coupleConversationId: number;
    coupleProfileIndex: CoupleProfileIndex;
    isAtLimit: boolean;
    onSend: (payload: InsertCoupleConversationMessagePayload) => void;
};

const ConversationInput: FC<Props> = ({ coupleProfileIndex, isAtLimit, onSend }) => {
    const [text, setText] = useState("");

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
        <textarea
            className="max-w-3xl mx-auto w-full z-10 bg-black resize-none w-full py-2 px-3 text-sm border border-neutral-900 border-b-0 outline-none"
            placeholder="Message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
        />
    );
};

export default ConversationInput;
