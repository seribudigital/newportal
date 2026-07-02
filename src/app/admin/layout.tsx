"use client";

import React from "react";
import { AuthProvider } from "@/lib/authContext";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Allow unauthenticated access to login page
  if (pathname === "/admin/login") {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <AdminGuard>
        <div className="min-h-screen flex bg-background text-foreground">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminGuard>
    </AuthProvider>
  );
}
