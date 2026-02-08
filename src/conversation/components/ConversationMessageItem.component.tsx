import type { FC } from "react";

import type { NormalizedConversationUiItemMessage } from "@/conversation/types/conversation.type";

type Props = {
    item: NormalizedConversationUiItemMessage;
};

const ConversationMessageItem: FC<Props> = ({ item }) => {
    const hasMedia = item.imagesAbsoluteURLs.length > 0 || item.recordingFilePath !== null;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: item.isReceived ? "flex-start" : "flex-end",
                marginBottom: item.isNextItemAMessageSentBySameUser ? "1px" : "0.35rem",
            }}
        >
            <div
                style={{
                    maxWidth: "70%",
                    opacity: item.isPending ? 0.5 : 1,
                    border: "1px solid var(--foreground2)",
                    borderRadius: "4px",
                    padding: "0.25em 0.6em",
                }}
            >
                {hasMedia && (
                    <div style={{ fontStyle: "italic", opacity: 0.7 }}>
                        Ce message contient des medias, ouvre l'app pour les voir
                    </div>
                )}
                {item.content && <div style={{ whiteSpace: "pre-wrap" }}>{item.content}</div>}
                <div
                    style={{
                        fontSize: "0.75em",
                        opacity: 0.5,
                        textAlign: "right",
                        marginTop: "0.25rem",
                    }}
                >
                    {item.formattedSentAt}
                    {item.emojiReaction && ` ${item.emojiReaction}`}
                </div>
            </div>
        </div>
    );
};

export default ConversationMessageItem;
