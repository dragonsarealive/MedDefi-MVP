"use client"

import * as React from "react"
import { DayPicker, DayPickerProps } from "react-day-picker"
import "react-day-picker/dist/style.css"

export interface CalendarProps extends DayPickerProps {
  className?: string
}

export function Calendar({
  className = "",
  ...props
}: CalendarProps) {
  return (
    <div className={`w-full max-w-xs sm:max-w-sm md:max-w-md p-2 sm:p-4 rounded-2xl shadow-lg bg-white bento-calendar overflow-x-auto sm:overflow-x-visible ${className}`}>
      <DayPicker
        showOutsideDays
        modifiersClassNames={{
          selected: "bg-blue-600 text-white font-bold rounded-full",
          today: "border border-blue-400",
          weekend: "bento-capsule",
          saturday: "bento-capsule-sat",
        }}
        className="!border-none min-w-[340px]"
        {...props}
      />
      <style jsx global>{`
        .bento-calendar .rdp-day {
          border-radius: 9999px;
          padding: 0.5rem 0.75rem;
          margin: 0.1rem;
          transition: background 0.2s;
        }
        .bento-calendar .rdp-day_weekend {
          background: #f0f4ff;
          color: #2563eb;
        }
        .bento-calendar .rdp-day_saturday {
          background: #dbeafe;
          color: #1d4ed8;
        }
        .bento-calendar .rdp-day_selected {
          box-shadow: 0 2px 8px rgba(37,99,235,0.15);
        }
      `}</style>
    </div>
  )
} 