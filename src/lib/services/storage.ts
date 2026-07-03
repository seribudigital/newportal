import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import type { JenjangId } from "@/types";

export interface UploadResult {
  url: string;
  fullPath: string;
}

/**
 * Upload asset image/file via Client Firebase Storage or Server API fallback (/api/upload)
 */
export async function uploadMediaFile(
  file: File,
  jenjangId?: JenjangId,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const folder = jenjangId ? `media/${jenjangId}` : "media/yayasan";
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${folder}/${timestamp}_${cleanFileName}`;

  if (onProgress) onProgress(30);

  // Attempt 1: Direct Client Firebase Storage upload
  try {
    const storageRef = ref(storage, path);
    if (onProgress) onProgress(60);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
      cacheControl: "public, max-age=31536000",
    });
    const url = await getDownloadURL(snapshot.ref);
    if (onProgress) onProgress(100);
    return { url, fullPath: path };
  } catch (clientErr) {
    console.warn("Client Firebase Storage upload failed, trying server API route:", clientErr);
  }

  // Attempt 2: Server API endpoint
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

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
 * Upload berkas pendaftaran PPDB ke server API atau Firebase Storage
 */
export async function uploadPPDBFile(
  file: File,
  jenjangId: JenjangId,
  onProgress?: (percent: number) => void
): Promise<PPDBUploadResult> {
  const folder = `ppdb/${jenjangId}`;
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${folder}/${timestamp}_${cleanFileName}`;

  if (onProgress) onProgress(40);

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || "image/jpeg",
    });
    const url = await getDownloadURL(snapshot.ref);
    if (onProgress) onProgress(100);
    return {
      url,
      fullPath: path,
      fileSize: file.size,
      fileType: file.type,
    };
  } catch {
    // Fallback to API route
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
}
