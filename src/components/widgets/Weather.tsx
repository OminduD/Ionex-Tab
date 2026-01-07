import React, { useState, useEffect, memo, useMemo } from 'react';
import { SunIcon } from '../icons';
import { fetchWeatherData } from '../../services/api';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface WeatherProps {
  apiKey: string;
  size?: 'small' | 'medium' | 'large';
  theme?: string;
  onWeatherChange?: (condition: string) => void;
}

const Weather: React.FC<WeatherProps> = ({ apiKey, size = 'medium', theme = 'aurora', onWeatherChange }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { variants, containerStyle } = useThemeAnimation(theme);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const data = await fetchWeatherData(apiKey);
      setWeather(data);
      setLoading(false);

      // Notify parent component of weather condition change
      if (data && data.condition && onWeatherChange) {
        onWeatherChange(data.condition);
      }
    };

    loadWeather();
    // Reduced frequency: Update every 15 minutes instead of 10 for lower RAM usage
    const interval = setInterval(loadWeather, 900000);
    return () => clearInterval(interval);
  }, [apiKey, onWeatherChange]);

  const getWeatherIcon = (condition: string) => {
    const cond = condition?.toLowerCase() || '';
    const iconProps = { className: "w-full h-full drop-shadow-lg" };

    if (cond.includes('rain')) {
      return (
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <CloudRain {...iconProps} className="w-full h-full text-blue-400" />
        </motion.div>
      );
    }
    if (cond.includes('snow')) {
      return (
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <CloudSnow {...iconProps} className="w-full h-full text-white" />
        </motion.div>
      );
    }
    if (cond.includes('cloud')) {
      return (
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud {...iconProps} className="w-full h-full text-gray-300" />
        </motion.div>
      );
    }
    if (cond.includes('wind')) {
      return (
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Wind {...iconProps} className="w-full h-full text-teal-300" />
        </motion.div>
      );
    }
    return (
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <SunIcon {...iconProps} className="w-full h-full text-yellow-400" />
      </motion.div>
    );
  };

  const getWeatherGradient = (condition: string) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain')) return 'from-blue-900/40 to-slate-900/40';
    if (cond.includes('snow')) return 'from-slate-100/20 to-blue-100/10';
    if (cond.includes('cloud')) return 'from-gray-500/30 to-slate-600/30';
    if (cond.includes('clear') || cond.includes('sun')) return 'from-orange-400/20 to-yellow-400/10';
    return 'from-white/5 to-transparent';
  };

  // Memoize weather effects BEFORE early returns to prevent React hooks error #310
  // Reduced particle counts for performance
  const rainDrops = useMemo(() => 
    weather?.condition?.toLowerCase().includes('rain') 
      ? [...Array(8)].map((_, i) => ({ // Reduced from 20 to 8
          id: i,
          x: Math.random() * 100,
          duration: 0.5 + Math.random() * 0.5,
          delay: Math.random() * 2
        }))
      : [],
    [weather?.condition]
  );

  const snowFlakes = useMemo(() => 
    weather?.condition?.toLowerCase().includes('snow')
      ? [...Array(6)].map((_, i) => ({ // Reduced from 15 to 6
          id: i,
          x: Math.random() * 100,
          endX: Math.random() * 100,
          duration: 2 + Math.random() * 3,
          delay: Math.random() * 5
        }))
      : [],
    [weather?.condition]
  );

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full rounded-3xl ${containerStyle}`}>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (weather?.error) {
    return (
      <div className={`flex flex-col items-center justify-center h-full p-4 text-center rounded-3xl ${containerStyle}`}>
        <SunIcon className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs opacity-70">{weather.error}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`relative h-full overflow-hidden flex flex-col ${isSmall ? 'p-3' : 'p-5'} rounded-3xl ${containerStyle}`}
    >
      {/* Dynamic Background Gradient based on weather - static opacity for performance */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getWeatherGradient(weather?.condition)} opacity-40`}
      />

      {/* Live Weather Effects - reduced count for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {rainDrops.map((drop) => (
          <motion.div
            key={`rain-${drop.id}`}
            className="absolute w-[1px] h-4 bg-blue-400/50"
            style={{ left: `${drop.x}%` }}
            initial={{ y: -20 }}
            animate={{ y: 400 }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              ease: "linear",
              delay: drop.delay
            }}
          />
        ))}
        {snowFlakes.map((flake) => (
          <motion.div
            key={`snow-${flake.id}`}
            className="absolute w-1 h-1 bg-white/80 rounded-full blur-[1px]"
            style={{ left: `${flake.x}%` }}
            initial={{ y: -10 }}
            animate={{ y: 400, x: `${flake.endX - flake.x}%` }}
            transition={{
              duration: flake.duration,
              repeat: Infinity,
              ease: "linear",
              delay: flake.delay
            }}
          />
        ))}
        {/* Reduced cloud animations from 3 to 2 */}
        {(weather?.condition?.toLowerCase().includes('cloud') || weather?.condition?.toLowerCase().includes('overcast')) && (
          [...Array(2)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute w-32 h-12 bg-white/10 blur-xl rounded-full"
              initial={{ x: -150, y: 20 + i * 50 }}
              animate={{ x: 450 }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 8
              }}
            />
          ))
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40">
        {/* HUD Overlay */}
        <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="material-icons text-[10px] text-white/60">location_on</span>
              <h3 className={`font-bold text-white tracking-wide ${isSmall ? 'text-xs' : 'text-sm'}`}>
                {weather?.city}
              </h3>
            </div>
            <p className={`text-white/60 capitalize ${isSmall ? 'text-[10px]' : 'text-xs'}`}>
              {weather?.condition}
            </p>
          </div>
          <div className={`${isSmall ? 'w-10 h-10' : 'w-14 h-14'}`}>
            {getWeatherIcon(weather?.condition)}
          </div>
        </div>

        {/* Temperature */}
        <div className="flex-1 flex items-center justify-center my-2 relative">
          <div className={`font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 ${isSmall ? 'text-4xl' : 'text-5xl'} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
            {Math.round(weather?.temp)}°
          </div>
          {/* Decorative Data Stream */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full" />
            ))}
          </div>
        </div>

        {/* Details Grid (Medium/Large only) */}
        {!isSmall && (
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
              <Droplets className="w-4 h-4 text-blue-300" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Humidity</span>
                <span className="text-xs font-bold font-mono">{weather?.humidity}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
              <Wind className="w-4 h-4 text-teal-300" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Wind</span>
                <span className="text-xs font-bold font-mono">{weather?.windSpeed}km/h</span>
              </div>
            </div>

            {/* Extended Data for Large or if space permits (using isLarge logic for now, but could adapt) */}
            {(isLarge || weather?.uvIndex !== undefined) && (
              <>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                  <SunIcon className="w-4 h-4 text-orange-300" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">UV Index</span>
                    <span className="text-xs font-bold font-mono">{weather?.uvIndex ?? '-'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                  {/* Using Eye icon for visibility if available, or just text */}
                  <span className="material-icons text-xs text-purple-300">visibility</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Vis</span>
                    <span className="text-xs font-bold font-mono">{weather?.visibility ? `${weather.visibility}km` : '-'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default memo(Weather);
