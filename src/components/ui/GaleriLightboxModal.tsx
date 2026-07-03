"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { formatImageUrl } from "@/lib/utils/image";
import type { Galeri } from "@/types";

interface GaleriLightboxModalProps {
  item: Galeri | null;
  onClose: () => void;
}

export function GaleriLightboxModal({ item, onClose }: GaleriLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when item changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [item?.id]);

  const photos = item
    ? item.imagesUrl && item.imagesUrl.length > 0
      ? item.imagesUrl
      : [item.imageUrl]
    : [];

  const handleNext = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    if (photos.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [item, onClose, handleNext, handlePrev]);

  if (!item || photos.length === 0) return null;

  const currentPhotoUrl = formatImageUrl(photos[currentIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300 p-2 sm:p-4 animate-in fade-in-0">
      {/* Container Box */}
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col justify-between bg-emerald-950/80 border border-emerald-800/40 rounded-3xl overflow-hidden shadow-2xl text-white">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-emerald-950/90 z-20">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-gold-500 text-emerald-950 flex-shrink-0">
              {item.jenjangId ? item.jenjangId.toUpperCase() : "YAYASAN"}
            </span>
            <div className="min-w-0">
              <h2 className="font-heading font-bold text-sm sm:text-lg text-white truncate">
                {item.judul}
              </h2>
              <p className="text-[11px] text-emerald-200/80">
                Dokumentasi Kegiatan • Foto {currentIndex + 1} dari {photos.length}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Galeri"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Main Display Stage */}
        <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden bg-black/40">
          {/* Previous Button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto Sebelumnya"
              className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-gold-500 hover:text-emerald-950 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Main Photo */}
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              key={currentPhotoUrl}
              src={currentPhotoUrl}
              alt={`${item.judul} - ${currentIndex + 1}`}
              className="max-w-full max-h-[62vh] sm:max-h-[68vh] object-contain rounded-2xl shadow-2xl transition-all duration-300 animate-in fade-in-50 zoom-in-95"
            />
          </div>

          {/* Next Button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto Selanjutnya"
              className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-gold-500 hover:text-emerald-950 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}
        </div>

        {/* Bottom Panel (Description & Thumbnail Selector) */}
        <div className="p-4 sm:p-5 bg-emerald-950/95 border-t border-white/10 space-y-3 z-20">
          {item.keterangan && (
            <p className="text-xs sm:text-sm text-emerald-100/90 line-clamp-2 max-w-3xl">
              {item.keterangan}
            </p>
          )}

          {/* Thumbnail Selector Strip */}
          {photos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin scrollbar-thumb-emerald-700">
              {photos.map((thumbUrl, idx) => {
                const formattedThumb = formatImageUrl(thumbUrl);
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={`${thumbUrl.slice(0, 20)}-${idx}`}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-200 border-2 ${
                      isActive
                        ? "border-gold-400 scale-105 shadow-md ring-2 ring-gold-400/50 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-100 hover:border-white/40"
                    }`}
                  >
                    <img
                      src={formattedThumb}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
