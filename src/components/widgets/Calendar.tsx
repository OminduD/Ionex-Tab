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
    <div className="p-4 h-full flex flex-col relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 blur-2xl pointer-events-none" />
      
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
          style={{ color: 'var(--primary-color)' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        <motion.div
          key={monthName}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-bold text-base bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent px-3"
        >
          {monthName}
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(1)}
          className="p-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
          style={{ color: 'var(--accent-color)' }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-xs flex-1 relative z-10">
        {/* Week days */}
        {weekDays.map((day, i) => (
          <div 
            key={i} 
            className="text-center font-bold pb-2 text-[10px]"
            style={{ color: 'var(--accent-color)' }}
          >
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
            whileHover={day ? { 
              scale: 1.15, 
              backgroundColor: 'rgba(255,255,255,0.15)',
              boxShadow: '0 0 20px rgba(var(--primary-color-rgb), 0.4)'
            } : {}}
            className={`text-center py-2 rounded-lg transition-all cursor-pointer ${
              isToday(day)
                ? 'bg-gradient-to-br from-primary via-secondary to-accent text-white font-extrabold shadow-2xl ring-2 ring-white/20'
                : day
                ? 'text-white/80 hover:text-white hover:bg-white/5 backdrop-blur-sm'
                : 'opacity-0'
            }`}
            style={isToday(day) ? {
              boxShadow: `0 0 30px var(--primary-color), 0 0 60px var(--accent-color)`
            } : {}}
          >
            {day || ''}
          </motion.div>
        ))}
      </div>

      {/* Today indicator with gradient */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center text-[10px] mt-3 pt-3"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <span className="text-white/60">Today: </span>
        <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </motion.div>
    </div>
  );
};

export default Calendar;
