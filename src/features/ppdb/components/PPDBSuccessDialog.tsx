"use client";

import React from "react";
import { CheckCircle2, Copy, Printer, ArrowLeft, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JenjangId } from "@/types";

interface PPDBSuccessDialogProps {
  nomorPendaftaran: string;
  namaCalon: string;
  jenjangId: JenjangId;
  onClose: () => void;
}

export function PPDBSuccessDialog({
  nomorPendaftaran,
  namaCalon,
  jenjangId,
  onClose,
}: PPDBSuccessDialogProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(nomorPendaftaran);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-3xl border border-gold-500/40 shadow-2xl p-6 md:p-8 space-y-6 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full">
            Pendaftaran Berhasil Disimpan
          </span>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Alhamdulillah, Data Telah Diterima!
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Formulir pendaftaran untuk calon siswa <strong className="text-foreground">{namaCalon}</strong> ({jenjangId.toUpperCase()}) telah berhasil terkirim ke sistem PPDB.
          </p>
        </div>

        {/* Registration ID Badge */}
        <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-gold-500/30 space-y-2">
          <div className="text-[11px] text-gold-400 font-medium">Nomor Registrasi Pendaftaran Anda</div>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-xl font-extrabold tracking-wider text-gold-300">
              {nomorPendaftaran}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-gold-300 transition-colors cursor-pointer"
              title="Salin Kode Registrasi"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <p className="text-[10px] text-emerald-300">Berhasil disalin ke clipboard!</p>}
        </div>

        {/* Information & Next Steps */}
        <div className="p-4 rounded-xl bg-muted/50 text-left space-y-2.5 text-xs text-foreground/90">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Langkah Selanjutnya:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground">
            <li>Simpan atau screenshot nomor pendaftaran di atas.</li>
            <li>Tim Panitia PPDB akan memeriksa kelengkapan berkas Anda.</li>
            <li>Konfirmasi status pendaftaran akan dikirimkan melalui <strong>WhatsApp</strong>.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex-1 gap-2 border-emerald-900/20 text-xs font-semibold"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bukti</span>
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Selesai & Kembali</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
