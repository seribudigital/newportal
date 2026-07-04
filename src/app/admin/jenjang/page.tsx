"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { GraduationCap, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSemuaJenjang, getJenjangById } from "@/lib/services/jenjang";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Jenjang, JenjangId } from "@/types";

export default function AdminJenjangProfilPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [jenjangList, setJenjangList] = useState<Jenjang[]>([]);
  const [selectedJenjangId, setSelectedJenjangId] = useState<JenjangId>(profile?.jenjangId || "tkit");
  const [currentJenjang, setCurrentJenjang] = useState<Jenjang | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form fields
  const [nama, setNama] = useState("");
  const [kepalaSekolah, setKepalaSekolah] = useState("");
  const [akreditasi, setAkreditasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [visiMisi, setVisiMisi] = useState("");

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const all = await getSemuaJenjang();
        setJenjangList(all);

        const activeId = isYayasanAdmin ? selectedJenjangId : profile?.jenjangId || "tkit";
        const j = await getJenjangById(activeId);
        if (j) {
          setCurrentJenjang(j);
          setNama(j.nama);
          setKepalaSekolah(j.kepalaSekolah);
          setAkreditasi(j.akreditasi);
          setDeskripsi(j.deskripsi);
          setVisiMisi(j.visiMisi);
        }
      } catch (err) {
        console.error("Error loading profil jenjang:", err);
      } finally {
        setLoading(false);
      }
    }
    if (profile) init();
  }, [profile, isYayasanAdmin, selectedJenjangId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);

    const activeId = isYayasanAdmin ? selectedJenjangId : profile?.jenjangId || "tkit";

    try {
      await setDoc(doc(db, "jenjang", activeId), {
        nama,
        kepalaSekolah,
        akreditasi,
        deskripsi,
        visiMisi,
      }, { merge: true });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Gagal memperbarui profil: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-border">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
          Profil Jenjang & Kepala Sekolah
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Pengaturan visi-misi, akreditasi, dan nama Kepala Sekolah
        </p>
      </div>

      {isYayasanAdmin && (
        <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border">
          <span className="text-xs font-bold">Pilih Jenjang Sekolah:</span>
          <select
            value={selectedJenjangId}
            onChange={(e) => setSelectedJenjangId(e.target.value as JenjangId)}
            className="px-3 py-1.5 text-xs rounded-lg border border-input bg-background font-bold uppercase"
          >
            <option value="tkit">TKIT</option>
            <option value="sdit">SDIT</option>
            <option value="mts">MTs</option>
            <option value="ma">MA</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
      ) : (
        <Card className="border border-border shadow-md bg-card">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span>Kelola Profil {selectedJenjangId.toUpperCase()}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {saved && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profil jenjang berhasil diperbarui!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Resmi Jenjang</label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    value={kepalaSekolah}
                    onChange={(e) => setKepalaSekolah(e.target.value)}
                    placeholder="Ustadzah Maryam, S.Pd"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Status Akreditasi</label>
                <input
                  type="text"
                  value={akreditasi}
                  onChange={(e) => setAkreditasi(e.target.value)}
                  placeholder="Terakreditasi A (Unggul)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Deskripsi Profil Ringkas</label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Visi & Misi (Rich Text HTML)</label>
                <textarea
                  rows={6}
                  value={visiMisi}
                  onChange={(e) => setVisiMisi(e.target.value)}
                  placeholder="<p>Visi: ...</p><p>Misi: ...</p>"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background font-mono"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={submitting} className="bg-primary text-white text-xs px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan Profil</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
