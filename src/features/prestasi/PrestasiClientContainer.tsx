"use client";

import { useState, useMemo } from "react";
import { Award, Trophy, Filter, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Prestasi, JenjangId } from "@/types";

interface PrestasiClientContainerProps {
  initialPrestasiList: Prestasi[];
}

type JenjangFilter = "semua" | JenjangId;
type TingkatFilter = "semua" | "Kecamatan" | "Kota/Kab" | "Provinsi" | "Nasional" | "Internasional";

export function PrestasiClientContainer({ initialPrestasiList }: PrestasiClientContainerProps) {
  const [jenjangFilter, setJenjangFilter] = useState<JenjangFilter>("semua");
  const [tingkatFilter, setTingkatFilter] = useState<TingkatFilter>("semua");

  const filteredList = useMemo(() => {
    return initialPrestasiList.filter(p => {
      const matchJenjang = jenjangFilter === "semua" || p.jenjangId === jenjangFilter;
      const matchTingkat = tingkatFilter === "semua" || p.tingkat === tingkatFilter;
      return matchJenjang && matchTingkat;
    });
  }, [initialPrestasiList, jenjangFilter, tingkatFilter]);

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
        {/* Filter Jenjang */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground mr-2 w-full sm:w-auto">Jenjang:</span>
          <Button
            variant={jenjangFilter === "semua" ? "default" : "outline"}
            size="xs"
            onClick={() => setJenjangFilter("semua")}
            className="rounded-md text-xs"
          >
            Semua Jenjang
          </Button>
          <Button
            variant={jenjangFilter === "tkit" ? "default" : "outline"}
            size="xs"
            onClick={() => setJenjangFilter("tkit")}
            className="rounded-md text-xs"
          >
            TKIT
          </Button>
          <Button
            variant={jenjangFilter === "sdit" ? "default" : "outline"}
            size="xs"
            onClick={() => setJenjangFilter("sdit")}
            className="rounded-md text-xs"
          >
            SDIT
          </Button>
          <Button
            variant={jenjangFilter === "mts" ? "default" : "outline"}
            size="xs"
            onClick={() => setJenjangFilter("mts")}
            className="rounded-md text-xs"
          >
            MTs
          </Button>
          <Button
            variant={jenjangFilter === "ma" ? "default" : "outline"}
            size="xs"
            onClick={() => setJenjangFilter("ma")}
            className="rounded-md text-xs"
          >
            MA
          </Button>
        </div>

        {/* Filter Tingkat */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <span className="text-xs font-bold text-muted-foreground mr-2 w-full sm:w-auto">Tingkat Kejuaraan:</span>
          {(["semua", "Kecamatan", "Kota/Kab", "Provinsi", "Nasional", "Internasional"] as const).map(t => (
            <Button
              key={t}
              variant={tingkatFilter === t ? "secondary" : "ghost"}
              size="xs"
              onClick={() => setTingkatFilter(t)}
              className="rounded-md text-xs font-medium"
            >
              {t === "semua" ? "Semua Tingkat" : t}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredList.length === 0 ? (
        <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl max-w-xl mx-auto">
          <Trophy className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm font-medium">
            Belum ada catatan prestasi untuk filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <Card key={item.id} className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-card flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-gold-100 text-gold-700 border border-gold-400/30">
                    Tingkat {item.tingkat}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.jenjangId.toUpperCase()}
                  </span>
                </div>
                <CardTitle className="font-heading font-bold text-lg text-foreground">
                  {item.judul}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Peraih / Pemenang:</span> {item.pemenang}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Tahun:</span> {item.tahun}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
