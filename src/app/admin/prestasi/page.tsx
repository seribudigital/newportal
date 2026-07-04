"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Trophy, PlusCircle, Trash2, Edit, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPrestasiList } from "@/lib/services/publikExtra";
import { createDocument, updateDocument, deleteDocument } from "@/lib/services/konten";
import type { Prestasi, JenjangId } from "@/types";

export default function AdminPrestasiPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [prestasiList, setPrestasiList] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Prestasi | null>(null);

  const [judul, setJudul] = useState("");
  const [pemenang, setPemenang] = useState("");
  const [tingkat, setTingkat] = useState<'Kecamatan' | 'Kota/Kab' | 'Provinsi' | 'Nasional' | 'Internasional'>("Nasional");
  const [tahun, setTahun] = useState("2025");
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangId>(profile?.jenjangId || "sdit");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const targetJenjang = isYayasanAdmin ? undefined : profile?.jenjangId;
      const list = await getPrestasiList(targetJenjang);
      setPrestasiList(list);
    } catch (err) {
      console.error("Error loading prestasi admin list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) loadData();
  }, [profile, isYayasanAdmin]);

  const resetForm = () => {
    setEditingItem(null);
    setJudul("");
    setPemenang("");
    setTingkat("Nasional");
    setTahun("2025");
    setSelectedJenjang(profile?.jenjangId || "sdit");
  };

  const handleOpenForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item: Prestasi) => {
    setEditingItem(item);
    setJudul(item.judul || "");
    setPemenang(item.pemenang || "");
    setTingkat(item.tingkat || "Nasional");
    setTahun(item.tahun || "2025");
    setSelectedJenjang(item.jenjangId || profile?.jenjangId || "sdit");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const jenjang = isYayasanAdmin ? selectedJenjang : profile!.jenjangId!;

      if (editingItem) {
        await updateDocument<Prestasi>("prestasi", editingItem.id, {
          judul,
          pemenang,
          tingkat,
          tahun,
          jenjangId: jenjang,
        });
      } else {
        await createDocument<Prestasi>("prestasi", {
          judul,
          pemenang,
          tingkat,
          tahun,
          jenjangId: jenjang,
        });
      }

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err) {
      alert(`Gagal ${editingItem ? "memperbarui" : "menambahkan"} prestasi: ` + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data prestasi ini?")) return;
    try {
      await deleteDocument("prestasi", id);
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
            Kelola Prestasi Santri
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Penghargaan kejuaraan & lomba per jenjang
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
          <span>{showForm ? "Tutup Form" : "Tambah Prestasi"}</span>
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border border-border bg-card shadow-md space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            {editingItem ? "Form Edit Data Prestasi" : "Form Tambah Prestasi Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Judul Kejuaraan</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Juara 1 MTQ Nasional"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Pemenang / Tim</label>
                <input
                  type="text"
                  required
                  value={pemenang}
                  onChange={(e) => setPemenang(e.target.value)}
                  placeholder="Ahmad Raihan (Kelas 9)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Tingkat Kejuaraan</label>
                <select
                  value={tingkat}
                  onChange={(e) => setTingkat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                >
                  <option value="Kecamatan">Kecamatan</option>
                  <option value="Kota/Kab">Kota/Kab</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Internasional">Internasional</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Tahun</label>
                <input
                  type="text"
                  required
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
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
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : (editingItem ? "Perbarui Prestasi" : "Simpan Prestasi")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table Data */}
      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : prestasiList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed"><Trophy className="w-8 h-8 mx-auto text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Belum ada prestasi terdaftar.</p></Card>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-bold uppercase border-b">
              <tr>
                <th className="p-3">Judul Kejuaraan</th>
                <th className="p-3">Pemenang</th>
                <th className="p-3">Tingkat</th>
                <th className="p-3">Tahun</th>
                <th className="p-3">Jenjang</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {prestasiList.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-semibold">{item.judul}</td>
                  <td className="p-3">{item.pemenang}</td>
                  <td className="p-3 font-bold text-gold-600">{item.tingkat}</td>
                  <td className="p-3">{item.tahun}</td>
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
