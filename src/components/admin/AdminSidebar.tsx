"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  Trophy, 
  Mail, 
  Users, 
  Settings,
  LogOut,
  ShieldCheck,
  BookOpen,
  UserCheck,
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const pathname = usePathname();
  const { profile, logout, isYayasanAdmin } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Pendaftaran PPDB", href: "/admin/ppdb", icon: GraduationCap },
    { label: "Kelola Berita", href: "/admin/berita", icon: Newspaper },
    { label: "Kelola Agenda", href: "/admin/agenda", icon: Calendar },
    { label: "Kelola Galeri", href: "/admin/galeri", icon: ImageIcon },
    { label: "Kelola Prestasi", href: "/admin/prestasi", icon: Trophy },
    { label: "Kelola Program", href: "/admin/program", icon: BookOpen },
    { label: "Dewan Guru", href: "/admin/guru", icon: UserCheck },
    { label: "Data Siswa", href: "/admin/siswa", icon: Users },
    { label: "Pengurus Organisasi", href: "/admin/pengurus", icon: UserCheck },
    { label: "Profil Jenjang", href: "/admin/jenjang", icon: GraduationCap },
    { label: "Pesan Kontak", href: "/admin/pesan-kontak", icon: Mail },
  ];

  if (isYayasanAdmin) {
    navItems.push(
      { label: "Manajemen Admin", href: "/admin/users", icon: Users },
      { label: "Pengaturan Global", href: "/admin/settings", icon: Settings }
    );
  }

  return (
    <aside className="w-64 bg-emerald-950 text-emerald-100 border-r border-gold-500/20 flex flex-col justify-between shrink-0 hidden md:flex min-h-screen">
      <div className="p-6 space-y-6">
        
        {/* Admin Header Logo */}
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-500 text-emerald-950 flex items-center justify-center font-heading font-bold text-lg shadow-sm">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base leading-tight text-white">
              Admin Portal
            </span>
            <span className="text-[10px] text-gold-400 font-medium">
              Yayasan Islam Terpadu
            </span>
          </div>
        </Link>

        {/* User Info Badge */}
        {profile && (
          <div className="p-3 rounded-xl bg-emerald-900/60 border border-gold-500/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate">{profile.nama}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            </div>
            <p className="text-[10px] text-emerald-300 font-mono">
              Role: <span className="font-semibold uppercase text-gold-300">{profile.role}</span>
              {profile.jenjangId && ` (${profile.jenjangId.toUpperCase()})`}
            </p>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1 pt-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-gold-500 text-emerald-950 shadow-sm"
                    : "text-emerald-200/80 hover:bg-emerald-900/80 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-emerald-900">
        <Button
          variant="ghost"
          onClick={() => logout()}
          className="w-full justify-start text-xs font-semibold text-emerald-300 hover:bg-emerald-900 hover:text-white gap-2.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-destructive" />
          <span>Keluar (Logout)</span>
        </Button>
      </div>
    </aside>
  );
}
