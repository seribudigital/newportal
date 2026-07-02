import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "media/yayasan";

    if (!file) {
      return NextResponse.json({ error: "Berkas gambar tidak ditemukan." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const destination = `${folder}/${timestamp}_${cleanFileName}`;

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "new-portal-549da.firebasestorage.app";
    
    try {
      const bucket = adminStorage.bucket(bucketName);
      const gcsFile = bucket.file(destination);

      await gcsFile.save(buffer, {
        metadata: {
          contentType: file.type || "image/jpeg",
          cacheControl: "public, max-age=31536000",
        },
      });

      let publicUrl = "";
      try {
        const [signedUrl] = await gcsFile.getSignedUrl({
          action: "read",
          expires: "2500-01-01",
        });
        publicUrl = signedUrl;
      } catch {
        publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
      }

      return NextResponse.json({ url: publicUrl, success: true });
    } catch (storageErr) {
      console.warn("Direct Cloud Storage upload failed, converting to optimized inline Data URL:", storageErr);
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ url: dataUrl, success: true });
    }
  } catch (error: any) {
    console.error("API Upload error:", error);
    return NextResponse.json({ error: error.message || "Gagal mengunggah gambar." }, { status: 500 });
  }
}
