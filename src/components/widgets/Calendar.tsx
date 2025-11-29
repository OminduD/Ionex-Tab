import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeParticles } from '../ThemeParticles';

interface CalendarProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
}

const Calendar: React.FC<CalendarProps> = ({ theme = 'aurora', size = 'medium' }) => {
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

  const goToToday = () => {
    setDate(new Date());
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

  const isSmall = size === 'small';

  return (
    <div className={`${isSmall ? 'p-2' : 'p-4'} h-full flex flex-col relative overflow-hidden`}>
      {/* Theme Particles */}
      <ThemeParticles theme={theme} density="low" />
      
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 blur-2xl pointer-events-none" />
      
      {/* Header with navigation */}
      <div className={`flex items-center justify-between ${isSmall ? 'mb-1' : 'mb-3'} relative z-10`}>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(-1)}
          className="p-1 rounded-lg transition-all duration-300 backdrop-blur-sm"
          style={{ color: 'var(--primary-color)' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        
        <div className="flex flex-col items-center gap-0.5">
          <motion.div
            key={monthName}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent px-2 ${isSmall ? 'text-sm' : 'text-base'}`}
          >
            {monthName}
          </motion.div>
          
          {/* Today Button */}
          {!isSmall && (
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={goToToday}
              className="px-3 py-1 text-[10px] font-semibold rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all backdrop-blur-sm"
            >
              Today
            </motion.button>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(1)}
          className="p-1 rounded-lg transition-all duration-300 backdrop-blur-sm"
          style={{ color: 'var(--accent-color)' }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className={`grid grid-cols-7 ${isSmall ? 'gap-0.5' : 'gap-1.5'} text-xs flex-1 relative z-10`}>
        {/* Week days */}
        {weekDays.map((day, i) => (
          <div 
            key={i} 
            className={`text-center font-bold ${isSmall ? 'pb-1 text-[9px]' : 'pb-2 text-[10px]'}`}
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
            className={`text-center flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              isToday(day)
                ? 'bg-gradient-to-br from-primary via-secondary to-accent text-white font-extrabold shadow-2xl ring-1 ring-white/20'
                : day
                ? 'text-white/80 hover:text-white hover:bg-white/5 backdrop-blur-sm'
                : 'opacity-0'
            } ${isSmall ? 'text-[10px] py-0.5' : 'py-2'}`}
            style={isToday(day) ? {
              boxShadow: `0 0 30px var(--primary-color), 0 0 60px var(--accent-color)`
            } : {}}
          >
            {day || ''}
          </motion.div>
        ))}
      </div>

      {/* Today indicator with gradient - Hide on small to save space */}
      {!isSmall && (
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
      )}
    </div>
  );
};

export default Calendar;
