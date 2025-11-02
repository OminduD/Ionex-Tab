// src/services/api.ts
// This file centralizes all external API calls.

export const fetchWeatherData = async (apiKey: string) => {
    if (!apiKey) {
        return { error: "OpenWeatherMap API key not set. Please add it in settings." };
    }
    const lat = 6.9271;
    const lon = 79.8612;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            return { error: `Weather API error: ${response.statusText}` };
        }
        const data = await response.json();
        return {
            city: data.name,
            temp: Math.round(data.main.temp),
            condition: data.weather[0]?.main || 'N/A',
        };
    } catch (error) {
        console.error("Weather fetch error:", error);
        return { error: "Failed to fetch weather data." };
    }
};

export {};
