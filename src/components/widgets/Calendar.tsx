import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [days, setDays] = useState<(number | null)[]>([]);

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

  const today = date.getDate();
  const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (delta: number) => {
    setDate(new Date(date.getFullYear(), date.getMonth() + delta, 1));
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const now = new Date();
    return (
      day === today &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-theme-primary" />
        </motion.button>
        
        <motion.div
          key={monthName}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          {monthName}
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-theme-primary" />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-xs flex-1">
        {/* Week days */}
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-theme-accent font-semibold pb-1 text-[10px]">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            whileHover={day ? { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
            className={`text-center py-1.5 rounded-lg transition-all cursor-pointer ${
              isToday(day)
                ? 'bg-gradient-to-br from-primary to-accent text-white font-bold shadow-lg'
                : day
                ? 'text-white/80 hover:text-white'
                : 'opacity-0'
            }`}
          >
            {day || ''}
          </motion.div>
        ))}
      </div>

      {/* Today indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="text-center text-[10px] text-white/60 mt-2 border-t border-white/10 pt-2"
      >
        Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </motion.div>
    </div>
  );
};

export default Calendar;
