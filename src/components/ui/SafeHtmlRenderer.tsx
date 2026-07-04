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
      className={`prose prose-emerald max-w-none text-foreground leading-relaxed [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-heading [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-foreground [&_h3]:text-xl [&_h3]:font-bold [&_h3]:font-heading [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
