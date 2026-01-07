import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, MapPin, Trash2, RefreshCw } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { parseICS } from '../../utils/icsParser';

import { CalendarEvent } from '../../types';

interface CalendarProps {
  theme?: string;
  size?: 'small' | 'medium' | 'large';
  events?: CalendarEvent[];
  googleCalendarUrl?: string;
}

const Calendar: React.FC<CalendarProps> = ({ size = 'medium', theme = 'aurora', events: externalEvents = [], googleCalendarUrl }) => {
  const [date, setDate] = useState(new Date());
  const [days, setDays] = useState<(number | null)[]>([]);
  const [localEvents, setLocalEvents] = useLocalStorage<CalendarEvent[]>('ionex_calendar_events', []);
  const [importedEvents, setImportedEvents] = useState<CalendarEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<CalendarEvent | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    allDay: false
  });
  const [isImporting, setIsImporting] = useState(false);
  const { variants, containerStyle } = useThemeAnimation(theme);

  // Combine all events
  const events = [...externalEvents, ...localEvents, ...importedEvents];

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

  // Import from Google Calendar ICS URL
  const importFromGoogle = useCallback(async () => {
    if (!googleCalendarUrl) return;
    
    setIsImporting(true);
    try {
      // Google Calendar public ICS URL format
      const response = await fetch(googleCalendarUrl);
      const icsContent = await response.text();
      const parsed = parseICS(icsContent);
      setImportedEvents(parsed);
    } catch (error) {
      console.error('Failed to import calendar:', error);
    } finally {
      setIsImporting(false);
    }
  }, [googleCalendarUrl]);

  // Import on mount if URL is set
  useEffect(() => {
    if (googleCalendarUrl) {
      importFromGoogle();
    }
  }, [googleCalendarUrl, importFromGoogle]);

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) return;

    const startDate = new Date(newEvent.date);
    if (newEvent.time && !newEvent.allDay) {
      const [hours, minutes] = newEvent.time.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes));
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title.trim(),
      description: newEvent.description.trim() || undefined,
      startDate,
      location: newEvent.location.trim() || undefined,
      allDay: newEvent.allDay
    };

    setLocalEvents([...localEvents, event]);
    setNewEvent({ title: '', description: '', date: '', time: '', location: '', allDay: false });
    setShowAddForm(false);
  };

  const deleteEvent = (id: string) => {
    setLocalEvents(localEvents.filter(e => e.id !== id));
    setShowEventDetails(null);
  };

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    setSelectedDay(day);
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setShowEventDetails(dayEvents[0]);
    } else {
      // Pre-fill date for new event
      const eventDate = new Date(date.getFullYear(), date.getMonth(), day);
      setNewEvent(prev => ({ ...prev, date: eventDate.toISOString().split('T')[0] }));
      setShowAddForm(true);
    }
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
                    onClick={() => handleDayClick(day)}
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
                        <div className="text-[10px] text-slate-400">Click to add event</div>
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

      {/* Add Button */}
      <div className="flex items-center justify-between mt-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] text-white/70 hover:text-white transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Event
        </motion.button>
        {googleCalendarUrl && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={importFromGoogle}
            disabled={isImporting}
            className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] text-white/70 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isImporting ? 'animate-spin' : ''}`} />
            Sync
          </motion.button>
        )}
      </div>

      {/* Add Event Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-3"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[280px] bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  New Event
                </h4>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Event title..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50"
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary/50"
                />
                {!newEvent.allDay && (
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary/50"
                  />
                )}
              </div>

              <label className="flex items-center gap-2 text-xs text-white/60">
                <input
                  type="checkbox"
                  checked={newEvent.allDay}
                  onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                  className="rounded border-white/20 bg-white/5"
                />
                All day event
              </label>

              <input
                type="text"
                placeholder="Location (optional)"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50"
              />

              <textarea
                placeholder="Description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-primary/50 resize-none"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addEvent}
                className="w-full py-2 bg-primary/30 hover:bg-primary/50 rounded-lg text-xs font-medium text-white transition-colors"
              >
                Add Event
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-3"
            onClick={() => setShowEventDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[280px] bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white truncate flex-1">{showEventDetails.title}</h4>
                <button
                  onClick={() => setShowEventDetails(null)}
                  className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(showEventDetails.startDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    {!showEventDetails.allDay && ` at ${new Date(showEventDetails.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                </div>

                {showEventDetails.location && (
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{showEventDetails.location}</span>
                  </div>
                )}

                {showEventDetails.description && (
                  <p className="text-white/50 mt-2 pt-2 border-t border-white/10">
                    {showEventDetails.description}
                  </p>
                )}
              </div>

              {/* Only allow deleting local events */}
              {localEvents.some(e => e.id === showEventDetails.id) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => deleteEvent(showEventDetails.id)}
                  className="w-full mt-3 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-xs font-medium text-red-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Event
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Calendar;
