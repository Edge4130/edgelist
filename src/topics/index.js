import beer from "./beer";
import wings from "./wings";

// Bundled copies of the original topics. The apps load topics from the database
// (edited in the Topic Builder) and fall back to these only if the database is unreachable.
export const TOPICS = { beer, wings };

// Each Vercel deployment sets VITE_TOPIC to pick its topic.
export const TOPIC_SLUG = (import.meta.env.VITE_TOPIC || "beer").toLowerCase();
