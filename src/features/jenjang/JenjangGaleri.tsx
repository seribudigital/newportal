import { Image as ImageIcon } from "lucide-react";
import type { Galeri } from "@/types";

interface JenjangGaleriProps {
  galeriList: Galeri[];
  jenjangNama: string;
}

export function JenjangGaleri({ galeriList, jenjangNama }: JenjangGaleriProps) {
  return (
    <section id="galeri" className="py-16 md:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Galeri Spesifik
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Dokumentasi Kegiatan {jenjangNama}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Momen ragam aktivitas santri dan program belajar mengajar di lingkungan {jenjangNama}.
          </p>
        </div>

        {galeriList.length === 0 ? (
          <div className="text-center p-12 bg-muted/20 border border-dashed border-border rounded-2xl max-w-2xl mx-auto">
            <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm font-medium">
              Galeri foto khusus jenjang ini belum tersedia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {galeriList.map((item) => (
              <div
                key={item.id}
                className="group relative h-48 sm:h-60 rounded-2xl overflow-hidden bg-emerald-950/20 border border-border shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.imageUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <h3 className="font-heading font-semibold text-sm line-clamp-1 group-hover:text-gold-300 transition-colors">
                    {item.judul}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
