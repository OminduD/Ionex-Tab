import React, { useState, useEffect } from 'react';
import { SunIcon } from '../icons';
import { fetchWeatherData } from '../../services/api';

interface WeatherProps {
  apiKey: string;
}

const Weather: React.FC<WeatherProps> = ({ apiKey }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const data = await fetchWeatherData(apiKey);
      setWeather(data);
      setLoading(false);
    };

    if (apiKey) {
      loadWeather();
      const interval = setInterval(loadWeather, 600000); // Update every 10 minutes
      return () => clearInterval(interval);
    } else {
      setWeather({ error: 'API key not set' });
      setLoading(false);
    }
  }, [apiKey]);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (weather?.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <SunIcon className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs opacity-70">{weather.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <SunIcon className="w-12 h-12 mb-2" />
      <div className="text-3xl font-bold">{weather?.temp}°C</div>
      <div className="text-sm opacity-70">{weather?.city}</div>
      <div className="text-xs opacity-60 mt-1">{weather?.condition}</div>
    </div>
  );
};

export default Weather;
