"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { 
  Users, 
  PlusCircle, 
  Trash2, 
  Edit, 
  Loader2, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCollectionByJenjang, createDocument, updateDocument, deleteDocument } from "@/lib/services/konten";
import type { Siswa, JenjangId } from "@/types";
import * as XLSX from "xlsx";

export default function AdminSiswaPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulkCard, setShowBulkCard] = useState(false);
  const [editingItem, setEditingItem] = useState<Siswa | null>(null);

  // Single form states
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("2025/2026");
  const [selectedJenjang, setSelectedJenjang] = useState<JenjangId>(profile?.jenjangId || "sdit");
  const [submitting, setSubmitting] = useState(false);

  // Bulk Upload states
  const [previewData, setPreviewData] = useState<Array<Omit<Siswa, "id">>>([]);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const resetForm = () => {
    setEditingItem(null);
    setNama("");
    setKelas("");
    setTahunAjaran("2025/2026");
    setSelectedJenjang(profile?.jenjangId || "sdit");
  };

  const handleOpenForm = () => {
    resetForm();
    setShowBulkCard(false);
    setShowForm(true);
  };

  const handleEdit = (item: Siswa) => {
    setEditingItem(item);
    setNama(item.nama || "");
    setKelas(item.kelas || "");
    setTahunAjaran(item.tahunAjaran || "2025/2026");
    setSelectedJenjang(item.jenjangId || profile?.jenjangId || "sdit");
    setShowBulkCard(false);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const jenjang = isYayasanAdmin ? selectedJenjang : profile!.jenjangId!;

      if (editingItem) {
        await updateDocument<Siswa>("siswa", editingItem.id, {
          nama,
          kelas,
          tahunAjaran,
          jenjangId: jenjang,
        });
      } else {
        await createDocument<Siswa>("siswa", {
          nama,
          kelas,
          tahunAjaran,
          fotoUrl: "",
          jenjangId: jenjang,
        });
      }

      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err) {
      alert(`Gagal ${editingItem ? "memperbarui" : "menambahkan"} data siswa: ` + (err as Error).message);
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

  // Generate & Download Excel Template
  const handleDownloadTemplate = () => {
    const defaultJenjang = isYayasanAdmin ? "SDIT" : (profile?.jenjangId?.toUpperCase() || "SDIT");
    const sampleData = [
      {
        "Nama Lengkap": "Muhammad Raihan",
        "Kelas": "Kelas 5-A / Tahfizh",
        "Tahun Ajaran": "2025/2026",
        "Jenjang": defaultJenjang,
      },
      {
        "Nama Lengkap": "Aisyah Azzahra",
        "Kelas": "Kelas 1-B",
        "Tahun Ajaran": "2025/2026",
        "Jenjang": defaultJenjang,
      },
      {
        "Nama Lengkap": "Ahmad Fauzi",
        "Kelas": "Kelas 3-C",
        "Tahun Ajaran": "2025/2026",
        "Jenjang": defaultJenjang,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Data Siswa");
    XLSX.writeFile(workbook, "Template_Import_Data_Siswa.xlsx");
  };

  // Parse Uploaded Excel File
  const handleExcelFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          alert("File Excel kosong atau format tabel tidak valid.");
          return;
        }

        const parsedSiswa: Array<Omit<Siswa, "id">> = data.map((row) => {
          const namaVal = row["Nama Lengkap"] || row["Nama"] || row["Nama Siswa"] || row["nama"] || "";
          const kelasVal = row["Kelas"] || row["Kelas / Rombel"] || row["Rombel"] || row["kelas"] || "";
          const tahunVal = row["Tahun Ajaran"] || row["Tahun"] || row["tahunAjaran"] || "2025/2026";
          const jenjangRaw = (row["Jenjang"] || row["Cakupan Jenjang"] || row["jenjangId"] || "").toString().toLowerCase().trim();

          let jenjangIdVal: JenjangId = (isYayasanAdmin ? (jenjangRaw as JenjangId) : profile?.jenjangId) || "sdit";
          if (!["tkit", "sdit", "mts", "ma"].includes(jenjangIdVal)) {
            jenjangIdVal = profile?.jenjangId || "sdit";
          }

          return {
            nama: String(namaVal).trim(),
            kelas: String(kelasVal).trim(),
            tahunAjaran: String(tahunVal).trim(),
            fotoUrl: "",
            jenjangId: jenjangIdVal,
          };
        }).filter((item) => item.nama.length > 0);

        if (parsedSiswa.length === 0) {
          alert("Tidak ada kolom 'Nama Lengkap' atau 'Nama' yang valid ditemukan.");
          return;
        }

        setPreviewData(parsedSiswa);
      } catch (err) {
        alert("Gagal membaca file Excel/CSV: " + (err as Error).message);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Execute Bulk Upload to Firestore
  const handleExecuteBulkUpload = async () => {
    if (previewData.length === 0) return;
    setUploadingBulk(true);
    setBulkProgress(0);

    try {
      for (let i = 0; i < previewData.length; i++) {
        await createDocument<Siswa>("siswa", previewData[i]);
        setBulkProgress(i + 1);
      }

      alert(`Berhasil mengimpor ${previewData.length} data siswa!`);
      setPreviewData([]);
      setShowBulkCard(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadData();
    } catch (err) {
      alert("Terjadi kesalahan saat mengimpor data: " + (err as Error).message);
    } finally {
      setUploadingBulk(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            Kelola Data Santri / Siswa
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Direktori siswa aktif per jenjang sekolah
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="text-xs font-semibold px-3 py-2 rounded-xl gap-1.5 border-emerald-600/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 cursor-pointer"
            title="Unduh format template Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download Template Excel</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setShowBulkCard(!showBulkCard);
            }}
            className="text-xs font-semibold px-3 py-2 rounded-xl gap-1.5 border-gold-500/40 text-gold-700 dark:text-gold-400 hover:bg-gold-50 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-gold-600" />
            <span>{showBulkCard ? "Tutup Import" : "Upload Massal Excel"}</span>
          </Button>

          <Button
            onClick={() => {
              setShowBulkCard(false);
              if (showForm) {
                setShowForm(false);
                resetForm();
              } else {
                handleOpenForm();
              }
            }}
            className="bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            <span>{showForm ? "Tutup Form" : "Tambah Siswa Baru"}</span>
          </Button>
        </div>
      </div>

      {/* BULK UPLOAD EXCEL CARD */}
      {showBulkCard && (
        <Card className="p-6 border border-gold-500/30 bg-card shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                <span>Upload Massal Data Siswa (Excel / CSV)</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Impor banyak data siswa sekaligus dari file spreadsheet Excel (.xlsx, .xls, .csv).
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="text-xs font-semibold rounded-xl gap-1.5 self-start sm:self-auto border-primary/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template Excel</span>
            </Button>
          </div>

          {/* Upload Drop Area */}
          <div className="space-y-4">
            <div className="p-6 border-2 border-dashed border-emerald-900/30 rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/10 text-center space-y-3">
              <Upload className="w-8 h-8 text-primary mx-auto opacity-80" />
              <div>
                <p className="text-xs font-bold text-foreground">Pilih atau Seret Berkas Excel (.xlsx / .csv)</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pastikan header kolom berisi: <strong>Nama Lengkap</strong>, <strong>Kelas</strong>, <strong>Tahun Ajaran</strong>, dan <strong>Jenjang</strong>.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleExcelFileSelect}
                className="hidden"
                id="excel-file-input"
              />

              <label
                htmlFor="excel-file-input"
                className="inline-flex items-center gap-2 bg-primary hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Pilih Berkas Excel</span>
              </label>
            </div>

            {/* Preview Parsed Data */}
            {previewData.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ditemukan {previewData.length} data siswa siap diimpor</span>
                  </div>

                  <Button
                    onClick={handleExecuteBulkUpload}
                    disabled={uploadingBulk}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md gap-2"
                  >
                    {uploadingBulk ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengimpor ({bulkProgress}/{previewData.length})...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Simpan {previewData.length} Data ke Database</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="border border-border rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted font-bold border-b sticky top-0">
                      <tr>
                        <th className="p-2.5">No</th>
                        <th className="p-2.5">Nama Siswa</th>
                        <th className="p-2.5">Kelas</th>
                        <th className="p-2.5">Tahun Ajaran</th>
                        <th className="p-2.5">Jenjang</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {previewData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/40">
                          <td className="p-2.5 text-muted-foreground">{idx + 1}</td>
                          <td className="p-2.5 font-semibold text-foreground">{item.nama}</td>
                          <td className="p-2.5">{item.kelas}</td>
                          <td className="p-2.5">{item.tahunAjaran}</td>
                          <td className="p-2.5 font-bold uppercase">{item.jenjangId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* SINGLE FORM MANUAL */}
      {showForm && (
        <Card className="p-6 border border-border bg-card shadow-md space-y-4">
          <h2 className="font-heading font-bold text-lg text-foreground">
            {editingItem ? "Form Edit Data Siswa" : "Form Tambah Siswa Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : (editingItem ? "Perbarui Data Siswa" : "Simpan Siswa")}
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
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-semibold">{item.nama}</td>
                  <td className="p-3">{item.kelas}</td>
                  <td className="p-3">{item.tahunAjaran}</td>
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
