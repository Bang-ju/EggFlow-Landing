import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex flex-row w-[100vw] h-[100vh]">
      <App />
    </div>
  </StrictMode>
);
