"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, FileText, ArrowRight, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatImageUrl } from "@/lib/utils/image";
import type { Berita, JenjangId } from "@/types";

interface BeritaClientContainerProps {
  initialBeritaList: Berita[];
}

type FilterOption = "semua" | "yayasan" | JenjangId;

export function BeritaClientContainer({ initialBeritaList }: BeritaClientContainerProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("semua");
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const filteredList = useMemo(() => {
    if (selectedFilter === "semua") return initialBeritaList;
    if (selectedFilter === "yayasan") return initialBeritaList.filter(b => !b.jenjangId);
    return initialBeritaList.filter(b => b.jenjangId === selectedFilter);
  }, [initialBeritaList, selectedFilter]);

  const displayedList = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  const hasMore = visibleCount < filteredList.length;

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border max-w-2xl mx-auto">
        <Button
          variant={selectedFilter === "semua" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedFilter("semua"); setVisibleCount(6); }}
          className="rounded-full text-xs font-medium"
        >
          Semua Berita
        </Button>
        <Button
          variant={selectedFilter === "yayasan" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedFilter("yayasan"); setVisibleCount(6); }}
          className="rounded-full text-xs font-medium"
        >
          Yayasan
        </Button>
        <Button
          variant={selectedFilter === "tkit" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedFilter("tkit"); setVisibleCount(6); }}
          className="rounded-full text-xs font-medium"
        >
          TKIT
        </Button>
        <Button
          variant={selectedFilter === "sdit" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedFilter("sdit"); setVisibleCount(6); }}
          className="rounded-full text-xs font-medium"
        >
          SDIT
        </Button>
        <Button
          variant={selectedFilter === "mts" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedFilter("mts"); setVisibleCount(6); }}
          className="rounded-full text-xs font-medium"
        >
          MTs
        </Button>
        <Button
          variant={selectedFilter === "ma" ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedFilter("ma"); setVisibleCount(6); }}
          className="rounded-full text-xs font-medium"
        >
          MA
        </Button>
      </div>

      {/* Grid Display */}
      {displayedList.length === 0 ? (
        <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl max-w-xl mx-auto">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm font-medium">
            Tidak ada berita ditemukan untuk kategori ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedList.map((item) => {
            const formattedImg = formatImageUrl(item.gambarUtamaUrl);
            return (
              <Card key={item.id} className="overflow-hidden border border-border/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between bg-card group">
                <div>
                  <div className="relative w-full h-48 bg-emerald-900/10 overflow-hidden">
                    {formattedImg ? (
                      <img
                        src={formattedImg}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            e.currentTarget.style.display = "none";
                            const fallback = document.createElement("div");
                            fallback.className = "w-full h-full flex items-center justify-center text-emerald-800/40 font-heading font-bold text-2xl bg-emerald-100/40";
                            fallback.innerText = "Al-Hikmah";
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-800/40 font-heading font-bold text-2xl bg-emerald-100/40">
                        Al-Hikmah
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-emerald-950/80 text-gold-400 border border-gold-500/30">
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
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            variant="outline"
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-6 py-2 rounded-xl font-semibold border-emerald-800/30 hover:bg-emerald-50"
          >
            Muat Berita Lainnya
          </Button>
        </div>
      )}
    </div>
  );
}
