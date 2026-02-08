import type { FC } from "react";

import type { Couple } from "@/app/types/app.type";

type Props = {
    couple: Couple;
    onProfileSelected: (profileId: number) => void;
};

const OnBoardingScreen: FC<Props> = ({ couple, onProfileSelected }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
            }}
        >
            <div box-="round">
                <h2 style={{ textAlign: "center", marginTop: 0 }}>Qui es-tu ?</h2>
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                    }}
                >
                    <button type="button" onClick={() => onProfileSelected(couple.profile1.id)}>
                        {couple.profile1.name}
                    </button>
                    <button type="button" onClick={() => onProfileSelected(couple.profile2.id)}>
                        {couple.profile2.name}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnBoardingScreen;
