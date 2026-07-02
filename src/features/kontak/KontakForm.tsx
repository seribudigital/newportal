"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { submitPesanKontak } from "@/lib/services/publikExtra";

export function KontakForm() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    // Basic validation & anti-spam
    if (!formData.nama.trim() || !formData.email.trim() || !formData.pesan.trim()) {
      setErrorMsg("Mohon lengkapi seluruh kolom formulir.");
      setLoading(false);
      return;
    }

    if (formData.pesan.length < 10) {
      setErrorMsg("Pesan terlalu pendek. Mohon tulis minimal 10 karakter.");
      setLoading(false);
      return;
    }

    try {
      await submitPesanKontak(formData);
      setSuccess(true);
      setFormData({ nama: "", email: "", subjek: "", pesan: "" });
    } catch (err) {
      console.error("Error submitting contact message:", err);
      setErrorMsg("Gagal mengirim pesan. Silakan coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-border/80 shadow-md bg-card">
      <CardHeader>
        <CardTitle className="font-heading font-bold text-2xl text-foreground">
          Kirim Pesan & Pertanyaan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-emerald-900">
              Pesan Berhasil Terkirim!
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Jazakumullah khairan. Tim sekretariat kami akan segera menindaklanjuti pesan Anda melalui email/kontak.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSuccess(false)}
              className="mt-2 text-xs font-semibold"
            >
              Kirim Pesan Lainnya
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="nama" className="text-xs font-semibold text-foreground">
                Nama Lengkap <span className="text-destructive">*</span>
              </label>
              <input
                id="nama"
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Masukkan nama Anda"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-foreground">
                Email / No. WhatsApp <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="text"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@contoh.com atau 0812..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subjek" className="text-xs font-semibold text-foreground">
                Subjek / Perihal
              </label>
              <input
                id="subjek"
                type="text"
                value={formData.subjek}
                onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                placeholder="Misal: Informasi PPDB SDIT"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pesan" className="text-xs font-semibold text-foreground">
                Pesan Anda <span className="text-destructive">*</span>
              </label>
              <textarea
                id="pesan"
                rows={4}
                required
                value={formData.pesan}
                onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                placeholder="Tuliskan pertanyaan atau pesan Anda secara rinci..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs py-2.5 shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirim Pesan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan</span>
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
