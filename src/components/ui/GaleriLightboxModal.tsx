"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { formatImageUrl } from "@/lib/utils/image";
import type { Galeri } from "@/types";

interface GaleriLightboxModalProps {
  item: Galeri | null;
  onClose: () => void;
}

export function GaleriLightboxModal({ item, onClose }: GaleriLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastScrollTime = useRef<number>(0);

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

  // Mouse wheel scroll to switch photos
  const handleWheel = (e: React.WheelEvent) => {
    if (photos.length <= 1) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 250) return; // 250ms cooldown for smooth scrolling

    if (Math.abs(e.deltaY) > 10 || Math.abs(e.deltaX) > 10) {
      lastScrollTime.current = now;
      if (e.deltaY > 0 || e.deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
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
      {/* Outer Modal Container */}
      <div className="relative w-full max-w-6xl h-[94vh] flex flex-col bg-emerald-950/90 border border-emerald-800/40 rounded-3xl overflow-hidden shadow-2xl text-white">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-emerald-950/90 z-20 flex-shrink-0">
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

        {/* Main Section: Left Stage + Right Sidebar */}
        <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT: Main Photo Stage */}
          <div
            onWheel={handleWheel}
            className="relative flex-1 min-h-0 min-w-0 flex items-center justify-center p-2 sm:p-6 bg-black/60 overflow-hidden group select-none"
          >
            {/* Scroll hint badge */}
            {photos.length > 1 && (
              <span className="absolute top-3 left-4 z-20 text-[10px] text-white/70 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full pointer-events-none border border-white/10 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                💡 Scroll mouse / usap untuk ganti foto
              </span>
            )}

            {/* Previous Button */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Foto Sebelumnya"
                className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-gold-500 hover:text-emerald-950 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5 sm:w-8 sm:h-8" />
              </button>
            )}

            {/* Main Photo Display */}
            <div className="relative w-full h-full min-h-0 flex items-center justify-center p-1 sm:p-2">
              <img
                key={currentPhotoUrl}
                src={currentPhotoUrl}
                alt={`${item.judul} - ${currentIndex + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-all duration-300 animate-in fade-in-50 zoom-in-95"
                style={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>

            {/* Next Button */}
            {photos.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Foto Selanjutnya"
                className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-gold-500 hover:text-emerald-950 text-white backdrop-blur-md transition-all shadow-lg hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* RIGHT: Sidebar Panel (Description & Vertical Thumbnail List) */}
          <div className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-emerald-950/95 border-t md:border-t-0 md:border-l border-white/10 p-4 sm:p-5 flex flex-col min-h-0 overflow-y-auto space-y-4">
            {item.keterangan && (
              <div className="space-y-1 pb-2 border-b border-white/10">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-400">
                  Keterangan Kegiatan
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  {item.keterangan}
                </p>
              </div>
            )}

            {/* Thumbnail Selector List */}
            {photos.length > 1 && (
              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">
                  Daftar Foto ({photos.length})
                </h4>
                <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-24 md:max-h-full pb-2 md:pb-0 pr-1 scrollbar-thin scrollbar-thumb-emerald-700">
                  {photos.map((thumbUrl, idx) => {
                    const formattedThumb = formatImageUrl(thumbUrl);
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={`${thumbUrl.slice(0, 20)}-${idx}`}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative flex items-center gap-3 p-1.5 rounded-xl transition-all duration-200 border-2 text-left flex-shrink-0 md:flex-shrink cursor-pointer ${
                          isActive
                            ? "border-gold-400 bg-gold-500/15 shadow-md ring-2 ring-gold-400/40 opacity-100"
                            : "border-white/10 bg-emerald-900/30 opacity-60 hover:opacity-100 hover:border-white/40"
                        }`}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
                          <img
                            src={formattedThumb}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="hidden md:block min-w-0 flex-1">
                          <span className={`text-xs font-semibold block truncate ${isActive ? "text-gold-300 font-bold" : "text-emerald-100"}`}>
                            Foto #{idx + 1}
                          </span>
                          <span className="text-[10px] text-emerald-300/70 block">
                            {isActive ? "Tampil Sekarang" : "Klik untuk buka"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
