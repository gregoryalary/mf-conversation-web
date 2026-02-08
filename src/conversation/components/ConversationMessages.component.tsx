import { type FC, useEffect, useRef } from "react";

import type { CoupleProfileIndex } from "@/app/types/app.type";
import ConversationMessageItem from "@/conversation/components/ConversationMessageItem.component";
import type {
    CoupleConversationMessage,
    InsertCoupleConversationMessagePayload,
} from "@/conversation/types/conversation.type";
import { buildConversationItems } from "@/conversation/utils/conversation.util";

type Props = {
    messages: CoupleConversationMessage[];
    pendingMessages: InsertCoupleConversationMessagePayload[];
    coupleProfileIndex: CoupleProfileIndex;
};

const ConversationMessages: FC<Props> = ({ messages, pendingMessages, coupleProfileIndex }) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const prevMessageCountRef = useRef(0);

    const items = buildConversationItems(messages, pendingMessages, coupleProfileIndex);

    // Reverse: buildConversationItems returns most-recent-first (for mobile inverted list)
    // Web needs oldest-first at top
    const reversedItems = [...items].reverse();

    const currentMessageCount = messages.length + pendingMessages.length;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }, []);

    useEffect(() => {
        if (currentMessageCount > prevMessageCountRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        prevMessageCountRef.current = currentMessageCount;
    }, [currentMessageCount]);

    return (
        <div
            ref={containerRef}
            style={{
                height: "100%",
                overflowY: "auto",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                maxWidth: 1024,
                marginRight: "auto",
                marginLeft: "auto",
                gap: 16,
            }}
        >
            {reversedItems.map((item) => {
                if (item.type === "date") {
                    return (
                        <div
                            key={item.key}
                            style={{
                                textAlign: "center",
                                padding: "0.5rem 0",
                                opacity: 0.6,
                                fontSize: "0.85em",
                            }}
                        >
                            {item.formattedDate}
                        </div>
                    );
                }

                return <ConversationMessageItem key={item.key} item={item} />;
            })}
            <div ref={bottomRef} />
        </div>
    );
};

export default ConversationMessages;
