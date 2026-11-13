import beer from "./beer";
import wings from "./wings";
import whiskey from "./whiskey";

// Bundled copies of the topics. The apps load topics from the database
// (edited in the Topic Builder) and fall back to these if the database has none.
export const TOPICS = { beer, wings, whiskey };

// Each Vercel deployment sets VITE_TOPIC to pick its topic.
export const TOPIC_SLUG = (import.meta.env.VITE_TOPIC || "beer").toLowerCase();
