"use client";
import Header from "./Header";
import { usePathname } from "next/navigation";

// Only render the full header on public (non-dashboard) routes
export default function HeaderWrapper() {
  const pathname = usePathname();
  // Hide header on any route that starts with these (including subroutes)
  const isInternal = /^\/(dashboard|appointments|messages)(\/|$)/.test(pathname);
  if (isInternal) return null;
  return <Header />;
} 