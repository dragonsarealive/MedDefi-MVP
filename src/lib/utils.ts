import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shortens a wallet address to show first 6 and last 4 characters
 * @param address - The full wallet address
 * @returns Shortened address format (e.g., "0x1234...abcd")
 */
export function shortenAddress(address: string): string {
  if (!address || address.length < 10) {
    return address;
  }
  
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
} 