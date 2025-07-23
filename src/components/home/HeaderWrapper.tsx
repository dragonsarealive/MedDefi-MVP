"use client";
import NavBarbig from "../layout/NavBarbig";
import { usePathname } from "next/navigation";

// Only render the full header on public (non-dashboard) routes
export default function HeaderWrapper() {
  const pathname = usePathname();
  // Hide header on doctor and patient routes (including subroutes)
  const isInternal = /^\/(doctor|patient)(\/|$)/.test(pathname);
  if (isInternal) return null;
  return <NavBarbig />;
} 