import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface CalendarProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const Calendar: React.FC<CalendarProps> = ({ size = 'medium', theme = 'aurora' }) => {
  const [date, setDate] = useState(new Date());
  const [days, setDays] = useState<(number | null)[]>([]);
  const { variants, containerStyle } = useThemeAnimation(theme);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
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

  const today = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const changeMonth = (delta: number) => {
    setDate(new Date(date.getFullYear(), date.getMonth() + delta, 1));
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      day === today &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  };

  const isSmall = size === 'small';

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-4'} rounded-3xl ${containerStyle}`}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(-1)}
          className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        <span className={`font-bold text-white tracking-wide ${isSmall ? 'text-xs' : 'text-sm'}`}>
          {monthName}
        </span>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(1)}
          className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-7 gap-1 flex-1 content-start">
        {/* Week Days */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-white/40 uppercase tracking-wider">
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {day && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full h-full flex items-center justify-center rounded-lg text-xs font-medium transition-all ${isToday(day)
                  ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_10px_rgba(var(--primary-color-rgb),0.5)]'
                  : 'text-white/80 hover:bg-white/10'
                  }`}
              >
                {day}
              </motion.button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Calendar;
