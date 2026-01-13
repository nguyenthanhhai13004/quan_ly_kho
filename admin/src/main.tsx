import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import Providers from "./providers/providers.tsx";
import AppRouter from "./routes/app-router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.locale("vi");
import "leaflet/dist/leaflet.css";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Providers>
        <AppRouter />
      </Providers>
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>,
);
