import Link from "next/link";
import { ArrowRight, Award, UserCheck, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { Jenjang } from "@/types";

interface JenjangHeroProps {
  jenjang: Jenjang;
}

const JENJANG_HERO_STYLES: Record<string, { bg: string; badge: string; accentText: string }> = {
  tkit: { bg: "from-emerald-950 via-emerald-900 to-emerald-950", badge: "bg-tkit-bg text-tkit border-tkit/40", accentText: "text-tkit" },
  sdit: { bg: "from-slate-950 via-sky-950 to-slate-950", badge: "bg-sdit-bg text-sdit border-sdit/40", accentText: "text-sdit" },
  mts: { bg: "from-teal-950 via-emerald-950 to-teal-950", badge: "bg-mts-bg text-mts border-mts/40", accentText: "text-mts" },
  ma: { bg: "from-emerald-950 via-emerald-900 to-emerald-950", badge: "bg-ma-bg text-ma border-ma/40", accentText: "text-ma" },
};

export function JenjangHero({ jenjang }: JenjangHeroProps) {
  const style = JENJANG_HERO_STYLES[jenjang.id] || JENJANG_HERO_STYLES.ma;

  return (
    <section className={`relative overflow-hidden bg-gradient-to-b ${style.bg} text-white py-16 lg:py-24 border-b border-gold-500/20`}>
      {/* Geometrical Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Jenjang Pendidikan Terpadu</span>
            </div>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white leading-tight">
              {jenjang.nama}
            </h1>

            <p className="text-emerald-100/90 text-base sm:text-lg max-w-2xl leading-relaxed">
              {jenjang.deskripsi}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href={`/ppdb?jenjang=${jenjang.id}`}
                className={buttonVariants({ variant: "default", size: "lg" }) + " bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm"}
              >
                <span>Daftar PPDB {jenjang.id.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#kurikulum"
                className={buttonVariants({ variant: "outline", size: "lg" }) + " border-emerald-700/60 bg-white/5 text-emerald-100 hover:bg-white/10 font-medium px-6 py-3 rounded-xl text-sm"}
              >
                Lihat Kurikulum
              </a>
            </div>
          </div>

          {/* Quick Details Card */}
          <div className="lg:col-span-4 bg-white/95 text-foreground rounded-2xl p-6 shadow-2xl border border-gold-500/30 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Tingkat Akreditasi</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${style.badge}`}>
                Akreditasi {jenjang.akreditasi}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Kepala Sekolah</span>
              </div>
              <p className="font-heading font-bold text-base text-emerald-950">
                {jenjang.kepalaSekolah}
              </p>
            </div>

            {jenjang.visiMisi && (
              <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground block mb-1">Visi & Misi Ringkas:</span>
                <div 
                  className="line-clamp-3 prose prose-xs"
                  dangerouslySetInnerHTML={{ __html: jenjang.visiMisi }} 
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
