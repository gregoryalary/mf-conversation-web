import { StrictMode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import App from "@/app/App.component";

import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            gcTime: Number.POSITIVE_INFINITY,
            retry: 0,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
);
