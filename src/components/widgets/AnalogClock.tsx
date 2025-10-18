import React, { useState, useEffect } from 'react';

interface AnalogClockProps {
  showDigital?: boolean;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ showDigital = false }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="relative w-40 h-40">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-10 rounded-full blur-xl" />
        
        {/* Clock face */}
        <svg className="w-full h-full relative z-10" viewBox="0 0 200 200">
          {/* Clock circle with gradient */}
          <defs>
            <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-primary" style={{ stopColor: 'var(--primary-color)' }} />
              <stop offset="100%" className="text-accent" style={{ stopColor: 'var(--accent-color)' }} />
            </linearGradient>
          </defs>
          
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="rgba(255,255,255,0.05)"
            stroke="url(#clockGradient)"
            strokeWidth="4"
            className="opacity-80"
          />
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = 100 + 75 * Math.cos(angle);
            const y1 = 100 + 75 * Math.sin(angle);
            const x2 = 100 + 85 * Math.cos(angle);
            const y2 = 100 + 85 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-50"
              />
            );
          })}

          {/* Hour hand */}
          <line
            x1="100"
            y1="100"
            x2={100 + 45 * Math.cos(hourAngle * Math.PI / 180)}
            y2={100 + 45 * Math.sin(hourAngle * Math.PI / 180)}
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="opacity-80"
          />

          {/* Minute hand */}
          <line
            x1="100"
            y1="100"
            x2={100 + 65 * Math.cos(minuteAngle * Math.PI / 180)}
            y2={100 + 65 * Math.sin(minuteAngle * Math.PI / 180)}
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-90"
          />

          {/* Second hand */}
          <line
            x1="100"
            y1="100"
            x2={100 + 75 * Math.cos(secondAngle * Math.PI / 180)}
            y2={100 + 75 * Math.sin(secondAngle * Math.PI / 180)}
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle cx="100" cy="100" r="5" fill="currentColor" />
        </svg>
      </div>
      
      {showDigital && (
        <div className="text-2xl font-bold mt-4">
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      
      <div className="text-sm opacity-70 mt-2">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};

export default AnalogClock;
