"use client";

import { SafeHtmlRenderer } from "@/components/ui/SafeHtmlRenderer";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="space-y-2">
      <textarea
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "<p>Tulis paragraf berita/konten di sini...</p>"}
        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-input bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
      />

      {/* Real-time Sanitized HTML Preview Box */}
      {value && (
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Pratinjau Hasil Teks Ter-Sanitasi (Live XSS-Safe Preview):
          </span>
          <SafeHtmlRenderer html={value} className="text-xs" />
        </div>
      )}
    </div>
  );
}
