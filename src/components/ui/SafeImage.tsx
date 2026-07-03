"use client";

import { useState } from "react";
import { formatImageUrl } from "@/lib/utils/image";
import { Image as ImageIcon } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackText?: string;
}

export function SafeImage({ src, alt, fallbackText, className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);
  const formattedUrl = formatImageUrl(src);

  if (!formattedUrl || error) {
    if (fallbackText) {
      return (
        <div className="w-full h-full flex items-center justify-center text-emerald-800/40 font-heading font-bold text-2xl bg-emerald-100/40">
          {fallbackText}
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-emerald-950/20 text-muted-foreground/40 p-4 text-center">
        <ImageIcon className="w-8 h-8 opacity-40 mx-auto" />
      </div>
    );
  }

  return (
    <img
      src={formattedUrl}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
