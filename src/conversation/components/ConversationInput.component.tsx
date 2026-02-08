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

    return (
        <div
            style={{
                maxWidth: 1024,
                width: "100%",
                alignSelf: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "0.4rem",
                    padding: "0.3rem 0.5rem",
                    flexShrink: 0,
                }}
            >
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isAtLimit ? "Limite de messages atteinte" : "Écrire un message..."}
                    disabled={isAtLimit}
                    rows={5}
                    style={{
                        flex: 1,
                        resize: "none",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        padding: 8,
                        borderRadius: 2,
                    }}
                />
                <button
                    style={{ alignSelf: "end" }}
                    type="button"
                    onClick={handleSend}
                    disabled={isAtLimit || !text.trim()}
                >
                    Envoyer →
                </button>
            </div>
        </div>
    );
};

export default ConversationInput;
