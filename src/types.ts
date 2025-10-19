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
  widgets: Record<string, boolean>;
  widgetSizes: Record<string, WidgetSize>;
  widgetPositions: Record<string, WidgetPosition>;
  shortcuts: Shortcut[];
  userName?: string; // User's name for greeting
  showQuotesAndIP?: boolean; // Toggle for quotes and IP display (legacy - keeping for backward compatibility)
  showQuotes?: boolean; // Separate toggle for quotes
  showIP?: boolean; // Separate toggle for IP address
  apiKeys: {
    weather: string;
    gemini: string;
    groq?: string;
    news?: string; // News API key for real-time news
  };
  connectedMusicPlatforms?: string[];
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    bgGradientStart: string;
    bgGradientEnd: string;
  };
  autoThemeFromWallpaper?: boolean;
}

export type WidgetId = 'clock' | 'analogClock' | 'weather' | 'calendar' | 'todoList' | 'aiAssistant' | 'notes' | 'appShortcuts' | 'musicPlayer' | 'newsFeed';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// Empty export to ensure this is treated as a module
export {};
