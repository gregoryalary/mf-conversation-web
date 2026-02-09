import { useMemo, useState } from "react";

import ColorBends from "@/bits/components/ColorBends.component";
import DarkVeil from "@/bits/components/DarkVeil.component";
import Dither from "@/bits/components/Dither.component";
import FaultyTerminal from "@/bits/components/FaultyTerminal.component";
import FloatingLines from "@/bits/components/FloatingLines.component";
import Galaxy from "@/bits/components/Galaxy.component";
import LetterGlitch from "@/bits/components/LetterGlitch.component";
import PrismaticBurst from "@/bits/components/PrismaticBurst.component";
import useConversationBackgroundSelection, {
    BACKGROUND_OPTIONS,
} from "@/conversation/hooks/useConversationBackgroundSelection.hook";

const getRandomColor = () => `#${(((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0")}`;

const ConversationBackground = () => {
    const { selectedBackgrounds } = useConversationBackgroundSelection();

    const [randomState] = useState(() => ({
        color1: getRandomColor(),
        color2: getRandomColor(),
        color3: getRandomColor(),
        value1: Math.random(),
        value2: Math.random(),
        value3: Math.random(),
        value4: Math.random(),
        value5: Math.random(),
        value6: Math.random(),
        value7: Math.random(),
        value8: Math.random(),
    }));

    const randomBackground = useMemo(() => {
        if (selectedBackgrounds === null) return null;
        const eligible = BACKGROUND_OPTIONS.filter((o) => selectedBackgrounds.includes(o));
        if (eligible.length === 0) return null;
        return eligible[Math.floor(Math.random() * eligible.length)];
    }, [selectedBackgrounds]);

    if (!randomBackground) {
        return null;
    }

    return (
        <div className="fixed inset-0 overflow-hidden">
            <div className="w-full h-full relative">
                {randomBackground === "color-bends" && (
                    <ColorBends
                        colors={[randomState.color1, randomState.color2, randomState.color3]}
                        rotation={randomState.value1 * 360 - 180}
                        speed={randomState.value2 / 3 + 0.1}
                        frequency={randomState.value3 * 0.2 + 0.9}
                        warpStrength={1}
                        mouseInfluence={Number.MIN_VALUE}
                        parallax={0}
                        noise={randomState.value4 / 3 + 0.1}
                        transparent
                        autoRotate={randomState.value5 * 3}
                    />
                )}
                {randomBackground === "dark-veil" && (
                    <DarkVeil
                        speed={randomState.value1 * 2}
                        hueShift={randomState.value2 * 360}
                        noiseIntensity={randomState.value3 / 5}
                        scanlineIntensity={randomState.value4}
                        scanlineFrequency={randomState.value5 * 5}
                        warpAmount={randomState.value2 * 5}
                    />
                )}
                {randomBackground === "prismatic-burst" && (
                    <PrismaticBurst
                        colors={[randomState.color1, randomState.color2, randomState.color3]}
                        animationType="rotate3d"
                        intensity={randomState.value1 * 5 + 1}
                        speed={randomState.value2 * 0.5}
                        distort={randomState.value3 * 10}
                        rayCount={randomState.value4 * 20}
                    />
                )}
                {randomBackground === "galaxy" && (
                    <Galaxy
                        mouseInteraction={false}
                        mouseRepulsion={false}
                        density={randomState.value1 * 3}
                        glowIntensity={randomState.value2}
                        saturation={randomState.value3}
                        hueShift={randomState.value4}
                        speed={randomState.value5}
                        twinkleIntensity={randomState.value6}
                    />
                )}
                {randomBackground === "glitch" && (
                    <LetterGlitch
                        glitchColors={[randomState.color1, randomState.color2, randomState.color3]}
                        smooth={true}
                        glitchSpeed={randomState.value1 * 100}
                        centerVignette={randomState.value2 > 0.5}
                        outerVignette={randomState.value3 > 0.5}
                        characters="mélaniefrézal"
                    />
                )}
                {randomBackground === "faulty-terminal" && (
                    <FaultyTerminal
                        tint={randomState.color1}
                        scale={randomState.value1 + 2}
                        digitSize={randomState.value5 * 3}
                        noiseAmp={randomState.value2}
                        brightness={1}
                        scanlineIntensity={randomState.value3}
                        curvature={randomState.value4 / 2}
                        mouseReact={false}
                    />
                )}
                {randomBackground === "dither" && (
                    <Dither
                        waveColor={[randomState.value1, randomState.value2, randomState.value3]}
                        disableAnimation={false}
                        enableMouseInteraction={false}
                        mouseRadius={0.3}
                        waveAmplitude={randomState.value4 * 0.3 + 0.1}
                        waveFrequency={randomState.value5 + 5}
                        waveSpeed={randomState.value6 * 0.01 * 3}
                        colorNum={randomState.value7 * 20 + 10}
                    />
                )}
                {randomBackground === "floating-lines" && (
                    <FloatingLines
                        enabledWaves={["top", "middle", "bottom"]}
                        lineCount={randomState.value1 * 10 + 1}
                        lineDistance={randomState.value2 * 60 + 40}
                        bendRadius={randomState.value3 * 100}
                        bendStrength={randomState.value4 * 100}
                        interactive={false}
                    />
                )}
            </div>
        </div>
    );
};

export default ConversationBackground;
