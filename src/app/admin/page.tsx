"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  Trophy, 
  Mail, 
  Users, 
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getBeritaList } from "@/lib/services/berita";
import { getAgendaList } from "@/lib/services/agenda";
import { getGaleriList } from "@/lib/services/galeri";
import { getPrestasiList } from "@/lib/services/publikExtra";

export default function AdminDashboardOverview() {
  const { profile, isYayasanAdmin } = useAuth();
  const [stats, setStats] = useState({
    beritaCount: 0,
    agendaCount: 0,
    galeriCount: 0,
    prestasiCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const jenjangId = isYayasanAdmin ? undefined : profile?.jenjangId;

        const [berita, agenda, galeri, prestasi] = await Promise.all([
          getBeritaList(jenjangId, false).catch(() => []),
          getAgendaList(jenjangId, false).catch(() => []),
          getGaleriList(jenjangId).catch(() => []),
          getPrestasiList(jenjangId).catch(() => []),
        ]);

        setStats({
          beritaCount: berita.length,
          agendaCount: agenda.length,
          galeriCount: galeri.length,
          prestasiCount: prestasi.length,
        });
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    if (profile) {
      loadStats();
    }
  }, [profile, isYayasanAdmin]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-lg border border-gold-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hak Akses: {profile?.role?.toUpperCase()}</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl">
            Selamat Datang, {profile?.nama}!
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl">
            {isYayasanAdmin 
              ? "Anda memiliki wewenang penuh mengelola konten seluruh jenjang (TKIT, SDIT, MTs, MA) dan pengaturan yayasan." 
              : `Anda berada dalam ruang kelola konten khusus jenjang ${profile?.jenjangId?.toUpperCase()}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/berita/new"
            className={buttonVariants({ variant: "default" }) + " bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Berita Baru</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="border border-border/80 shadow-xs bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Berita
            </CardTitle>
            <Newspaper className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-foreground">
              {loading ? "..." : stats.beritaCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Artikel dipublikasi & draft</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Agenda
            </CardTitle>
            <Calendar className="w-5 h-5 text-gold-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-foreground">
              {loading ? "..." : stats.agendaCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Jadwal kegiatan sekolah</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Foto Galeri
            </CardTitle>
            <ImageIcon className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-foreground">
              {loading ? "..." : stats.galeriCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Dokumentasi terpajang</p>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-xs bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Prestasi Santri
            </CardTitle>
            <Trophy className="w-5 h-5 text-gold-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-foreground">
              {loading ? "..." : stats.prestasiCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Penghargaan kejuaraan</p>
          </CardContent>
        </Card>

      </div>

      {/* Quick Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gold-500/30 p-6 space-y-4 bg-emerald-950/5 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-gold-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg">Modul PPDB Online</h3>
              <p className="text-xs text-muted-foreground">Verifikasi & proses status pendaftaran siswa</p>
            </div>
          </div>
          <Link
            href="/admin/ppdb"
            className={buttonVariants({ variant: "default", size: "sm" }) + " w-full justify-between text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white"}
          >
            <span>Buka Verifikasi PPDB</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg">Modul Berita & Pengumuman</h3>
              <p className="text-xs text-muted-foreground">Kelola penerbitan berita portal & jenjang</p>
            </div>
          </div>
          <Link
            href="/admin/berita"
            className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full justify-between text-xs font-semibold"}
          >
            <span>Buka Daftar Berita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg">Kotak Pesan Publik</h3>
              <p className="text-xs text-muted-foreground">Lihat pesan & masukan dari formulir kontak</p>
            </div>
          </div>
          <Link
            href="/admin/pesan-kontak"
            className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full justify-between text-xs font-semibold"}
          >
            <span>Lihat Pesan Masuk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
