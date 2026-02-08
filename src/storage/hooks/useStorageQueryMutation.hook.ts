import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useStorageQueryMutation = <T>(key: string, deserialize: (raw: string) => T, serialize: (value: T) => string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["storage", key],
        queryFn: () => {
            const raw = localStorage.getItem(key);
            if (raw === null) return null;
            return deserialize(raw);
        },
        staleTime: Number.POSITIVE_INFINITY,
    });

    const { mutate } = useMutation({
        mutationFn: async (value: T) => {
            localStorage.setItem(key, serialize(value));
            return value;
        },
        onSuccess: (value) => {
            queryClient.setQueryData(["storage", key], value);
        },
    });

    return { query, mutate };
};

export default useStorageQueryMutation;
