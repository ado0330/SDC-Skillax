import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Deterministically formats an ISO date string as 'DD Mon YYYY' in UTC.
 * Prevents SSR/Client locale hydration mismatch (e.g. 'Sept' vs 'Sep').
 */
export function formatDisplayDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = d.getUTCDate();
    const month = MONTH_NAMES[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}
