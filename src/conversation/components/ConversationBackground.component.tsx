import ColorBends from "@/bits/components/ColorBends.component";
import DarkVeil from "@/bits/components/DarkVeil.component";
import FaultyTerminal from "@/bits/components/FaultyTerminal.component";
import Galaxy from "@/bits/components/Galaxy.component";
import LetterGlitch from "@/bits/components/LetterGlitch.component";
import PrismaticBurst from "@/bits/components/PrismaticBurst.component";

const options = ["color-bends", "dark-veil", "prismatic-burst", "galaxy", "glitch" /*, "faulty-terminal"*/];

const randomBackground = options[Math.floor(Math.random() * options.length)];

const ConversationBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-full relative">
                {randomBackground === "color-bends" && (
                    <ColorBends
                        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
                        rotation={0}
                        speed={0.2}
                        frequency={1}
                        warpStrength={1}
                        mouseInfluence={Number.MIN_VALUE}
                        parallax={0.5}
                        noise={0.1}
                        transparent
                        autoRotate={0}
                    />
                )}
                {randomBackground === "dark-veil" && (
                    <DarkVeil
                        hueShift={0}
                        noiseIntensity={0}
                        scanlineIntensity={0}
                        speed={0.5}
                        scanlineFrequency={0}
                        warpAmount={0}
                    />
                )}
                {randomBackground === "prismatic-burst" && (
                    <PrismaticBurst
                        animationType="rotate3d"
                        intensity={2}
                        speed={0.2}
                        distort={0}
                        paused={false}
                        rayCount={0}
                        colors={["green", "red", "blue"]}
                    />
                )}
                {randomBackground === "galaxy" && (
                    <Galaxy mouseInteraction={false} mouseRepulsion={false} saturation={1} rotationSpeed={0.1} />
                )}
                {randomBackground === "glitch" && (
                    <LetterGlitch
                        glitchColors={["#2f5343", "#17392a", "#1a485d"]}
                        glitchSpeed={100}
                        centerVignette={false}
                        outerVignette={true}
                        smooth={true}
                        characters="mélaniefrézal"
                    />
                )}
                {randomBackground === "faulty-terminal" && (
                    <FaultyTerminal
                        scale={1.5}
                        gridMul={[2, 1]}
                        digitSize={1.2}
                        timeScale={0.5}
                        pause={false}
                        scanlineIntensity={0.5}
                        glitchAmount={1}
                        flickerAmount={1}
                        noiseAmp={1}
                        chromaticAberration={0}
                        dither={0}
                        curvature={0.1}
                        tint="#842466"
                        mouseReact={false}
                        mouseStrength={0.5}
                        pageLoadAnimation
                        brightness={0.6}
                    />
                )}
            </div>
        </div>
    );
};

export default ConversationBackground;
