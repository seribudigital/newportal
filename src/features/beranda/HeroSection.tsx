import Link from "next/link";
import { ArrowRight, Sparkles, GraduationCap, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50 py-20 lg:py-28">
      {/* Subtle Islamic Geometrical Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Decorative Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Badge Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pendidikan Islam Terpadu Berwawasan Global</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white max-w-4xl leading-tight sm:leading-snug">
          Membentuk Generasi <span className="text-gold-400 font-serif underline decoration-gold-500/40 decoration-wavy underline-offset-8">Rabbani</span>, Cerdas & Berakhlak Mulia
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-emerald-100/90 max-w-2xl font-sans leading-relaxed">
          Menyelenggarakan pendidikan Islam terintegrasi Al-Qur'an dan Sains dari jenjang TKIT, SDIT, MTs, hingga MA. Mempersiapkan pemimpin masa depan.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/ppdb"
            className={buttonVariants({ variant: "default", size: "lg" }) + " w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold px-8 py-3 rounded-xl shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 text-base transition-all hover:scale-105"}
          >
            <span>Daftar PPDB Online</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="#jenjang-section"
            className={buttonVariants({ variant: "outline", size: "lg" }) + " w-full sm:w-auto border-emerald-700/60 bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/60 hover:text-white font-medium px-8 py-3 rounded-xl text-base backdrop-blur-xs"}
          >
            Jelajahi 4 Jenjang
          </Link>
        </div>

        {/* Quick Highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-emerald-800/60 max-w-3xl w-full text-left text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              ✓
            </div>
            <div>
              <p className="font-bold text-white">Akreditasi A</p>
              <p className="text-emerald-300/80 text-xs">Unggul Nasional</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              📖
            </div>
            <div>
              <p className="font-bold text-white">Program Tahfizh</p>
              <p className="text-emerald-300/80 text-xs">Target Hafal Qur'an</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2 md:col-span-1 justify-center md:justify-start">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              🌐
            </div>
            <div>
              <p className="font-bold text-white">Bilingual & Sains</p>
              <p className="text-emerald-300/80 text-xs">Arab - Inggris</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
