"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  Phone, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PendaftaranPPDB, StatusPPDB, JenjangId } from "@/types";

interface PPDBTableProps {
  pendaftaranList: PendaftaranPPDB[];
  isYayasan: boolean;
  selectedJenjangFilter: JenjangId | "all";
  onJenjangFilterChange: (jenjang: JenjangId | "all") => void;
  selectedStatusFilter: StatusPPDB | "all";
  onStatusFilterChange: (status: StatusPPDB | "all") => void;
  onSelectDetail: (pendaftaran: PendaftaranPPDB) => void;
  isLoading: boolean;
}

export function PPDBTable({
  pendaftaranList,
  isYayasan,
  selectedJenjangFilter,
  onJenjangFilterChange,
  selectedStatusFilter,
  onStatusFilterChange,
  onSelectDetail,
  isLoading,
}: PPDBTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: StatusPPDB) => {
    switch (status) {
      case "baru":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" /> Baru
          </span>
        );
      case "diverifikasi":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <UserCheck className="w-3 h-3" /> Diverifikasi
          </span>
        );
      case "diterima":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Diterima
          </span>
        );
      case "ditolak":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
            <XCircle className="w-3 h-3" /> Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const filteredData = pendaftaranList.filter((item) => {
    const nameMatch = (item.calonSiswa?.namaLengkap || item.namaCalon || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const regNoMatch = (item.nomorPendaftaran || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const waMatch = (item.orangTua?.nomorWhatsApp || item.dataOrangTua?.nomorWhatsApp || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return nameMatch || regNoMatch || waMatch;
  });

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-card p-4 rounded-2xl border border-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama calon siswa, no. registrasi, atau WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Filter Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Jenjang Filter for Yayasan Admin */}
          {isYayasan && (
            <select
              value={selectedJenjangFilter}
              onChange={(e) => onJenjangFilterChange(e.target.value as JenjangId | "all")}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Semua Jenjang</option>
              <option value="tkit">TKIT</option>
              <option value="sdit">SDIT</option>
              <option value="mts">MTs</option>
              <option value="ma">MA</option>
            </select>
          )}

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusPPDB | "all")}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="diverifikasi">Diverifikasi</option>
            <option value="diterima">Diterima</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Memuat data pendaftaran PPDB...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm space-y-2">
            <AlertCircle className="w-8 h-8 text-muted-foreground/60 mx-auto" />
            <p className="font-semibold text-foreground">Tidak ada data pendaftaran ditemukan</p>
            <p className="text-xs">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">No. Registrasi</th>
                  <th className="py-3.5 px-4">Calon Siswa</th>
                  <th className="py-3.5 px-4">Jenjang</th>
                  <th className="py-3.5 px-4">Orang Tua / Kontak</th>
                  <th className="py-3.5 px-4">Berkas</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((item) => {
                  const nama = item.calonSiswa?.namaLengkap || item.namaCalon || "Calon Siswa";
                  const noReg = item.nomorPendaftaran || item.id.substring(0, 8).toUpperCase();
                  const ortuNama = item.orangTua?.namaAyah || item.dataOrangTua?.namaAyah || item.orangTua?.namaIbu || "-";
                  const wa = item.orangTua?.nomorWhatsApp || item.dataOrangTua?.nomorWhatsApp || "-";
                  const berkasCount = item.berkas?.length || item.berkasUrls?.length || 0;

                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800 dark:text-emerald-400">
                        {noReg}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground">{nama}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.calonSiswa?.jenisKelamin === "L" ? "Laki-laki" : item.calonSiswa?.jenisKelamin === "P" ? "Perempuan" : ""}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase font-mono font-extrabold text-[11px] px-2 py-0.5 rounded bg-emerald-950/10 text-emerald-800 dark:text-emerald-300">
                          {item.jenjangId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-foreground">{ortuNama}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{wa}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-card border border-border">
                          <FileText className="w-3 h-3 text-emerald-600" />
                          {berkasCount} Dokumen
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSelectDetail(item)}
                          className="hover:bg-emerald-50 text-emerald-800 hover:text-emerald-950 font-semibold gap-1 text-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail & Verifikasi</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
