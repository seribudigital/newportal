"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SettingsProvider } from "@/lib/settingsContext";

export function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <SettingsProvider>{children}</SettingsProvider>;
  }

  return (
    <SettingsProvider>
      <Header />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </SettingsProvider>
  );
}
