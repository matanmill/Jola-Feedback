import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'Unknown date';
  }
}

export function getFirstNWords(text: string, n: number = 3): string {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  return words.slice(0, n).join(' ');
}
