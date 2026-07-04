"use client";

import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, MapPin, Clock, Filter, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Agenda, JenjangId } from "@/types";
import { formatDate } from "@/lib/utils";

interface AgendaClientContainerProps {
  agendaList: Agenda[];
}

type FilterOption = "semua" | "yayasan" | JenjangId;

export function AgendaClientContainer({ agendaList }: AgendaClientContainerProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("semua");

  const filteredList = useMemo(() => {
    if (selectedFilter === "semua") return agendaList;
    if (selectedFilter === "yayasan") return agendaList.filter(a => !a.jenjangId);
    return agendaList.filter(a => a.jenjangId === selectedFilter);
  }, [agendaList, selectedFilter]);

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Jenjang:</span>
        </div>

        <Button
          variant={selectedFilter === "semua" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("semua")}
          className="rounded-full text-xs font-medium"
        >
          Semua ({agendaList.length})
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

      {/* List Display */}
      {filteredList.length === 0 ? (
        <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl max-w-xl mx-auto">
          <CalendarIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm font-medium">
            Belum ada agenda mendatang untuk kategori ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((item) => {
            const formattedDate = formatDate(item.tanggalMulai, true);

            return (
              <Card key={item.id} className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-card flex flex-col justify-between">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-emerald-950 text-gold-400 border border-gold-500/30">
                      {item.jenjangId ? item.jenjangId.toUpperCase() : "YAYASAN"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gold-600 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mendatang</span>
                    </div>
                  </div>
                  <CardTitle className="font-heading font-bold text-xl text-foreground">
                    {item.judul}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.deskripsi}
                  </p>

                  <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-foreground">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                      <CalendarIcon className="w-4 h-4 text-gold-600 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{item.lokasi}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
