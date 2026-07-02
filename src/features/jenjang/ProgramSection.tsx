import { BookOpen, Award, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Program } from "@/types";

interface ProgramSectionProps {
  programs: Program[];
  jenjangNama: string;
}

export function ProgramSection({ programs, jenjangNama }: ProgramSectionProps) {
  return (
    <section id="kurikulum" className="py-16 md:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Kurikulum & Program Unggulan
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Program Pembelajaran {jenjangNama}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Dirancang secara terpadu mengombinasikan standar Kurikulum Nasional dengan pendalaman Al-Qur'an dan karakter Islami.
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center p-12 bg-muted/30 border border-dashed border-border rounded-2xl max-w-2xl mx-auto">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm font-medium">
              Informasi program & kurikulum untuk jenjang ini sedang diperbarui oleh pihak sekolah.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((item) => (
              <Card key={item.id} className="border border-border/80 shadow-xs hover:shadow-md transition-all bg-card flex flex-col justify-between">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.kategori}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-gold-600" />
                  </div>
                  <CardTitle className="font-heading font-bold text-lg text-foreground">
                    {item.nama}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.deskripsi}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
