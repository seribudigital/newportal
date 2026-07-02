import type { JenjangId } from "@/types";

export interface UploadResult {
  url: string;
  fullPath: string;
}

/**
 * Upload asset image/file via server API endpoint (/api/upload)
 * Bypasses browser CORS restrictions completely.
 */
export async function uploadMediaFile(
  file: File,
  jenjangId?: JenjangId,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const folder = jenjangId ? `media/${jenjangId}` : "media/yayasan";
  
  if (onProgress) onProgress(30);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  if (onProgress) onProgress(60);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mengunggah gambar ke server.");
  }

  if (onProgress) onProgress(100);

  const data = await res.json();
  return {
    url: data.url,
    fullPath: folder,
  };
}

export interface PPDBUploadResult extends UploadResult {
  fileSize: number;
  fileType: string;
}

/**
 * Upload berkas pendaftaran PPDB ke server API
 */
export async function uploadPPDBFile(
  file: File,
  jenjangId: JenjangId,
  onProgress?: (percent: number) => void
): Promise<PPDBUploadResult> {
  const folder = `ppdb/${jenjangId}`;
  
  if (onProgress) onProgress(40);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mengunggah berkas PPDB.");
  }

  if (onProgress) onProgress(100);

  const data = await res.json();
  return {
    url: data.url,
    fullPath: folder,
    fileSize: file.size,
    fileType: file.type,
  };
}
