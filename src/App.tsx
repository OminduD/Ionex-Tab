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
import AIChatSidebar from './components/AIChatSidebar';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Zap } from 'lucide-react';
import { extractColorsFromImage, applyCustomColors } from './utils/colorExtractorImproved';
import { getRandomWallpaper } from './utils/themeWallpapers';

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
const FullscreenAnimation = React.lazy(() => import('./components/FullscreenAnimation'));

// Default API key for weather (free tier OpenWeatherMap)
const DEFAULT_WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

const LogoButton = ({ onClick }: { onClick: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      <div className="relative flex items-center gap-3 px-5 py-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* 3D Logo Container */}
        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center relative shadow-lg"
          style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
        >
          <motion.div 
            className="absolute inset-0 rounded-xl bg-white/20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-white font-black text-xl relative z-10 drop-shadow-md">I</span>
        </motion.div>

        <div style={{ transform: "translateZ(10px)" }}>
          <div className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors">Ionex</div>
          <div className="text-[10px] font-medium text-white/50 uppercase tracking-widest group-hover:text-white/80 transition-colors">New Tab</div>
        </div>
      </div>
    </motion.button>
  );
};

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
  const [showFullscreenAnimation, setShowFullscreenAnimation] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Set random wallpaper from theme bundle on first load or theme change
  useEffect(() => {
    // Only set random wallpaper if user hasn't uploaded a custom wallpaper
    if (!settings.wallpaperFile) {
      const randomWallpaper = getRandomWallpaper(settings.theme);
      if (settings.wallpaperUrl !== randomWallpaper) {
        setSettings(prev => ({
          ...prev,
          wallpaperUrl: randomWallpaper
        }));
      }
    }
  }, [settings.theme]); // Trigger when theme changes

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
          <Clock 
            timeFormat={settings.timeFormat} 
            theme={settings.theme} 
            size={settings.widgetSizes.clock}
          />
        )}
        {(settings.clockType === 'analog' || settings.clockType === 'both') && (
          <AnalogClock showDigital={settings.clockType === 'both'} timeFormat={settings.timeFormat} theme={settings.theme} />
        )}
      </>
    ),
    analogClock: null, // Deprecated - now controlled by clockType setting
    weather: <Weather apiKey={settings.apiKeys.weather} theme={settings.theme} size={settings.widgetSizes.weather} />,
    calendar: <Calendar theme={settings.theme} size={settings.widgetSizes.calendar} />,
    todoList: <TodoList theme={settings.theme} size={settings.widgetSizes.todoList} />,
    aiAssistant: <AIWidget groqKey={settings.apiKeys.groq || ''} theme={settings.theme} />,
    notes: <NotesWidget theme={settings.theme} size={settings.widgetSizes.notes} />,
    appShortcuts: <AppShortcuts shortcuts={settings.shortcuts} theme={settings.theme} size={settings.widgetSizes.appShortcuts} />,
    musicPlayer: <MusicPlayer theme={settings.theme} />,
    newsFeed: <NewsFeed apiKey={settings.apiKeys.news} theme={settings.theme} size={settings.widgetSizes.newsFeed} />,
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
            style={{ perspective: 1000 }}
          >
            <LogoButton onClick={() => setShowFullscreenAnimation(true)} />
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
              // Skip aiAssistant as it's now a sidebar
              if (!enabled || !widgetMap[widgetId] || widgetId === 'aiAssistant') return null;

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

        {/* AI Chat Sidebar & Toggle */}
        {settings.widgets.aiAssistant && (
          <>
            {/* Toggle Button */}
            <motion.button
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAIChatOpen(true)}
              className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 p-3 bg-white/10 backdrop-blur-md border-l border-y border-white/20 rounded-l-2xl shadow-lg transition-all hover:bg-white/20 ${isAIChatOpen ? 'translate-x-full opacity-0 pointer-events-none' : ''}`}
            >
              <div className="writing-vertical-rl text-white/80 text-xs font-bold tracking-widest py-2 flex items-center gap-2" style={{ writingMode: 'vertical-rl' }}>
                <span>AI CHAT</span>
              </div>
            </motion.button>

            <AIChatSidebar
              isOpen={isAIChatOpen}
              onClose={() => setIsAIChatOpen(false)}
              groqKey={settings.apiKeys.groq || ''}
            />
          </>
        )}

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

        {/* Fullscreen Animation */}
        <React.Suspense fallback={null}>
          <FullscreenAnimation
            theme={settings.theme}
            isVisible={showFullscreenAnimation}
            onComplete={() => setShowFullscreenAnimation(false)}
          />
        </React.Suspense>
      </div>
    </div>
  );
};

export default App;

export { };
