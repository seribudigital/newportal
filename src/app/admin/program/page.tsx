"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { BookOpen, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCollectionByJenjang, createDocument, deleteDocument } from "@/lib/services/konten";
import type { Program, JenjangId, KategoriProgram } from "@/types";

export default function AdminProgramPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [programList, setProgramList] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState<KategoriProgram>("kurikulum");
  const [deskripsi, setDeskripsi] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangId>(profile?.jenjangId || "sdit");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const targetJenjang = isYayasanAdmin ? undefined : profile?.jenjangId;
      const list = await getCollectionByJenjang<Program>("program", targetJenjang);
      setProgramList(list);
    } catch (err) {
      console.error("Error loading program admin list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) loadData();
  }, [profile, isYayasanAdmin]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createDocument<Program>("program", {
        nama,
        kategori,
        deskripsi,
        ikonUrl: "",
        jenjangId: isYayasanAdmin ? selectedJenjang : profile!.jenjangId!,
      });
      setShowForm(false);
      setNama(""); setDeskripsi("");
      await loadData();
    } catch (err) {
      alert("Gagal menambahkan program: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus program ini?")) return;
    try {
      await deleteDocument("program", id);
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
            Kelola Program & Kurikulum
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Program unggulan & kurikulum per jenjang sekolah
          </p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          <span>{showForm ? "Tutup Form" : "Tambah Program Baru"}</span>
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border border-border bg-card shadow-md space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">Form Tambah Program Baru</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Program / Kurikulum</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Program Tahfizh 5 Juz / Math Club"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Kategori</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as KategoriProgram)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                >
                  <option value="kurikulum">Kurikulum</option>
                  <option value="unggulan">Unggulan</option>
                  <option value="jurusan">Jurusan</option>
                  <option value="ekskul">Ekstrakurikuler</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Cakupan Jenjang</label>
              {isYayasanAdmin ? (
                <select
                  value={selectedJenjang}
                  onChange={(e) => setSelectedJenjang(e.target.value as JenjangId)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                >
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

            <div className="space-y-1">
              <label className="text-xs font-semibold">Deskripsi Ringkas</label>
              <textarea
                rows={3}
                required
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Penjelasan sasaran & metode pembelajaran..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submitting} className="bg-primary text-white text-xs px-6 py-2 rounded-xl">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : "Simpan Program"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table List */}
      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : programList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed"><BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Belum ada program terdaftar.</p></Card>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-bold uppercase border-b">
              <tr>
                <th className="p-3">Nama Program</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Jenjang</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {programList.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-semibold">{item.nama}</td>
                  <td className="p-3 uppercase font-bold text-emerald-800">{item.kategori}</td>
                  <td className="p-3 font-bold uppercase">{item.jenjangId}</td>
                  <td className="p-3 text-right">
                    <Button variant="outline" size="xs" onClick={() => handleDelete(item.id)} className="text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
