import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

import { CalendarEvent } from '../../types';

interface CalendarProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
  events?: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ size = 'medium', theme = 'aurora', events = [] }) => {
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

  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isSmall = size === 'small';

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`h-full flex flex-col relative overflow-hidden ${isSmall ? 'p-2' : 'p-3'} rounded-3xl ${containerStyle}`}
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
      <div className="relative z-10 grid grid-cols-7 gap-1 flex-1 content-start overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40">
        {/* Week Days */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] font-medium text-white/40 uppercase tracking-wider">
            {day}
          </div>
        ))}

        {/* Days */}
        <AnimatePresence mode='wait' custom={date.getMonth()}>
          <motion.div
            key={date.getMonth()}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="contents"
          >
            {days.map((day, i) => (
              <div key={i} className="aspect-square flex items-center justify-center perspective-500">
                {day && (
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      rotateX: 10,
                      rotateY: 10,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full h-full flex items-center justify-center rounded-xl text-xs font-medium transition-all relative group backdrop-blur-md border border-white/5 shadow-sm ${isToday(day)
                      ? 'text-white font-bold bg-white/10'
                      : 'text-white/80 hover:bg-white/10'
                      }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {isToday(day) && (
                      <motion.div
                        layoutId="today-glow"
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary opacity-80 shadow-[0_0_20px_rgba(var(--primary-color-rgb),0.6)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 drop-shadow-md">{day}</span>

                    {/* Event Dots */}
                    {getEventsForDay(day).length > 0 && (
                      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                        {getEventsForDay(day).slice(0, 3).map((_, idx) => (
                          <div key={idx} className={`w-1 h-1 rounded-full ${isToday(day) ? 'bg-white' : 'bg-cyan-400'} shadow-sm`} />
                        ))}
                      </div>
                    )}

                    {/* Tooltip for events */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 hidden group-hover:block">
                      {getEventsForDay(day).length > 0 ? (
                        <div className="space-y-1">
                          {getEventsForDay(day).map(e => (
                            <div key={e.id} className="text-[10px] text-white truncate">• {e.title}</div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">No events</div>
                      )}
                    </div>

                    {/* Glass Reflection */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.button>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Calendar;
