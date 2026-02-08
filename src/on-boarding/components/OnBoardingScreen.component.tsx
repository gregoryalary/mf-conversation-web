import { type FC, useEffect, useRef, useState } from "react";

import type { Couple } from "@/app/types/app.type";
import ASCIIText from "@/bits/components/AsciiText.component";
import { Button } from "@/shadcdn/components/ui/button";

const emojiList = [
    "❤️",
    "🤓",
    "😊",
    "🎉",
    "🌟",
    "🔥",
    "💫",
    "✨",
    "🌈",
    "🦄",
    "🍕",
    "🎮",
    "🎨",
    "🎭",
    "🎪",
    "🎯",
    "🚀",
    "💎",
    "🌺",
    "🌸",
    "🎵",
    "🎸",
    "⚡",
    "💝",
];

const getRandomEmoji = (): string => {
    return emojiList[Math.floor(Math.random() * emojiList.length)];
};

type Props = {
    couple: Couple;
    onProfileSelected: (profileId: number) => void;
};

const OnBoardingScreen: FC<Props> = ({ couple, onProfileSelected }) => {
    const [emojis, setEmojis] = useState<[string, string, string, string]>(["❤️", "🤓", "😊", "🎉"]);
    const currentIndexRef = useRef<0 | 1 | 2 | 3>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const indexToChange = currentIndexRef.current;

            setEmojis((prev) => {
                const newEmojis: [string, string, string, string] = [...prev];
                newEmojis[indexToChange] = getRandomEmoji();
                return newEmojis;
            });

            currentIndexRef.current = ((currentIndexRef.current + 1) % 4) as 0 | 1 | 2 | 3;
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-2 h-screen">
            <div className="h-72 relative overflow-hidden w-full">
                <ASCIIText text="Qui es-tu ?" enableWaves asciiFontSize={8} />
            </div>
            <div className="flex flex-row gap-8">
                <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="lg"
                    onClick={() => console.log(couple.profile1.id)}
                >
                    {emojis[0]}
                    &nbsp;&nbsp;
                    {couple.profile1.name}
                    &nbsp;&nbsp;
                    {emojis[1]}
                </Button>
                <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="lg"
                    onClick={() => onProfileSelected(couple.profile2.id)}
                >
                    {emojis[2]}
                    &nbsp;&nbsp;
                    {couple.profile2.name}
                    &nbsp;&nbsp;
                    {emojis[3]}
                </Button>
            </div>
        </div>
    );
};

export default OnBoardingScreen;
