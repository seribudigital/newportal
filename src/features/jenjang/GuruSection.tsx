import { UserCheck, Users, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Guru } from "@/types";

interface GuruSectionProps {
  guruList: Guru[];
  jenjangNama: string;
}

export function GuruSection({ guruList, jenjangNama }: GuruSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-emerald-950/5 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Tenaga Pendidik
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Dewan Guru & Pengajar {jenjangNama}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Pendidik profesional yang kompeten, berdedikasi tinggi, dan teladan dalam pembentukan karakter santri.
          </p>
        </div>

        {guruList.length === 0 ? (
          <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl max-w-2xl mx-auto">
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm font-medium">
              Data dewan guru untuk jenjang ini sedang diunggah.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {guruList.map((guru) => (
              <Card key={guru.id} className="overflow-hidden border border-border/80 shadow-xs hover:shadow-lg transition-all bg-card text-center group">
                <div className="w-full h-48 bg-emerald-900/10 relative overflow-hidden">
                  {guru.fotoUrl && !guru.fotoUrl.startsWith("blob:") ? (
                    <img
                      src={guru.fotoUrl}
                      alt={guru.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          e.currentTarget.style.display = "none";
                          const fallback = document.createElement("div");
                          fallback.className = "w-full h-full flex items-center justify-center bg-emerald-100/50 text-emerald-900 font-heading font-bold text-3xl";
                          fallback.innerText = guru.nama.charAt(0);
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100/50 text-emerald-900 font-heading font-bold text-3xl">
                      {guru.nama.charAt(0)}
                    </div>
                  )}
                </div>
                <CardContent className="p-4 space-y-1">
                  <h3 className="font-heading font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                    {guru.nama}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700">
                    {guru.jabatan}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {guru.mataPelajaran}
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
