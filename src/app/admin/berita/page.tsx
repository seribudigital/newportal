"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  Newspaper, 
  Loader2, 
  CheckCircle, 
  Clock 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { getBeritaList, deleteBerita } from "@/lib/services/berita";
import type { Berita } from "@/types";

export default function AdminBeritaListPage() {
  const { profile, isYayasanAdmin } = useAuth();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const jenjangId = isYayasanAdmin ? undefined : profile?.jenjangId;
      const list = await getBeritaList(jenjangId, false);
      setBeritaList(list);
    } catch (err) {
      console.error("Error loading berita admin list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile, isYayasanAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini secara permanen?")) return;
    setDeletingId(id);
    try {
      await deleteBerita(id);
      await loadData();
    } catch (err) {
      alert("Gagal menghapus berita: " + (err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            Kelola Berita & Artikel
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Daftar artikel berita yayasan & jenjang terdaftar
          </p>
        </div>

        <Link
          href="/admin/berita/new"
          className={buttonVariants({ variant: "default" }) + " bg-primary hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm self-start sm:self-auto flex items-center gap-1.5"}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Berita Baru</span>
        </Link>
      </div>

      {/* Content List Table */}
      {loading ? (
        <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs">Memuat daftar berita...</span>
        </div>
      ) : beritaList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-border">
          <Newspaper className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Belum ada berita dibuat.</p>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-bold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Judul Berita</th>
                  <th className="p-4">Cakupan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {beritaList.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold text-foreground max-w-md">
                      <p className="line-clamp-1">{item.judul}</p>
                      <p className="text-[10px] text-muted-foreground font-normal">Slug: {item.slug}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-gold-400 border border-gold-500/30">
                        {item.jenjangId ? item.jenjangId.toUpperCase() : "YAYASAN"}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.status === "published" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="text-destructive hover:bg-destructive/10 border-destructive/20 cursor-pointer"
                      >
                        {deletingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
