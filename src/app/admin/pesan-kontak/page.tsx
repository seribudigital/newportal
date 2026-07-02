"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Mail, Loader2, Calendar, UserCheck, Phone, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PesanKontak } from "@/lib/services/publikExtra";

export default function AdminPesanKontakPage() {
  const { isYayasanAdmin } = useAuth();
  const [pesanList, setPesanList] = useState<PesanKontak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPesan() {
      try {
        const q = query(collection(db, "pesanKontak"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PesanKontak));
        setPesanList(list);
      } catch (err) {
        console.error("Error fetching pesan kontak:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPesan();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
          Pesan Kontak Masuk
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Daftar pertanyaan dan masukan publik dari halaman Kontak
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs">Memuat pesan masuk...</span>
        </div>
      ) : pesanList.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-border">
          <Mail className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Belum ada pesan kontak masuk.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pesanList.map((item) => (
            <Card key={item.id} className="border border-border/80 shadow-xs bg-card flex flex-col justify-between p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <UserCheck className="w-4 h-4 text-primary" />
                    <span>{item.nama}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {item.createdAt 
                      ? new Date((item.createdAt as any).seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
                      : 'Terbaru'}
                  </span>
                </div>

                <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{item.email}</span>
                </div>

                {item.subjek && (
                  <p className="text-xs font-bold text-foreground pt-1">
                    Subjek: {item.subjek}
                  </p>
                )}

                <p className="text-xs text-muted-foreground leading-relaxed pt-1 bg-muted/30 p-3 rounded-xl border border-border/60">
                  "{item.pesan}"
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
