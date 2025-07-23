'use client'

import { Card } from "@/components/ui/card";
import Image from "next/image";

interface DashboardBannerProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  imageUrl: string;
}

export default function DashboardBanner({ title, description, buttonText, onButtonClick, imageUrl }: DashboardBannerProps) {
  return (
    <Card className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg">
      <div>
        <div className="text-white text-lg font-semibold mb-1">{title}</div>
        <div className="text-white text-sm mb-3">{description}</div>
        <button onClick={onButtonClick} className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-blue-50 transition">{buttonText}</button>
      </div>
      <div className="hidden md:block">
        <Image src={imageUrl} alt="Banner" width={64} height={64} className="rounded-full object-cover border-4 border-blue-200" />
      </div>
    </Card>
  );
} 