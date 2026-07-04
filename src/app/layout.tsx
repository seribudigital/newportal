import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Amiri } from "next/font/google";
import "./globals.css";
import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const amiriFont = Amiri({
  variable: "--font-heading",
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#022c22",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Portal Utama — Yayasan Islam Terpadu",
    template: "%s | SIT",
  },
  description: "Web Portal Resmi Yayasan Islam Terpadu. Menyelenggarakan pendidikan berkualitas terpadu dari jenjang TKIT, SDIT, MTs, hingga MA.",
  keywords: [
    "Sekolah Islam Terpadu",
    "SIT",
    "TKIT",
    "SDIT",
    "MTs",
    "MA",
    "PPDB Online",
    "Pendidikan Islam Rabbani",
    "Tahfidz Al-Qur'an"
  ],
  authors: [{ name: "Yayasan Islam Terpadu" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sit-portal.sch.id"),
  openGraph: {
    title: "Portal Utama — Yayasan Islam Terpadu",
    description: "Pendidikan Islam Terpadu Berintegrasi Sains, Adab, & Al-Qur'an untuk Jenjang TKIT, SDIT, MTs, dan MA.",
    url: "/",
    siteName: "Portal SIT",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal Utama — Yayasan Islam Terpadu",
    description: "Web Portal Resmi Yayasan Islam Terpadu — TKIT, SDIT, MTs, MA.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakartaSans.variable} ${amiriFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
