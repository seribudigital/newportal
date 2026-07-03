import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { getBeritaList, getBeritaBySlug } from "@/lib/services/berita";
import { SafeHtmlRenderer } from "@/components/ui/SafeHtmlRenderer";

export const revalidate = 0;
export const dynamicParams = true;

interface BeritaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatTanggal(tanggal: any): string {
  if (!tanggal) return "Terbaru";
  try {
    if (typeof tanggal?.toDate === "function") {
      return tanggal.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
    if (tanggal?.seconds) {
      return new Date(tanggal.seconds * 1000).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
    if (typeof tanggal === "string" || typeof tanggal === "number") {
      return new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
  } catch {
    // ignore
  }
  return "Terbaru";
}

export async function generateStaticParams() {
  try {
    const beritaList = await getBeritaList(undefined, true);
    return beritaList.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BeritaDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const berita = await getBeritaBySlug(slug);

    if (!berita || berita.status !== "published") {
      return { title: "Berita Tidak Ditemukan" };
    }

    return {
      title: `${berita.judul} - Portal Sekolah Islam Terpadu`,
      description: berita.ringkasan,
      openGraph: {
        title: berita.judul,
        description: berita.ringkasan,
        images: berita.gambarUtamaUrl ? [berita.gambarUtamaUrl] : [],
      },
    };
  } catch {
    return { title: "Portal Sekolah Islam Terpadu" };
  }
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita || berita.status !== "published") {
    notFound();
  }

  return (
    <main className="flex-1 py-12 md:py-20 bg-background">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Berita</span>
        </Link>

        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase px-3 py-1 rounded-md bg-emerald-950 text-gold-400 border border-gold-500/30">
              {berita.jenjangId ? berita.jenjangId.toUpperCase() : "PORTAL YAYASAN"}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-gold-600" />
              <span>{formatTanggal(berita.tanggal)}</span>
            </div>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
            {berita.judul}
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-sans">
            {berita.ringkasan}
          </p>
        </div>

        {/* Main Banner Image */}
        {berita.gambarUtamaUrl && !berita.gambarUtamaUrl.startsWith("blob:") && (
          <div className="w-full h-[300px] sm:h-[420px] rounded-2xl overflow-hidden bg-emerald-900/10 border border-border">
            <img
              src={berita.gambarUtamaUrl}
              alt={berita.judul}
              className="w-full h-full object-cover"
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) parent.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Sanitized Rich Text Content */}
        <div className="pt-4 border-t border-border">
          <SafeHtmlRenderer html={berita.isi} />
        </div>

      </article>
    </main>
  );
}
