"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { KontakForm } from "@/features/kontak/KontakForm";
import { useSettings } from "@/lib/settingsContext";

export default function KontakPage() {
  const { settings } = useSettings();

  return (
    <main className="flex-1 py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-500/20">
            Hubungi Kami
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-foreground mt-3">
            Kontak & Lokasi Kampus Sekolah
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Silakan hubungi tim sekretariat atau panitia PPDB kami untuk pertanyaan seputar pendaftaran dan informasi sekolah.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Info & Map (Left Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-sm text-foreground">Alamat Kampus</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {settings?.alamat}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="w-9 h-9 rounded-lg bg-gold-100 text-gold-800 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-sm text-foreground">Telepon / WhatsApp</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {settings?.telepon}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-sm text-foreground">Email Resmi</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {settings?.email}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="w-9 h-9 rounded-lg bg-gold-100 text-gold-800 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-sm text-foreground">Jam Operasional</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Senin - Jumat: 07.30 - 15.30 WIB<br />Sabtu: 08.00 - 12.00 WIB
                </p>
              </div>
            </div>

            {/* Embedded Google Maps Placeholder */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-border bg-emerald-950/10 relative">
              <iframe
                title="Peta Lokasi Sekolah"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.81956135000001!3d-6.194741399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x6b45e6782db59a02!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>

          </div>

          {/* Contact Form (Right Col 5) */}
          <div className="lg:col-span-5">
            <KontakForm />
          </div>

        </div>

      </div>
    </main>
  );
}
