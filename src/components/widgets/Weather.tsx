import React, { useState, useEffect } from 'react';
import { SunIcon } from '../icons';
import { fetchWeatherData } from '../../services/api';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, Wind, Droplets, Gauge, Thermometer } from 'lucide-react';
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
    if (cond.includes('rain')) return <CloudRain className="w-full h-full text-blue-400" />;
    if (cond.includes('snow')) return <CloudSnow className="w-full h-full text-white" />;
    if (cond.includes('cloud')) return <Cloud className="w-full h-full text-gray-300" />;
    if (cond.includes('wind')) return <Wind className="w-full h-full text-teal-300" />;
    return <SunIcon className="w-full h-full text-yellow-400" />;
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
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-bold text-white tracking-wide ${isSmall ? 'text-xs' : 'text-lg'}`}>
              {weather?.city}
            </h3>
            <p className={`text-white/60 capitalize ${isSmall ? 'text-[10px]' : 'text-xs'}`}>
              {weather?.condition}
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`${isSmall ? 'w-8 h-8' : 'w-12 h-12'}`}
          >
            {getWeatherIcon(weather?.condition)}
          </motion.div>
        </div>

        {/* Temperature */}
        <div className="flex-1 flex items-center justify-center my-2">
          <div className={`font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 ${isSmall ? 'text-4xl' : 'text-6xl'}`}>
            {Math.round(weather?.temp)}°
          </div>
        </div>

        {/* Details Grid (Medium/Large only) */}
        {!isSmall && (
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
              <Droplets className="w-4 h-4 text-blue-300" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50">Humidity</span>
                <span className="text-xs font-bold">{weather?.humidity}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
              <Wind className="w-4 h-4 text-teal-300" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50">Wind</span>
                <span className="text-xs font-bold">{weather?.windSpeed}km/h</span>
              </div>
            </div>
            {isLarge && (
              <>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                  <Thermometer className="w-4 h-4 text-red-300" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50">Feels Like</span>
                    <span className="text-xs font-bold">{weather?.feelsLike}°</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                  <Gauge className="w-4 h-4 text-purple-300" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50">Pressure</span>
                    <span className="text-xs font-bold">{weather?.pressure}hPa</span>
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
