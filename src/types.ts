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
  searchEngine: string;
  widgets: Record<string, boolean>;
  widgetSizes: Record<string, WidgetSize>;
  widgetPositions: Record<string, WidgetPosition>;
  shortcuts: Shortcut[];
  userName?: string; // User's name for greeting
  apiKeys: {
    weather: string;
    gemini: string;
  };
}

export type WidgetId = 'clock' | 'analogClock' | 'weather' | 'calendar' | 'todoList' | 'aiAssistant' | 'appShortcuts' | 'musicPlayer' | 'newsFeed';

// Empty export to ensure this is treated as a module
export {};
