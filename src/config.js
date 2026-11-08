// Engine-wide settings shared by every topic. A topic can override contactEmail in its own file.
export const ENGINE = {
  contactEmail: "Daniel.Edgerton@gmail.com",
};

export function contactHref(topic) {
  const email = topic.contactEmail || ENGINE.contactEmail;
  return `mailto:${email}?subject=${encodeURIComponent(`${topic.name} feedback`)}`;
}
