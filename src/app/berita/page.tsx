import type { Metadata } from "next";
import { getBeritaList } from "@/lib/services/berita";
import { BeritaClientContainer } from "@/features/berita/BeritaClientContainer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Berita & Pengumuman - Yayasan Islam Terpadu",
  description: "Kabar terbaru kegiatan santri, agenda sekolah, dan pengumuman resmi yayasan.",
};

export default async function BeritaListPage() {
  const beritaList = await getBeritaList(undefined, true).catch(() => []);

  return (
    <main className="flex-1 py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Pusat Informasi
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Berita & Kabar Kegiatan Santri
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Simak beragam informasi pendidikan, prestasi, dan dokumentasi kegiatan sekolah dari seluruh jenjang.
          </p>
        </div>

        {/* Filter & News Grid */}
        <BeritaClientContainer initialBeritaList={beritaList} />

      </div>
    </main>
  );
}
