import React, { useState, useEffect } from 'react';

const Calendar: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [days, setDays] = useState<(number | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }
    setDays(calendarDays);
  }, [date]);

  const today = date.getDate();
  const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="text-center font-bold mb-2 text-sm">{monthName}</div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center opacity-60 font-semibold">
            {day}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`text-center py-1 rounded ${
              day === today
                ? 'bg-white/20 font-bold'
                : day
                ? 'opacity-70'
                : 'opacity-0'
            }`}
          >
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
