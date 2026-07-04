"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { getBeritaById, updateBerita } from "@/lib/services/berita";
import { Timestamp } from "firebase/firestore";
import type { StatusKonten, JenjangId, Berita } from "@/types";

interface AdminBeritaEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminBeritaEditPage({ params }: AdminBeritaEditPageProps) {
  const resolvedParams = use(params);
  const beritaId = resolvedParams.id;

  const { profile, isYayasanAdmin } = useAuth();
  const router = useRouter();

  const [fetching, setFetching] = useState(true);
  const [judul, setJudul] = useState("");
  const [slug, setSlug] = useState("");
  const [jenjangId, setJenjangId] = useState<string>("");
  const [gambarUtamaUrl, setGambarUtamaUrl] = useState("");
  const [ringkasan, setRingkasan] = useState("");
  const [isi, setIsi] = useState("");
  const [status, setStatus] = useState<StatusKonten>("published");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadBerita() {
      try {
        const data = await getBeritaById(beritaId);
        if (data) {
          setJudul(data.judul || "");
          setSlug(data.slug || "");
          setJenjangId(data.jenjangId || "");
          setGambarUtamaUrl(data.gambarUtamaUrl || "");
          setRingkasan(data.ringkasan || "");
          setIsi(data.isi || "");
          setStatus(data.status || "published");
        } else {
          setErrorMsg("Berita tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error loading berita edit data:", err);
        setErrorMsg("Gagal memuat data berita.");
      } finally {
        setFetching(false);
      }
    }
    if (beritaId) {
      loadBerita();
    }
  }, [beritaId]);

  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJudul(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      );
    }
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
      const targetJenjang = isYayasanAdmin 
        ? (jenjangId ? (jenjangId as JenjangId) : undefined)
        : profile?.jenjangId;

      const updatePayload: Partial<Berita> = {
        judul,
        slug,
        gambarUtamaUrl,
        ringkasan,
        isi,
        status,
        updatedAt: Timestamp.now(),
      };

      if (targetJenjang) {
        updatePayload.jenjangId = targetJenjang;
      }

      await updateBerita(beritaId, updatePayload);
      router.push("/admin/berita");
    } catch (err) {
      console.error("Error updating berita:", err);
      setErrorMsg("Gagal memperbarui berita: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Memuat Data Berita...</p>
      </div>
    );
  }

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
            Edit Berita
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Perbarui informasi atau konten berita sekolah
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

            {/* Image Uploader Component */}
            <ImageUploader
              value={gambarUtamaUrl}
              onChange={setGambarUtamaUrl}
              jenjangId={jenjangId as JenjangId}
              label="Gambar Utama / Thumbnail Berita"
            />

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

            <RichTextEditor
              value={isi}
              onChange={setIsi}
              label="Isi Berita Lengkap"
              placeholder="Tuliskan isi berita lengkap di sini..."
              required
            />

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Perbarui...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
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
