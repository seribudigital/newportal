"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Image as ImageIcon, Filter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Galeri, JenjangId } from "@/types";

interface GaleriClientContainerProps {
  initialGaleriList: Galeri[];
}

type FilterOption = "semua" | "yayasan" | JenjangId;

export function GaleriClientContainer({ initialGaleriList }: GaleriClientContainerProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("semua");

  const filteredList = useMemo(() => {
    if (selectedFilter === "semua") return initialGaleriList;
    if (selectedFilter === "yayasan") return initialGaleriList.filter(g => !g.jenjangId);
    return initialGaleriList.filter(g => g.jenjangId === selectedFilter);
  }, [initialGaleriList, selectedFilter]);

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Foto:</span>
          </div>

          <Button
            variant={selectedFilter === "semua" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("semua")}
            className="rounded-full text-xs font-medium"
          >
            Semua ({initialGaleriList.length})
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

        {/* Tautan Cepat Ke Halaman Spesifik Jenjang */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>Ke Galeri Halaman Jenjang:</span>
          <Link href="/jenjang/tkit#galeri" className="text-emerald-700 hover:underline">TKIT</Link>
          <span>•</span>
          <Link href="/jenjang/sdit#galeri" className="text-emerald-700 hover:underline">SDIT</Link>
          <span>•</span>
          <Link href="/jenjang/mts#galeri" className="text-emerald-700 hover:underline">MTs</Link>
          <span>•</span>
          <Link href="/jenjang/ma#galeri" className="text-emerald-700 hover:underline">MA</Link>
        </div>
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
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="group relative h-52 sm:h-64 rounded-2xl overflow-hidden bg-emerald-950/20 border border-border shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-0 inset-x-0 p-4 text-white flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gold-500 text-emerald-950 w-fit mb-1">
                  {item.jenjangId ? item.jenjangId.toUpperCase() : "YAYASAN"}
                </span>
                <h3 className="font-heading font-semibold text-sm line-clamp-2 group-hover:text-gold-300 transition-colors">
                  {item.judul}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
