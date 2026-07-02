"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Loader2, ShieldAlert } from "lucide-react";
import type { Role, JenjangId } from "@/types";

interface AdminGuardProps {
  children: React.ReactNode;
  requiredRole?: Role;
  requiredJenjang?: JenjangId;
}

export function AdminGuard({ children, requiredRole, requiredJenjang }: AdminGuardProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-muted-foreground">Memverifikasi Hak Akses Admin...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-muted-foreground">Mengarahkan Halaman...</p>
      </div>
    );
  }

  // Access check
  if (requiredRole === "admin_yayasan" && profile.role !== "admin_yayasan") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-foreground">Akses Ditolak</h2>
        <p className="text-sm text-muted-foreground max-w-md mt-2">
          Halaman ini khusus untuk Admin Yayasan. Peran Anda saat ini adalah ({profile.role}).
        </p>
      </div>
    );
  }

  if (requiredJenjang && profile.role === "admin_jenjang" && profile.jenjangId !== requiredJenjang) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-foreground">Akses Terbatas</h2>
        <p className="text-sm text-muted-foreground max-w-md mt-2">
          Anda hanya berwenang mengelola jenjang {profile.jenjangId?.toUpperCase()}, bukan {requiredJenjang.toUpperCase()}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
