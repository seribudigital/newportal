"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
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
  
  // Check if string contains HTML tags
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

  // Active state for toolbar buttons
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    h2: false,
    h3: false,
    ul: false,
    ol: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    justify: false,
  });

  // Track cursor selection to highlight active toolbar buttons
  const updateActiveStates = useCallback(() => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    if (!editorRef.current.contains(sel.anchorNode)) return;

    try {
      const bold = document.queryCommandState("bold");
      const italic = document.queryCommandState("italic");
      const underline = document.queryCommandState("underline");
      const ul = document.queryCommandState("insertUnorderedList");
      const ol = document.queryCommandState("insertOrderedList");

      let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
      if (node.nodeType === 3) node = node.parentElement;

      let isH2 = false;
      let isH3 = false;
      let isLeft = false;
      let isCenter = false;
      let isRight = false;
      let isJustify = false;

      let current = node as HTMLElement | null;
      while (current && current !== editorRef.current) {
        const tag = current.tagName?.toUpperCase();
        if (tag === "H2") isH2 = true;
        if (tag === "H3") isH3 = true;

        const align = current.style?.textAlign || current.getAttribute("align") || "";
        if (align === "center" || current.classList?.contains("text-center")) isCenter = true;
        if (align === "right" || current.classList?.contains("text-right")) isRight = true;
        if (align === "justify" || current.classList?.contains("text-justify")) isJustify = true;
        if (align === "left" || current.classList?.contains("text-left")) isLeft = true;

        current = current.parentElement;
      }

      setActiveStates({
        bold,
        italic,
        underline,
        h2: isH2,
        h3: isH3,
        ul,
        ol,
        alignLeft: isLeft,
        alignCenter: isCenter,
        alignRight: isRight,
        justify: isJustify,
      });
    } catch {
      // ignore queryCommandState errors
    }
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveStates);
    return () => document.removeEventListener("selectionchange", updateActiveStates);
  }, [updateActiveStates]);

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
    updateActiveStates();
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

  // Toggle Heading (H2 / H3) specifically for highlighted text or line block
  const toggleHeading = (tag: "h2" | "h3") => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const selectedText = range.toString();

    let parent: Node | null = range.commonAncestorContainer;
    if (parent.nodeType === 3) parent = parent.parentElement;

    let existingHeading: HTMLElement | null = null;
    let curr = parent as HTMLElement | null;
    while (curr && curr !== editorRef.current) {
      if (curr.tagName === "H2" || curr.tagName === "H3") {
        existingHeading = curr;
        break;
      }
      curr = curr.parentElement;
    }

    if (existingHeading) {
      // Toggle OFF: Unwrap heading element back to plain text
      const parentEl = existingHeading.parentElement;
      if (parentEl) {
        while (existingHeading.firstChild) {
          parentEl.insertBefore(existingHeading.firstChild, existingHeading);
        }
        parentEl.removeChild(existingHeading);
      }
    } else if (selectedText.trim().length > 0) {
      // Wrap ONLY the highlighted text into heading tag
      const headingEl = document.createElement(tag);
      headingEl.className =
        tag === "h2"
          ? "font-heading font-bold text-2xl text-foreground my-3"
          : "font-heading font-bold text-xl text-foreground my-2";

      try {
        range.surroundContents(headingEl);
      } catch {
        const html = range.cloneContents();
        const div = document.createElement("div");
        div.appendChild(html);
        document.execCommand(
          "insertHTML",
          false,
          `<${tag} class="${headingEl.className}">${div.innerHTML}</${tag}>`
        );
      }
    } else {
      // Full line block format if cursor is just placed on line
      try {
        document.execCommand("formatBlock", false, `<${tag.toUpperCase()}>`);
      } catch {
        document.execCommand("formatBlock", false, tag);
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
    updateActiveStates();
  };

  // Active button helper class
  const getBtnClass = (isActive: boolean) =>
    `p-1.5 rounded-lg transition-all cursor-pointer ${
      isActive
        ? "bg-primary text-white shadow-xs font-bold ring-2 ring-primary/30"
        : "hover:bg-background text-muted-foreground hover:text-foreground"
    }`;

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

      <div className="relative border border-input rounded-2xl overflow-hidden bg-background shadow-xs focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all max-h-[560px] flex flex-col">
        
        {/* STICKY TOP TOOLBAR */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 bg-muted/95 backdrop-blur-xs border-b border-border text-xs shrink-0">
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

          {/* Heading H2 & H3 Badges */}
          <button
            type="button"
            onClick={() => toggleHeading("h2")}
            className={`px-2.5 py-1 rounded-lg font-heading font-extrabold text-xs transition-all cursor-pointer ${
              activeStates.h2
                ? "bg-primary text-white shadow-xs ring-2 ring-primary/30"
                : "hover:bg-background text-emerald-800 dark:text-emerald-400"
            }`}
            title="Judul Utama (Heading 2) - Berlaku untuk teks terblok"
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => toggleHeading("h3")}
            className={`px-2.5 py-1 rounded-lg font-heading font-extrabold text-xs transition-all cursor-pointer ${
              activeStates.h3
                ? "bg-primary text-white shadow-xs ring-2 ring-primary/30"
                : "hover:bg-background text-emerald-800 dark:text-emerald-400"
            }`}
            title="Subjudul (Heading 3) - Berlaku untuk teks terblok"
          >
            H3
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Text Style: Bold, Italic, Underline */}
          <button
            type="button"
            onClick={() => execCmd("bold")}
            className={getBtnClass(activeStates.bold)}
            title="Tebal (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("italic")}
            className={getBtnClass(activeStates.italic)}
            title="Cetak Miring (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("underline")}
            className={getBtnClass(activeStates.underline)}
            title="Garis Bawah (Underline)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCmd("insertUnorderedList")}
            className={getBtnClass(activeStates.ul)}
            title="Daftar Poin (Bullet List)"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("insertOrderedList")}
            className={getBtnClass(activeStates.ol)}
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
            className={getBtnClass(activeStates.alignLeft)}
            title="Rata Kiri"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("justifyCenter")}
            className={getBtnClass(activeStates.alignCenter)}
            title="Rata Tengah"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("justifyRight")}
            className={getBtnClass(activeStates.alignRight)}
            title="Rata Kanan"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd("justifyFull")}
            className={getBtnClass(activeStates.justify)}
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

        {/* EDITOR SCROLLABLE BODY AREA */}
        {showCodeMode ? (
          <textarea
            rows={14}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-4 text-xs font-mono bg-background text-foreground focus:outline-none leading-relaxed resize-y max-h-[480px] overflow-y-auto"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            onKeyUp={updateActiveStates}
            onMouseUp={updateActiveStates}
            onClick={updateActiveStates}
            onKeyDown={handleKeyDown}
            className="prose prose-emerald max-w-none p-4 min-h-[280px] max-h-[480px] overflow-y-auto focus:outline-none bg-background text-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-1 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-heading [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-foreground [&_h3]:text-xl [&_h3]:font-bold [&_h3]:font-heading [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground [&_p]:mb-4 [&_p]:leading-relaxed"
            style={{ minHeight: "280px" }}
          />
        )}
      </div>
    </div>
  );
}
