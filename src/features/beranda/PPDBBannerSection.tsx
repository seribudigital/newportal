import Link from "next/link";
import { ArrowRight, CheckCircle, GraduationCap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function PPDBBannerSection() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white relative overflow-hidden">
      {/* Background Geometrical Ornament */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-emerald-950/60 border border-gold-500/30 rounded-3xl p-8 sm:p-12 md:p-16 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-bold uppercase tracking-wider mb-4">
              <GraduationCap className="w-4 h-4" />
              <span>Pendaftaran Murid Baru (PPDB)</span>
            </div>

            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight">
              Bergabunglah Bersama Keluarga Besar Yayasan Islam Terpadu
            </h2>

            <p className="mt-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Pendaftaran Penerimaan Peserta Didik Baru (PPDB) untuk tahun ajaran baru telah dibuka. Dapatkan kuota gelombang pertama dengan fasilitas beasiswa tahfizh & prestasi.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold-400" /> Form Online Cepat
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold-400" /> Tes Pemetaan Qur'an
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-gold-400" /> Verifikasi Berkas Mudah
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
            <Link
              href="/ppdb"
              className={buttonVariants({ variant: "default", size: "lg" }) + " w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold px-8 py-4 rounded-xl shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 text-base transition-transform hover:scale-105"}
            >
              <span>Isi Formulir PPDB</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-[11px] text-center text-emerald-300/80">
              Butuh bantuan? Kontak Panitia PPDB di Halaman Kontak
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
