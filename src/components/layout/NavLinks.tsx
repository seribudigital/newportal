"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JENJANG_MENU_ITEMS } from "./JenjangDropdown";

interface NavLinksProps {
  onLinkClick?: () => void;
  className?: string;
}

export function NavLinks({ onLinkClick, className = "" }: NavLinksProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <nav className="flex items-center gap-1 md:gap-2 lg:gap-5" aria-label="Navigasi Utama">
      <Link
        href="/"
        onClick={onLinkClick}
        className="px-2.5 py-2 text-sm font-medium text-foreground hover:text-emerald-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        Beranda
      </Link>

      <Link
        href="/tentang"
        onClick={onLinkClick}
        className="px-2.5 py-2 text-sm font-medium text-foreground hover:text-emerald-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        Tentang
      </Link>

      {/* Dropdown Jenjang Desktop */}
      <div className="relative hidden md:block">
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger className="flex items-center gap-1 px-2.5 py-2 text-sm font-medium text-foreground hover:text-emerald-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer">
            <span>Jenjang</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown ? "rotate-180" : ""}`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-1 bg-card border-emerald-900/10 shadow-lg rounded-xl">
            {JENJANG_MENU_ITEMS.map((item) => (
              <DropdownMenuItem key={item.id} className="p-0">
                <Link
                  href={`/jenjang/${item.slug}`}
                  onClick={onLinkClick}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900"
                >
                  <span className="font-medium">{item.nama}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link
        href="/agenda"
        onClick={onLinkClick}
        className="px-2.5 py-2 text-sm font-medium text-foreground hover:text-emerald-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        Agenda
      </Link>

      <Link
        href="/prestasi"
        onClick={onLinkClick}
        className="px-2.5 py-2 text-sm font-medium text-foreground hover:text-emerald-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        Prestasi
      </Link>

      <Link
        href="/berita"
        onClick={onLinkClick}
        className="px-2.5 py-2 text-sm font-medium text-foreground hover:text-emerald-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        Berita
      </Link>

      <Link
        href="/galeri"
        onClick={onLinkClick}
        className="px-2.5 py-2 text-sm font-medium text-foreground hover:text-emerald-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        Galeri
      </Link>

      <Link
        href="/kontak"
        onClick={onLinkClick}
        className="px-2.5 py-2 text-sm font-medium text-foreground hover:text-emerald-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        Kontak
      </Link>
    </nav>
  );
}
