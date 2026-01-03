// src/services/api.ts
// This file centralizes all external API calls.

// Get user's location using IP-based geolocation (fallback)
const getLocationByIP = async (): Promise<{ lat: number; lon: number; city?: string }> => {
    try {
        // Using ipapi.co - free, no API key required
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        console.log('IP Geolocation data:', data);

        if (data.latitude && data.longitude) {
            const city = data.city || data.region || data.country_name;
            console.log('Extracted city from IP:', city);
            return {
                lat: data.latitude,
                lon: data.longitude,
                city: city
            };
        }
    } catch (error) {
        console.error('IP geolocation error:', error);
    }

    // Ultimate fallback to Colombo, Sri Lanka
    return { lat: 6.9271, lon: 79.8612 };
};

// Get user's location using browser geolocation API
const getUserLocation = (): Promise<{ lat: number; lon: number; city?: string }> => {
    return new Promise((resolve) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                async () => {
                    // If permission denied, use IP-based geolocation
                    console.log('Geolocation denied, using IP-based location');
                    const ipLocation = await getLocationByIP();
                    resolve(ipLocation);
                }
            );
        } else {
            // If geolocation not supported, use IP-based geolocation
            getLocationByIP().then(resolve);
        }
    });
};

// Get city name from coordinates using reverse geocoding
const getCityName = async (lat: number, lon: number, apiKey: string = 'bd5e378503939ddaee76f12ad7a97608'): Promise<string> => {
    try {
        // Try OpenWeatherMap reverse geocoding first (more reliable)
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
        );
        const data = await response.json();
        if (data && data[0]) {
            // OpenWeatherMap returns city name in the 'name' field
            return data[0].name || data[0].local_names?.en || 'Your Location';
        }

        // Fallback to Open-Meteo if OpenWeatherMap fails
        const fallbackResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`
        );
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.results && fallbackData.results[0]) {
            return fallbackData.results[0].name || 'Your Location';
        }

        return 'Your Location';
    } catch (error) {
        console.error('City name fetch error:', error);
        return 'Your Location';
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
        // Get user's location (tries browser geolocation first, then IP-based)
        const locationData = await getUserLocation();
        const { lat, lon, city: ipCity } = locationData;

        // Fetch weather data from Open-Meteo (FREE, no API key needed!)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,visibility&daily=sunrise,sunset,uv_index_max&timezone=auto`;

        const response = await fetch(weatherUrl);

        if (!response.ok) {
            return { error: `Weather API error: ${response.statusText}` };
        }

        const data = await response.json();
        const current = data.current;
        const daily = data.daily;

        // Get city name (use IP-based city if available, otherwise do reverse geocoding)
        console.log('IP-based city:', ipCity);
        const city = ipCity || await getCityName(lat, lon, _apiKey);
        console.log('Final city name:', city);

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
