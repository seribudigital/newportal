import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSemuaJenjang, getJenjangBySlug } from "@/lib/services/jenjang";
import { getGuruList } from "@/lib/services/guru";
import { getGaleriList } from "@/lib/services/galeri";
import { getCollectionByJenjang } from "@/lib/services/konten";
import type { Program, Siswa, JenjangId } from "@/types";

import { JenjangHero } from "@/features/jenjang/JenjangHero";
import { ProgramSection } from "@/features/jenjang/ProgramSection";
import { GuruSection } from "@/features/jenjang/GuruSection";
import { SiswaSection } from "@/features/jenjang/SiswaSection";
import { JenjangGaleri } from "@/features/jenjang/JenjangGaleri";

export const revalidate = 60;

interface JenjangPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const jenjangList = await getSemuaJenjang().catch(() => []);
  if (jenjangList.length === 0) {
    return [
      { slug: "tkit" },
      { slug: "sdit" },
      { slug: "mts" },
      { slug: "ma" },
    ];
  }
  return jenjangList.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: JenjangPageProps): Promise<Metadata> {
  const { slug } = await params;
  const jenjang = await getJenjangBySlug(slug);

  if (!jenjang) {
    return {
      title: "Jenjang Tidak Ditemukan",
    };
  }

  return {
    title: `${jenjang.nama} - Portal Sekolah Islam Terpadu`,
    description: jenjang.deskripsi,
  };
}

export default async function JenjangDetailPage({ params }: JenjangPageProps) {
  const { slug } = await params;
  const jenjang = await getJenjangBySlug(slug);

  if (!jenjang) {
    notFound();
  }

  const jenjangId = jenjang.id as JenjangId;

  // Fetch data specifically filtered by jenjangId
  const [programs, guruList, siswaList, galeriList] = await Promise.all([
    getCollectionByJenjang<Program>("program", jenjangId).catch(() => []),
    getGuruList(jenjangId).catch(() => []),
    getCollectionByJenjang<Siswa>("siswa", jenjangId).catch(() => []),
    getGaleriList(jenjangId).catch(() => []),
  ]);

  return (
    <main className="flex-1">
      {/* 1. Profil & Hero Jenjang */}
      <JenjangHero jenjang={jenjang} />

      {/* 2. Program & Kurikulum */}
      <ProgramSection programs={programs} jenjangNama={jenjang.nama} />

      {/* 3. Dewan Guru */}
      <GuruSection guruList={guruList} jenjangNama={jenjang.nama} />

      {/* 4. Direktori Santri & Siswa Aktif */}
      <SiswaSection siswaList={siswaList} jenjangNama={jenjang.nama} />

      {/* 5. Galeri Spesifik (#galeri anchor) */}
      <JenjangGaleri galeriList={galeriList} jenjangNama={jenjang.nama} />
    </main>
  );
}
