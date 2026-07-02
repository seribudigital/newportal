import Link from "next/link";
import type { JenjangId } from "@/types";

export interface JenjangMenuItem {
  id: JenjangId;
  nama: string;
  slug: string;
  badge: string;
  badgeColor: string;
}

export const JENJANG_MENU_ITEMS: JenjangMenuItem[] = [
  { id: "tkit", nama: "TKIT (Usia Dini)", slug: "tkit", badge: "PAUD", badgeColor: "bg-tkit-bg text-tkit border-tkit/30" },
  { id: "sdit", nama: "SDIT (Sekolah Dasar)", slug: "sdit", badge: "SD", badgeColor: "bg-sdit-bg text-sdit border-sdit/30" },
  { id: "mts", nama: "MTs (Menengah Pertama)", slug: "mts", badge: "MTs", badgeColor: "bg-mts-bg text-mts border-mts/30" },
  { id: "ma", nama: "MA (Menengah Atas)", slug: "ma", badge: "MA", badgeColor: "bg-ma-bg text-ma border-ma/30" },
];

interface JenjangDropdownProps {
  onSelect?: () => void;
}

export function JenjangDropdown({ onSelect }: JenjangDropdownProps) {
  return (
    <div className="py-2 px-1 grid grid-cols-1 gap-1 min-w-[220px]">
      {JENJANG_MENU_ITEMS.map((item) => (
        <Link
          key={item.id}
          href={`/jenjang/${item.slug}`}
          onClick={onSelect}
          className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-emerald-50 hover:text-emerald-900 transition-colors focus:bg-emerald-50 focus:outline-none"
        >
          <span>{item.nama}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold uppercase ${item.badgeColor}`}>
            {item.badge}
          </span>
        </Link>
      ))}
    </div>
  );
}
