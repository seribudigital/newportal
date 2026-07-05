import type { Metadata } from "next";
import { ShieldCheck, Target, Users } from "lucide-react";
import { getPengurusYayasan } from "@/lib/services/publikExtra";
import { Card } from "@/components/ui/card";
import { SafeImage } from "@/components/ui/SafeImage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tentang Kami - Portal Sekolah Islam Terpadu",
  description: "Profil sejarah, visi-misi, dan susunan pengurus Yayasan Islam Terpadu.",
};

export default async function TentangPage() {
  const pengurusList = await getPengurusYayasan().catch(() => []);

  return (
    <main className="flex-1 py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: Hero & History */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Profil Yayasan
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-foreground">
            Membangun Peradaban Rabbani Berkemajuan
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Yayasan Islam Terpadu berdiri sejak tahun 2005 dengan komitmen menyelenggarakan pendidikan terpadu yang memadukan keunggulan ilmu syar'i, sains modern, dan pembentukan akhlak mulia.
          </p>
        </div>

        {/* Section 2: Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border border-emerald-900/10 shadow-md bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-gold-400">Visi Utama</h2>
              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                "Menjadi lembaga pendidikan Islam terpadu rujukan nasional yang melahirkan generasi Rabbani berjiwa pemimpin, cerdas secara intelektual, dan berakhlak Qur'ani."
              </p>
            </div>
          </Card>

          <Card className="border border-border shadow-xs bg-card p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-foreground">Misi Lembaga</h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-gold-600 font-bold">•</span>
                <span>Menyelenggarakan pembelajaran terpadu Al-Qur'an dan sains terkini.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 font-bold">•</span>
                <span>Membina hafalan Al-Qur'an dan karakter santri secara intensif.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-600 font-bold">•</span>
                <span>Menciptakan lingkungan belajar Islami yang aman, asri, dan berbasis teknologi.</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Section 3: Organization Structure / Live Pengurus from Firestore */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-3xl text-foreground">
              Struktur Pengurus Yayasan
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Jajaran pembina dan pengurus yang berdedikasi mengawal kualitas pendidikan.
            </p>
          </div>

          {pengurusList.length === 0 ? (
            <div className="text-center p-12 bg-card border border-dashed border-border rounded-2xl max-w-xl mx-auto">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
              <p className="text-muted-foreground text-sm font-medium">
                Belum ada data pengurus yayasan yang terdaftar. silakan tambahkan data melalui Dashboard Admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pengurusList.map((p) => (
                <Card key={p.id} className="p-6 text-center border border-border shadow-xs bg-card hover:shadow-md transition-all flex flex-col items-center justify-between space-y-4">
                  <div className="space-y-3 flex flex-col items-center">
                    {p.fotoUrl ? (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-700/20 bg-emerald-950/10">
                        <SafeImage src={p.fotoUrl} alt={p.nama} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-heading font-bold text-2xl flex items-center justify-center border border-emerald-900/10 shadow-xs">
                        {p.nama.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="font-heading font-bold text-lg text-foreground">{p.nama}</h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold mt-1 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/50 inline-block">
                        {p.jabatan}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted-foreground border-t border-border/60 pt-3 w-full">
                    <span>{p.organisasi || "Yayasan"}</span>
                    {p.periode && <span className="font-medium text-foreground"> • Periode {p.periode}</span>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
