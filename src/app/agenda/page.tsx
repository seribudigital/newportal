import type { Metadata } from "next";
import { getAgendaList } from "@/lib/services/agenda";
import { AgendaClientContainer } from "@/features/agenda/AgendaClientContainer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Agenda & Kegiatan - Yayasan Islam Terpadu",
  description: "Jadwal kegiatan mendatang, kalender akademik, dan agenda sekolah.",
};

export default async function AgendaPage() {
  const agendaList = await getAgendaList(undefined, true).catch(() => []);

  return (
    <main className="flex-1 py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Kalender Akademik
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Agenda & Kegiatan Mendatang
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Pantau jadwal pelaksanaan acara, ujian, pertemuan wali murid, dan peringatan hari besar Islam di lingkungan sekolah.
          </p>
        </div>

        {/* Agenda Container */}
        <AgendaClientContainer agendaList={agendaList} />

      </div>
    </main>
  );
}
