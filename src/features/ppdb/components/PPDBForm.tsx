"use client";

import React, { useState } from "react";
import { 
  User, 
  Users, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  Loader2, 
  Check, 
  Sparkles, 
  Paperclip,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitPendaftaran } from "@/lib/services/ppdb";
import { uploadPPDBFile } from "@/lib/services/storage";
import type { JenjangId, BerkasPPDB, DataCalonSiswa, DataOrangTua } from "@/types";

interface PPDBFormProps {
  initialJenjangId?: JenjangId;
  onSuccess: (result: { id: string; nomorPendaftaran: string; namaCalon: string; jenjangId: JenjangId }) => void;
}

interface UploadingFileState {
  key: string; // e.g. "kk", "akta", "pasFoto", "ijazah"
  file: File;
  progress: number;
  error?: string;
  uploaded?: BerkasPPDB;
}

export function PPDBForm({ initialJenjangId = "sdit", onSuccess }: PPDBFormProps) {
  const [jenjangId, setJenjangId] = useState<JenjangId>(initialJenjangId);

  // Form Student State
  const [calonSiswa, setCalonSiswa] = useState<DataCalonSiswa>({
    namaLengkap: "",
    namaPanggilan: "",
    nisn: "",
    jenisKelamin: "L",
    tempatLahir: "",
    tanggalLahir: "",
    agama: "Islam",
    alamatLengkap: "",
    sekolahAsal: "",
  });

  // Form Parent State
  const [orangTua, setOrangTua] = useState<DataOrangTua>({
    namaAyah: "",
    pekerjaanAyah: "",
    namaIbu: "",
    pekerjaanIbu: "",
    namaWali: "",
    nomorWhatsApp: "",
    email: "",
    alamatOrtu: "",
  });

  const [catatanPendaftar, setCatatanPendaftar] = useState("");

  // Uploaded Files Map
  const [berkasMap, setBerkasMap] = useState<Record<string, BerkasPPDB>>({});
  const [uploadingState, setUploadingState] = useState<Record<string, UploadingFileState>>({});

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileSlots = [
    { key: "kk", label: "Kartu Keluarga (KK)", required: true, accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "akta", label: "Akta Kelahiran", required: true, accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "pasFoto", label: "Pas Foto Calon Siswa", required: true, accept: ".jpg,.jpeg,.png" },
    { key: "ijazah", label: "Ijazah / SKL / Rapor (Khusus MTs / MA)", required: jenjangId === "mts" || jenjangId === "ma", accept: ".pdf,.jpg,.jpeg,.png" },
  ];

  const handleFileUpload = async (slotKey: string, slotLabel: string, file: File) => {
    // Validation 1: Max size 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`Ukuran file ${file.name} melebihi batas maksimal 5MB.`);
      return;
    }

    // Set uploading state
    setUploadingState((prev) => ({
      ...prev,
      [slotKey]: { key: slotKey, file, progress: 10 },
    }));

    try {
      const res = await uploadPPDBFile(file, jenjangId, (percent) => {
        setUploadingState((prev) => ({
          ...prev,
          [slotKey]: { ...prev[slotKey], progress: percent },
        }));
      });

      const berkasItem: BerkasPPDB = {
        nama: slotLabel,
        url: res.url,
        path: res.fullPath,
        fileSize: res.fileSize,
        fileType: res.fileType,
      };

      setBerkasMap((prev) => ({ ...prev, [slotKey]: berkasItem }));

      setUploadingState((prev) => {
        const copy = { ...prev };
        delete copy[slotKey];
        return copy;
      });
    } catch (error: any) {
      console.error("Upload Error:", error);
      setUploadingState((prev) => ({
        ...prev,
        [slotKey]: { ...prev[slotKey], progress: 0, error: "Gagal mengunggah berkas. Coba lagi." },
      }));
    }
  };

  const handleRemoveFile = (slotKey: string) => {
    setBerkasMap((prev) => {
      const copy = { ...prev };
      delete copy[slotKey];
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!calonSiswa.namaLengkap.trim()) {
      setErrorMessage("Nama lengkap calon siswa wajib diisi.");
      return;
    }
    if (!calonSiswa.tempatLahir.trim() || !calonSiswa.tanggalLahir) {
      setErrorMessage("Tempat dan tanggal lahir calon siswa wajib diisi.");
      return;
    }
    if (!calonSiswa.alamatLengkap.trim()) {
      setErrorMessage("Alamat lengkap wajib diisi.");
      return;
    }
    if (!orangTua.namaAyah.trim() && !orangTua.namaIbu.trim()) {
      setErrorMessage("Minimal isi nama Ayah Kandung atau Ibu Kandung.");
      return;
    }
    if (!orangTua.nomorWhatsApp.trim()) {
      setErrorMessage("Nomor WhatsApp aktif wajib diisi untuk konfirmasi pendaftaran.");
      return;
    }

    // Required File Check
    for (const slot of fileSlots) {
      if (slot.required && !berkasMap[slot.key]) {
        setErrorMessage(`Mohon unggah dokumen berkas "${slot.label}" sebelum melanjutkan.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const berkasList = Object.values(berkasMap);
      const result = await submitPendaftaran({
        jenjangId,
        calonSiswa,
        orangTua,
        berkas: berkasList,
        catatanPendaftar,
      });

      onSuccess({
        id: result.id,
        nomorPendaftaran: result.nomorPendaftaran,
        namaCalon: calonSiswa.namaLengkap,
        jenjangId,
      });
    } catch (err: any) {
      console.error("PPDB Submit Error:", err);
      setErrorMessage("Gagal mengirim data pendaftaran. Silakan periksa koneksi internet Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="form-pendaftaran" className="bg-card rounded-3xl border border-gold-500/20 shadow-xl p-6 md:p-10 space-y-8">
      {/* Header Form */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span>Formulir Pendaftaran Siswa Baru</span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          Isi Data Pendaftaran PPDB Online
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Silakan lengkapi seluruh isian formulir di bawah ini dengan benar.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs md:text-sm font-medium flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. SELEKSI JENJANG PENDIDIKAN */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>Pilih Jenjang Sekolah</span>
            <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "tkit", label: "TKIT", name: "TK Islam Terpadu" },
              { id: "sdit", label: "SDIT", name: "SD Islam Terpadu" },
              { id: "mts", label: "MTs", name: "Madrasah Tsanawiyah" },
              { id: "ma", label: "MA", name: "Madrasah Aliyah" },
            ].map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setJenjangId(j.id as JenjangId)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  jenjangId === j.id
                    ? "bg-emerald-900 text-white border-gold-500 shadow-sm font-bold ring-2 ring-gold-500/50"
                    : "bg-background text-foreground border-border hover:bg-emerald-50/50"
                }`}
              >
                <div className="text-sm font-heading font-bold">{j.label}</div>
                <div className={`text-[11px] truncate ${jenjangId === j.id ? "text-gold-300" : "text-muted-foreground"}`}>
                  {j.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. DATA CALON SISWA */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-emerald-800 font-heading font-bold text-base md:text-lg">
            <User className="w-5 h-5" />
            <h3>A. Data Calon Peserta Didik</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-foreground">
                Nama Lengkap Calon Siswa <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Muhammad Ali Al-Fatih"
                value={calonSiswa.namaLengkap}
                onChange={(e) => setCalonSiswa({ ...calonSiswa, namaLengkap: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Nama Panggilan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Nama Panggilan</label>
              <input
                type="text"
                placeholder="Contoh: Ali"
                value={calonSiswa.namaPanggilan || ""}
                onChange={(e) => setCalonSiswa({ ...calonSiswa, namaPanggilan: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* NISN */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">NISN (Opsional)</label>
              <input
                type="text"
                placeholder="Nomor Induk Siswa Nasional (jika ada)"
                value={calonSiswa.nisn || ""}
                onChange={(e) => setCalonSiswa({ ...calonSiswa, nisn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Jenis Kelamin <span className="text-destructive">*</span>
              </label>
              <select
                value={calonSiswa.jenisKelamin}
                onChange={(e) => setCalonSiswa({ ...calonSiswa, jenisKelamin: e.target.value as "L" | "P" })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="L">Laki-Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* Tempat Lahir */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tempat Lahir <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Kota / Kabupaten Lahir"
                value={calonSiswa.tempatLahir}
                onChange={(e) => setCalonSiswa({ ...calonSiswa, tempatLahir: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tanggal Lahir <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                required
                value={calonSiswa.tanggalLahir}
                onChange={(e) => setCalonSiswa({ ...calonSiswa, tanggalLahir: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Sekolah Asal */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Sekolah Asal / TK / SD Sebelumnya</label>
              <input
                type="text"
                placeholder="Contoh: TK Islam Terpadu Al-Hikmah"
                value={calonSiswa.sekolahAsal || ""}
                onChange={(e) => setCalonSiswa({ ...calonSiswa, sekolahAsal: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-foreground">
                Alamat Lengkap Tempat Tinggal <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="Jalan, RT/RW, Desa/Kelurahan, Kecamatan, Kota/Kabupaten"
                value={calonSiswa.alamatLengkap}
                onChange={(e) => setCalonSiswa({ ...calonSiswa, alamatLengkap: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
              />
            </div>
          </div>
        </div>

        {/* 3. DATA ORANG TUA / WALI */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-emerald-800 font-heading font-bold text-base md:text-lg">
            <Users className="w-5 h-5" />
            <h3>B. Data Orang Tua / Wali</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Ayah */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nama Ayah Kandung <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Ayah"
                value={orangTua.namaAyah}
                onChange={(e) => setOrangTua({ ...orangTua, namaAyah: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Pekerjaan Ayah */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pekerjaan Ayah</label>
              <input
                type="text"
                placeholder="PNS / Swasta / Wiraswasta / dll"
                value={orangTua.pekerjaanAyah || ""}
                onChange={(e) => setOrangTua({ ...orangTua, pekerjaanAyah: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Nama Ibu */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nama Ibu Kandung <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Ibu"
                value={orangTua.namaIbu}
                onChange={(e) => setOrangTua({ ...orangTua, namaIbu: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Pekerjaan Ibu */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Pekerjaan Ibu</label>
              <input
                type="text"
                placeholder="Ibu Rumah Tangga / PNS / dll"
                value={orangTua.pekerjaanIbu || ""}
                onChange={(e) => setOrangTua({ ...orangTua, pekerjaanIbu: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Nomor WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nomor WhatsApp Aktif <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={orangTua.nomorWhatsApp}
                onChange={(e) => setOrangTua({ ...orangTua, nomorWhatsApp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Orang Tua (Opsional)</label>
              <input
                type="email"
                placeholder="alamat.email@gmail.com"
                value={orangTua.email || ""}
                onChange={(e) => setOrangTua({ ...orangTua, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* 4. UNGGAH BERKAS PERSYARATAN */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-heading font-bold text-base md:text-lg">
              <Upload className="w-5 h-5" />
              <h3>C. Unggah Dokumen Berkas Persyaratan</h3>
            </div>
            <span className="text-xs text-muted-foreground">Maksimal 5MB per file (PDF/JPG/PNG)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fileSlots.map((slot) => {
              const uploadedItem = berkasMap[slot.key];
              const isUploading = uploadingState[slot.key];

              return (
                <div key={slot.key} className="p-4 rounded-2xl border border-border bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1">
                      <span>{slot.label}</span>
                      {slot.required && <span className="text-destructive">*</span>}
                    </label>
                    {uploadedItem && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        <FileCheck className="w-3 h-3" /> Terunggah
                      </span>
                    )}
                  </div>

                  {uploadedItem ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-emerald-500/30 text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Paperclip className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium text-foreground">{uploadedItem.nama}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(slot.key)}
                        className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                        title="Hapus / ganti berkas"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : isUploading ? (
                    <div className="p-3 rounded-xl bg-card border border-border space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-foreground">
                        <span className="truncate">{isUploading.file.name}</span>
                        <span className="text-emerald-700 font-bold">{isUploading.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 transition-all duration-200" style={{ width: `${isUploading.progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id={`file-${slot.key}`}
                        accept={slot.accept}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(slot.key, slot.label, f);
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor={`file-${slot.key}`}
                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-900/20 hover:border-emerald-600 rounded-xl bg-card cursor-pointer hover:bg-emerald-50/50 transition-colors text-center space-y-1"
                      >
                        <Upload className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-semibold text-foreground">Klik untuk Pilih File</span>
                        <span className="text-[10px] text-muted-foreground">PDF, JPG, PNG (Maks. 5MB)</span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. CATATAN TAMBAHAN & SUBMIT BUTTON */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              placeholder="Tuliskan catatan khusus atau informasi lain jika ada..."
              value={catatanPendaftar}
              onChange={(e) => setCatatanPendaftar(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              Dengan mengirimkan formulir ini, Anda menyatakan bahwa data dan berkas yang diisikan adalah benar.
            </p>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-8 py-3 rounded-xl shadow-md gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengirim Pendaftaran...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 text-gold-400" />
                  <span>Kirim Pendaftaran PPDB</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
