/**
 * Format image URL to ensure public accessibility across browser restarts and devices.
 * Transforms raw GCS URLs into public Firebase Storage API URLs.
 */
export function formatImageUrl(url?: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  // Expired blob URLs from browser session memory cannot be loaded
  if (trimmed.startsWith("blob:")) return "";

  // Convert raw Google Cloud Storage URLs to public Firebase Storage URLs
  if (trimmed.includes("storage.googleapis.com/")) {
    try {
      const match = trimmed.match(/storage\.googleapis\.com\/([^\/]+)\/(.+)/);
      if (match) {
        const bucket = match[1];
        const rawPath = match[2].split("?")[0];
        const encodedPath = encodeURIComponent(rawPath);
        return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
      }
    } catch {
      // Fallback to raw trimmed string if parsing fails
    }
  }

  return trimmed;
}

/**
 * Compress image file to lightweight JPEG Data URL (under ~100KB)
 * Prevents Firestore 1MB document size limit errors.
 */
export function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
