"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { UserCheck, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { getPengurusYayasan } from "@/lib/services/publikExtra";
import { createDocument, deleteDocument } from "@/lib/services/konten";
import type { Pengurus, JenjangId } from "@/types";

export default function AdminPengurusPage() {
  const { profile } = useAuth();
  const [pengurusList, setPengurusList] = useState<Pengurus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [nama, setNama] = useState("");
  const [organisasi, setOrganisasi] = useState("Yayasan");
  const [jabatan, setJabatan] = useState("");
  const [periode, setPeriode] = useState("2024 - 2029");
  const [fotoUrl, setFotoUrl] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getPengurusYayasan();
      setPengurusList(list);
    } catch (err) {
      console.error("Error loading pengurus admin list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) loadData();
  }, [profile]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createDocument<Pengurus>("pengurus", {
        nama,
        organisasi,
        jabatan,
        periode,
        fotoUrl,
        jenjangId: selectedJenjang ? (selectedJenjang as JenjangId) : undefined,
      });
      setShowForm(false);
      setNama(""); setJabatan(""); setFotoUrl("");
      await loadData();
    } catch (err) {
      alert("Gagal menambahkan pengurus: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengurus ini?")) return;
    try {
      await deleteDocument("pengurus", id);
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
            Kelola Pengurus Organisasi & Yayasan
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Struktur pimpinan yayasan & organisasi kesiswaan
          </p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          <span>{showForm ? "Tutup Form" : "Tambah Pengurus"}</span>
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border border-border bg-card shadow-md space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">Form Tambah Pengurus</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Pengurus</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="KH. Abdullah Gymnastiar"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Organisasi / Lembaga</label>
                <input
                  type="text"
                  required
                  value={organisasi}
                  onChange={(e) => setOrganisasi(e.target.value)}
                  placeholder="Yayasan / OSIS SDIT / Komite"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Jabatan</label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="Ketua Pembina / Ketua Komite"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Periode Jabatan</label>
                <input
                  type="text"
                  required
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                  placeholder="2024 - 2029"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
            </div>

            <ImageUploader
              value={fotoUrl}
              onChange={setFotoUrl}
              label="Foto Pengurus (Opsional)"
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold">Cakupan (Opsional)</label>
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
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submitting} className="bg-primary text-white text-xs px-6 py-2 rounded-xl">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : "Simpan Pengurus"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table Data */}
      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : pengurusList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed"><UserCheck className="w-8 h-8 mx-auto text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Belum ada pengurus terdaftar.</p></Card>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-bold uppercase border-b">
              <tr>
                <th className="p-3">Nama Pengurus</th>
                <th className="p-3">Organisasi</th>
                <th className="p-3">Jabatan</th>
                <th className="p-3">Periode</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pengurusList.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-semibold">{item.nama}</td>
                  <td className="p-3">{item.organisasi}</td>
                  <td className="p-3 font-semibold text-emerald-800">{item.jabatan}</td>
                  <td className="p-3">{item.periode}</td>
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
