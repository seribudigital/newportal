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
  Code,
  Sparkles,
  RemoveFormatting
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [showCodeMode, setShowCodeMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Initialize and sync contenteditable div with value prop
  useEffect(() => {
    if (!editorRef.current) return;
    if (isUpdatingRef.current) return;

    const formatted = parseAndEnsureParagraphs(value || "");
    if (editorRef.current.innerHTML !== formatted) {
      editorRef.current.innerHTML = formatted;
    }
  }, [value, showCodeMode]);

  const handleInput = () => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const html = editorRef.current.innerHTML;
    onChange(html);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };

  // Execute browser formatting command
  const execCmd = (command: string, arg: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  // Format paragraph block (h2, h3, p)
  const formatBlock = (tag: string) => {
    execCmd("formatBlock", tag);
  };

  // Convert raw text to HTML paragraphs
  const handleAutoFormatParagraphs = () => {
    const formatted = parseAndEnsureParagraphs(value);
    onChange(formatted);
    if (editorRef.current) {
      editorRef.current.innerHTML = formatted;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-destructive">*</span>}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
            WYSIWYG Live Editor
          </span>
        </label>

        {/* Toggle Code / Visual Mode */}
        <button
          type="button"
          onClick={() => setShowCodeMode(!showCodeMode)}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold self-start sm:self-auto cursor-pointer"
        >
          <Code className="w-3.5 h-3.5" />
          <span>{showCodeMode ? "Kembali ke WYSIWYG Visual" : "Edit Kode HTML Raw"}</span>
        </button>
      </div>

      <div className="border border-input rounded-2xl overflow-hidden bg-background shadow-xs focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
        {/* WYSIWYG Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/60 border-b border-border text-xs">
          {/* Quick Paragraph Formatter */}
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleAutoFormatParagraphs}
            className="bg-gold-500/20 text-gold-800 dark:text-gold-300 border-gold-500/40 hover:bg-gold-500/30 text-[11px] font-bold gap-1 rounded-lg"
            title="Otomatis rapikan spasi & paragraf"
          >
            <Wand2 className="w-3.5 h-3.5 text-gold-600" />
            <span>⚡ Rapikan Paragraf</span>
          </Button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Heading Style Dropdown */}
          <button
            type="button"
            onClick={() => formatBlock("p")}
            className="p-1.5 px-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs font-semibold"
            title="Paragraf Biasa"
          >
            Paragraf
          </button>

          <button
            type="button"
            onClick={() => formatBlock("h2")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-0.5"
            title="Judul Utama (Heading 2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => formatBlock("h3")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-0.5"
            title="Subjudul (Heading 3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Text Style: Bold, Italic, Underline */}
          <button
            type="button"
            onClick={() => execCmd("bold")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Tebal (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("italic")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Cetak Miring (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("underline")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Garis Bawah (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCmd("insertUnorderedList")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Daftar Poin (Bullet List)"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("insertOrderedList")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Daftar Angka (Numbered List)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Alignments */}
          <button
            type="button"
            onClick={() => execCmd("justifyLeft")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Rata Kiri"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("justifyCenter")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Rata Tengah"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("justifyRight")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Rata Kanan"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("justifyFull")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Rata Kiri Kanan (Justify)"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Remove Format */}
          <button
            type="button"
            onClick={() => execCmd("removeFormat")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Hapus Format Teks"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Body */}
        {showCodeMode ? (
          <textarea
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 text-xs font-mono bg-background text-foreground focus:outline-none leading-relaxed resize-y"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="prose prose-emerald max-w-none p-4 min-h-[280px] focus:outline-none bg-background text-foreground leading-relaxed prose-p:mb-4 prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground"
            style={{ minHeight: "280px" }}
          />
        )}
      </div>
    </div>
  );
}
