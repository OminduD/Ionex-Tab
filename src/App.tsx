// src/App.tsx
// The main application component - Redesigned with unique cool layout

import React, { useState, useEffect } from 'react';
import { Settings, WidgetId } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SettingsIcon } from './components/icons';
import { SettingsPanel } from './components/SettingsPanel';
import { SearchBar } from './components/SearchBar';
import { QuickLinks } from './components/QuickLinks';
import { AIToolsButton } from './components/AIToolsButton';
import { Greeting } from './components/Greeting';
import { QuoteAndIP } from './components/QuoteAndIP';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { extractColorsFromImage, applyCustomColors } from './utils/colorExtractorImproved';

// Dynamically import widgets
const Clock = React.lazy(() => import('./components/widgets/Clock'));
const AnalogClock = React.lazy(() => import('./components/widgets/AnalogClock'));
const Weather = React.lazy(() => import('./components/widgets/Weather'));
const Calendar = React.lazy(() => import('./components/widgets/Calendar'));
const TodoList = React.lazy(() => import('./components/widgets/TodoList'));
const AIWidget = React.lazy(() => import('./components/widgets/AIWidgetImproved'));
const NotesWidget = React.lazy(() => import('./components/widgets/NotesWidget'));
const AppShortcuts = React.lazy(() => import('./components/widgets/AppShortcuts'));
const MusicPlayer = React.lazy(() => import('./components/widgets/MusicPlayer'));
const NewsFeed = React.lazy(() => import('./components/widgets/NewsFeed'));
const FocusMode = React.lazy(() => import('./components/widgets/FocusMode'));
const DraggableWidget = React.lazy(() => import('./components/DraggableWidget'));

// Default API key for weather (free tier OpenWeatherMap)
const DEFAULT_WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

const App: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<Settings>('homeTabSettings-v7', {
    wallpaperUrl: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop',
    theme: 'aurora',
    clockType: 'digital',
    timeFormat: '24h', // Default to 24-hour format
    searchEngine: 'google',
    userName: '',
    showQuotesAndIP: true, // Legacy support
    showQuotes: true, // Separate toggle for quotes
    showIP: true, // Separate toggle for IP
    widgets: { clock: true, weather: true, calendar: true, todoList: true, aiAssistant: true, notes: true, appShortcuts: false, musicPlayer: false, newsFeed: true },
    widgetSizes: { clock: 'small', weather: 'medium', calendar: 'small', todoList: 'medium', aiAssistant: 'large', notes: 'medium', appShortcuts: 'medium', musicPlayer: 'medium', newsFeed: 'medium' },
    widgetPositions: {
      clock: { x: 50, y: 100 },
      weather: { x: 400, y: 80 },
      calendar: { x: 900, y: 100 },
      todoList: { x: 100, y: 350 },
      newsFeed: { x: 700, y: 350 },
      aiAssistant: { x: 400, y: 350 },
      notes: { x: 600, y: 400 },
      appShortcuts: { x: 500, y: 500 },
      musicPlayer: { x: 800, y: 500 },
    },
    shortcuts: [
        { id: '1', name: 'Gmail', url: 'https://mail.google.com', icon: 'gmail' },
        { id: '2', name: 'YouTube', url: 'https://youtube.com', icon: 'youtube' },
        { id: '3', name: 'GitHub', url: 'https://github.com', icon: 'github' },
        { id: '4', name: 'Discord', url: 'https://discord.com', icon: 'discord' },
        { id: '5', name: 'Spotify', url: 'https://spotify.com', icon: 'spotify' },
        { id: '6', name: 'Reddit', url: 'https://reddit.com', icon: 'reddit' },
        { id: '7', name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
        { id: '8', name: 'Figma', url: 'https://figma.com', icon: 'figma' },
    ],
    apiKeys: { weather: DEFAULT_WEATHER_API_KEY, groq: '' },
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Apply manual custom colors
  useEffect(() => {
    if (settings.customColors && !settings.autoThemeFromWallpaper) {
      applyCustomColors(settings.customColors);
    }
  }, [settings.customColors, settings.autoThemeFromWallpaper]);

  // Apply custom colors or extract from wallpaper
  useEffect(() => {
    if (settings.autoThemeFromWallpaper && (settings.wallpaperFile || settings.wallpaperUrl)) {
      // Auto-detect colors from wallpaper
      const imageUrl = settings.wallpaperFile || settings.wallpaperUrl || '';
      extractColorsFromImage(imageUrl)
        .then((colors) => {
          console.log('Extracted colors:', colors);
          applyCustomColors(colors);
        })
        .catch((error) => {
          console.error('Failed to extract colors:', error);
        });
    }
  }, [settings.wallpaperFile, settings.wallpaperUrl, settings.autoThemeFromWallpaper]);

  const updateWidgetPosition = (id: WidgetId, x: number, y: number) => {
    setSettings(prev => ({
      ...prev,
      widgetPositions: {
        ...prev.widgetPositions,
        [id]: { x, y }
      }
    }));
  };

  const widgetMap: Record<WidgetId, React.ReactNode> = {
    clock: (
      <>
        {(settings.clockType === 'digital' || settings.clockType === 'both') && (
          <Clock timeFormat={settings.timeFormat} />
        )}
        {(settings.clockType === 'analog' || settings.clockType === 'both') && (
          <AnalogClock showDigital={settings.clockType === 'both'} timeFormat={settings.timeFormat} />
        )}
      </>
    ),
    analogClock: null, // Deprecated - now controlled by clockType setting
    weather: <Weather apiKey={settings.apiKeys.weather} />,
    calendar: <Calendar />,
    todoList: <TodoList />,
    aiAssistant: <AIWidget groqKey={settings.apiKeys.groq || ''} />,
    notes: <NotesWidget />,
    appShortcuts: <AppShortcuts shortcuts={settings.shortcuts} />,
    musicPlayer: <MusicPlayer />,
    newsFeed: <NewsFeed apiKey={settings.apiKeys.news} />,
  };

  return (
    <div className={`theme-${settings.theme} font-sans`}>
        <div 
            className={`h-screen w-screen text-white bg-cover bg-center bg-fixed overflow-hidden relative ${!settings.wallpaperFile && !settings.wallpaperUrl ? 'bg-theme-gradient' : ''}`}
            style={{ backgroundImage: settings.wallpaperFile || settings.wallpaperUrl ? `url(${settings.wallpaperFile || settings.wallpaperUrl})` : undefined }}
        >
            {/* Top-Left: Logo/Brand & Focus Button */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 px-4 py-3 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                    <span className="text-white font-bold text-lg">I</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Ionex</div>
                    <div className="text-xs text-white/70">New Tab</div>
                  </div>
                </div>
              </motion.div>

              {/* Focus Mode Button */}
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => setIsFocusMode(true)} 
                className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all hover:scale-110 group" 
                aria-label="Focus Mode"
                title="Focus Mode"
              >
                <Zap className="w-6 h-6 icon-color group-hover:rotate-12 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Top-Right: Settings Button */}
            <div className="fixed top-6 right-6 z-50">
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setIsSettingsOpen(true)} 
                className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-all hover:scale-110" 
                aria-label="Settings"
              >
                <SettingsIcon className="w-6 h-6 icon-color" />
              </motion.button>
            </div>

            {/* Bottom-Left: AI Tools Button */}
            <AIToolsButton />

            {/* Center: Greeting + Search Bar (Fixed Position) */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-4xl px-6">
              <Greeting userName={settings.userName} />
              
              <SearchBar 
                selectedEngine={settings.searchEngine}
                onEngineChange={(engine) => setSettings({ ...settings, searchEngine: engine })}
              />

              {/* Quote and IP Address */}
              <QuoteAndIP 
                showQuotes={settings.showQuotes ?? settings.showQuotesAndIP ?? true} 
                showIP={settings.showIP ?? settings.showQuotesAndIP ?? true}
              />
            </div>

            {/* Bottom: Quick Links Bar (Fixed at Bottom) */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-6xl px-6">
              <QuickLinks 
                shortcuts={settings.shortcuts}
                theme={settings.theme}
              />
            </div>

            {/* Draggable Widgets Area */}
            <div className="absolute inset-0 overflow-hidden">
               <React.Suspense fallback={<div className="text-center">Loading...</div>}>
                   {Object.entries(settings.widgets).map(([id, enabled]) => {
                       const widgetId = id as WidgetId;
                       if (!enabled || !widgetMap[widgetId]) return null;
                       
                       const position = settings.widgetPositions[widgetId] || { x: 100, y: 100 };
                       
                       return (
                           <DraggableWidget
                               key={widgetId}
                               id={widgetId}
                               position={position}
                               onPositionChange={(x: number, y: number) => updateWidgetPosition(widgetId, x, y)}
                               size={settings.widgetSizes[widgetId] || 'small'}
                           >
                               {widgetMap[widgetId]}
                           </DraggableWidget>
                       );
                   })}
               </React.Suspense>
            </div>

            {/* Focus Mode Overlay */}
            <React.Suspense fallback={<div>Loading...</div>}>
                <FocusMode isActive={isFocusMode} onClose={() => setIsFocusMode(false)} />
            </React.Suspense>

            {/* Settings Panel */}
            <SettingsPanel 
                settings={settings}
                setSettings={setSettings}
                isVisible={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    </div>
  );
};

export default App;

export {};
