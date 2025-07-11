import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface CategoryChipProps {
  label: string;
  icon: ReactNode;
  colorClass?: string; // e.g. 'bg-pink-100 text-pink-700'
}

export default function CategoryChip({ label, icon, colorClass = "bg-blue-100 text-blue-700" }: CategoryChipProps) {
  return (
    <Card className={`flex flex-col items-center justify-center px-4 py-3 gap-1 rounded-2xl shadow-sm min-w-[80px] ${colorClass}`} tabIndex={0} role="button">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium mt-1">{label}</span>
    </Card>
  );
} 