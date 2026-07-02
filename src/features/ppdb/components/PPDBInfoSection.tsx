"use client";

import React from "react";
import { 
  FileText, 
  UploadCloud, 
  UserCheck, 
  Award, 
  CheckCircle2, 
  GraduationCap,
  ArrowRight,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JenjangId } from "@/types";

interface PPDBInfoSectionProps {
  onSelectJenjang: (jenjangId: JenjangId) => void;
}

export function PPDBInfoSection({ onSelectJenjang }: PPDBInfoSectionProps) {
  const jenjangOptions: { id: JenjangId; nama: string; badge: string; deskripsi: string; minUsia: string; bgClass: string; borderClass: string; textClass: string }[] = [
    {
      id: "tkit",
      nama: "TKIT (Taman Kanak-Kanak Islam Terpadu)",
      badge: "Usia 4 - 6 Tahun",
      deskripsi: "Pendidikan anak usia dini berbasis adab, pembentukan karakter Islami, hafalan juz 30, dan motorik.",
      minUsia: "Minimal 4 Tahun per Juli",
      bgClass: "bg-amber-500/10",
      borderClass: "border-amber-500/30",
      textClass: "text-amber-700",
    },
    {
      id: "sdit",
      nama: "SDIT (Sekolah Dasar Islam Terpadu)",
      badge: "Akreditasi A",
      deskripsi: "Pendidikan dasar terpadu sains & Al-Qur'an, tahfidz minimal 3 juz, dan pembiasaan ibadah harian.",
      minUsia: "Minimal 6 Tahun per Juli",
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500/30",
      textClass: "text-emerald-700",
    },
    {
      id: "mts",
      nama: "MTs (Madrasah Tsanawiyah)",
      badge: "Full Day / Boarding",
      deskripsi: "Pendidikan menengah pertama dengan penguatan bahasa Arab, Inggris, sains unggulan, dan tahfidz.",
      minUsia: "Lulusan SD/MI Sederajat",
      bgClass: "bg-sky-500/10",
      borderClass: "border-sky-500/30",
      textClass: "text-sky-700",
    },
    {
      id: "ma",
      nama: "MA (Madrasah Aliyah)",
      badge: "Saintek & Soshum",
      deskripsi: "Persiapan akademik perguruan tinggi favorit dalam & luar negeri serta penguatan kepemimpinan Islam.",
      minUsia: "Lulusan SMP/MTs Sederajat",
      bgClass: "bg-indigo-500/10",
      borderClass: "border-indigo-500/30",
      textClass: "text-indigo-700",
    },
  ];

  const alurLangkah = [
    {
      step: "01",
      title: "Isi Form Online",
      desc: "Lengkapi data calon siswa dan data orang tua/wali secara akurat.",
      icon: FileText,
    },
    {
      step: "02",
      title: "Unggah Berkas",
      desc: "Upload Kartu Keluarga, Akta Kelahiran, Pas Foto, dan Rapor/Ijazah.",
      icon: UploadCloud,
    },
    {
      step: "03",
      title: "Verifikasi Admin",
      desc: "Tim PPDB memeriksa kelengkapan dokumen dan menjadwalkan pemetaan/tes.",
      icon: UserCheck,
    },
    {
      step: "04",
      title: "Pengumuman",
      desc: "Dapatkan status pendaftaran (Diterima / Diverifikasi) dan nomor pendaftaran.",
      icon: Award,
    },
  ];

  return (
    <section className="space-y-12">
      {/* Hero Banner PPDB */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-8 md:p-12 border border-gold-500/30 shadow-2xl">
        {/* Background Islamic Pattern Decor */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/30 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran Baru</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
            Membangun Generasi Rabbani, Berakhlaq Mulia & Berprestasi
          </h1>

          <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
            Selamat datang di Portal PPDB Online Yayasan Islam Terpadu. Silakan pilih jenjang pendidikan putra/putri Anda dan lengkapi formulir pendaftaran secara online dengan mudah, cepat, dan aman.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <a href="#form-pendaftaran">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-400 text-emerald-950 font-bold shadow-lg gap-2 cursor-pointer">
                <span>Mulai Pendaftaran Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="#syarat-ppdb" className="text-xs text-emerald-200 hover:text-white underline font-medium flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Lihat Persyaratan & Panduan</span>
            </a>
          </div>
        </div>
      </div>

      {/* Choice of Education Level Cards */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Pilihan Jenjang Pendidikan
          </h2>
          <p className="text-muted-foreground text-sm">
            Klik pada jenjang pendidikan yang ingin Anda daftarkan untuk langsung memuat formulir pendaftaran.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jenjangOptions.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectJenjang(item.id);
                const el = document.getElementById("form-pendaftaran");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`group relative p-6 rounded-2xl border ${item.borderClass} ${item.bgClass} bg-card/80 backdrop-blur-xs shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:-translate-y-1`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center ${item.textClass}`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${item.borderClass} ${item.textClass} bg-white/80`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-emerald-800 transition-colors">
                  {item.nama}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>{item.minUsia}</span>
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Pilih <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Steps (Alur Pendaftaran) */}
      <div className="space-y-6 bg-card rounded-2xl p-6 md:p-8 border border-border shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Alur Pendaftaran PPDB
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm">
            4 Langkah praktis untuk menyelesaikan proses pendaftaran calon peserta didik baru.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {alurLangkah.map((stepItem) => {
            const Icon = stepItem.icon;
            return (
              <div key={stepItem.step} className="relative p-5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-900/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xl font-extrabold text-gold-500/60">
                    {stepItem.step}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stepItem.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persyaratan Umum Section */}
      <div id="syarat-ppdb" className="bg-emerald-950/5 dark:bg-emerald-950/30 rounded-2xl p-6 md:p-8 border border-emerald-900/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Persyaratan Umum & Berkas Administrasi
          </h3>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-foreground/90">
          <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card border border-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Scan / Foto Asli <strong>Kartu Keluarga (KK)</strong> (Format PDF/JPG, maks. 5MB)</span>
          </li>
          <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card border border-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Scan / Foto Asli <strong>Akta Kelahiran Calon Siswa</strong> (Format PDF/JPG, maks. 5MB)</span>
          </li>
          <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card border border-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Pas Foto Terbaru Calon Siswa</strong> latar belakang merah/biru (Format JPG/PNG)</span>
          </li>
          <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card border border-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Ijazah / Surat Keterangan Lulus / Rapor Terakhir</strong> (khusus pendaftar MTs & MA)</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
