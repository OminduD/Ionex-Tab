// src/components/SettingsPanel.tsx
// The settings panel component - Completely redesigned with sidebar navigation and premium UI

import React, { useState, useEffect } from 'react';
import { Settings, WidgetSize } from '../types';
import { PlusIcon, Trash2Icon, UploadIcon, ImageIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Palette, Image as ImageIconLucide, Clock, LayoutGrid, Link as LinkIcon, Key, Save, X } from 'lucide-react';

interface Props {
    settings: Settings;
    setSettings: (value: Settings | ((val: Settings) => Settings)) => void;
    isVisible: boolean;
    onClose: () => void;
}

const themes: Record<string, { name: string; class: string; wallpaper: string; colors: string[] }> = {
    aurora: {
        name: 'Aurora',
        class: 'bg-gradient-to-br from-purple-600 to-blue-500',
        wallpaper: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop',
        colors: ['#9333ea', '#3b82f6', '#6366f1']
    },
    sunset: {
        name: 'Sunset',
        class: 'bg-gradient-to-br from-amber-500 to-rose-600',
        wallpaper: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=2070&auto=format&fit=crop',
        colors: ['#f59e0b', '#f43f5e', '#e11d48']
    },
    forest: {
        name: 'Forest',
        class: 'bg-gradient-to-br from-lime-600 to-emerald-700',
        wallpaper: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
        colors: ['#65a30d', '#059669', '#047857']
    },
    ocean: {
        name: 'Ocean',
        class: 'bg-gradient-to-br from-sky-400 to-blue-700',
        wallpaper: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2026&auto=format&fit=crop',
        colors: ['#38bdf8', '#1d4ed8', '#0369a1']
    },
    midnight: {
        name: 'Midnight',
        class: 'bg-gradient-to-br from-gray-900 to-violet-900',
        wallpaper: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop',
        colors: ['#a78bfa', '#7c3aed', '#8b5cf6']
    },
    neon: {
        name: 'Neon',
        class: 'bg-gradient-to-br from-fuchsia-500 to-cyan-500',
        wallpaper: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2187&auto=format&fit=crop',
        colors: ['#d946ef', '#06b6d4', '#8b5cf6']
    },
    cherry: {
        name: 'Cherry',
        class: 'bg-gradient-to-br from-pink-600 to-red-700',
        wallpaper: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?q=80&w=2070&auto=format&fit=crop',
        colors: ['#db2777', '#dc2626', '#be123c']
    },
    mint: {
        name: 'Mint',
        class: 'bg-gradient-to-br from-teal-400 to-green-600',
        wallpaper: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
        colors: ['#2dd4bf', '#16a34a', '#14b8a6']
    },
};

type TabId = 'personal' | 'themes' | 'wallpaper' | 'clock' | 'widgets' | 'shortcuts' | 'api';

export const SettingsPanel: React.FC<Props> = ({ settings, setSettings, isVisible, onClose }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [activeTab, setActiveTab] = useState<TabId>('personal');
    const [newShortcutName, setNewShortcutName] = useState('');
    const [newShortcutUrl, setNewShortcutUrl] = useState('');

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings, isVisible]);

    if (!isVisible) return null;

    const handleSave = () => {
        const trimmedSettings = {
            ...localSettings,
            apiKeys: {
                weather: localSettings.apiKeys.weather?.trim() || '',
                groq: localSettings.apiKeys.groq?.trim() || '',
            }
        };
        setSettings(trimmedSettings);
        onClose();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalSettings((prev: Settings) => ({
                    ...prev,
                    wallpaperFile: reader.result as string,
                    wallpaperUrl: ''
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addShortcut = () => {
        if (newShortcutName && newShortcutUrl) {
            let iconUrl = '';
            try {
                const url = new URL(newShortcutUrl.startsWith('http') ? newShortcutUrl : 'https://' + newShortcutUrl);
                iconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
            } catch (e) {
                console.error('Invalid URL');
            }

            setLocalSettings((prev: Settings) => ({
                ...prev,
                shortcuts: [...prev.shortcuts, {
                    id: Date.now().toString(),
                    name: newShortcutName,
                    url: newShortcutUrl,
                    icon: iconUrl
                }]
            }));
            setNewShortcutName('');
            setNewShortcutUrl('');
        }
    };

    const deleteShortcut = (id: string) => {
        setLocalSettings((prev: Settings) => ({
            ...prev,
            shortcuts: prev.shortcuts.filter(s => s.id !== id)
        }));
    };

    const tabs = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'themes', label: 'Themes', icon: Palette },
        { id: 'wallpaper', label: 'Wallpaper', icon: ImageIconLucide },
        { id: 'clock', label: 'Clock', icon: Clock },
        { id: 'widgets', label: 'Widgets', icon: LayoutGrid },
        { id: 'shortcuts', label: 'Shortcuts', icon: LinkIcon },
        { id: 'api', label: 'API Keys', icon: Key },
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
                    onClick={handleSave}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl h-[85vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row bg-[#0f172a] border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Sidebar Navigation */}
                        <div className="w-full md:w-64 bg-black/20 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 flex flex-col gap-2 overflow-y-auto scrollbar-none">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <img src="/Ionex.png" alt="Logo" className="w-8 h-8 rounded-lg" onError={(e) => e.currentTarget.style.display = 'none'} />
                                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Settings</h2>
                            </div>

                            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabId)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isActive
                                                ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-white border border-white/10 shadow-lg'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                                            <span className="font-medium text-sm">{tab.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTabIndicator"
                                                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full hidden md:block"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-auto hidden md:block pt-6 border-t border-white/10">
                                <p className="text-xs text-white/30 text-center">Ionex Tab v1.0</p>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-gray-900 via-[#131b2e] to-gray-900 relative">
                            {/* Top Bar */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/10 backdrop-blur-md sticky top-0 z-20">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="max-w-3xl mx-auto space-y-6"
                                    >
                                        {activeTab === 'personal' && (
                                            <div className="space-y-6">
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-white/70 mb-2">Your Name</label>
                                                        <input
                                                            type="text"
                                                            value={localSettings.userName || ''}
                                                            onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
                                                            placeholder="What should we call you?"
                                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-white">Show Quotes</div>
                                                            <div className="text-xs text-white/50">Daily inspiration</div>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={localSettings.showQuotes}
                                                                onChange={() => setLocalSettings({ ...localSettings, showQuotes: !localSettings.showQuotes })}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                        </label>
                                                    </div>

                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-white">Show IP Address</div>
                                                            <div className="text-xs text-white/50">Network info</div>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={localSettings.showIP}
                                                                onChange={() => setLocalSettings({ ...localSettings, showIP: !localSettings.showIP })}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'themes' && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {Object.entries(themes).map(([key, theme]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => setLocalSettings({
                                                            ...localSettings,
                                                            theme: key,
                                                            customColors: undefined,
                                                            wallpaperUrl: theme.wallpaper,
                                                            wallpaperFile: undefined
                                                        })}
                                                        className={`relative group overflow-hidden rounded-2xl aspect-video transition-all ${localSettings.theme === key ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#0f172a]' : 'hover:ring-2 hover:ring-white/20'
                                                            }`}
                                                    >
                                                        <div className={`absolute inset-0 ${theme.class} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                                            <span className="font-bold text-white text-lg shadow-black/50 drop-shadow-md">{theme.name}</span>
                                                            <div className="flex gap-1 mt-2">
                                                                {theme.colors.map((c, i) => (
                                                                    <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {localSettings.theme === key && (
                                                            <div className="absolute top-2 right-2 bg-white text-primary rounded-full p-0.5">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === 'wallpaper' && (
                                            <div className="space-y-6">
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                    <label className="flex items-center gap-4 cursor-pointer mb-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={localSettings.autoThemeFromWallpaper || false}
                                                            onChange={(e) => setLocalSettings({
                                                                ...localSettings,
                                                                autoThemeFromWallpaper: e.target.checked
                                                            })}
                                                            className="w-5 h-5 accent-primary rounded bg-white/10 border-white/20"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-white">Auto-detect Colors</div>
                                                            <div className="text-sm text-white/50">Extract theme from wallpaper</div>
                                                        </div>
                                                    </label>

                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-white/70 mb-2">Upload Image</label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileUpload}
                                                                className="hidden"
                                                                id="wallpaper-upload"
                                                            />
                                                            <label
                                                                htmlFor="wallpaper-upload"
                                                                className="flex flex-col items-center justify-center gap-2 bg-black/20 hover:bg-black/30 border border-white/10 border-dashed rounded-xl p-8 cursor-pointer transition-all group"
                                                            >
                                                                <UploadIcon className="w-8 h-8 text-white/40 group-hover:text-primary transition-colors" />
                                                                <span className="text-sm text-white/60 group-hover:text-white transition-colors">Click to upload</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-white/70 mb-2">Image URL</label>
                                                            <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-4 py-3">
                                                                <ImageIcon className="w-5 h-5 text-white/40" />
                                                                <input
                                                                    type="text"
                                                                    value={localSettings.wallpaperUrl}
                                                                    onChange={(e) => setLocalSettings({ ...localSettings, wallpaperUrl: e.target.value, wallpaperFile: undefined })}
                                                                    placeholder="https://..."
                                                                    className="flex-1 bg-transparent text-white outline-none placeholder-white/30 text-sm"
                                                                    disabled={!!localSettings.wallpaperFile}
                                                                />
                                                            </div>
                                                            {localSettings.wallpaperUrl && (
                                                                <div className="mt-4 rounded-xl overflow-hidden h-32 border border-white/10">
                                                                    <img src={localSettings.wallpaperUrl} alt="Preview" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'clock' && (
                                            <div className="space-y-6">
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-white/70 mb-3">Clock Style</label>
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {['digital', 'analog', 'both'].map((type) => (
                                                                <button
                                                                    key={type}
                                                                    onClick={() => setLocalSettings({ ...localSettings, clockType: type as 'digital' | 'analog' | 'both' })}
                                                                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all border ${localSettings.clockType === type
                                                                        ? 'bg-primary/20 border-primary text-primary'
                                                                        : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5'
                                                                        }`}
                                                                >
                                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-white/70 mb-3">Time Format</label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {[
                                                                { id: '12h', label: '12 Hour (AM/PM)' },
                                                                { id: '24h', label: '24 Hour' }
                                                            ].map((format) => (
                                                                <button
                                                                    key={format.id}
                                                                    onClick={() => setLocalSettings({ ...localSettings, timeFormat: format.id as '12h' | '24h' })}
                                                                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all border ${localSettings.timeFormat === format.id
                                                                        ? 'bg-primary/20 border-primary text-primary'
                                                                        : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5'
                                                                        }`}
                                                                >
                                                                    {format.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'widgets' && (
                                            <div className="grid gap-3">
                                                {Object.entries(localSettings.widgets).map(([key, enabled]) => (
                                                    <div
                                                        key={key}
                                                        className={`bg-white/5 border rounded-xl p-4 transition-all ${enabled ? 'border-primary/30 bg-primary/5' : 'border-white/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${enabled ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'}`}>
                                                                    <LayoutGrid className="w-5 h-5" />
                                                                </div>
                                                                <span className="capitalize font-medium text-white">
                                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                                </span>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={Boolean(enabled)}
                                                                    onChange={(e) => setLocalSettings({
                                                                        ...localSettings,
                                                                        widgets: { ...localSettings.widgets, [key]: e.target.checked }
                                                                    })}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                            </label>
                                                        </div>

                                                        {enabled && key !== 'aiAssistant' && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                className="flex gap-2 pl-13"
                                                            >
                                                                {(['small', 'medium', 'large'] as WidgetSize[]).map((size) => (
                                                                    <button
                                                                        key={size}
                                                                        onClick={() => setLocalSettings({
                                                                            ...localSettings,
                                                                            widgetSizes: { ...localSettings.widgetSizes, [key]: size }
                                                                        })}
                                                                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${localSettings.widgetSizes[key] === size
                                                                            ? 'bg-primary/20 border-primary text-primary'
                                                                            : 'bg-black/20 border-white/10 text-white/50 hover:bg-white/5'
                                                                            }`}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === 'shortcuts' && (
                                            <div className="space-y-6">
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                    <div className="flex gap-2 mb-6">
                                                        <input
                                                            type="text"
                                                            value={newShortcutName}
                                                            onChange={(e) => setNewShortcutName(e.target.value)}
                                                            placeholder="Name (e.g. YouTube)"
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all text-sm"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={newShortcutUrl}
                                                            onChange={(e) => setNewShortcutUrl(e.target.value)}
                                                            placeholder="URL"
                                                            className="flex-[2] bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all text-sm"
                                                        />
                                                        <button
                                                            onClick={addShortcut}
                                                            className="bg-primary hover:bg-primary/90 text-white p-3 rounded-xl transition-colors"
                                                        >
                                                            <PlusIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                                        <AnimatePresence>
                                                            {localSettings.shortcuts.map((shortcut) => (
                                                                <motion.div
                                                                    key={shortcut.id}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                                    className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5 group hover:border-white/10 transition-colors"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                                        {shortcut.icon ? (
                                                                            <img src={shortcut.icon} alt="" className="w-5 h-5 rounded-sm" />
                                                                        ) : (
                                                                            <LinkIcon className="w-4 h-4 text-white/40" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-medium text-white text-sm truncate">{shortcut.name}</div>
                                                                        <div className="text-xs text-white/40 truncate">{shortcut.url}</div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => deleteShortcut(shortcut.id)}
                                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <Trash2Icon className="w-4 h-4" />
                                                                    </button>
                                                                </motion.div>
                                                            ))}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'api' && (
                                            <div className="space-y-4">
                                                {[
                                                    {
                                                        key: 'weather',
                                                        label: 'Weather API',
                                                        link: 'https://open-meteo.com/',
                                                        description: 'Optional. Using free Open-Meteo by default.'
                                                    },
                                                    {
                                                        key: 'groq',
                                                        label: 'Groq AI API',
                                                        link: 'https://console.groq.com',
                                                        description: 'Required for AI Assistant functionality.'
                                                    }
                                                ].map((api) => (
                                                    <div key={api.key} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div>
                                                                <h4 className="font-bold text-white">{api.label}</h4>
                                                                <p className="text-xs text-white/50">{api.description}</p>
                                                            </div>
                                                            <a
                                                                href={api.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                                                            >
                                                                Get Key <span className="text-[10px]">↗</span>
                                                            </a>
                                                        </div>
                                                        <input
                                                            type="password"
                                                            value={localSettings.apiKeys[api.key as keyof typeof localSettings.apiKeys] || ''}
                                                            onChange={(e) => setLocalSettings({
                                                                ...localSettings,
                                                                apiKeys: { ...localSettings.apiKeys, [api.key]: e.target.value }
                                                            })}
                                                            placeholder={`Enter ${api.label} Key`}
                                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-all font-mono text-sm"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer Action Bar */}
                            <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-md flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
