// src/components/SettingsPanel.tsx
// The settings panel component for managing all user preferences.

import React, { useState, useEffect } from 'react';
import { Settings, WidgetSize } from '../types';
import { XIcon, PlusIcon, Trash2Icon, UploadIcon, ImageIcon } from './icons';

interface Props {
  settings: Settings;
  setSettings: (value: Settings | ((val: Settings) => Settings)) => void;
  isVisible: boolean;
  onClose: () => void;
}

const themes: Record<string, { name: string; class: string }> = {
    aurora: { name: 'Aurora', class: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
    sunset: { name: 'Sunset', class: 'bg-gradient-to-br from-orange-500 to-red-600' },
    forest: { name: 'Forest', class: 'bg-gradient-to-br from-green-500 to-teal-600' },
    ocean: { name: 'Ocean', class: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
};

export const SettingsPanel: React.FC<Props> = ({ settings, setSettings, isVisible, onClose }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [newShortcutName, setNewShortcutName] = useState('');
    const [newShortcutUrl, setNewShortcutUrl] = useState('');

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings, isVisible]);

    if (!isVisible) return null;

    const handleSave = () => {
        setSettings(localSettings);
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
                    wallpaperUrl: '' // Clear URL when using file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addShortcut = () => {
        if (newShortcutName && newShortcutUrl) {
            // Extract icon from URL
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

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={handleSave}>
            <div
                className="bg-gray-900/95 backdrop-blur-lg p-6 rounded-2xl text-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Wallpaper Section */}
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Wallpaper</h3>
                    
                    {/* Upload from device */}
                    <div className="mb-3">
                        <label className="block text-sm mb-2 opacity-70">Upload from Device</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="wallpaper-upload"
                            />
                            <label 
                                htmlFor="wallpaper-upload"
                                className="flex-1 bg-white/10 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                                <UploadIcon className="w-5 h-5" />
                                <span>{localSettings.wallpaperFile ? 'Change Image' : 'Choose Image'}</span>
                            </label>
                            {localSettings.wallpaperFile && (
                                <button
                                    onClick={() => setLocalSettings({ ...localSettings, wallpaperFile: undefined })}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* URL input */}
                    <div>
                        <label className="block text-sm mb-2 opacity-70">Or use Image URL</label>
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 opacity-50" />
                            <input
                                type="text"
                                value={localSettings.wallpaperUrl}
                                onChange={(e) => setLocalSettings({ ...localSettings, wallpaperUrl: e.target.value, wallpaperFile: undefined })}
                                placeholder="Enter image URL"
                                className="flex-1 bg-white/10 rounded-lg px-4 py-2 outline-none focus:bg-white/20"
                                disabled={!!localSettings.wallpaperFile}
                            />
                        </div>
                    </div>
                </section>

                {/* Theme Section */}
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Theme</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(themes).map(([key, theme]) => (
                            <button
                                key={key}
                                onClick={() => setLocalSettings({ ...localSettings, theme: key })}
                                className={`p-3 rounded-lg ${theme.class} ${localSettings.theme === key ? 'ring-2 ring-white' : ''} transition-all`}
                            >
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Widgets Section */}
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Widgets</h3>
                    <div className="space-y-2">
                        {Object.entries(localSettings.widgets).map(([key, enabled]) => (
                            <div key={key} className="p-3 bg-white/5 rounded-lg hover:bg-white/10">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(enabled)}
                                        onChange={(e) => setLocalSettings({
                                            ...localSettings,
                                            widgets: { ...localSettings.widgets, [key]: e.target.checked }
                                        })}
                                        className="w-5 h-5"
                                    />
                                </label>
                                {enabled && (
                                    <div className="mt-2 flex gap-2">
                                        <span className="text-xs opacity-70">Size:</span>
                                        {(['small', 'medium', 'large'] as WidgetSize[]).map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setLocalSettings({
                                                    ...localSettings,
                                                    widgetSizes: { ...localSettings.widgetSizes, [key]: size }
                                                })}
                                                className={`text-xs px-2 py-1 rounded ${
                                                    localSettings.widgetSizes[key] === size 
                                                        ? 'bg-blue-500 text-white' 
                                                        : 'bg-white/10 text-white/70'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Clock Type Section */}
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Clock Display</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['digital', 'analog', 'both'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setLocalSettings({ ...localSettings, clockType: type as 'digital' | 'analog' | 'both' })}
                                className={`p-3 rounded-lg ${localSettings.clockType === type ? 'bg-blue-500' : 'bg-white/10'} hover:bg-blue-600 transition-all capitalize`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </section>

                {/* App Shortcuts Section */}
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">App Shortcuts</h3>
                    <div className="space-y-2 mb-3">
                        {localSettings.shortcuts.map(shortcut => (
                            <div key={shortcut.id} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                                <span className="flex-1">{shortcut.name}</span>
                                <button onClick={() => deleteShortcut(shortcut.id)} className="p-2 hover:bg-white/10 rounded transition-colors">
                                    <Trash2Icon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newShortcutName}
                            onChange={(e) => setNewShortcutName(e.target.value)}
                            placeholder="Name"
                            className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/20"
                        />
                        <input
                            type="text"
                            value={newShortcutUrl}
                            onChange={(e) => setNewShortcutUrl(e.target.value)}
                            placeholder="URL"
                            className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/20"
                        />
                        <button onClick={addShortcut} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </section>

                {/* API Keys Section */}
                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">API Keys</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm mb-1 opacity-70">OpenWeatherMap API Key</label>
                            <input
                                type="password"
                                value={localSettings.apiKeys.weather}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    apiKeys: { ...localSettings.apiKeys, weather: e.target.value }
                                })}
                                placeholder="Enter weather API key"
                                className="w-full bg-white/10 rounded-lg px-4 py-2 outline-none focus:bg-white/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 opacity-70">Google Gemini API Key</label>
                            <input
                                type="password"
                                value={localSettings.apiKeys.gemini}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    apiKeys: { ...localSettings.apiKeys, gemini: e.target.value }
                                })}
                                placeholder="Enter Gemini API key"
                                className="w-full bg-white/10 rounded-lg px-4 py-2 outline-none focus:bg-white/20"
                            />
                        </div>
                    </div>
                </section>

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Save & Close
                </button>
            </div>
        </div>
    );
};
