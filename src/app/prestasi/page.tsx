import type { Metadata } from "next";
import { getPrestasiList } from "@/lib/services/publikExtra";
import { PrestasiClientContainer } from "@/features/prestasi/PrestasiClientContainer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Prestasi Santri - Yayasan Islam Terpadu",
  description: "Capaian prestasi akademik, sains, dan Qur'an santri di berbagai tingkat kompetisi.",
};

export default async function PrestasiPage() {
  const prestasiList = await getPrestasiList().catch(() => []);

  return (
    <main className="flex-1 py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Jejak Kebanggaan
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Prestasi & Penghargaan Santri
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Raihan prestasi santri dalam bidang keagamaan, sains, olahraga, dan seni dari tingkat kecamatan hingga internasional.
          </p>
        </div>

        {/* Prestasi Container */}
        <PrestasiClientContainer initialPrestasiList={prestasiList} />

      </div>
    </main>
  );
}
