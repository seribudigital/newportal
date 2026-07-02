import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-lg p-1">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-gold-400 flex items-center justify-center font-heading text-xl font-bold border border-gold-500/30 shadow-sm transition-transform group-hover:scale-105">
        Y
      </div>
      <div className="flex flex-col text-left">
        <span className="font-heading font-bold text-lg leading-tight text-emerald-900 group-hover:text-emerald-700 transition-colors">
          Al-Hikmah
        </span>
        <span className="text-[11px] font-sans text-muted-foreground tracking-wide font-medium">
          Yayasan Islam Terpadu
        </span>
      </div>
    </Link>
  );
}
