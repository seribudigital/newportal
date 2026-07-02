import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import type { JenjangId } from "@/types";

export interface UploadResult {
  url: string;
  fullPath: string;
}

/**
 * Upload asset image/file to Firebase Storage into role-safe folders.
 * Path pattern:
 * - /media/{jenjangId}/{fileName} for jenjang specific assets
 * - /media/yayasan/{fileName} for main portal assets
 */
export async function uploadMediaFile(
  file: File,
  jenjangId?: JenjangId,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const folder = jenjangId ? `media/${jenjangId}` : "media/yayasan";
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${folder}/${timestamp}_${cleanFileName}`;

  const storageRef = ref(storage, filePath);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        console.error("Firebase Storage Upload Error:", error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          url: downloadUrl,
          fullPath: filePath,
        });
      }
    );
  });
}

export interface PPDBUploadResult extends UploadResult {
  fileSize: number;
  fileType: string;
}

/**
 * Upload berkas pendaftaran PPDB ke Firebase Storage pada path private `/ppdb/{jenjangId}/{timestamp}_{cleanFileName}`
 */
export async function uploadPPDBFile(
  file: File,
  jenjangId: JenjangId,
  onProgress?: (percent: number) => void
): Promise<PPDBUploadResult> {
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `ppdb/${jenjangId}/${timestamp}_${cleanFileName}`;

  const storageRef = ref(storage, filePath);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        console.error("Firebase Storage PPDB Upload Error:", error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          url: downloadUrl,
          fullPath: filePath,
          fileSize: file.size,
          fileType: file.type,
        });
      }
    );
  });
}
