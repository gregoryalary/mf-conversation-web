import useStorageQueryMutation from "@/storage/hooks/useStorageQueryMutation.hook";

export const BACKGROUND_OPTIONS = [
    "color-bends",
    "dark-veil",
    "prismatic-burst",
    "galaxy",
    "glitch",
    "faulty-terminal",
] as const;

const useConversationBackgroundSelection = () => {
    const { query, mutate } = useStorageQueryMutation<string[]>("background-selection", JSON.parse, JSON.stringify);

    const selectedBackgrounds = query.data ?? null;

    const toggleBackground = (key: string) => {
        const current = selectedBackgrounds ?? [...BACKGROUND_OPTIONS];
        if (current.includes(key)) {
            mutate(current.filter((k) => k !== key));
        } else {
            mutate([...current, key]);
        }
    };

    return { selectedBackgrounds, toggleBackground };
};

export default useConversationBackgroundSelection;
