import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TextConfigProvider } from "./context/textConfig/textConfig.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <TextConfigProvider>
            <App />
        </TextConfigProvider>
    </StrictMode>,
);
