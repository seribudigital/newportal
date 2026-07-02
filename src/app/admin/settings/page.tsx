"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Settings, Save, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGlobalSettings, updateGlobalSettings, DEFAULT_SETTINGS } from "@/lib/services/settings";
import type { GlobalSettings } from "@/types";

export default function AdminSettingsPage() {
  const { isYayasanAdmin } = useAuth();
  const [formData, setFormData] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getGlobalSettings();
        setFormData(data);
      } catch (err) {
        console.error("Failed loading global settings:", err);
      } finally {
        setFetching(false);
      }
    }
    loadSettings();
  }, []);

  if (!isYayasanAdmin) {
    return <div className="p-8 text-center text-muted-foreground font-semibold">Khusus Admin Yayasan</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await updateGlobalSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Gagal menyimpan pengaturan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Memuat Pengaturan Situs...</p>
      </div>
    );
  }

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {saved && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengaturan situs berhasil diperbarui ke database Firestore!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold">Nama Resmi Yayasan</label>
              <input
                type="text"
                required
                value={formData.namaYayasan}
                onChange={(e) => setFormData({ ...formData, namaYayasan: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
                placeholder="Yayasan Islam Terpadu Al-Khoir"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Alamat Lengkap</label>
              <textarea
                rows={3}
                required
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background resize-none"
                placeholder="Alamat lengkap yayasan..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Telepon Resmi</label>
                <input
                  type="text"
                  required
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Email Kontak</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-primary text-white text-xs px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
