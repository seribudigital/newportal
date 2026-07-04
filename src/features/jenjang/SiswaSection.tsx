"use client";

import { useState, useMemo } from "react";
import { UserCheck, Search, Filter, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Siswa } from "@/types";

interface SiswaSectionProps {
  siswaList: Siswa[];
  jenjangNama: string;
}

export function SiswaSection({ siswaList, jenjangNama }: SiswaSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("semua");

  // Get unique list of classes for filter dropdown
  const kelasList = useMemo(() => {
    const list = Array.from(new Set(siswaList.map((s) => s.kelas).filter(Boolean)));
    return list.sort();
  }, [siswaList]);

  // Filtered student list based on search & class selection
  const filteredList = useMemo(() => {
    return siswaList.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kelas.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKelas = selectedKelas === "semua" || item.kelas === selectedKelas;
      return matchSearch && matchKelas;
    });
  }, [siswaList, searchQuery, selectedKelas]);

  return (
    <section id="santri" className="py-16 md:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Direktori Santri
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Daftar Santri & Siswa Aktif {jenjangNama}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Direktori data santri terdaftar per kelas dan tahun ajaran di lingkungan sekolah.
          </p>
        </div>

        {/* Filter & Search Bar */}
        {siswaList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari nama santri atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Class Filter */}
            {kelasList.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-xs font-semibold text-muted-foreground shrink-0">Filter Kelas:</span>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-input bg-background font-semibold w-full sm:w-auto"
                >
                  <option value="semua">Semua Kelas ({siswaList.length})</option>
                  {kelasList.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* List Display */}
        {siswaList.length === 0 ? (
          <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl max-w-2xl mx-auto">
            <UserCheck className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm font-medium">
              Data direktori santri untuk jenjang {jenjangNama} sedang diperbarui oleh admin.
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center p-12 bg-card border border-border rounded-2xl max-w-xl mx-auto">
            <p className="text-muted-foreground text-sm font-medium">
              Tidak ditemukan data santri dengan kata kunci "{searchQuery}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredList.map((item) => (
              <Card
                key={item.id}
                className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-card p-4 flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-950/10 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 font-heading font-bold text-base flex items-center justify-center shrink-0 border border-emerald-900/10">
                  {item.nama.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <h3 className="font-heading font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {item.nama}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/50">
                      {item.kelas}
                    </span>
                    {item.tahunAjaran && <span>T.A {item.tahunAjaran}</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
