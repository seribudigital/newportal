"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { JENJANG_MENU_ITEMS } from "./JenjangDropdown";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [jenjangOpen, setJenjangOpen] = useState(true);

  return (
    <div className="md:hidden">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
        aria-expanded={isOpen}
        className="text-foreground hover:bg-emerald-50 hover:text-emerald-800"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[65px] bg-card/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xl p-6 z-50 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2" aria-label="Navigasi Mobile">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-emerald-50 text-foreground"
            >
              Beranda
            </Link>

            <Link
              href="/tentang"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-emerald-50 text-foreground"
            >
              Tentang
            </Link>

            {/* Accordion Jenjang Mobile */}
            <div className="flex flex-col rounded-xl bg-emerald-50/50 p-2">
              <button
                onClick={() => setJenjangOpen(!jenjangOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-base font-semibold text-emerald-900 cursor-pointer"
              >
                <span>Jenjang Pendidikan</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${jenjangOpen ? "rotate-180" : ""}`} />
              </button>

              {jenjangOpen && (
                <div className="flex flex-col gap-1 mt-1 pl-2">
                  {JENJANG_MENU_ITEMS.map((item) => (
                    <Link
                      key={item.id}
                      href={`/jenjang/${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg hover:bg-white text-foreground"
                    >
                      <span>{item.nama}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/berita"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-emerald-50 text-foreground"
            >
              Berita & Agenda
            </Link>

            <Link
              href="/galeri"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-emerald-50 text-foreground"
            >
              Galeri Kegiatan
            </Link>

            <Link
              href="/kontak"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-base font-medium rounded-lg hover:bg-emerald-50 text-foreground"
            >
              Kontak
            </Link>
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link
              href="/ppdb"
              onClick={() => setIsOpen(false)}
              className={buttonVariants({ variant: "default" }) + " w-full bg-primary hover:bg-emerald-800 text-white font-semibold shadow-xs justify-center"}
            >
              PPDB Online
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
