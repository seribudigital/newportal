"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Users, Trash2, Edit, PlusCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGuruList, createGuru, deleteGuru } from "@/lib/services/guru";
import { updateDocument } from "@/lib/services/konten";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Guru, JenjangId } from "@/types";

export default function AdminGuruPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Guru | null>(null);

  // Form states
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangId>(profile?.jenjangId || "sdit");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const targetJenjang = isYayasanAdmin ? undefined : profile?.jenjangId;
      const list = await getGuruList(targetJenjang);
      setGuruList(list);
    } catch (err) {
      console.error("Error loading guru admin list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) loadData();
  }, [profile, isYayasanAdmin]);

  const resetForm = () => {
    setEditingItem(null);
    setNama("");
    setJabatan("");
    setMataPelajaran("");
    setFotoUrl("");
    setSelectedJenjang(profile?.jenjangId || "sdit");
  };

  const handleOpenForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item: Guru) => {
    setEditingItem(item);
    setNama(item.nama || "");
    setJabatan(item.jabatan || "");
    setMataPelajaran(item.mataPelajaran || "");
    setFotoUrl(item.fotoUrl || "");
    setSelectedJenjang(item.jenjangId || profile?.jenjangId || "sdit");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const jenjang = isYayasanAdmin ? selectedJenjang : profile!.jenjangId!;

      if (editingItem) {
        await updateDocument<Guru>("guru", editingItem.id, {
          nama,
          jabatan,
          mataPelajaran,
          fotoUrl,
          jenjangId: jenjang,
        });
      } else {
        await createGuru({
          nama,
          jabatan,
          mataPelajaran,
          fotoUrl,
          jenjangId: jenjang,
        });
      }

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err) {
      alert(`Gagal ${editingItem ? "memperbarui" : "menambahkan"} guru: ` + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data dewan guru ini?")) return;
    try {
      await deleteGuru(id);
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
            Kelola Dewan Guru
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Data tenaga pendidik per jenjang sekolah
          </p>
        </div>

        <Button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else {
              handleOpenForm();
            }
          }}
          className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          <span>{showForm ? "Tutup Form" : "Tambah Guru Baru"}</span>
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border border-border bg-card shadow-md space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            {editingItem ? "Form Edit Data Guru" : "Form Tambah Guru Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Ustadz Ahmad Fauzi, S.Pd.I"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Jabatan</label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Guru Wali Kelas / Waka Kurikulum"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  placeholder="Tahfizh Al-Qur'an & Bahasa Arab"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Jenjang Sekolah</label>
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
            </div>

            <ImageUploader
              value={fotoUrl}
              onChange={(url) => setFotoUrl(url)}
              jenjangId={isYayasanAdmin ? selectedJenjang : profile?.jenjangId}
              label="Foto Profil Guru"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="text-xs px-4 py-2 rounded-xl"
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-white text-xs px-6 py-2 rounded-xl">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : (editingItem ? "Perbarui Data Guru" : "Simpan Guru")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table Data */}
      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : guruList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed"><Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Belum ada data guru terdaftar.</p></Card>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-bold uppercase border-b">
              <tr>
                <th className="p-3">Nama Guru</th>
                <th className="p-3">Jabatan</th>
                <th className="p-3">Mapel</th>
                <th className="p-3">Jenjang</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guruList.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-semibold">{item.nama}</td>
                  <td className="p-3">{item.jabatan}</td>
                  <td className="p-3">{item.mataPelajaran}</td>
                  <td className="p-3 font-bold uppercase">{item.jenjangId}</td>
                  <td className="p-3 text-right space-x-2">
                    <Button variant="outline" size="xs" onClick={() => handleEdit(item)} className="text-primary hover:bg-primary/10 border-primary/20 cursor-pointer">
                      <Edit className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="xs" onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer">
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
