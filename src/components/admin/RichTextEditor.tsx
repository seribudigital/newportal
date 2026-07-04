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
  RemoveFormatting,
  Indent,
  Outdent
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
  
  // Check if string contains HTML tags like <p>, <div>, <h2>, <h3>, <br>, <ul>, <ol>, <li>, <b>, <i>, <u>, etc.
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

  // Format Heading (H2 / H3) reliably across browsers
  const formatHeading = (tag: "h2" | "h3") => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    try {
      document.execCommand("formatBlock", false, `<${tag.toUpperCase()}>`);
    } catch {
      document.execCommand("formatBlock", false, tag);
    }

    // Fallback if node isn't converted
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let node: Node | null = selection.getRangeAt(0).commonAncestorContainer;
      if (node.nodeType === 3) node = node.parentElement;

      if (node && node instanceof HTMLElement && editorRef.current.contains(node)) {
        let block: HTMLElement = node;
        while (
          block.parentElement &&
          block.parentElement !== editorRef.current &&
          !["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "LI"].includes(block.tagName)
        ) {
          block = block.parentElement;
        }

        if (block && block !== editorRef.current && block.tagName !== tag.toUpperCase()) {
          const newEl = document.createElement(tag);
          newEl.innerHTML = block.innerHTML;
          block.replaceWith(newEl);
        }
      }
    }
    handleInput();
  };

  // Handle Tab key for paragraph indent / tabulation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        execCmd("outdent");
      } else {
        // Insert 4 non-breaking spaces for tab indent at cursor position
        document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
        handleInput();
      }
    }
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

          {/* Heading H2 & H3 */}
          <button
            type="button"
            onClick={() => formatHeading("h2")}
            className="p-1.5 px-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
            title="Judul Utama (Heading 2)"
          >
            <Heading2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>H2</span>
          </button>

          <button
            type="button"
            onClick={() => formatHeading("h3")}
            className="p-1.5 px-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
            title="Subjudul (Heading 3)"
          >
            <Heading3 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>H3</span>
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

          {/* Tabulation / Indent / Outdent */}
          <button
            type="button"
            onClick={() => execCmd("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;")}
            className="p-1.5 px-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 font-semibold text-xs"
            title="Masuk Paragraf / Tabulasi (Tab)"
          >
            <Indent className="w-4 h-4 text-emerald-700" />
            <span>Tab</span>
          </button>

          <button
            type="button"
            onClick={() => execCmd("outdent")}
            className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Kembali Rata Kiri (Outdent)"
          >
            <Outdent className="w-4 h-4" />
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
            onKeyDown={handleKeyDown}
            className="prose prose-emerald max-w-none p-4 min-h-[280px] focus:outline-none bg-background text-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-1 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-heading [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-foreground [&_h3]:text-xl [&_h3]:font-bold [&_h3]:font-heading [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground [&_p]:mb-4 [&_p]:leading-relaxed"
            style={{ minHeight: "280px" }}
          />
        )}
      </div>
    </div>
  );
}
