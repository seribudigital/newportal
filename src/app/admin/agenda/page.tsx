"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Calendar, PlusCircle, Trash2, Edit, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAgendaList } from "@/lib/services/agenda";
import { createDocument, updateDocument, deleteDocument } from "@/lib/services/konten";
import { Timestamp } from "firebase/firestore";
import type { Agenda, JenjangId } from "@/types";
import { formatDate, toDatetimeLocalString } from "@/lib/utils";

export default function AdminAgendaPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [agendaList, setAgendaList] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Agenda | null>(null);

  const [judul, setJudul] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalMulaiStr, setTanggalMulaiStr] = useState("");
  const [tanggalSelesaiStr, setTanggalSelesaiStr] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const targetJenjang = isYayasanAdmin ? undefined : profile?.jenjangId;
      const list = await getAgendaList(targetJenjang, false);
      setAgendaList(list);
    } catch (err) {
      console.error("Error loading agenda admin list:", err);
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
    setLokasi("");
    setDeskripsi("");
    setTanggalMulaiStr("");
    setTanggalSelesaiStr("");
    setSelectedJenjang("");
  };

  const handleOpenForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (item: Agenda) => {
    setEditingItem(item);
    setJudul(item.judul || "");
    setLokasi(item.lokasi || "");
    setDeskripsi(item.deskripsi || "");
    setTanggalMulaiStr(toDatetimeLocalString(item.tanggalMulai));
    setTanggalSelesaiStr(toDatetimeLocalString(item.tanggalSelesai));
    setSelectedJenjang(item.jenjangId || "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggalMulaiStr) {
      alert("Harap pilih tanggal dan waktu mulai kegiatan.");
      return;
    }

    setSubmitting(true);
    try {
      const startTimestamp = Timestamp.fromDate(new Date(tanggalMulaiStr));
      const endTimestamp = tanggalSelesaiStr ? Timestamp.fromDate(new Date(tanggalSelesaiStr)) : undefined;
      const jenjang = selectedJenjang ? (selectedJenjang as JenjangId) : (isYayasanAdmin ? undefined : profile!.jenjangId);

      if (editingItem) {
        await updateDocument<Agenda>("agenda", editingItem.id, {
          judul,
          lokasi,
          deskripsi,
          tanggalMulai: startTimestamp,
          ...(endTimestamp ? { tanggalSelesai: endTimestamp } : {}),
          jenjangId: jenjang,
        });
      } else {
        await createDocument<Agenda>("agenda", {
          judul,
          lokasi,
          deskripsi,
          tanggalMulai: startTimestamp,
          ...(endTimestamp ? { tanggalSelesai: endTimestamp } : {}),
          status: "published",
          jenjangId: jenjang,
        });
      }

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err) {
      alert(`Gagal ${editingItem ? "memperbarui" : "menambahkan"} agenda: ` + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus agenda ini?")) return;
    try {
      await deleteDocument("agenda", id);
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
            Kelola Agenda Kegiatan
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Jadwal kegiatan yayasan & sekolah
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
          <span>{showForm ? "Tutup Form" : "Tambah Agenda Baru"}</span>
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border border-border bg-card shadow-md space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            {editingItem ? "Form Edit Agenda" : "Form Tambah Agenda Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Ujian Akhir Semester / Manasik Haji"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Lokasi Pelaksanaan</label>
                <input
                  type="text"
                  required
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Aula Utama Yayasan / Lab TIK"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Tanggal & Waktu Mulai</label>
                <input
                  type="datetime-local"
                  required
                  value={tanggalMulaiStr}
                  onChange={(e) => setTanggalMulaiStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Tanggal & Waktu Selesai (Opsional)</label>
                <input
                  type="datetime-local"
                  value={tanggalSelesaiStr}
                  onChange={(e) => setTanggalSelesaiStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
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

            <div className="space-y-1">
              <label className="text-xs font-semibold">Deskripsi Ringkas</label>
              <textarea
                rows={3}
                required
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Rincian agenda kegiatan..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
              />
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
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : (editingItem ? "Perbarui Agenda" : "Simpan Agenda")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table Data */}
      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : agendaList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed"><Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-2" /><p className="text-xs text-muted-foreground">Belum ada agenda terdaftar.</p></Card>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 font-bold uppercase border-b">
              <tr>
                <th className="p-3">Judul Agenda</th>
                <th className="p-3">Tanggal & Waktu</th>
                <th className="p-3">Lokasi</th>
                <th className="p-3">Jenjang</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {agendaList.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-semibold">{item.judul}</td>
                  <td className="p-3 font-medium text-emerald-800 dark:text-emerald-400">
                    {formatDate(item.tanggalMulai, true)}
                  </td>
                  <td className="p-3">{item.lokasi}</td>
                  <td className="p-3 font-bold uppercase">{item.jenjangId || "YAYASAN"}</td>
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
