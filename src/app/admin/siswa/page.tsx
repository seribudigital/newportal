"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Users, PlusCircle, Trash2, Loader2, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCollectionByJenjang, createDocument, deleteDocument } from "@/lib/services/konten";
import type { Siswa, JenjangId } from "@/types";

export default function AdminSiswaPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("2025/2026");
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangId>(profile?.jenjangId || "sdit");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const targetJenjang = isYayasanAdmin ? undefined : profile?.jenjangId;
      const list = await getCollectionByJenjang<Siswa>("siswa", targetJenjang);
      setSiswaList(list);
    } catch (err) {
      console.error("Error loading siswa admin list:", err);
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
      await createDocument<Siswa>("siswa", {
        nama,
        kelas,
        tahunAjaran,
        fotoUrl: "",
        jenjangId: isYayasanAdmin ? selectedJenjang : profile!.jenjangId!,
      });
      setShowForm(false);
      setNama(""); setKelas("");
      await loadData();
    } catch (err) {
      alert("Gagal menambahkan data siswa: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data siswa ini?")) return;
    try {
      await deleteDocument("siswa", id);
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
            Kelola Data Santri / Siswa
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Direktori siswa aktif per jenjang sekolah
          </p>
        </div>

        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          <span>{showForm ? "Tutup Form" : "Tambah Siswa Baru"}</span>
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border border-border bg-card shadow-md space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">Form Tambah Siswa Baru</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Muhammad Raihan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Kelas / Rombel</label>
                <input
                  type="text"
                  required
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Kelas 5-A / Tahfizh"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Tahun Ajaran</label>
                <input
                  type="text"
                  required
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                  placeholder="2025/2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
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
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submitting} className="bg-primary text-white text-xs px-6 py-2 rounded-xl">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : "Simpan Siswa"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table Data */}
      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : siswaList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed"><Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Belum ada data siswa terdaftar.</p></Card>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-bold uppercase border-b">
              <tr>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Tahun Ajaran</th>
                <th className="p-3">Jenjang</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {siswaList.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-semibold">{item.nama}</td>
                  <td className="p-3">{item.kelas}</td>
                  <td className="p-3">{item.tahunAjaran}</td>
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
