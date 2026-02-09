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
    const prevMessageCountRef = useRef(0);

    const items = buildConversationItems(messages, pendingMessages, coupleProfileIndex);

    // Reverse: buildConversationItems returns most-recent-first (for mobile inverted list)
    // Web needs oldest-first at top
    const reversedItems = [...items].reverse();

    const currentMessageCount = messages.length + pendingMessages.length;

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
    }, []);

    useEffect(() => {
        if (currentMessageCount > prevMessageCountRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        prevMessageCountRef.current = currentMessageCount;
    }, [currentMessageCount]);

    return (
        <div className="pt-16 pb-42 items-center flex flex-col">
            {reversedItems.map((item) => {
                if (item.type === "date") {
                    return (
                        <div key={item.key} className="text-center py-2 px-0 opacity-60 text-sm">
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
