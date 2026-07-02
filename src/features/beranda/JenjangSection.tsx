import Link from "next/link";
import { ArrowUpRight, School, Award, Users, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Jenjang } from "@/types";

interface JenjangSectionProps {
  list: Jenjang[];
}

const JENJANG_COLORS: Record<string, { badge: string; border: string; bg: string }> = {
  tkit: { badge: "bg-tkit-bg text-tkit border-tkit/30", border: "border-tkit/20 hover:border-tkit", bg: "bg-tkit-bg/30" },
  sdit: { badge: "bg-sdit-bg text-sdit border-sdit/30", border: "border-sdit/20 hover:border-sdit", bg: "bg-sdit-bg/30" },
  mts: { badge: "bg-mts-bg text-mts border-mts/30", border: "border-mts/20 hover:border-mts", bg: "bg-mts-bg/30" },
  ma: { badge: "bg-ma-bg text-ma border-ma/30", border: "border-ma/20 hover:border-ma", bg: "bg-ma-bg/30" },
};

export function JenjangSection({ list }: JenjangSectionProps) {
  return (
    <section id="jenjang-section" className="py-16 md:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Jenjang Pendidikan
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Pendidikan Terpadu Usia Dini Hingga Menengah Atas
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-3">
            Setiap jenjang dirancang khusus untuk mendukung perkembangan spritual, akademik, dan karakter santri secara berkesinambungan.
          </p>
        </div>

        {/* Card Grid */}
        {list.length === 0 ? (
          <div className="text-center p-8 bg-card border border-dashed border-border rounded-2xl">
            <School className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm font-medium">Data jenjang sekolah belum tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((item) => {
              const theme = JENJANG_COLORS[item.id] || JENJANG_COLORS.ma;
              return (
                <Card
                  key={item.id}
                  className={`group relative flex flex-col justify-between border transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${theme.border}`}
                >
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg border ${theme.badge}`}>
                        {item.id.toUpperCase()}
                      </div>
                      <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-md border ${theme.badge}`}>
                        Akreditasi {item.akreditasi}
                      </span>
                    </div>
                    <CardTitle className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                      {item.nama}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-0">
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {item.deskripsi}
                    </CardDescription>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span className="truncate">Kepala Sekolah: {item.kepalaSekolah}</span>
                    </div>

                    <Link
                      href={`/jenjang/${item.slug}`}
                      className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-muted/60 hover:bg-primary hover:text-white text-foreground text-xs font-semibold transition-all group-hover:bg-primary group-hover:text-white"
                    >
                      <span>Lihat Profil & Kurikulum</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
