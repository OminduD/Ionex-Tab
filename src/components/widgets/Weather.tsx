import React, { useState, useEffect } from 'react';
import { SunIcon } from '../icons';
import { fetchWeatherData } from '../../services/api';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react';
import { useThemeAnimation } from '../../hooks/useThemeAnimation';

interface WeatherProps {
  apiKey: string;
  size?: 'small' | 'medium' | 'large';
  theme?: string;
}

const Weather: React.FC<WeatherProps> = ({ apiKey, size = 'medium', theme = 'aurora' }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { variants, containerStyle } = useThemeAnimation(theme);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const data = await fetchWeatherData(apiKey);
      setWeather(data);
      setLoading(false);
    };

    loadWeather();
    const interval = setInterval(loadWeather, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [apiKey]);

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

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`relative h-full overflow-hidden flex flex-col ${isSmall ? 'p-3' : 'p-5'} rounded-3xl ${containerStyle}`}
    >
      {/* Background Gradient based on weather */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
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
          <div className={`${isSmall ? 'w-10 h-10' : 'w-16 h-16'}`}>
            {getWeatherIcon(weather?.condition)}
          </div>
        </div>

        {/* Temperature */}
        <div className="flex-1 flex items-center justify-center my-2">
          <div className={`font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 ${isSmall ? 'text-4xl' : 'text-6xl'} drop-shadow-xl`}>
            {Math.round(weather?.temp)}°
          </div>
        </div>

        {/* Details Grid (Medium/Large only) */}
        {!isSmall && (
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <Droplets className="w-4 h-4 text-blue-300" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50">Humidity</span>
                <span className="text-xs font-bold">{weather?.humidity}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <Wind className="w-4 h-4 text-teal-300" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50">Wind</span>
                <span className="text-xs font-bold">{weather?.windSpeed}km/h</span>
              </div>
            </div>

            {/* Extended Data for Large or if space permits (using isLarge logic for now, but could adapt) */}
            {(isLarge || weather?.uvIndex !== undefined) && (
              <>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <SunIcon className="w-4 h-4 text-orange-300" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50">UV Index</span>
                    <span className="text-xs font-bold">{weather?.uvIndex ?? '-'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  {/* Using Eye icon for visibility if available, or just text */}
                  <span className="material-icons text-xs text-purple-300">visibility</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50">Visibility</span>
                    <span className="text-xs font-bold">{weather?.visibility ? `${weather.visibility}km` : '-'}</span>
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

export default Weather;
