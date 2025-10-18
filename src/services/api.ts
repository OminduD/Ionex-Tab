// src/services/api.ts
// This file centralizes all external API calls.

export const callGeminiAPI = async (prompt: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    return "Error: Gemini API key is not set. Please add it in the settings panel.";
  }
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return `Error: API call failed with status ${response.status}. See console for details.`;
    }
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response.";
  } catch (error) {
    console.error("Gemini API call error:", error);
    return "An error occurred while contacting the Gemini API. Check console for details.";
  }
};

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
