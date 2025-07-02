"use client";
import Header from "./Header";
import { usePathname } from "next/navigation";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  if (isDashboard) return null;
  return <Header />;
} 