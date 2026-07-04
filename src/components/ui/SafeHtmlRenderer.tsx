"use client";

import DOMPurify from "isomorphic-dompurify";
import { parseAndEnsureParagraphs } from "@/components/admin/RichTextEditor";

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

export function SafeHtmlRenderer({ html, className = "" }: SafeHtmlRendererProps) {
  const formattedContent = parseAndEnsureParagraphs(html || "");

  const sanitizedHtml = DOMPurify.sanitize(formattedContent, {
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'u', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'rel', 'style'],
  });

  return (
    <div
      className={`prose prose-emerald max-w-none prose-p:leading-relaxed prose-p:mb-4 prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
