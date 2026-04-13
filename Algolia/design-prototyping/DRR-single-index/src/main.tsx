import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DRRProvider } from "./context/DRRContext";
import PasswordGate from "./components/PasswordGate";
import App from "./App";
import "./index.css";

const baseUrl = import.meta.env.BASE_URL;
const routerBasename =
  baseUrl === "/" ? undefined : baseUrl.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <PasswordGate>
        <DRRProvider>
          <App />
        </DRRProvider>
      </PasswordGate>
    </BrowserRouter>
  </StrictMode>
);
