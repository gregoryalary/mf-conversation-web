import { useQuery } from "@tanstack/react-query";

import { getCouple } from "@/app/utils/app-api.util";
import { parseGetCouplePayload } from "@/app/utils/app-validation.util";

const useAppGetCoupleQuery = (coupleId: number) =>
    useQuery({
        queryKey: ["couple", coupleId],
        queryFn: async () => {
            const payload = await getCouple(coupleId);
            return parseGetCouplePayload(payload);
        },
    });

export default useAppGetCoupleQuery;
