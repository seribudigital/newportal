"use client";

import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { isYayasanAdmin } = useAuth();
  const [namaYayasan, setNamaYayasan] = useState("Yayasan Islam Terpadu Al-Hikmah");
  const [alamat, setAlamat] = useState("Jl. Pendidikan Islam No. 123, Kompleks Terpadu Al-Hikmah, Jakarta Selatan");
  const [telepon, setTelepon] = useState("(021) 7890-1234");
  const [email, setEmail] = useState("info@alhikmah-yit.sch.id");
  const [saved, setSaved] = useState(false);

  if (!isYayasanAdmin) {
    return <div className="p-8 text-center text-muted-foreground font-semibold">Khusus Admin Yayasan</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-border">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
          Pengaturan Global Situs
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Konfigurasi nama yayasan, alamat resmi, dan kontak publik portal
        </p>
      </div>

      <Card className="border border-border shadow-md bg-card">
        <CardHeader>
          <CardTitle className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Identitas & Kontak Global</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {saved && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengaturan situs berhasil diperbarui!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold">Nama Resmi Yayasan</label>
              <input
                type="text"
                value={namaYayasan}
                onChange={(e) => setNamaYayasan(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Alamat Lengkap</label>
              <textarea
                rows={3}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Telepon Resmi</label>
                <input
                  type="text"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Email Kontak</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-primary text-white text-xs px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
