"use client";

import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Link2, Star, Plus } from "lucide-react";
import { uploadMediaFile } from "@/lib/services/storage";
import { Button } from "@/components/ui/button";
import { formatImageUrl, compressImage } from "@/lib/utils/image";
import type { JenjangId } from "@/types";

interface MultiImageUploaderProps {
  values: string[];
  onChange: (urls: string[]) => void;
  jenjangId?: JenjangId;
  label?: string;
}

export function MultiImageUploader({
  values = [],
  onChange,
  jenjangId,
  label = "Unggah Berkas Foto Album",
}: MultiImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);

    const validFiles = fileList.filter((f) => {
      if (!f.type.startsWith("image/")) {
        setErrorMsg("Beberapa berkas dilewati karena bukan berupa gambar.");
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        setErrorMsg("Beberapa berkas dilewati karena ukurannya > 5MB.");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const newUrls: string[] = [];

      for (const file of validFiles) {
        // 1. Immediately compress image to lightweight base64 JPEG for guaranteed persistence
        const compressedUrl = await compressImage(file);
        newUrls.push(compressedUrl);

        // 2. Background upload attempt
        const currentIndex = values.length + newUrls.length - 1;
        uploadMediaFile(file, jenjangId)
          .then((result) => {
            if (result.url && !result.url.startsWith("data:")) {
              const updated = [...values, ...newUrls];
              updated[currentIndex] = result.url;
              onChange(updated);
            }
          })
          .catch((storageErr) => {
            console.log("Storage upload background notice (using compressed fallback):", storageErr);
          });
      }

      onChange([...values, ...newUrls]);
    } catch (err) {
      console.error("Multi-image compression error:", err);
      setErrorMsg("Gagal memproses berkas gambar.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onChange([...values, manualUrl.trim()]);
      setManualUrl("");
      setShowUrlInput(false);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = values.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleMakeCover = (indexToCover: number) => {
    if (indexToCover === 0) return;
    const updated = [...values];
    const [target] = updated.splice(indexToCover, 1);
    updated.unshift(target);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">
          {label} ({values.length} foto)
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? "Unggah dari Komputer" : "+ URL Gambar"}</span>
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://domain.com/gambar.jpg"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="sm" className="bg-primary text-white text-xs px-4 rounded-xl">
            Tambah
          </Button>
        </form>
      )}

      {/* Grid Preview Thumbnails */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-muted/20 border border-border rounded-2xl">
          {values.map((url, index) => {
            const formatted = formatImageUrl(url);
            const isCover = index === 0;
            return (
              <div
                key={`${url.slice(0, 30)}-${index}`}
                className="group relative h-28 rounded-xl overflow-hidden border border-border bg-emerald-950/10"
              >
                <img
                  src={formatted}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover Badge */}
                {isCover ? (
                  <span className="absolute top-1.5 left-1.5 bg-gold-500 text-emerald-950 font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" /> Cover Utama
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleMakeCover(index)}
                    title="Jadikan Foto Cover Utama"
                    className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-gold-500 hover:text-emerald-950 text-white font-semibold text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Set Cover
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  title="Hapus Foto Ini"
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/80 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-1 right-1.5 text-[9px] bg-black/60 text-white px-1.5 py-0.2 rounded font-mono">
                  #{index + 1}
                </div>
              </div>
            );
          })}

          {/* Add More Drop Area Box */}
          <label className="h-28 border-2 border-dashed border-border hover:border-primary/60 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-background/50 hover:bg-primary/5 transition-colors">
            <Plus className="w-5 h-5 text-muted-foreground mb-1" />
            <span className="text-[10px] font-semibold text-muted-foreground">+ Foto Lagi</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelect}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Main Upload Drop Area if empty */}
      {values.length === 0 && (
        <div className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-6 text-center space-y-3 bg-muted/20 transition-colors">
          {loading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">Memproses & Mengunggah Foto...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  Klik untuk memilih 1 atau lebih foto sekaligus dari perangkat
                </p>
                <p className="text-[10px] text-muted-foreground">Format PNG, JPG, WebP (Bisa pilih banyak file sekaligus)</p>
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelect}
                className="hidden"
                id="multi-image-upload-file-input"
              />
              <label
                htmlFor="multi-image-upload-file-input"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold cursor-pointer hover:bg-emerald-800 shadow-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Banyak Berkas Foto</span>
              </label>
            </>
          )}
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-destructive font-medium">{errorMsg}</p>}
    </div>
  );
}
