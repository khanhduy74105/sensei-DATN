import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-").map(part => parseInt(part.trim()));
    return `${year}-${month}`;
}