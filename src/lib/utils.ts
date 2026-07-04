import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDate(dateVal: any): Date | null {
  if (!dateVal) return null;
  if (typeof dateVal.toDate === 'function') {
    return dateVal.toDate();
  }
  if (typeof dateVal.seconds === 'number') {
    return new Date(dateVal.seconds * 1000);
  }
  if (typeof dateVal === 'string' || typeof dateVal === 'number') {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) return d;
  }
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    return dateVal;
  }
  return null;
}

export function formatDate(dateVal: any, includeTime = false): string {
  const d = parseDate(dateVal);
  if (!d) return '-';
  
  if (includeTime) {
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function toDatetimeLocalString(dateVal: any): string {
  const d = parseDate(dateVal);
  if (!d) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}

