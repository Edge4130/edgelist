// Phone-friendly photo handling.
// - Works with camera shots and library photos (JPEG, PNG, WebP, and iPhone HEIC).
// - Most phones convert HEIC to JPEG on upload; when one doesn't (some Android and desktop
//   browsers), the HEIC converter loads on demand so the main app stays small.
// - Resizes to 1200px on the long side and saves as JPEG, so large phone photos stay small.

const isHeic = (f) => /hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name || "");

async function heicToJpeg(file) {
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  return Array.isArray(out) ? out[0] : out;
}

async function decode(blob) {
  if (window.createImageBitmap) {
    try { return await createImageBitmap(blob, { imageOrientation: "from-image" }); } catch { /* fall through */ }
  }
  const url = URL.createObjectURL(blob);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export async function compressImage(file, maxSide = 1200, quality = 0.75) {
  if (!file) throw new Error("No photo was selected.");
  let source = file;
  let img;
  try {
    if (isHeic(file)) source = await heicToJpeg(file);
    img = await decode(source);
  } catch {
    // Some browsers mislabel HEIC files; try converting once before giving up.
    try { img = await decode(await heicToJpeg(file)); }
    catch { throw new Error("That photo format couldn't be opened. Try a JPEG or PNG, or take the photo again from here."); }
  }
  const w = img.width, h = img.height;
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff"; // transparent PNGs get a white background instead of black
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  img.close?.();
  return c.toDataURL("image/jpeg", quality);
}
