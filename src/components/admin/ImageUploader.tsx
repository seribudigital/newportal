"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Link2 } from "lucide-react";
import { uploadMediaFile } from "@/lib/services/storage";
import { Button } from "@/components/ui/button";
import type { JenjangId } from "@/types";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  jenjangId?: JenjangId;
  label?: string;
}

export function ImageUploader({ value, onChange, jenjangId, label = "Gambar Utama / Thumbnail" }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [imgError, setImgError] = useState(false);

  const convertFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

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
    setImgError(false);

    try {
      const result = await uploadMediaFile(file, jenjangId, (p) => setProgress(p));
      onChange(result.url);
    } catch (err) {
      console.warn("Server upload fallback: converting file to persistent Data URL", err);
      try {
        const persistentUrl = await convertFileToDataUrl(file);
        onChange(persistentUrl);
      } catch (readErr) {
        console.error("FileReader error:", readErr);
        setErrorMsg("Gagal membaca berkas gambar dari perangkat.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      setImgError(false);
      onChange(manualUrl.trim());
      setShowUrlInput(false);
    }
  };

  const isBlobUrl = value?.startsWith("blob:");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        {!value && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            <span>{showUrlInput ? "Unggah dari Komputer" : "Gunakan URL Gambar"}</span>
          </button>
        )}
      </div>

      {value && !imgError && !isBlobUrl ? (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-border bg-emerald-950/10 group">
          <img
            src={value}
            alt="Preview Upload"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="xs"
              onClick={() => {
                onChange("");
                setManualUrl("");
                setImgError(false);
              }}
              className="rounded-xl text-xs font-semibold px-3 py-1.5"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Hapus / Ganti Gambar
            </Button>
          </div>
        </div>
      ) : value && (imgError || isBlobUrl) ? (
        <div className="w-full p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-center space-y-2">
          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            Gambar sebelumnya menggunakan session sementara yang sudah tidak berlaku/kadaluarsa.
          </p>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => {
              onChange("");
              setManualUrl("");
              setImgError(false);
            }}
            className="rounded-xl text-xs font-semibold px-3 py-1 border-amber-500/50 text-amber-800 dark:text-amber-200"
          >
            Unggah Ulang Gambar
          </Button>
        </div>
      ) : showUrlInput ? (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://domain.com/gambar.jpg"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="sm" className="bg-primary text-white text-xs px-4 rounded-xl">
            Gunakan
          </Button>
        </form>
      ) : (
        <div className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 text-center space-y-3 bg-muted/20 transition-colors">
          {loading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Mengunggah Gambar... {progress}%</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Klik tombol di bawah untuk memilih gambar dari perangkat</p>
                <p className="text-[10px] text-muted-foreground">Format PNG, JPG, WebP (Maksimal 5MB)</p>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload-file-input"
              />
              <label
                htmlFor="image-upload-file-input"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold cursor-pointer hover:bg-emerald-800 shadow-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Berkas Gambar</span>
              </label>
            </>
          )}
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-destructive font-medium">{errorMsg}</p>}
    </div>
  );
}
