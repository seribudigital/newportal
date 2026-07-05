"use client";

import { useState, useRef } from "react";
import mammoth from "mammoth";
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface ImportedWordData {
  judul: string;
  slug: string;
  ringkasan: string;
  isi: string;
}

interface WordImporterProps {
  onImport: (data: ImportedWordData) => void;
  className?: string;
}

export function WordImporter({ onImport, className = "" }: WordImporterProps) {
  const [openModal, setOpenModal] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [previewData, setPreviewData] = useState<ImportedWordData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      setError("Mohon pilih file berformat Microsoft Word (.docx).");
      return;
    }

    setParsing(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Convert to HTML
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      const rawTextResult = await mammoth.extractRawText({ arrayBuffer });

      const fullHtml = htmlResult.value || "";
      const rawText = rawTextResult.value || "";

      // Split raw text into non-empty lines
      const lines = rawText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        throw new Error("Dokumen Word kosong atau tidak dapat dibaca.");
      }

      // First line is assumed to be title
      const detectedJudul = lines[0];
      const detectedSlug = generateSlug(detectedJudul);

      // Remaining lines form summary & body
      const bodyLines = lines.slice(1);
      const firstBodyParagraph = bodyLines.length > 0 ? bodyLines[0] : detectedJudul;
      const detectedRingkasan =
        firstBodyParagraph.length > 200
          ? firstBodyParagraph.slice(0, 197) + "..."
          : firstBodyParagraph;

      setPreviewData({
        judul: detectedJudul,
        slug: detectedSlug,
        ringkasan: detectedRingkasan,
        isi: fullHtml,
      });
    } catch (err) {
      console.error("Error parsing Word file:", err);
      setError(
        "Gagal membaca file Word: " +
          (err instanceof Error ? err.message : "Format file tidak didukung.")
      );
    } finally {
      setParsing(false);
    }
  };

  const handleApply = () => {
    if (previewData) {
      onImport(previewData);
      setOpenModal(false);
      setPreviewData(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setPreviewData(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpenModal(true)}
        className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-semibold text-xs gap-1.5 rounded-xl shadow-xs cursor-pointer"
      >
        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>Import dari File Word (.docx)</span>
      </Button>

      {/* MODAL DIALOG */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl bg-card border-border shadow-2xl rounded-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 bg-muted/60 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    Import Berita dari File Word
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Unggah dokumen (.docx) untuk mengisi judul, ringkasan & isi berita secara otomatis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Upload Dropzone */}
              {!previewData && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-600/30 dark:border-emerald-500/30 hover:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 p-8 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {parsing ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                      <p className="text-xs font-semibold text-muted-foreground">
                        Membaca & menganalisis file Word...
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          Klik untuk memilih file Microsoft Word (.docx)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sistem akan mengekstrak Judul, Ringkasan, dan Paragraf secara otomatis
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Preview Extracted Data */}
              {previewData && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <Sparkles className="w-4 h-4 text-gold-600" />
                      <span>Berhasil Diekstrak! Periksa pratinjau di bawah:</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        setPreviewData(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Ganti File
                    </Button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">
                        Judul Berita Terdeteksi:
                      </span>
                      <div className="p-2.5 rounded-lg bg-muted/60 font-bold text-foreground border border-border">
                        {previewData.judul}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">
                        URL Slug Auto-Generated:
                      </span>
                      <div className="p-2.5 rounded-lg bg-muted/60 font-mono text-emerald-700 dark:text-emerald-400 border border-border">
                        {previewData.slug}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">
                        Ringkasan Awal:
                      </span>
                      <div className="p-2.5 rounded-lg bg-muted/60 text-muted-foreground border border-border leading-relaxed">
                        {previewData.ringkasan}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">
                        Pratinjau HTML Isi Berita:
                      </span>
                      <div
                        className="p-3.5 rounded-lg bg-muted/40 border border-border max-h-48 overflow-y-auto prose prose-emerald text-xs leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: previewData.isi }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="text-xs rounded-xl"
              >
                Batal
              </Button>

              {previewData && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleApply}
                  className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Terapkan ke Form Berita</span>
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
