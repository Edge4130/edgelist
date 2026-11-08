import beer from "./beer";
import wings from "./wings";

export const TOPICS = { beer, wings };

// Each Vercel deployment sets VITE_TOPIC to pick its topic. Defaults to beer.
export const TOPIC_SLUG = (import.meta.env.VITE_TOPIC || "beer").toLowerCase();
export const topic = TOPICS[TOPIC_SLUG] || beer;
