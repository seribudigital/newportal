"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6 bg-card p-8 rounded-3xl border border-destructive/20 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading font-bold text-xl md:text-2xl text-foreground">
            Terjadi Kesalahan pada Sistem
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Mohon maaf atas ketidaknyamanan ini. Terjadi kendala saat memuat halaman yang Anda minta.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground bg-muted p-1.5 rounded">
              ErrorCode: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs gap-2 py-2.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Muat Ulang</span>
          </Button>

          <Link
            href="/"
            className={buttonVariants({ variant: "outline" }) + " flex-1 text-xs font-bold gap-2 justify-center"}
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
