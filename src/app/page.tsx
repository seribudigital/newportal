import { getSemuaJenjang } from "@/lib/services/jenjang";
import { getBeritaList } from "@/lib/services/berita";
import { getGaleriList } from "@/lib/services/galeri";

import { HeroSection } from "@/features/beranda/HeroSection";
import { JenjangSection } from "@/features/beranda/JenjangSection";
import { BeritaSection } from "@/features/beranda/BeritaSection";
import { GaleriSection } from "@/features/beranda/GaleriSection";
import { PPDBBannerSection } from "@/features/beranda/PPDBBannerSection";

// Revalidate data every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  // Fetch data safely in parallel via isolated Firestore services (Server Component)
  const [jenjangData, beritaData, galeriData] = await Promise.all([
    getSemuaJenjang().catch((err) => {
      console.error("Error fetching jenjang:", err);
      return [];
    }),
    getBeritaList(undefined, true).catch((err) => {
      console.error("Error fetching berita:", err);
      return [];
    }),
    getGaleriList(undefined, 8).catch((err) => {
      console.error("Error fetching galeri:", err);
      return [];
    }),
  ]);

  return (
    <main className="flex-1">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Kartu 4 Jenjang Section */}
      <JenjangSection list={jenjangData} />

      {/* 3. Berita Terbaru Section */}
      <BeritaSection beritaList={beritaData} />

      {/* 4. Galeri Terbaru Agregat Section */}
      <GaleriSection galeriList={galeriData} />

      {/* 5. CTA PPDB Banner Section */}
      <PPDBBannerSection />
    </main>
  );
}
