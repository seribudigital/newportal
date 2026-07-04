"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading2, 
  Heading3, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Wand2, 
  Eye, 
  Code,
  Type
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeHtmlRenderer } from "@/components/ui/SafeHtmlRenderer";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function parseAndEnsureParagraphs(content: string): string {
  if (!content) return "";
  
  // Check if string contains HTML tags like <p>, <div>, <h2>, <br>, <ul>, <li>, <b>, <i>, <u>, etc.
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
  
  if (hasHtmlTags) {
    return content;
  }
  
  // Split by double newlines into paragraphs
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
    
  if (paragraphs.length === 0) return "";

  return paragraphs
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

export function RichTextEditor({
  value,
  onChange,
  label = "Isi Konten / Berita",
  placeholder = "Tuliskan isi berita lengkap di sini...",
  required = false,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap selected text in textarea
  const wrapSelection = (openTag: string, closeTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const replacement = selectedText 
      ? `${openTag}${selectedText}${closeTag}`
      : `${openTag}teks${closeTag}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + (selectedText.length || 4));
    }, 50);
  };

  // Convert raw text into HTML paragraphs <p>
  const handleAutoFormatParagraphs = () => {
    const formatted = parseAndEnsureParagraphs(value);
    onChange(formatted);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "write"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Editor Teks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "preview"
                ? "bg-background text-emerald-800 dark:text-emerald-400 shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pratinjau Hasil (Live Preview)</span>
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <div className="border border-input rounded-2xl overflow-hidden bg-background shadow-xs focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/60 border-b border-border text-xs">
            {/* Auto Format Paragraph Button */}
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleAutoFormatParagraphs}
              className="bg-gold-500/20 text-gold-800 dark:text-gold-300 border-gold-500/40 hover:bg-gold-500/30 text-[11px] font-bold gap-1 rounded-lg"
              title="Otomatis bungkus paragraf teks mentah menjadi tag HTML <p>"
            >
              <Wand2 className="w-3.5 h-3.5 text-gold-600" />
              <span>⚡ Auto-Format Paragraf</span>
            </Button>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Headings */}
            <button
              type="button"
              onClick={() => wrapSelection("<h2>", "</h2>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-0.5"
              title="Judul Paragraf (Heading 2)"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection("<h3>", "</h3>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-0.5"
              title="Subjudul Paragraf (Heading 3)"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection("<p>", "</p>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-0.5 font-bold text-xs px-2"
              title="Bungkus Paragraf <p>"
            >
              <span>&lt;p&gt;</span>
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Text Style: Bold, Italic, Underline */}
            <button
              type="button"
              onClick={() => wrapSelection("<b>", "</b>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Tebal (Bold <b>)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection("<i>", "</i>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Cetak Miring (Italic <i>)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection("<u>", "</u>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Garis Bawah (Underline <u>)"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Lists */}
            <button
              type="button"
              onClick={() => wrapSelection("<ul>\n  <li>", "</li>\n</ul>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Daftar Poin (Bullet List <ul>)"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection("<ol>\n  <li>", "</li>\n</ol>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Daftar Angka (Numbered List <ol>)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Alignments */}
            <button
              type="button"
              onClick={() => wrapSelection('<p className="text-left">', "</p>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Rata Kiri"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection('<p className="text-center">', "</p>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Rata Tengah"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection('<p className="text-right">', "</p>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Rata Kanan"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => wrapSelection('<p className="text-justify">', "</p>")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Rata Kiri Kanan (Justify)"
            >
              <AlignJustify className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Line Break */}
            <button
              type="button"
              onClick={() => wrapSelection("", "<br />")}
              className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs font-semibold px-2"
              title="Garis Baru <br />"
            >
              &lt;br /&gt;
            </button>
          </div>

          {/* Text Area Input */}
          <textarea
            ref={textareaRef}
            rows={10}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 text-xs font-mono bg-background text-foreground focus:outline-none leading-relaxed resize-y"
          />
        </div>
      ) : (
        /* Live Preview Tab */
        <div className="border border-border rounded-2xl p-6 bg-card min-h-[250px] shadow-xs space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center justify-between">
            <span>Tampilan Akhir Pada Portal Publik:</span>
            <span className="text-emerald-700 font-semibold">Tampilan Sesuai CSS Portal</span>
          </div>
          <SafeHtmlRenderer html={value} />
        </div>
      )}
    </div>
  );
}
