"use client";

import Link from "next/link";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeImage } from "@/components/ui/SafeImage";
import { useSettings } from "@/lib/settingsContext";
import type { Berita } from "@/types";

interface BeritaSectionProps {
  beritaList: Berita[];
}

export function BeritaSection({ beritaList }: BeritaSectionProps) {
  const { settings } = useSettings();
  return (
    <section className="py-16 md:py-24 bg-emerald-950/5 relative border-y border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
              Kabar & Informasi
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
              Berita Terbaru Yayasan
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xl">
              Ikuti kabar kegiatan santri, agenda pendidikan, dan prestasi terbaru dari seluruh jenjang.
            </p>
          </div>

          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-emerald-800 transition-colors shrink-0"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Berita Grid */}
        {beritaList.length === 0 ? (
          <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl">
            <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm font-medium">Belum ada berita dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beritaList.slice(0, 3).map((item) => (
              <Card key={item.id} className="overflow-hidden border border-border/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between bg-card group">
                <div>
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 bg-emerald-900/10 overflow-hidden">
                    <SafeImage
                      src={item.gambarUtamaUrl}
                      alt={item.judul}
                      fallbackText={item.jenjangId ? `${item.jenjangId.toUpperCase()} ${settings?.singkatanYayasan || ''}`.trim() : (settings?.singkatanYayasan || settings?.namaYayasan || "")}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-emerald-950/80 text-gold-400 backdrop-blur-xs border border-gold-500/30">
                        {item.jenjangId ? item.jenjangId.toUpperCase() : "YAYASAN"}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="p-5 pb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-600" />
                      <span>
                        {item.tanggal?.toDate 
                          ? item.tanggal.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                          : 'Terbaru'}
                      </span>
                    </div>
                    <CardTitle className="font-heading font-bold text-lg leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/berita/${item.slug}`}>
                        {item.judul}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-5 pb-5 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.ringkasan}
                    </p>
                  </CardContent>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-emerald-800 transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
