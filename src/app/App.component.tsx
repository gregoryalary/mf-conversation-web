import type { FC } from "react";

import useAppGetCoupleQuery from "@/app/hooks/useAppGetCoupleQuery.hook";
import type { CoupleProfileIndex } from "@/app/types/app.type";
import ConversationScreen from "@/conversation/components/ConversationScreen.component";
import OnBoardingScreen from "@/on-boarding/components/OnBoardingScreen.component";
import { ThemeProvider } from "@/on-boarding/components/ThemeProvider.component";
import useStorageQueryMutation from "@/storage/hooks/useStorageQueryMutation.hook";

const COUPLE_ID = 2;

const App: FC = () => {
    const { query: profileQuery, mutate: setProfileId } = useStorageQueryMutation(
        "current-profiles",
        (raw) => Number(raw),
        (value) => String(value),
    );

    const { data: couple } = useAppGetCoupleQuery(COUPLE_ID);

    if (!couple) {
        return null;
    }

    const currentProfileId = profileQuery.data;

    if (!currentProfileId) {
        return (
            <ThemeProvider defaultTheme="dark">
                <OnBoardingScreen couple={couple} onProfileSelected={(profileId) => setProfileId(profileId)} />
            </ThemeProvider>
        );
    }

    const coupleProfileIndex: CoupleProfileIndex = currentProfileId === couple.profile1.id ? 1 : 2;

    const currentProfile = coupleProfileIndex === 1 ? couple.profile1 : couple.profile2;

    return (
        <ThemeProvider defaultTheme="dark">
            <ConversationScreen
                coupleId={COUPLE_ID}
                coupleProfileIndex={coupleProfileIndex}
                currentProfile={currentProfile}
            />
        </ThemeProvider>
    );
};

export default App;
