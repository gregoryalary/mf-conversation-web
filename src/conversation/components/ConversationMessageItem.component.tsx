import type { FC } from "react";

import { Info } from "lucide-react";

import type { NormalizedConversationUiItemMessage } from "@/conversation/types/conversation.type";
import { Alert, AlertDescription } from "@/shadcdn/components/ui/alert";
import { cn } from "@/shadcdn/lib/utils";

type Props = {
    item: NormalizedConversationUiItemMessage;
};

const ConversationMessageItem: FC<Props> = ({ item }) => {
    const hasMedia = item.imagesAbsoluteURLs.length > 0 || item.recordingFilePath !== null;

    return (
        <div
            className={cn(
                "flex flex-row max-w-3xl w-full",
                item.isReceived ? "justify-start" : "justify-end",
                item.isNextItemAMessageSentBySameUser ? "pb-2" : "pb-4",
            )}
        >
            <div className={cn("max-w-7/10", item.isPending ? "opacity-50" : "opacity-100")}>
                <Alert className="bg-black/25 backdrop-blur-2xl gap-1.5">
                    {hasMedia && (
                        <AlertDescription className="text-amber-400 text-xs text-amber-600 flex-wrap">
                            <div className="flex flex-row gap-1 items-center">
                                <Info size={14} strokeWidth={1.5} />
                                Ce message contient des medias, ouvre l'app pour les voir
                            </div>
                        </AlertDescription>
                    )}
                    <AlertDescription className="text-white whitespace-pre-line">{item.content}</AlertDescription>
                    <AlertDescription className="text-gray-300 text-xs text-right">
                        {item.formattedSentAt}
                        {item.emojiReaction && ` ${item.emojiReaction}`}
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
};

export default ConversationMessageItem;
