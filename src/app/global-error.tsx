"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-emerald-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6 bg-emerald-900/80 p-8 rounded-3xl border border-gold-500/30 shadow-2xl">
          <h1 className="text-2xl font-bold text-white font-serif">
            Terjadi Kesalahan Sistem Global
          </h1>
          <p className="text-xs text-emerald-200">
            Aplikasi mengalami kendala fatal. Silakan muat ulang halaman.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-gold-500 text-emerald-950 font-bold text-xs hover:bg-gold-400 transition-colors"
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      </body>
    </html>
  );
}
