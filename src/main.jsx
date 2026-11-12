import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { TOPICS, TOPIC_SLUG } from "./topics";
import { fetchPublished } from "./lib/topicsApi";
import { applyTheme } from "./lib/theme";
import App from "./App.jsx";

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));
const root = createRoot(document.getElementById("root"));
const isAdmin = location.pathname.startsWith("/admin") || location.hash === "#admin";

async function start() {
  if (isAdmin) {
    document.title = "EdgeList Builder";
    root.render(<StrictMode><Suspense fallback={<p className="boot">Loading builder</p>}><AdminApp /></Suspense></StrictMode>);
    return;
  }
  // Published config from the database first; the bundled copy if that fails.
  const topic = (await fetchPublished(TOPIC_SLUG)) || TOPICS[TOPIC_SLUG];
  if (!topic) {
    root.render(<p className="boot">This app isn't set up yet. Publish the "{TOPIC_SLUG}" topic in the builder.</p>);
    return;
  }
  applyTheme(topic);
  root.render(<StrictMode><App topic={topic} /></StrictMode>);
}
start();
