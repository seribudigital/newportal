"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe, Share2, Video } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { JENJANG_MENU_ITEMS } from "./JenjangDropdown";
import { useSettings } from "@/lib/settingsContext";

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-gold-500/20 relative overflow-hidden">
      {/* Geometrical Background Accent Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & About */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/95 p-2.5 rounded-xl inline-block w-fit shadow-xs">
              <BrandLogo />
            </div>
            <p className="text-sm text-emerald-200/80 leading-relaxed font-sans">
              {settings?.tagline || "Mewujudkan generasi Rabbani yang berakhlak mulia, unggul dalam sains & Qur’an, serta siap menjadi pemimpin masa depan."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Media Sosial Yayasan" className="w-9 h-9 rounded-lg bg-emerald-900/80 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-emerald-950 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Saluran Video Yayasan" className="w-9 h-9 rounded-lg bg-emerald-900/80 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-emerald-950 transition-colors">
                <Video className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Situs Website" className="w-9 h-9 rounded-lg bg-emerald-900/80 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-emerald-950 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Jenjang Pendidikan */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-gold-400 border-b border-emerald-800/60 pb-2">
              Jenjang Pendidikan
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {JENJANG_MENU_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link href={`/jenjang/${item.slug}`} className="hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
                    {item.nama}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Tautan Cepat */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-gold-400 border-b border-emerald-800/60 pb-2">
              Tautan Cepat
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/tentang" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
                  Visi & Misi Yayasan
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
                  Berita & Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/ppdb" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
                  Informasi PPDB Online
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500/60" />
                  Galeri Foto & Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Lokasi */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-lg text-gold-400 border-b border-emerald-800/60 pb-2">
              Kontak & Lokasi
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-emerald-200/90">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <span>{settings?.alamat}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{settings?.telepon}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{settings?.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p>© {new Date().getFullYear()} {settings?.namaYayasan}. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/privasi" className="hover:text-gold-400 transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat" className="hover:text-gold-400 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
