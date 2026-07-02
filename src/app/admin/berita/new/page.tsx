"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createBerita } from "@/lib/services/berita";
import { Timestamp } from "firebase/firestore";
import type { StatusKonten, JenjangId } from "@/types";

export default function AdminBeritaCreatePage() {
  const { profile, isYayasanAdmin } = useAuth();
  const router = useRouter();

  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [jenjangId, setJenjangId] = useState<string>(profile?.jenjangId || "");
  const [gambarUtamaUrl, setGambarUtamaUrl] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [isi, setIsi] = useState("");
  const [status, setStatus] = useState<StatusKonten>("published");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJudul(val);
    // Auto-generate slug
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!judul.trim() || !slug.trim() || !ringkasan.trim() || !isi.trim()) {
      setErrorMsg("Mohon lengkapi seluruh field yang wajib diisi.");
      setLoading(false);
      return;
    }

    try {
      await createBerita({
        judul,
        slug,
        jenjangId: (isYayasanAdmin ? (jenjangId as JenjangId || undefined) : profile?.jenjangId),
        tanggal: Timestamp.now(),
        gambarUtamaUrl,
        ringkasan,
        isi,
        status,
        createdBy: profile?.uid || "admin",
        updatedAt: Timestamp.now(),
      });

      router.push("/admin/berita");
    } catch (err) {
      console.error("Error creating berita:", err);
      setErrorMsg("Gagal menyimpan berita: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/berita"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Berita</span>
      </Link>

      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            Tulis Berita Baru
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Publikasikan pengumuman atau kabar berita sekolah
          </p>
        </div>
      </div>

      <Card className="border border-border/80 shadow-md bg-card">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Judul Berita <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={handleJudulChange}
                  placeholder="Misal: Seminar Parenting Santri"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  URL Slug (Auto-generated) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="seminar-parenting-santri"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Cakupan Jenjang</label>
                {isYayasanAdmin ? (
                  <select
                    value={jenjangId}
                    onChange={(e) => setJenjangId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Portal Utama (Yayasan)</option>
                    <option value="tkit">TKIT</option>
                    <option value="sdit">SDIT</option>
                    <option value="mts">MTs</option>
                    <option value="ma">MA</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={profile?.jenjangId?.toUpperCase() || ""}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-muted font-bold text-emerald-800"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Status Publikasi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusKonten)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="published">Published (Terbit Publik)</option>
                  <option value="draft">Draft (Simpan Sementara)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">URL Gambar Utama / Thumbnail</label>
              <input
                type="text"
                value={gambarUtamaUrl}
                onChange={(e) => setGambarUtamaUrl(e.target.value)}
                placeholder="/images/berita-1.jpg atau https://..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Ringkasan Berita <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={ringkasan}
                onChange={(e) => setRingkasan(e.target.value)}
                placeholder="Tuliskan 1-2 kalimat ringkasan berita..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Isi Berita (Mendukung Teks HTML) <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={8}
                required
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                placeholder="<p>Tulis paragraf berita lengkap di sini...</p>"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Berita</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
