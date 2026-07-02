import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BrandLogo } from "./BrandLogo";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-card/90 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <BrandLogo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
          
          {/* CTA PPDB Link styled as Button */}
          <Link
            href="/ppdb"
            className={buttonVariants({ variant: "default", size: "default" }) + " bg-primary hover:bg-emerald-800 text-white font-semibold shadow-xs px-5 rounded-lg"}
          >
            PPDB Online
          </Link>
        </div>

        {/* Mobile Navigation Drawer Toggle */}
        <MobileNav />
      </div>
    </header>
  );
}
