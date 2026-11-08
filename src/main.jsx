import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { topic } from "./topics";
import { applyTheme } from "./lib/theme";
import App from "./App.jsx";

applyTheme(topic);
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
