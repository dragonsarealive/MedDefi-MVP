"use client"

import React, { useState } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  isBefore,
  isAfter,
  isWeekend,
  startOfDay,
} from "date-fns"

interface CalendarProps {
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  minDate?: Date // earliest allowed month (inclusive)
  className?: string
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate: controlledSelected,
  onDateChange,
  minDate = new Date(),
  className = "",
}) => {
  // Internal state for month/year and selected date
  const today = startOfDay(new Date())
  const initialMonth = controlledSelected ? startOfMonth(controlledSelected) : startOfMonth(today)
  const [currentMonth, setCurrentMonth] = useState(initialMonth)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(controlledSelected)
  const [animating, setAnimating] = useState<"left" | "right" | null>(null)

  // Sync controlled selectedDate
  React.useEffect(() => {
    if (controlledSelected && !isSameDay(controlledSelected, selectedDate)) {
      setSelectedDate(controlledSelected)
      if (!isSameMonth(controlledSelected, currentMonth)) {
        setCurrentMonth(startOfMonth(controlledSelected))
      }
    }
    // eslint-disable-next-line
  }, [controlledSelected])

  // Helpers
  function handlePrevMonth() {
    const prev = subMonths(currentMonth, 1)
    if (isBefore(prev, startOfMonth(minDate))) return
    setAnimating("left")
    setTimeout(() => {
      setCurrentMonth(prev)
      setAnimating(null)
    }, 180)
  }
  function handleNextMonth() {
    setAnimating("right")
    setTimeout(() => {
      setCurrentMonth(addMonths(currentMonth, 1))
      setAnimating(null)
    }, 180)
  }

  function handleDateClick(date: Date) {
    if (isBefore(date, today)) return
    setSelectedDate(date)
    onDateChange?.(date)
  }

  // Generate all days for the current month grid
  function getMonthGrid(month: Date) {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
    const days: Date[] = []
    let d = start
    while (d <= end) {
      days.push(d)
      d = addDays(d, 1)
    }
    return days
  }

  const days = getMonthGrid(currentMonth)
  const monthLabel = format(currentMonth, "MMMM yyyy")
  const canGoPrev = !isBefore(subMonths(currentMonth, 1), startOfMonth(minDate))

  return (
    <div
      className={`w-full max-w-xs sm:max-w-sm md:max-w-md py-2 px-4 rounded-2xl shadow-lg bg-white select-none ${className}`}
    >
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-2">
        <button
          className={`p-2 rounded hover:bg-blue-100 transition disabled:opacity-30 disabled:cursor-not-allowed`}
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          aria-label="Previous Month"
        >
          &lt;
        </button>
        <span className="font-semibold text-lg">{monthLabel}</span>
        <button
          className="p-2 rounded hover:bg-blue-100 transition"
          onClick={handleNextMonth}
          aria-label="Next Month"
        >
          &gt;
        </button>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-1 text-center text-xs font-medium text-gray-500">
        {WEEKDAYS.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>
      {/* Days grid with animation */}
      <div
        className={`grid grid-cols-7 gap-1 transition-all duration-200 ease-in-out ${
          animating === "left"
            ? "-translate-x-8 opacity-0"
            : animating === "right"
            ? "translate-x-8 opacity-0"
            : "opacity-100"
        }`}
        style={{ minHeight: 6 * 40 }}
      >
        {days.map((date, idx) => {
          const isCurrentMonth = isSameMonth(date, currentMonth)
          const isPast = isBefore(date, today)
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const isTodayDate = isToday(date)
          const isWeekendDay = isWeekend(date)
          const isOtherMonth = !isCurrentMonth
          return (
            <button
              key={date.toISOString()}
              className={`w-9 h-9 flex items-center justify-center mx-auto my-1 rounded-full text-sm font-medium
                transition-all duration-150
                ${isOtherMonth ? "text-gray-400" : ""}
                ${isWeekendDay && isCurrentMonth ? "text-blue-500" : ""}
                ${isTodayDate && isCurrentMonth ? "bg-blue-500 text-white" : ""}
                ${isSelected && isCurrentMonth ? "ring-2 ring-blue-400 bg-blue-100 text-blue-900" : ""}
                ${isPast || isOtherMonth ? "cursor-not-allowed opacity-50" : "hover:bg-blue-100 cursor-pointer"}
              `}
              onClick={() => handleDateClick(date)}
              disabled={isPast || isOtherMonth}
              tabIndex={isOtherMonth ? -1 : 0}
              aria-label={format(date, "yyyy-MM-dd")}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
} 