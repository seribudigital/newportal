"use client";

import { useState, useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { GaleriLightboxModal } from "@/components/ui/GaleriLightboxModal";
import type { Galeri, JenjangId } from "@/types";

interface GaleriClientContainerProps {
  initialGaleriList: Galeri[];
}

type FilterOption = "semua" | "yayasan" | JenjangId;

export function GaleriClientContainer({ initialGaleriList }: GaleriClientContainerProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("semua");
  const [selectedGaleri, setSelectedGaleri] = useState<Galeri | null>(null);

  const filteredList = useMemo(() => {
    if (selectedFilter === "semua") return initialGaleriList;
    if (selectedFilter === "yayasan") return initialGaleriList.filter(g => !g.jenjangId);
    return initialGaleriList.filter(g => g.jenjangId === selectedFilter);
  }, [initialGaleriList, selectedFilter]);

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border max-w-2xl mx-auto">
        <Button
          variant={selectedFilter === "semua" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("semua")}
          className="rounded-full text-xs font-medium"
        >
          Semua Album ({initialGaleriList.length})
        </Button>
        <Button
          variant={selectedFilter === "yayasan" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("yayasan")}
          className="rounded-full text-xs font-medium"
        >
          Yayasan
        </Button>
        <Button
          variant={selectedFilter === "tkit" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("tkit")}
          className="rounded-full text-xs font-medium"
        >
          TKIT
        </Button>
        <Button
          variant={selectedFilter === "sdit" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("sdit")}
          className="rounded-full text-xs font-medium"
        >
          SDIT
        </Button>
        <Button
          variant={selectedFilter === "mts" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("mts")}
          className="rounded-full text-xs font-medium"
        >
          MTs
        </Button>
        <Button
          variant={selectedFilter === "ma" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("ma")}
          className="rounded-full text-xs font-medium"
        >
          MA
        </Button>
      </div>

      {/* Grid Display */}
      {filteredList.length === 0 ? (
        <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl max-w-xl mx-auto">
          <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm font-medium">
            Belum ada dokumentasi foto untuk kategori ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredList.map((item) => {
            const totalPhotos = item.imagesUrl && item.imagesUrl.length > 0 ? item.imagesUrl.length : 1;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedGaleri(item)}
                className="group relative h-52 sm:h-64 rounded-2xl overflow-hidden bg-emerald-950/20 border border-border shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <SafeImage
                  src={item.imageUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gold-500 text-emerald-950 shadow-sm">
                    {item.jenjangId ? item.jenjangId.toUpperCase() : "YAYASAN"}
                  </span>
                  {totalPhotos > 1 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-sm">
                      📷 {totalPhotos} Foto
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 text-white flex flex-col justify-end z-10">
                  <h3 className="font-heading font-semibold text-sm line-clamp-2 group-hover:text-gold-300 transition-colors">
                    {item.judul}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Slider Modal */}
      <GaleriLightboxModal
        item={selectedGaleri}
        onClose={() => setSelectedGaleri(null)}
      />
    </div>
  );
}
