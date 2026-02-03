import React, { useState } from "react";

function Calendar({ selectedDate, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const generateCalendarDays = () => {
    const days = [];
    const startDay = startOfMonth.getDay(); // Sunday = 0
    const totalDays = endOfMonth.getDate();

    // Fill blank days at start
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isSameDay = (d1, d2) =>
    d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  return (
    <div className="border rounded-lg p-3 w-full max-w-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
          ◀
        </button>
        <div className="font-semibold">
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </div>
        <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
          ▶
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-xs font-medium mb-1">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((day, idx) =>
          day ? (
            <button
              key={idx}
              onClick={() => onSelect && onSelect(day)}
              className={`p-2 rounded-full hover:bg-teal-100 ${
                isSameDay(day, selectedDate) ? "bg-teal-500 text-white" : ""
              }`}
            >
              {day.getDate()}
            </button>
          ) : (
            <div key={idx}></div>
          )
        )}
      </div>
    </div>
  );
}

export { Calendar };