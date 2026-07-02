"use client";

import DOMPurify from "isomorphic-dompurify";

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
}

export function SafeHtmlRenderer({ html, className = "" }: SafeHtmlRendererProps) {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'rel'],
  });

  return (
    <div
      className={`prose prose-emerald max-w-none prose-p:leading-relaxed prose-headings:font-heading prose-headings:font-bold ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
