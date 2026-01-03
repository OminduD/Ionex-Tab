// src/types.ts
// This file defines the core data structures for our application.

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface Settings {
  wallpaperUrl: string;
  wallpaperFile?: string; // Base64 encoded image from device
  theme: string;
  clockType: 'digital' | 'analog' | 'both';
  timeFormat?: '12h' | '24h'; // 12-hour (AM/PM) or 24-hour time format
  searchEngine: string;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  widgets: Record<string, { id: string; type: string; x: number; y: number; w: number; h: number; visible: boolean }>;
  widgetSizes: Record<string, WidgetSize>;
  widgetPositions?: Record<string, WidgetPosition>; // Keeping for backward compatibility if needed
  shortcuts?: Shortcut[];
  userName?: string; // User's name for greeting
  showQuotesAndIP?: boolean; // Toggle for quotes and IP display (legacy - keeping for backward compatibility)
  showQuotes?: boolean; // Separate toggle for quotes
  showIP?: boolean; // Separate toggle for IP address
  showSeconds?: boolean; // Toggle for seconds in clock
  showVirtualPet?: boolean; // Toggle for virtual pet
  petMode?: 'svg' | 'emoji' | 'gif' | 'pixel'; // Visual style of the pet
  customPetUrl?: string; // URL for custom GIF pet
  apiKeys: {
    weather: string;
    groq?: string;
    openai?: string;
    news?: string; // News API key for real-time news
    github?: string;
  };
  connectedMusicPlatforms?: string[];
  musicPlayerEmbedUrl?: string; // Spotify/SoundCloud link to embed in the Music Player widget
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    bgGradientStart: string;
    bgGradientEnd: string;
  };
  autoThemeFromWallpaper?: boolean;
  enableParallax?: boolean;
  enableMouseTrail?: boolean;
  enableGreeting?: boolean;
  githubUsername?: string;
  cryptoCoins?: string[]; // e.g. ['bitcoin', 'ethereum', 'dogecoin']
  minimalistMode?: boolean;
  minimalistTheme?: 'dark' | 'light';
  calendarEvents?: CalendarEvent[];
  googleCalendarUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
  location?: string;
}

export type WidgetId = 'clock' | 'analogClock' | 'weather' | 'calendar' | 'todoList' | 'aiAssistant' | 'notes' | 'appShortcuts' | 'musicPlayer' | 'newsFeed' | 'systemStats' | 'github' | 'crypto' | 'achievements';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// Empty export to ensure this is treated as a module
export { };
