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
