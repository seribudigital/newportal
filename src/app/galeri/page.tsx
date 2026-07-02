import type { Metadata } from "next";
import { getGaleriList } from "@/lib/services/galeri";
import { GaleriClientContainer } from "@/features/galeri/GaleriClientContainer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Galeri Foto & Kegiatan - Yayasan Islam Terpadu",
  description: "Dokumentasi kegiatan santri, fasilitas sekolah, dan acara resmi yayasan.",
};

export default async function GaleriPage() {
  const galeriList = await getGaleriList().catch(() => []);

  return (
    <main className="flex-1 py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Dokumentasi Visual
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Galeri Foto Terbaru
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Momen kebersamaan, suasana belajar mengajar, dan ragam aktivitas santri dari seluruh jenjang pendidikan.
          </p>
        </div>

        {/* Galeri Grid Container */}
        <GaleriClientContainer initialGaleriList={galeriList} />

      </div>
    </main>
  );
}
