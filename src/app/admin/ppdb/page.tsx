"use client";

import React, { useEffect, useState } from "react";
import { 
  GraduationCap, 
  Clock, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authContext";
import { getPendaftaranList } from "@/lib/services/ppdb";
import { PPDBTable } from "@/features/ppdb/admin/PPDBTable";
import { PPDBDetailDrawer } from "@/features/ppdb/admin/PPDBDetailDrawer";
import type { PendaftaranPPDB, StatusPPDB, JenjangId } from "@/types";

export default function AdminPPDBPage() {
  const { profile, isYayasanAdmin } = useAuth();

  const [pendaftaranList, setPendaftaranList] = useState<PendaftaranPPDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [jenjangFilter, setJenjangFilter] = useState<JenjangId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusPPDB | "all">("all");

  // Selected Detail for Drawer
  const [selectedDetail, setSelectedDetail] = useState<PendaftaranPPDB | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Role Scoping: admin_jenjang automatically scoped to profile.jenjangId
      const scopedJenjang: JenjangId | undefined = isYayasanAdmin 
        ? (jenjangFilter === "all" ? undefined : jenjangFilter)
        : (profile?.jenjangId || undefined);

      const scopedStatus: StatusPPDB | undefined = statusFilter === "all" ? undefined : statusFilter;

      const data = await getPendaftaranList(scopedJenjang, scopedStatus);
      setPendaftaranList(data);
    } catch (error) {
      console.error("Error loading PPDB list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile, jenjangFilter, statusFilter]);

  // Statistics Count
  const stats = {
    total: pendaftaranList.length,
    baru: pendaftaranList.filter((p) => p.status === "baru").length,
    diverifikasi: pendaftaranList.filter((p) => p.status === "diverifikasi").length,
    diterima: pendaftaranList.filter((p) => p.status === "diterima").length,
    ditolak: pendaftaranList.filter((p) => p.status === "ditolak").length,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-gold-500 font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Modul Verifikasi Admin</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Kelola Pendaftaran PPDB
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {isYayasanAdmin
              ? "Hak Akses Admin Yayasan — Memantau seluruh pendaftaran lintas 4 jenjang."
              : `Hak Akses Admin Jenjang (${profile?.jenjangId?.toUpperCase() || ""}) — Memproses pendaftar jenjang milik Anda.`}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadData}
          disabled={isLoading}
          className="gap-2 text-xs font-semibold border-emerald-900/20 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <div className="text-[11px] font-bold text-muted-foreground uppercase">Total Pendaftar</div>
          <div className="font-heading text-2xl font-extrabold text-foreground">{stats.total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1">
          <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> Status Baru
          </div>
          <div className="font-heading text-2xl font-extrabold text-blue-800 dark:text-blue-300">{stats.baru}</div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
          <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Diverifikasi
          </div>
          <div className="font-heading text-2xl font-extrabold text-amber-800 dark:text-amber-300">{stats.diverifikasi}</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
          <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Diterima
          </div>
          <div className="font-heading text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">{stats.diterima}</div>
        </div>

        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-1">
          <div className="text-[11px] font-bold text-destructive uppercase flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Ditolak
          </div>
          <div className="font-heading text-2xl font-extrabold text-destructive">{stats.ditolak}</div>
        </div>
      </div>

      {/* Main PPDB Table Component */}
      <PPDBTable
        pendaftaranList={pendaftaranList}
        isYayasan={isYayasanAdmin}
        selectedJenjangFilter={jenjangFilter}
        onJenjangFilterChange={(j) => setJenjangFilter(j)}
        selectedStatusFilter={statusFilter}
        onStatusFilterChange={(s) => setStatusFilter(s)}
        onSelectDetail={(item) => setSelectedDetail(item)}
        isLoading={isLoading}
      />

      {/* Detail Drawer Modal */}
      <PPDBDetailDrawer
        pendaftaran={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        onStatusUpdated={() => loadData()}
      />
    </div>
  );
}
