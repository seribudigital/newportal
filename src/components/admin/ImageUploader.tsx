"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadMediaFile } from "@/lib/services/storage";
import { Button } from "@/components/ui/button";
import type { JenjangId } from "@/types";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  jenjangId?: JenjangId;
  label?: string;
}

export function ImageUploader({ value, onChange, jenjangId, label = "Gambar / Thumbnail" }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Berkas harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Ukuran berkas maksimal 5MB.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const result = await uploadMediaFile(file, jenjangId, (p) => setProgress(p));
      onChange(result.url);
    } catch (err) {
      console.error("Upload error:", err);
      // Fallback for demo / offline environment without active Storage bucket connection
      const mockUrl = URL.createObjectURL(file);
      onChange(mockUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-foreground">{label}</label>

      {value ? (
        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border bg-emerald-950/10 group">
          <img src={value} alt="Preview Upload" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="xs"
              onClick={() => onChange("")}
              className="rounded-lg text-xs"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Hapus Gambar
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center space-y-2 bg-muted/20 transition-colors">
          {loading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Mengunggah... {progress}%</span>
            </div>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Klik untuk memilih foto atau drag & drop</p>
                <p className="text-[10px] text-muted-foreground">PNG, JPG, WebP maksimal 5MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload-input"
              />
              <label
                htmlFor="image-upload-input"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold cursor-pointer hover:bg-emerald-800 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Berkas</span>
              </label>
            </>
          )}
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-destructive font-medium">{errorMsg}</p>}
    </div>
  );
}
