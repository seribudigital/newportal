"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Image as ImageIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGaleriList } from "@/lib/services/galeri";
import { createDocument, deleteDocument } from "@/lib/services/konten";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { Timestamp } from "firebase/firestore";
import type { Galeri, JenjangId } from "@/types";

export default function AdminGaleriPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [judul, setJudul] = useState("");
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [keterangan, setKeterangan] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const targetJenjang = isYayasanAdmin ? undefined : profile?.jenjangId;
      const list = await getGaleriList(targetJenjang);
      setGaleriList(list);
    } catch (err) {
      console.error("Error loading galeri admin list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) loadData();
  }, [profile, isYayasanAdmin]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imagesUrl.length === 0) {
      alert("Harap unggah minimal 1 foto kegiatan.");
      return;
    }
    setSubmitting(true);
    try {
      const mainCoverUrl = imagesUrl[0];
      await createDocument<Galeri>("galeri", {
        judul,
        imageUrl: mainCoverUrl,
        imagesUrl: imagesUrl,
        keterangan,
        tanggal: Timestamp.now(),
        jenjangId: selectedJenjang ? (selectedJenjang as JenjangId) : (isYayasanAdmin ? undefined : profile!.jenjangId),
      });
      setShowForm(false);
      setJudul(""); setImagesUrl([]); setKeterangan("");
      await loadData();
    } catch (err) {
      alert("Gagal menambahkan galeri: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus album foto galeri ini?")) return;
    try {
      await deleteDocument("galeri", id);
      await loadData();
    } catch (err) {
      alert("Gagal menghapus: " + (err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            Kelola Galeri Dokumentasi
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Foto & album kegiatan yayasan & sekolah
          </p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          <span>{showForm ? "Tutup Form" : "Tambah Album Galeri"}</span>
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border border-border bg-card shadow-md space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">Form Tambah Album Galeri</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Judul Kegiatan / Album Dokumentasi</label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Kegiatan Manasik Haji Cilik Santri"
                className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Cakupan Jenjang</label>
              {isYayasanAdmin ? (
                <select
                  value={selectedJenjang}
                  onChange={(e) => setSelectedJenjang(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                >
                  <option value="">Yayasan (Global)</option>
                  <option value="tkit">TKIT</option>
                  <option value="sdit">SDIT</option>
                  <option value="mts">MTs</option>
                  <option value="ma">MA</option>
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value={profile?.jenjangId?.toUpperCase()}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-muted font-bold"
                />
              )}
            </div>

            <MultiImageUploader
              values={imagesUrl}
              onChange={setImagesUrl}
              jenjangId={selectedJenjang ? (selectedJenjang as JenjangId) : profile?.jenjangId}
              label="Unggah Berkas Foto Album"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold">Keterangan / Deskripsi Kegiatan</label>
              <textarea
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Dokumentasi suasana kegiatan pembelajaran & praktik di..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submitting} className="bg-primary text-white text-xs px-6 py-2 rounded-xl">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : "Simpan Album Galeri"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table Data */}
      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : galeriList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed"><ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Belum ada foto galeri terdaftar.</p></Card>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-bold uppercase border-b">
              <tr>
                <th className="p-3">Judul Dokumentasi</th>
                <th className="p-3">Jenjang</th>
                <th className="p-3">Jumlah Foto</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {galeriList.map((item) => {
                const totalPhotos = item.imagesUrl && item.imagesUrl.length > 0 ? item.imagesUrl.length : 1;
                return (
                  <tr key={item.id}>
                    <td className="p-3 font-semibold">{item.judul}</td>
                    <td className="p-3 font-bold uppercase">{item.jenjangId || "YAYASAN"}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      📷 {totalPhotos} Foto
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="outline" size="xs" onClick={() => handleDelete(item.id)} className="text-destructive">
                        <Trash2 className="w-3 h-3" />
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
  );
}
