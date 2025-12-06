// src/services/api.ts
// This file centralizes all external API calls.

// Get user's location using browser geolocation API
const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                () => {
                    // Fallback to Colombo, Sri Lanka if permission denied
                    resolve({ lat: 6.9271, lon: 79.8612 });
                }
            );
        } else {
            // Fallback to Colombo, Sri Lanka if geolocation not supported
            resolve({ lat: 6.9271, lon: 79.8612 });
        }
    });
};

// Get city name from coordinates using reverse geocoding
const getCityName = async (lat: number, lon: number): Promise<string> => {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`
        );
        const data = await response.json();
        if (data.results && data.results[0]) {
            return data.results[0].name || 'Unknown';
        }
        return 'Unknown';
    } catch (error) {
        console.error('City name fetch error:', error);
        return 'Unknown';
    }
};

// Convert WMO weather code to condition text
const getWeatherCondition = (code: number): string => {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain Showers';
    if (code <= 86) return 'Snow Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Cloudy';
};

export const fetchWeatherData = async (_apiKey?: string) => {
    // Note: _apiKey parameter kept for compatibility but not used (prefixed with _ to suppress warning)
    // Open-Meteo is completely free and doesn't require an API key!

    try {
        // Get user's location
        const { lat, lon } = await getUserLocation();

        // Fetch weather data from Open-Meteo (FREE, no API key needed!)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,visibility&daily=sunrise,sunset,uv_index_max&timezone=auto`;

        const response = await fetch(weatherUrl);

        if (!response.ok) {
            return { error: `Weather API error: ${response.statusText}` };
        }

        const data = await response.json();
        const current = data.current;
        const daily = data.daily;

        // Get city name
        const city = await getCityName(lat, lon);

        return {
            city: city,
            temp: Math.round(current.temperature_2m),
            condition: getWeatherCondition(current.weather_code),
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.wind_speed_10m),
            pressure: Math.round(current.pressure_msl),
            visibility: Math.round((current.visibility || 10000) / 1000), // Convert to km
            feelsLike: Math.round(current.temperature_2m), // Open-Meteo doesn't provide feels_like, using temp
            sunrise: daily.sunrise[0],
            sunset: daily.sunset[0],
            uvIndex: daily.uv_index_max[0],
        };
    } catch (error) {
        console.error("Weather fetch error:", error);
        return { error: "Failed to fetch weather data. Please check your internet connection." };
    }
};

export { };
