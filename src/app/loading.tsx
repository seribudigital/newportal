import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-emerald-950/10 dark:border-emerald-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase animate-pulse">
        Memuat Halaman...
      </p>
    </div>
  );
}
