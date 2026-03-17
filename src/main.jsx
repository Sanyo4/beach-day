import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BeachDayApp from "../app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BeachDayApp />
  </StrictMode>
);
