import Link from "next/link";
import { Compass, Home, ArrowLeft, GraduationCap, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 text-center">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background pointer-events-none" />

      <div className="relative z-10 max-w-lg space-y-6">
        {/* Islamic Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <Compass className="w-4 h-4 text-gold-500" />
          <span>Afwan (Mohon Maaf)</span>
        </div>

        {/* 404 Big Display */}
        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-7xl sm:text-8xl text-emerald-950 dark:text-emerald-400 tracking-tight">
            404
          </h1>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau alamat URL yang Anda masukkan kurang tepat.
          </p>
        </div>

        {/* Navigation CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className={buttonVariants({ variant: "default", size: "lg" }) + " w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs gap-2 shadow-md"}
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/ppdb"
            className={buttonVariants({ variant: "outline", size: "lg" }) + " w-full sm:w-auto border-gold-500/40 text-foreground font-bold text-xs gap-2 hover:bg-gold-500/10"}
          >
            <GraduationCap className="w-4 h-4 text-gold-600" />
            <span>PPDB Online</span>
          </Link>
        </div>

        {/* Secondary link */}
        <div className="pt-6 border-t border-border/60">
          <p className="text-[11px] text-muted-foreground">
            Butuh bantuan menemukan informasi? Silakan hubungi kami di{" "}
            <Link href="/kontak" className="text-emerald-700 font-bold hover:underline">
              Halaman Kontak
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
