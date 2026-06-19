import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../d_level_tree.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
