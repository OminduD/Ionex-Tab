import React, { useState, useEffect } from 'react';
import { SunIcon } from '../icons';
import { fetchWeatherData } from '../../services/api';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import { ThemeParticles } from '../ThemeParticles';

interface WeatherProps {
  apiKey: string;
  size?: 'small' | 'medium' | 'large';
  theme?: string;
}

const Weather: React.FC<WeatherProps> = ({ apiKey, size = 'medium', theme = 'aurora' }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const data = await fetchWeatherData(apiKey);
      setWeather(data);
      setLoading(false);
    };

    // Open-Meteo is FREE and doesn't require API key!
    loadWeather();
    const interval = setInterval(loadWeather, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [apiKey]);

  const getWeatherIcon = (condition: string) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('rain')) return <CloudRain className="w-full h-full" />;
    if (cond.includes('snow')) return <CloudSnow className="w-full h-full" />;
    if (cond.includes('cloud')) return <Cloud className="w-full h-full" />;
    if (cond.includes('wind')) return <Wind className="w-full h-full" />;
    return <SunIcon className="w-full h-full" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (weather?.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <SunIcon className="w-8 h-8 mb-2 opacity-50 icon-color" />
        <p className="text-xs opacity-70">{weather.error}</p>
      </div>
    );
  }

  // Small size - compact view
  if (size === 'small') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-full relative overflow-hidden"
      >
        {/* Theme Particles */}
        <ThemeParticles theme={theme} density="low" />
        
        {/* Gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 blur-2xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 mb-3 icon-color"
          >
            {getWeatherIcon(weather?.condition)}
          </motion.div>
          <div className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {weather?.temp}°
          </div>
          <div className="text-sm opacity-70 mt-1">{weather?.city}</div>
        </div>
      </motion.div>
    );
  }

  // Medium size - standard view
  if (size === 'medium') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full p-4 relative overflow-hidden rounded-2xl"
      >
        {/* Theme Particles */}
        <ThemeParticles theme={theme} density="medium" />
        
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
        <motion.div 
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
        />
        
        <div className="relative z-10 flex flex-col items-center justify-center flex-1">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 mb-4 icon-color"
          >
            {getWeatherIcon(weather?.condition)}
          </motion.div>
          <div className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {weather?.temp}°C
          </div>
          <div className="text-lg font-medium mt-2">{weather?.city}</div>
          <div className="text-sm opacity-70 mt-1 capitalize">{weather?.condition}</div>
        </div>
      </motion.div>
    );
  }

  // Large size - detailed view with more info
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full p-6 relative overflow-hidden rounded-2xl"
    >
      {/* Animated gradient background */}
      <motion.div 
        animate={{ 
          background: [
            'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%)',
            'linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 50%, var(--secondary-color) 100%)',
            'linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 50%, var(--primary-color) 100%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 opacity-20 blur-3xl"
      />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {weather?.city}
          </h3>
          <p className="text-sm opacity-70 capitalize">{weather?.condition}</p>
        </div>

        {/* Main temp display */}
        <div className="flex items-center justify-center mb-6">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="w-24 h-24 mr-6 icon-color"
          >
            {getWeatherIcon(weather?.condition)}
          </motion.div>
          <div className="text-7xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
            {weather?.temp}°
          </div>
        </div>

        {/* Detailed info grid */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <Droplets className="w-5 h-5 icon-color" />
            <div>
              <p className="text-xs opacity-60">Humidity</p>
              <p className="text-lg font-semibold">{weather?.humidity || 65}%</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <Wind className="w-5 h-5 icon-color" />
            <div>
              <p className="text-xs opacity-60">Wind</p>
              <p className="text-lg font-semibold">{weather?.windSpeed || 12} km/h</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <Eye className="w-5 h-5 icon-color" />
            <div>
              <p className="text-xs opacity-60">Visibility</p>
              <p className="text-lg font-semibold">{weather?.visibility || 10} km</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <Gauge className="w-5 h-5 icon-color" />
            <div>
              <p className="text-xs opacity-60">Pressure</p>
              <p className="text-lg font-semibold">{weather?.pressure || 1013} hPa</p>
            </div>
          </motion.div>
        </div>

        {/* Feels like */}
        <div className="mt-4 text-center">
          <p className="text-sm opacity-60">Feels like <span className="font-semibold text-primary">{weather?.feelsLike || weather?.temp}°C</span></p>
        </div>
      </div>
    </motion.div>
  );
};

export default Weather;
