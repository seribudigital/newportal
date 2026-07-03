"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Galeri } from "@/types";

interface GaleriSectionProps {
  galeriList: Galeri[];
}

export function GaleriSection({ galeriList }: GaleriSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Galeri Kegiatan
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Dokumentasi Kegiatan Santri & Yayasan
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Momen kebersamaan, pembelajaran, dan prestasi santri dari seluruh jenjang pendidikan.
          </p>
        </div>

        {/* Aggregate Gallery Grid */}
        {galeriList.length === 0 ? (
          <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl">
            <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm font-medium">Belum ada foto galeri dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {galeriList.slice(0, 8).map((item, index) => (
              <div
                key={item.id || index}
                className="group relative h-48 sm:h-60 rounded-2xl overflow-hidden bg-emerald-950/20 border border-border shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <SafeImage
                  src={item.imageUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-white flex flex-col justify-end z-10">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gold-500 text-emerald-950 w-fit mb-1">
                    {item.jenjangId ? item.jenjangId.toUpperCase() : "YAYASAN"}
                  </span>
                  <h3 className="font-heading font-semibold text-sm line-clamp-1 group-hover:text-gold-300 transition-colors">
                    {item.judul}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buttons to Jenjang Galleries */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2 w-full sm:w-auto text-center">
            Lihat Galeri Per Jenjang:
          </span>
          <Link
            href="/jenjang/tkit#galeri"
            className="px-4 py-2 rounded-xl bg-tkit-bg text-tkit border border-tkit/30 text-xs font-bold hover:bg-tkit hover:text-white transition-colors"
          >
            Galeri TKIT
          </Link>
          <Link
            href="/jenjang/sdit#galeri"
            className="px-4 py-2 rounded-xl bg-sdit-bg text-sdit border border-sdit/30 text-xs font-bold hover:bg-sdit hover:text-white transition-colors"
          >
            Galeri SDIT
          </Link>
          <Link
            href="/jenjang/mts#galeri"
            className="px-4 py-2 rounded-xl bg-mts-bg text-mts border border-mts/30 text-xs font-bold hover:bg-mts hover:text-white transition-colors"
          >
            Galeri MTs
          </Link>
          <Link
            href="/jenjang/ma#galeri"
            className="px-4 py-2 rounded-xl bg-ma-bg text-ma border border-ma/30 text-xs font-bold hover:bg-ma hover:text-white transition-colors"
          >
            Galeri MA
          </Link>
        </div>
      </div>
    </section>
  );
}
