"use client";

import React, { useState } from "react";
import { 
  X, 
  User, 
  Users, 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck, 
  Loader2, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateStatusPendaftaran } from "@/lib/services/ppdb";
import type { PendaftaranPPDB, StatusPPDB } from "@/types";

interface PPDBDetailDrawerProps {
  pendaftaran: PendaftaranPPDB | null;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export function PPDBDetailDrawer({
  pendaftaran,
  onClose,
  onStatusUpdated,
}: PPDBDetailDrawerProps) {
  if (!pendaftaran) return null;

  const [selectedStatus, setSelectedStatus] = useState<StatusPPDB>(pendaftaran.status);
  const [catatanAdmin, setCatatanAdmin] = useState(pendaftaran.catatanAdmin || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveStatus = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateStatusPendaftaran(pendaftaran.id, selectedStatus, catatanAdmin);
      setSaveSuccess(true);
      setTimeout(() => {
        onStatusUpdated();
        onClose();
      }, 800);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Gagal memperbarui status pendaftaran.");
    } finally {
      setIsSaving(false);
    }
  };

  const cSiswa = pendaftaran.calonSiswa || {
    namaLengkap: pendaftaran.namaCalon || "-",
    jenisKelamin: "L",
    tempatLahir: "-",
    tanggalLahir: "-",
    agama: "Islam",
    alamatLengkap: "-",
  };

  const oTua = pendaftaran.orangTua || {
    namaAyah: pendaftaran.dataOrangTua?.namaAyah || "-",
    namaIbu: pendaftaran.dataOrangTua?.namaIbu || "-",
    nomorWhatsApp: pendaftaran.dataOrangTua?.nomorWhatsApp || "-",
    email: pendaftaran.dataOrangTua?.email || "",
  };

  const berkasList = pendaftaran.berkas || (pendaftaran.berkasUrls || []).map((url, idx) => ({
    nama: `Dokumen Berkas #${idx + 1}`,
    url,
    path: "",
  }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right-full duration-300">
        
        {/* Header Drawer */}
        <div className="p-6 bg-emerald-950 text-white flex items-center justify-between border-b border-gold-500/20 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-gold-500 text-emerald-950 uppercase">
                {pendaftaran.jenjangId}
              </span>
              <span className="font-mono text-xs text-emerald-300 font-semibold">
                {pendaftaran.nomorPendaftaran}
              </span>
            </div>
            <h2 className="font-heading text-lg font-bold text-white truncate">
              Detail Pendaftaran: {cSiswa.namaLengkap}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-emerald-900 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs md:text-sm">
          
          {/* Status Control Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Status Pendaftaran Saat Ini:</span>
              <span className="font-mono font-bold uppercase text-xs px-2.5 py-1 rounded-full bg-emerald-900 text-gold-300 border border-gold-500/30">
                {pendaftaran.status}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-emerald-900/10">
              <label className="font-semibold text-foreground">Ubah Status Pendaftaran:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["baru", "diverifikasi", "diterima", "ditolak"] as StatusPPDB[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`py-2 px-3 rounded-xl border font-bold capitalize transition-all cursor-pointer text-xs ${
                      selectedStatus === st
                        ? st === "diterima"
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                          : st === "ditolak"
                          ? "bg-destructive text-white border-destructive shadow-sm"
                          : st === "diverifikasi"
                          ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                          : "bg-blue-600 text-white border-blue-700 shadow-sm"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="font-semibold text-foreground">Catatan Internal Admin (Opsional):</label>
              <textarea
                rows={2}
                placeholder="Tuliskan alasan penolakan / instruksi kelengkapan berkas..."
                value={catatanAdmin}
                onChange={(e) => setCatatanAdmin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              />
            </div>

            <Button
              onClick={handleSaveStatus}
              disabled={isSaving}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2.5 rounded-xl gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  <span>Perubahan Status Berhasil Disimpan!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Simpan Perubahan Status</span>
                </>
              )}
            </Button>
          </div>

          {/* Section 1: Data Calon Siswa */}
          <div className="space-y-3 bg-card p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-2 font-heading font-bold text-base text-emerald-800 dark:text-emerald-400 border-b border-border pb-2">
              <User className="w-4 h-4" />
              <span>A. Detail Calon Siswa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground text-[11px]">Nama Lengkap:</span>
                <p className="font-semibold text-foreground">{cSiswa.namaLengkap}</p>
              </div>

              <div>
                <span className="text-muted-foreground text-[11px]">Nama Panggilan / NISN:</span>
                <p className="font-semibold text-foreground">
                  {cSiswa.namaPanggilan || "-"} {cSiswa.nisn ? `(NISN: ${cSiswa.nisn})` : ""}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground text-[11px]">Jenis Kelamin:</span>
                <p className="font-semibold text-foreground">
                  {cSiswa.jenisKelamin === "L" ? "Laki-Laki" : "Perempuan"}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground text-[11px]">Tempat, Tanggal Lahir:</span>
                <p className="font-semibold text-foreground">
                  {cSiswa.tempatLahir}, {cSiswa.tanggalLahir}
                </p>
              </div>

              {cSiswa.sekolahAsal && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground text-[11px]">Sekolah Asal:</span>
                  <p className="font-semibold text-foreground">{cSiswa.sekolahAsal}</p>
                </div>
              )}

              <div className="sm:col-span-2">
                <span className="text-muted-foreground text-[11px]">Alamat Lengkap:</span>
                <p className="font-semibold text-foreground leading-relaxed">{cSiswa.alamatLengkap}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Data Orang Tua */}
          <div className="space-y-3 bg-card p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-2 font-heading font-bold text-base text-emerald-800 dark:text-emerald-400 border-b border-border pb-2">
              <Users className="w-4 h-4" />
              <span>B. Detail Orang Tua / Wali</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground text-[11px]">Nama Ayah:</span>
                <p className="font-semibold text-foreground">
                  {oTua.namaAyah} {oTua.pekerjaanAyah ? `(${oTua.pekerjaanAyah})` : ""}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground text-[11px]">Nama Ibu:</span>
                <p className="font-semibold text-foreground">
                  {oTua.namaIbu} {oTua.pekerjaanIbu ? `(${oTua.pekerjaanIbu})` : ""}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground text-[11px]">Nomor WhatsApp:</span>
                <p className="font-bold text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <a href={`https://wa.me/${oTua.nomorWhatsApp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {oTua.nomorWhatsApp}
                  </a>
                </p>
              </div>

              {oTua.email && (
                <div>
                  <span className="text-muted-foreground text-[11px]">Email:</span>
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{oTua.email}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Berkas Terunggah */}
          <div className="space-y-3 bg-card p-4 rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-emerald-800 dark:text-emerald-400">
                <FileText className="w-4 h-4" />
                <span>C. Berkas Terunggah ({berkasList.length})</span>
              </div>
            </div>

            <div className="space-y-2">
              {berkasList.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Belum ada berkas terunggah.</p>
              ) : (
                berkasList.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-foreground truncate">{b.nama}</span>
                    </div>

                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-500/30 transition-colors shrink-0"
                    >
                      <span>Lihat Berkas</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {pendaftaran.catatanPendaftar && (
            <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
              <span className="font-semibold text-muted-foreground text-[11px]">Catatan Pendaftar:</span>
              <p className="text-foreground italic">{pendaftaran.catatanPendaftar}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
